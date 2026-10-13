import { Request, Response } from "express";
import { getDb } from "@/db";
import { CONFIG } from "@/configs";
import { IProject, IRegistration, RegistrationSchema } from "@/schemas";
import { successResponse } from "@/utils/responseHelper";
import { toObjectId } from "@/utils/objectId";
import { assertProposalDocUrl, assertRegistrationEligibility, normalizeEmail } from "@/utils/registrationGuards";
import { NotFoundError, ValidationError, ConflictError, UnauthorizedError } from "@/middlewares";

const getProjectsCollection = () => getDb().collection<IProject>("projects");
const getRegistrationsCollection = () =>
    getDb().collection<IRegistration>("registrations");

export const registerForProject = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { participant, proposal } = req.body;

    if (!req.user) {
        throw new UnauthorizedError("Missing access token");
    }

    const project = await getProjectsCollection().findOne({ _id: toObjectId(projectId as string, "project") as any });

    if (!project) {
        throw new NotFoundError("Project");
    }

    if (!participant?.email || !participant?.name) {
        throw new ValidationError("Name and email are required");
    }

    const canonicalEmail = normalizeEmail(participant.email);

    // eligibility: published status, open deadline, allowed years
    assertRegistrationEligibility(project, participant.year);

    // check duplicate registration (friendly 400s; unique indexes below
    // are the race-safe backstop and surface as 409s via errorHandler)
    const existingRegistration = await getRegistrationsCollection().findOne({
        projectId,
        $or: [
            { "participant.email": canonicalEmail },
            { userId: req.user.id },
        ],
    });

    if (existingRegistration) {
        throw new ConflictError("You have already registered for this project");
    }

    // prepare registration document
    const registration: Partial<IRegistration> = {
        projectId: projectId as string,
        projectTitle: project.title,
        projectSlug: project.slug,
        userId: req.user.id,
        userEmail: req.user.email,
        participant: { ...participant, email: canonicalEmail },
        proposal,
        status: "pending",
        ipAddress: req.ip || (req.headers["x-forwarded-for"] as string | undefined),
        userAgent: req.headers["user-agent"] as string | undefined,
        submittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    // validate with Zod schema
    const validatedRegistration = RegistrationSchema.parse(registration);

    // an attached proposal doc must genuinely live in our upload bucket
    if (validatedRegistration.proposal.proposalDoc) {
        assertProposalDocUrl(validatedRegistration.proposal.proposalDoc, CONFIG.supabase.url);
    }

    // insert into database
    const result = await getRegistrationsCollection().insertOne(
        validatedRegistration as any,
    );

    // get the created document
    const createdRegistration = await getRegistrationsCollection().findOne({
        _id: result.insertedId,
    });

    res
        .status(201)
        .json(successResponse(createdRegistration, "Registration submitted successfully"));
};

export const getMyRegistration = async (req: Request, res: Response) => {
    const { projectId } = req.params;

    if (!req.user) {
        throw new UnauthorizedError("Missing access token");
    }

    // Only the caller's own document is ever returned — no PII exposure.
    const registration = await getRegistrationsCollection().findOne({
        projectId: projectId as string,
        userId: req.user.id,
    });

    res.json(
        successResponse(
            { registration: registration ?? null },
            "Registration status retrieved successfully",
        ),
    );
};

export const listRegistrationsByProject = async (req: Request, res: Response) => {

    const { projectId } = req.params;
    const {
        status,
        page = "1",
        limit = "20",
    } = req.query;

    const project = await getProjectsCollection().findOne({ _id: toObjectId(projectId as string, "project") as any });

    if (!project) {
        throw new NotFoundError("Project");
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = { projectId };
    if (status) filter.status = status;

    const registrations = await getRegistrationsCollection()
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .toArray();

    const total = await getRegistrationsCollection().countDocuments(filter);

    res.json(
        successResponse(
            {
                registrations,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Registrations retrieved successfully"
        )
    );
};
