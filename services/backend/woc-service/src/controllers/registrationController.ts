import { Request, Response } from "express";
import { getDb } from "@/db";
import { IProject, IRegistration, RegistrationSchema } from "@/schemas";
import { successResponse } from "@/utils/responseHelper";
import { toObjectId } from "@/utils/objectId";
import { NotFoundError, ValidationError, ConflictError } from "@/middlewares";

const getProjectsCollection = () => getDb().collection<IProject>("projects");
const getRegistrationsCollection = () =>
    getDb().collection<IRegistration>("registrations");

export const registerForProject = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { participant, proposal } = req.body;

    const project = await getProjectsCollection().findOne({ _id: toObjectId(projectId as string, "project") as any });

    if (!project) {
        throw new NotFoundError("Project");
    }

    // check project is published
    if (project.status !== "published") {
        throw new ValidationError("Project is not published");
    }

    // check application deadline
    if (project.applicationDeadline) {
        const now = new Date();
        if (now > new Date(project.applicationDeadline)) {
            throw new ValidationError("Applications have closed for this project");
        }
    }

    if (!participant?.email || !participant?.name) {
        throw new ValidationError("Name and email are required");
    }

    // check duplicate registration
    const existingRegistration = await getRegistrationsCollection().findOne({
        projectId,
        "participant.email": participant.email,
    });

    if (existingRegistration) {
        throw new ConflictError("You have already registered for this project");
    }

    // prepare registration document
    const registration: Partial<IRegistration> = {
        projectId: projectId as string,
        projectTitle: project.title,
        projectSlug: project.slug,
        participant,
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
