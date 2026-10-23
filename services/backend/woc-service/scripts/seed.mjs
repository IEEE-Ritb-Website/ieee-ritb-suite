// Sample data seeder for woc-service (local development only).
// Seeds organizations + published-ready projects via direct Mongo writes
// (creation APIs require mentor/admin sessions). Safe to re-run:
// documents are matched by unique name/slug and only inserted when absent.
//
// Usage: pnpm --filter woc-service seed
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/woc-service-dev";

// Use the same database the service itself uses: the URI path when set,
// otherwise the service's dev/prod database name.
function resolveDbName() {
  try {
    const pathName = new URL(uri).pathname.replace(/^\//, "");
    if (pathName) return pathName;
  } catch {
    // fall through to the default below
  }
  return process.env.NODE_ENV === "production" ? "woc-service-prod" : "woc-service-dev";
}

const ORGANIZATIONS = [
  {
    name: "IEEE Computer Society RIT-B",
    tagline: "Student computing chapter driving open source on campus.",
  },
  {
    name: "OpenForge Lab",
    tagline: "Campus open-source lab mentoring winter contributors.",
  },
];

const PROJECTS = [
  {
    title: "Campus Navigation Assistant",
    slug: "campus-nav-assistant",
    shortDesc: "A chatbot that answers campus queries — rooms, timetables, and events.",
    longDesc:
      "Build a retrieval-based assistant over campus data (rooms, timetables, events). " +
      "Ship a working demo with an evaluation set of at least 50 real questions.",
    stipendDetails: { type: "fixed", amount: 5000, currency: "INR" },
    skills: [{ name: "TypeScript" }, { name: "React" }, { name: "REST APIs" }],
    deliverables: [
      { title: "Working demo", description: "Deployed demo answering campus questions." },
      { title: "Evaluation set", description: "At least 50 real questions with expected answers." },
    ],
    coordinator: { name: "Ananya Rao", contact: "ananya@ritb.edu" },
    duration: { value: 8, unit: "weeks" },
    difficulty: "beginner",
    eligibility: { allowedYears: [1, 2, 3, 4] },
    organization: "IEEE Computer Society RIT-B",
    tags: ["web", "chatbot"],
  },
  {
    title: "ML Attendance Predictor",
    slug: "ml-attendance-predictor",
    shortDesc: "Predict course attendance patterns from anonymized timetable data.",
    longDesc:
      "Explore anonymized timetable and attendance data, build a baseline predictor, " +
      "and document findings in a reproducible notebook with charts.",
    stipendDetails: { type: "range", minAmount: 3000, maxAmount: 6000, currency: "INR" },
    skills: [{ name: "Python", level: "intermediate" }, { name: "scikit-learn" }],
    deliverables: [
      { title: "Baseline model", description: "Trained predictor with reported metrics." },
      { title: "Reproducible notebook", description: "Charts and findings in one runnable notebook." },
    ],
    coordinator: { name: "Rahul Verma", contact: "rahul@ritb.edu" },
    duration: { value: 8, unit: "weeks" },
    difficulty: "intermediate",
    eligibility: { allowedYears: [2, 3, 4] },
    organization: "IEEE Computer Society RIT-B",
    tags: ["ml", "data"],
  },
  {
    title: "RIT Events IoT Board",
    slug: "rit-events-iot-board",
    shortDesc: "An LED notice board driven by campus event feeds over MQTT.",
    longDesc:
      "Design firmware and a small publisher service so the notice board reflects " +
      "live campus events. Deliver working hardware plus documented wiring and code.",
    stipendDetails: { type: "unpaid" },
    skills: [{ name: "C++", level: "advanced" }, { name: "MQTT" }],
    deliverables: [
      { title: "Working hardware", description: "Board displaying live event feed." },
      { title: "Docs", description: "Wiring diagram and firmware documentation." },
    ],
    coordinator: { name: "Vikram Menon", contact: "vikram@openforge.in" },
    duration: { value: 8, unit: "weeks" },
    difficulty: "advanced",
    organization: "OpenForge Lab",
    tags: ["iot", "hardware"],
  },
];

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(resolveDbName());

  const orgIds = new Map();
  for (const org of ORGANIZATIONS) {
    await db.collection("organizations").updateOne(
      { name: org.name },
      { $setOnInsert: { ...org } },
      { upsert: true },
    );
    const saved = await db.collection("organizations").findOne({ name: org.name });
    orgIds.set(org.name, String(saved._id));
  }

  let insertedProjects = 0;
  for (const project of PROJECTS) {
    const { organization, ...rest } = project;
    const result = await db.collection("projects").updateOne(
      { slug: rest.slug },
      {
        $setOnInsert: {
          ...rest,
          organizationId: orgIds.get(organization),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
    insertedProjects += result.upsertedCount ?? 0;
  }

  const orgCount = await db.collection("organizations").countDocuments();
  const projectCount = await db.collection("projects").countDocuments();
  console.log(
    `Seed complete: ${orgCount} organizations, ${projectCount} projects ` +
    `(${insertedProjects} projects newly inserted).`,
  );
} finally {
  await client.close();
}
