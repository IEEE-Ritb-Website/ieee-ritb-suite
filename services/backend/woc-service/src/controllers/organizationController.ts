import { Request, Response } from "express";
import { getDb } from "@/db";
import { OrganizationSchema } from "@/schemas";
import { successResponse } from "@/utils/responseHelper";
import { validateId } from "@/utils/objectId";
import { NotFoundError, ConflictError } from "@/middlewares";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const mapOrganization = (row: any) => ({
    id: row.id,
    _id: row.id,
    name: row.name,
    imageUrl: row.image_url ?? row.imageUrl ?? undefined,
    tagline: row.tagline ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

export const createOrganization = async (req: Request, res: Response) => {
    const validatedData = OrganizationSchema.parse(req.body);
    const supabase = getDb();

    // Check existing
    const { data: existing } = await supabase
        .from("organizations")
        .select("id")
        .eq("name", validatedData.name)
        .maybeSingle();

    if (existing) {
        throw new ConflictError("An organization with this name already exists");
    }

    const { data, error } = await supabase
        .from("organizations")
        .insert({
            name: validatedData.name,
            image_url: validatedData.imageUrl ?? null,
            tagline: validatedData.tagline ?? null,
        })
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            throw new ConflictError("An organization with this name already exists");
        }
        throw new Error(error.message);
    }

    res.status(201).json(successResponse(mapOrganization(data), "Organization created successfully"));
};

export const listOrganizations = async (req: Request, res: Response) => {
    const { page = "1", limit = "20" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.max(1, parseInt(limit as string) || 20);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const supabase = getDb();
    const { data, error, count } = await supabase
        .from("organizations")
        .select("*", { count: "exact" })
        .order("name", { ascending: true })
        .range(from, to);

    if (error) {
        throw new Error(error.message);
    }

    const total = count ?? (data?.length || 0);
    const organizations = (data || []).map(mapOrganization);

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
    const validId = validateId(organizationId as string, "organization");

    const supabase = getDb();
    const isUuid = UUID_REGEX.test(validId);

    const query = supabase
        .from("organizations")
        .select("*");

    const { data, error } = await (isUuid
        ? query.eq("id", validId)
        : query.eq("name", validId)
    ).maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        throw new NotFoundError("Organization");
    }

    res.json(successResponse(mapOrganization(data), "Organization retrieved successfully"));
};
