import { Request, Response } from "express";
import { getDb } from "@/db";
import { CONFIG } from "@/configs";
import { RegistrationSchema } from "@/schemas";
import { successResponse } from "@/utils/responseHelper";
import { validateId } from "@/utils/objectId";
import { assertProposalDocUrl, assertRegistrationEligibility, normalizeEmail } from "@/utils/registrationGuards";
import { NotFoundError, ValidationError, ConflictError } from "@/middlewares";
import { mapProject } from "./projectController";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const mapRegistration = (row: any) => ({
    id: row.id,
    _id: row.id,
    projectId: row.project_id ?? row.projectId,
    projectTitle: row.project_title ?? row.projectTitle,
    projectSlug: row.project_slug ?? row.projectSlug,
    participantEmail: row.participant_email ?? row.participantEmail ?? row.participant?.email,
    participant: row.participant,
    proposal: row.proposal,
    status: row.status,
    submittedAt: row.submitted_at ?? row.submittedAt,
    ipAddress: row.ip_address ?? row.ipAddress,
    userAgent: row.user_agent ?? row.userAgent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

export const registerForProject = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { participant, proposal } = req.body;
    const validProjectId = validateId(projectId as string, "project");

    if (!participant?.email || !participant?.name) {
        throw new ValidationError("Name and email are required");
    }

    const canonicalEmail = normalizeEmail(participant.email);
    const supabase = getDb();
    const isUuid = UUID_REGEX.test(validProjectId);

    // Verify project exists by id or slug
    const projectQuery = supabase.from("projects").select("*");
    const { data: projectRow, error: projectError } = await (isUuid
        ? projectQuery.eq("id", validProjectId)
        : projectQuery.eq("slug", validProjectId)
    ).maybeSingle();

    if (projectError) {
        throw new Error(projectError.message);
    }
    if (!projectRow) {
        throw new NotFoundError("Project");
    }

    const project = mapProject(projectRow);
    const resolvedProjectId = project.id;

    // Eligibility verification (e.g. deadline, allowed years)
    assertRegistrationEligibility(project as any, participant.year);

    // Duplicate check in Supabase
    const { data: existingRegistration } = await supabase
        .from("registrations")
        .select("id")
        .eq("project_id", resolvedProjectId)
        .eq("participant_email", canonicalEmail)
        .maybeSingle();

    if (existingRegistration) {
        throw new ConflictError("You have already registered for this project");
    }

    // Verify attached proposal document bucket URL if present
    if (proposal?.proposalDoc) {
        assertProposalDocUrl(proposal.proposalDoc, CONFIG.supabase.url);
    }

    // Validate registration data structure with Zod
    RegistrationSchema.parse({
        projectId: resolvedProjectId,
        projectTitle: project.title,
        projectSlug: project.slug,
        participant: { ...participant, email: canonicalEmail },
        proposal,
        status: "pending",
        ipAddress: req.ip || (req.headers["x-forwarded-for"] as string | undefined),
        userAgent: req.headers["user-agent"] as string | undefined,
        submittedAt: new Date(),
    });

    // Insert into Supabase registrations table
    const { data, error } = await supabase
        .from("registrations")
        .insert({
            project_id: resolvedProjectId,
            project_title: project.title,
            project_slug: project.slug,
            participant_email: canonicalEmail,
            participant: { ...participant, email: canonicalEmail },
            proposal,
            status: "pending",
            ip_address: req.ip || (req.headers["x-forwarded-for"] as string | undefined),
            user_agent: req.headers["user-agent"] as string | undefined,
        })
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            throw new ConflictError("You have already registered for this project");
        }
        throw new Error(error.message);
    }

    res.status(201).json(successResponse(mapRegistration(data), "Registration submitted successfully"));
};

export const getMyRegistration = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const validProjectId = validateId(projectId as string, "project");
    const emailParam = (req.query.email as string)?.trim().toLowerCase() || req.user?.email;

    if (!emailParam) {
        return res.json(
            successResponse(
                { registration: null },
                "Registration status retrieved successfully",
            ),
        );
    }

    const supabase = getDb();
    const isUuid = UUID_REGEX.test(validProjectId);
    let resolvedProjectId = validProjectId;
    if (!isUuid) {
        const { data: p } = await supabase.from("projects").select("id").eq("slug", validProjectId).maybeSingle();
        if (p) resolvedProjectId = p.id;
    }

    const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("project_id", resolvedProjectId)
        .eq("participant_email", emailParam)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    res.json(
        successResponse(
            { registration: data ? mapRegistration(data) : null },
            "Registration status retrieved successfully",
        ),
    );
};

export const listRegistrationsByProject = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const validProjectId = validateId(projectId as string, "project");
    const { status, page = "1", limit = "20" } = req.query;

    const supabase = getDb();
    const isUuid = UUID_REGEX.test(validProjectId);

    // Verify project exists
    const projectQuery = supabase.from("projects").select("id");
    const { data: projectRow } = await (isUuid
        ? projectQuery.eq("id", validProjectId)
        : projectQuery.eq("slug", validProjectId)
    ).maybeSingle();

    if (!projectRow) {
        throw new NotFoundError("Project");
    }
    const resolvedProjectId = projectRow.id;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.max(1, parseInt(limit as string) || 20);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabase
        .from("registrations")
        .select("*", { count: "exact" })
        .eq("project_id", resolvedProjectId);

    if (status) {
        query = query.eq("status", status);
    }

    const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        throw new Error(error.message);
    }

    const total = count ?? (data?.length || 0);
    const registrations = (data || []).map(mapRegistration);

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
