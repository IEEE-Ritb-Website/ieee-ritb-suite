import { Request, Response } from "express";
import { getDb } from "@/db";
import { IEvent, IFormResponse, FormResponseSchema } from "@/schemas";
import { successResponse, generateFormModel } from "@/utils";
import { NotFoundError, ValidationError, ConflictError } from "@/middlewares";

const getEventsCollection = () => getDb().collection<IEvent>("events");
const getFormResponsesCollection = () => getDb().collection<IFormResponse>("form-response");


// dynamic form model
export const getFormModelByEventId = async (req: Request, res: Response) => {
    const { eventId } = req.params;

    //get evet details
    const event = await getEventsCollection().findOne({ _id: eventId as any });

    if (!event) {
        throw new NotFoundError("Event");
    }

    // check if event is not draft and registration is open
    const now = new Date();
    const isPublished = event.status === "published";
    const isRegistrationOpen =
        now >= new Date(event.registrationOpenDate) &&
        now <= new Date(event.registrationCloseDate);

    // generate form model
    const formModel = generateFormModel(event);

    res.json(
        successResponse(
            {
                ...formModel,
                status: {
                    isPublished,
                    isRegistrationOpen,
                    eventStatus: event.status,
                },
            },
            "Form model generated successfully"
        )
    );
};

export const getFormModelBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    // get event details
    const event = await getEventsCollection().findOne({ slug });

    if (!event) {
        throw new NotFoundError("Event");
    }

    //check if event is published and registration is open
    const now = new Date();
    const isPublished = event.status === "published";
    const isRegistrationOpen =
        now >= new Date(event.registrationOpenDate) &&
        now <= new Date(event.registrationCloseDate);

    // generate form model
    const formModel = generateFormModel(event);

    res.json(
        successResponse(
            {
                ...formModel,
                status: {
                    isPublished,
                    isRegistrationOpen,
                    eventStatus: event.status,
                },
            },
            "Form model generated successfully"
        )
    );
};

export const submitFormResponse = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const submissionData = req.body;

    const event = await getEventsCollection().findOne({ _id: eventId as any });

    if (!event) {
        throw new NotFoundError("Event");
    }

    // check event is published
    if (event.status !== "published") {
        throw new ValidationError("Event is not published");
    }

    // check if registration is open
    const now = new Date();
    if (now < new Date(event.registrationOpenDate)) {
        throw new ValidationError("Registration has not opened yet");
    }
    if (now > new Date(event.registrationCloseDate)) {
        throw new ValidationError("Registration has closed");
    }

    // check capacity
    if (event.registrationConfig.maxParticipants) {
        const currentCount = await getFormResponsesCollection().countDocuments({
            eventId,
            status: { $in: ["pending", "approved"] },
        });
        if (currentCount >= event.registrationConfig.maxParticipants) {
            throw new ValidationError("Event has reached maximum capacity");
        }
    }

    const contactEmail = submissionData.email || submissionData.formData?.email;
    const contactName = submissionData.name || submissionData.formData?.name;
    const contactPhone = submissionData.phone || submissionData.formData?.phone;

    if (!contactEmail || !contactName) {
        throw new ValidationError("Name and email are required");
    }

    // check duplicate registration
    const existingRegistration = await getFormResponsesCollection().findOne({
        eventId,
        contactEmail,
    });

    if (existingRegistration) {
        throw new ConflictError("You have already registered for this event");
    }

    // extract registration type
    const registrationType = submissionData.registrationType ||
        (submissionData.formData?.registrationType) ||
        (event.registrationConfig.type === "both" ? "individual" : event.registrationConfig.type);

    // extract team info if applicable
    let teamInfo = undefined;
    if (registrationType === "team") {
        const teamName = submissionData.teamName || submissionData.formData?.teamName;
        const teamSize = submissionData.teamSize || submissionData.formData?.teamSize;

        if (!teamName || !teamSize) {
            throw new ValidationError("Team name and team size are required for team registration");
        }

        // validate team size
        const teamConfig = event.registrationConfig.team;
        if (teamConfig) {
            if (teamSize < teamConfig.minSize) {
                throw new ValidationError(`Team must have at least ${teamConfig.minSize} members`);
            }
            if (teamSize > teamConfig.maxSize) {
                throw new ValidationError(`Team cannot exceed ${teamConfig.maxSize} members`);
            }
        }

        teamInfo = {
            teamName,
            teamSize: parseInt(teamSize),
            teamMembers: submissionData.teamMembers || submissionData.formData?.teamMembers,
        };
    }

    // determine initial status
    const status = event.registrationConfig.autoApprove ? "approved" : "pending";

    // prepare form response document
    const formResponse: Partial<IFormResponse> = {
        eventId,
        eventTitle: event.title,
        eventSlug: event.slug,
        registrationType: registrationType as "individual" | "team",
        formData: submissionData.formData || submissionData,
        contactEmail,
        contactName,
        contactPhone,
        teamInfo,
        status: status as any,
        ipAddress: req.ip || req.headers['x-forwarded-for'] as string,
        userAgent: req.headers['user-agent'],
        submittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    // validate with Zod schema
    const validatedResponse = FormResponseSchema.parse(formResponse);

    // insert into database
    const result = await getFormResponsesCollection().insertOne(validatedResponse as any);

    // get the created document
    const createdResponse = await getFormResponsesCollection().findOne({
        _id: result.insertedId,
    });

    res.status(201).json(
        successResponse(
            createdResponse,
            `Registration ${status === "approved" ? "approved" : "submitted"} successfully`
        )
    );
};
