import { Request, Response } from "express";
import { getDb } from "@/db";
import { IOrganization, IProject, ProjectSchema } from "@/schemas";
import { successResponse } from "@/utils/responseHelper";
import { toObjectId } from "@/utils/objectId";
import { NotFoundError, ConflictError } from "@/middlewares";

const getOrganizationsCollection = () => getDb().collection<IOrganization>("organizations");
const getProjectsCollection = () => getDb().collection<IProject>("projects");

export const createProject = async (req: Request, res: Response) => {
    const validatedData = ProjectSchema.parse(req.body);

    const organization = await getOrganizationsCollection().findOne({
        _id: toObjectId(validatedData.organizationId, "organization") as any,
    });

    if (!organization) {
        throw new NotFoundError("Organization");
    }

    const existingProject = await getProjectsCollection().findOne({
        slug: validatedData.slug,
    });

    if (existingProject) {
        throw new ConflictError("A project with this slug already exists");
    }

    const result = await getProjectsCollection().insertOne(
        validatedData as any,
    );

    const createdProject = await getProjectsCollection().findOne({
        _id: result.insertedId,
    });

    res
        .status(201)
        .json(successResponse(createdProject, "Project created successfully"));
};

export const listProjects = async (req: Request, res: Response) => {
    const {
        organizationId,
        difficulty,
        page = "1",
        limit = "20",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;


    const filter: any = {};
    if (organizationId) filter.organizationId = organizationId;
    if (difficulty) filter.difficulty = difficulty;

    // get projects with pagination
    const projects = await getProjectsCollection()
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .toArray();

    const total = await getProjectsCollection().countDocuments(filter);

    res.json(
        successResponse(
            {
                projects,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Projects retrieved successfully"
        )
    );
};

export const getProjectById = async (req: Request, res: Response) => {
    const { projectId } = req.params;

    const project = await getProjectsCollection().findOne({ _id: toObjectId(projectId as string, "project") as any });

    if (!project) {
        throw new NotFoundError("Project");
    }

    res.json(successResponse(project, "Project retrieved successfully"));
};


export const getProjectBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    const project = await getProjectsCollection().findOne({ slug });

    if (!project) {
        throw new NotFoundError("Project");
    }

    res.json(successResponse(project, "Project retrieved successfully"));
};
