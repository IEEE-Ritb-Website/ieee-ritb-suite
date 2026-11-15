// Real data seeder for woc-service using Supabase.
// Seeds the real organization & project extracted from the official PDF listing.
//
// Usage: pnpm --filter woc-service seed
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) must be set in .env");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const REAL_ORGANIZATION = {
  name: "Technorishi Consulting Pvt. Ltd.",
  tagline: "Your Vision . Our Process — Enterprise solutions in HCM, facility management, compliance, and permit-to-work.",
  image_url: null,
};

const REAL_PROJECT = {
  title: "No-Code Business Process Management (BPM) Platform: Form, Status, Process and Transition Engine with Approval Engine Integration",
  slug: "nocode-bpm-platform",
  short_desc: "A metadata-driven no-code BPM platform enabling administrators to design forms, define statuses, model processes as stages, and execute transitions integrated with an existing approval engine.",
  long_desc: `Our platform already has an approval workflow designer and engine that decides who approves what and in which order. What is missing is the layer that defines the business process around that approval. This layer covers three things: the form that captures the data, the stages the request passes through, and the statuses and lifecycle it follows from creation until it closes.

Today, each new process needs development effort to build its form, define its statuses, and wire it to the approval engine. Business users cannot set up or change a process on their own.

We want a no-code layer where an administrator can design forms, define statuses, model processes as stages, and configure the transitions between them. Some transitions will hand control to the existing approval engine and resume based on the approval outcome. Every submitted form should run as a tracked process instance until it reaches a terminal status such as Completed, Rejected, or Cancelled, with a full audit trail.

The challenge has two parts:
1. Design a metadata-driven engine where forms, statuses, processes, and transitions are configuration, not code.
2. Integrate it cleanly with an existing approval engine that the students will not modify.

Technorishi builds enterprise platforms across HCM, facility management, compliance, and permit-to-work, all of which need configurable processes. The approval engine is already in place. This project builds the reusable process layer on top of it. The selected students will build four designers and one engine:
• Form Designer and Engine: Configurable form builder with common field types, field validations, and form versioning.
• Status Designer: Status master, categories (open, in-progress, terminal), and display attributes.
• Process Designer: Define processes as sets of stages, link forms, and set lifecycles.
• Transition Designer and Engine: Define allowed transitions, trigger actions, role permissions, conditions, webhooks, transition validation, and audit history.
• Approval Engine Integration: Holding state during approval steps, receiving callbacks, and syncing process status.`,
  stipend_details: {
    type: "fixed",
    notes: "Industry mentorship and internship certificate from Technorishi Consulting Pvt. Ltd.",
  },
  skills: [
    { name: "REST APIs" },
    { name: "Relational Databases" },
    { name: "PostgreSQL" },
    { name: "React" },
    { name: "State Machines" },
    { name: "Spring Boot / .NET / Node" },
  ],
  deliverables: [
    {
      title: "Architecture & Data-Model Document",
      description: "Architecture and data-model document, including the approval engine integration contract.",
    },
    {
      title: "Designers Suite",
      description: "Working form, status, process, and transition designers with runtime form rendering.",
    },
    {
      title: "Process Execution Engine",
      description: "Process execution engine with transition validation, state machines, and an audit trail.",
    },
    {
      title: "Approval Engine Integration",
      description: "Working integration with the approval engine (or provided sandbox).",
    },
    {
      title: "Working Demo & Setup Guide",
      description: "Two configured demo processes running end-to-end, source code repo, API documentation, and setup video.",
    },
  ],
  coordinator: {
    name: "Technical Project Head",
    contact: "info@technorishi.co.in",
  },
  duration: {
    value: 8,
    unit: "weeks",
  },
  difficulty: "intermediate",
  eligibility: {
    description: "Pre-final or final year students in CSE, IT, or related branches. Prior full-stack project experience required.",
    allowedYears: [3, 4],
    requireIEEEMembership: false,
  },
  tags: ["bpm", "no-code", "workflow-engine", "react", "fullstack", "enterprise"],
};

async function seed() {
  console.log("Seeding data into Supabase...");

  // 1. Upsert organization
  const { data: existingOrg, error: orgFindError } = await supabase
    .from("organizations")
    .select("id")
    .eq("name", REAL_ORGANIZATION.name)
    .maybeSingle();

  if (orgFindError) {
    console.error("Error checking organizations table. Have you run supabase-schema.sql in Supabase SQL editor?", orgFindError.message);
    process.exit(1);
  }

  let orgId = existingOrg?.id;
  if (!orgId) {
    const { data: newOrg, error: orgInsertError } = await supabase
      .from("organizations")
      .insert(REAL_ORGANIZATION)
      .select("id")
      .single();

    if (orgInsertError) {
      console.error("Failed to insert organization:", orgInsertError);
      process.exit(1);
    }
    orgId = newOrg.id;
    console.log(`Created organization: ${REAL_ORGANIZATION.name} (${orgId})`);
  } else {
    const { error: orgUpdateError } = await supabase
      .from("organizations")
      .update(REAL_ORGANIZATION)
      .eq("id", orgId);

    if (orgUpdateError) {
      console.error("Failed to update organization:", orgUpdateError);
      process.exit(1);
    }
    console.log(`Updated organization: ${REAL_ORGANIZATION.name} (${orgId})`);
  }

  // 2. Upsert project
  const { data: existingProject, error: projectFindError } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", REAL_PROJECT.slug)
    .maybeSingle();

  if (projectFindError) {
    console.error("Error checking projects table:", projectFindError.message);
    process.exit(1);
  }

  if (!existingProject) {
    const { data: newProject, error: projectInsertError } = await supabase
      .from("projects")
      .insert({
        ...REAL_PROJECT,
        organization_id: orgId,
      })
      .select("id")
      .single();

    if (projectInsertError) {
      console.error("Failed to insert project:", projectInsertError);
      process.exit(1);
    }
    console.log(`Created project: ${REAL_PROJECT.title} (${newProject.id})`);
  } else {
    // Update existing project with latest details
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        ...REAL_PROJECT,
        organization_id: orgId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingProject.id);

    if (updateError) {
      console.error("Failed to update project:", updateError);
      process.exit(1);
    }
    console.log(`Updated project: ${REAL_PROJECT.title} (${existingProject.id})`);
  }

  console.log("Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
