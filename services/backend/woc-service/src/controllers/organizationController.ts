import { Request, Response } from "express";
import { getDb } from "@/db";
import { IOrganization, OrganizationSchema } from "@/schemas";
import { successResponse } from "@/utils/responseHelper";
import { toObjectId } from "@/utils/objectId";
import { NotFoundError, ConflictError } from "@/middlewares";

const getOrganizationsCollection = () => getDb().collection<IOrganization>("organizations");

export const createOrganization = async (req: Request, res: Response) => {
    const validatedData = OrganizationSchema.parse(req.body);

    const existingOrganization = await getOrganizationsCollection().findOne({
        name: validatedData.name,
    });

    if (existingOrganization) {
        throw new ConflictError("An organization with this name already exists");
    }

    const result = await getOrganizationsCollection().insertOne(
        validatedData as any,
    );

    const createdOrganization = await getOrganizationsCollection().findOne({
        _id: result.insertedId,
    });

    res
        .status(201)
        .json(successResponse(createdOrganization, "Organization created successfully"));
};

export const listOrganizations = async (req: Request, res: Response) => {
    const {
        page = "1",
        limit = "20",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const organizations = await getOrganizationsCollection()
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .toArray();

    const total = await getOrganizationsCollection().countDocuments({});

    res.json(
        successResponse(
            {
                organizations,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Organizations retrieved successfully"
        )
    );
};

export const getOrganizationById = async (req: Request, res: Response) => {
    const { organizationId } = req.params;

    const organization = await getOrganizationsCollection().findOne({ _id: toObjectId(organizationId as string, "organization") as any });

    if (!organization) {
        throw new NotFoundError("Organization");
    }

    res.json(successResponse(organization, "Organization retrieved successfully"));
};
