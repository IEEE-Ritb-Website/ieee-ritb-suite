/**
 * Fallback preview data for RIT Winter of Code.
 * Used when the backend server is offline or loading preview states.
 */

import type { Organization, ProblemStatement } from "./woc-types";

export const DEV_MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "technorishi-consulting",
    name: "Technorishi Consulting Pvt. Ltd.",
    tagline: "Your Vision . Our Process — Enterprise solutions across HCM, facility management, compliance, and permit-to-work.",
  },
];

export const DEV_MOCK_PROBLEM_STATEMENTS: ProblemStatement[] = [
  {
    id: "nocode-bpm-platform",
    title:
      "No-Code Business Process Management (BPM) Platform: Form, Status, Process and Transition Engine with Approval Engine Integration",
    shortDesc:
      "A metadata-driven no-code BPM platform enabling administrators to design forms, define statuses, model processes as stages, and execute transitions integrated with an existing approval engine.",
    longDesc: `Our platform already has an approval workflow designer and engine that decides who approves what and in which order. What is missing is the layer that defines the business process around that approval. This layer covers three things: the form that captures the data, the stages the request passes through, and the statuses and lifecycle it follows from creation until it closes.

Today, each new process needs development effort to build its form, define its statuses, and wire it to the approval engine. Business users cannot set up or change a process on their own.

We want a no-code layer where an administrator can design forms, define statuses, model processes as stages, and configure the transitions between them. Some transitions will hand control to the existing approval engine and resume based on the approval outcome. Every submitted form should run as a tracked process instance until it reaches a terminal status such as Completed, Rejected, or Cancelled, with a full audit trail.

The challenge has two parts:
1. Design a metadata-driven engine where forms, statuses, processes, and transitions are configuration, not code.
2. Integrate it cleanly with an existing approval engine that the students will not modify.

The selected students will build four designers and one engine:
• Form Designer and Engine: Configurable form builder with common field types, field validations, and form versioning.
• Status Designer: Status master, categories (open, in-progress, terminal), and display attributes.
• Process Designer: Define processes as sets of stages, link forms, and set lifecycles.
• Transition Designer and Engine: Define allowed transitions, trigger actions, role permissions, conditions, webhooks, transition validation, and audit history.
• Approval Engine Integration: Holding state during approval steps, receiving callbacks, and syncing process status.`,
    stipendDetails: {
      amount: "Industry Mentorship & Certificate",
      currency: "INR",
      note: "Mentorship and completion certificate provided by Technorishi Consulting Pvt. Ltd.",
    },
    skills: [
      "REST APIs",
      "Relational Databases",
      "PostgreSQL",
      "React",
      "State Machines",
      "Spring Boot / .NET / Node",
    ],
    organization: "technorishi-consulting",
  },
];
