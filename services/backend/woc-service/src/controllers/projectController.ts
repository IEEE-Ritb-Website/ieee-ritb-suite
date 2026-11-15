import { Request, Response } from "express";
import { getDb } from "@/db";
import { ProjectSchema } from "@/schemas";
import { successResponse } from "@/utils/responseHelper";
import { validateId } from "@/utils/objectId";
import { NotFoundError, ConflictError } from "@/middlewares";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export // eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapProject = (row: any) => ({
    id: row.id,
    _id: row.id,
    title: row.title,
    slug: row.slug,
    shortDesc: row.short_desc ?? row.shortDesc ?? "",
    longDesc: row.long_desc ?? row.longDesc ?? "",
    organizationId: row.organization_id ?? row.organizationId ?? "",
    stipendDetails: row.stipend_details ?? row.stipendDetails ?? undefined,
    skills: row.skills ?? [],
    deliverables: row.deliverables ?? [],
    coordinator: row.coordinator ?? undefined,
    duration: row.duration ?? undefined,
    difficulty: row.difficulty ?? undefined,
    eligibility: row.eligibility ?? undefined,
    applicationDeadline: row.application_deadline ?? row.applicationDeadline ?? undefined,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

export const createProject = async (req: Request, res: Response) => {
    const validatedData = ProjectSchema.parse(req.body);
    const supabase = getDb();

    // Verify organization exists if organizationId is provided
    if (validatedData.organizationId) {
        const isOrgUuid = UUID_REGEX.test(validatedData.organizationId);
        const orgQuery = supabase.from("organizations").select("id");
        const { data: organization } = await (isOrgUuid
            ? orgQuery.eq("id", validatedData.organizationId)
            : orgQuery.eq("name", validatedData.organizationId)
        ).maybeSingle();

        if (!organization) {
            throw new NotFoundError("Organization");
        }
    }

    // Check slug collision
    const { data: existingProject } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", validatedData.slug)
        .maybeSingle();

    if (existingProject) {
        throw new ConflictError("A project with this slug already exists");
    }

    const { data, error } = await supabase
        .from("projects")
        .insert({
            title: validatedData.title,
            slug: validatedData.slug,
            short_desc: validatedData.shortDesc,
            long_desc: validatedData.longDesc,
            organization_id: validatedData.organizationId || null,
            stipend_details: validatedData.stipendDetails ?? null,
            skills: validatedData.skills ?? [],
            deliverables: validatedData.deliverables ?? [],
            coordinator: validatedData.coordinator ?? null,
            duration: validatedData.duration ?? null,
            difficulty: validatedData.difficulty ?? null,
            eligibility: validatedData.eligibility ?? null,
            application_deadline: validatedData.applicationDeadline ? new Date(validatedData.applicationDeadline).toISOString() : null,
            tags: validatedData.tags ?? [],
        })
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            throw new ConflictError("A project with this slug already exists");
        }
        throw new Error(error.message);
    }

    res.status(201).json(successResponse(mapProject(data), "Project created successfully"));
};

export const listProjects = async (req: Request, res: Response) => {
    const {
        organizationId,
        difficulty,
        page = "1",
        limit = "20",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.max(1, parseInt(limit as string) || 20);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const supabase = getDb();
    let query = supabase
        .from("projects")
        .select("*", { count: "exact" });

    if (organizationId) {
        query = query.eq("organization_id", organizationId);
    }
    if (difficulty) {
        query = query.eq("difficulty", difficulty);
    }

    const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        throw new Error(error.message);
    }

    const total = count ?? (data?.length || 0);
    const projects = (data || []).map(mapProject);

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
    const validId = validateId(projectId as string, "project");

    const supabase = getDb();
    const isUuid = UUID_REGEX.test(validId);

    const query = supabase
        .from("projects")
        .select("*");

    const { data, error } = await (isUuid
        ? query.eq("id", validId)
        : query.eq("slug", validId)
    ).maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        throw new NotFoundError("Project");
    }

    res.json(successResponse(mapProject(data), "Project retrieved successfully"));
};

export const getProjectBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    const supabase = getDb();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        throw new NotFoundError("Project");
    }

    res.json(successResponse(mapProject(data), "Project retrieved successfully"));
};
