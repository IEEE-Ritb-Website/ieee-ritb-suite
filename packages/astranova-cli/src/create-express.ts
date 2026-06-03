import fs from "fs";
import path from "path";
import {
    ProjectBuilder,
    FEATURES,
    LANGUAGE,
} from "@mrknown404/create-express-app";
import { getMonorepoRoot } from "./helper";
import chalk from "chalk";

export async function runCreateBE(projectName: string) {
    const rootDir = getMonorepoRoot();
    const baseDir = path.join(rootDir, "services", "backend");

    fs.mkdirSync(baseDir, { recursive: true });

    const projectPath = path.join(baseDir, projectName);

    if (fs.existsSync(projectPath)) {
        console.log(`Directory ${projectPath} already exists. Aborting.`);
        process.exit(1);
    }

    const customConfig = {
        language: LANGUAGE.TYPESCRIPT,
        features: [FEATURES.ESLINT, FEATURES.ZOD],
    };

    try {
        const builder = new ProjectBuilder(customConfig);
        builder.scriptName = "🚀 Create Astranova Express App";
        builder.setProjectBasePath(baseDir);
        builder.projectName = projectName;

        await builder.init();
        await builder.setupProject();
        builder.createFile(
            "astralogger.json",
            JSON.stringify(
                {
                    level: "trace",
                    transport: {
                        target: "pino-pretty",
                        options: {
                            colorize: true,
                        },
                    },
                },
                null,
                2,
            ),
        );

        builder.createFile(
            ".env.example",
            "PORT=3000\nCRON_SECRET=\n",
        );

        builder.createFile(
            "src/configs/index.ts",
            `const SERVER_PORT = process.env.PORT || 3000;

export const CONFIG = {
    server: {
        port: SERVER_PORT,
    },
    cronSecret: process.env.CRON_SECRET || "",
};
`,
        );

        builder.createFile(
            "src/routes/cron.ts",
            `import { type Request, type Response, Router } from "express";
import { CONFIG } from "@/configs";

export const cronRoute = Router();

cronRoute.get('/cron', (req: Request, res: Response) => {
    const secret = req.headers["x-cron-secret"];
    if (!secret || secret !== CONFIG.cronSecret) {
        return res.status(401).json({ success: false, error: { type: "unauthorized", message: "Invalid cron secret" } });
    }

    console.log("Cron job executed successfully");
    return res.status(200).json({
        success: true,
        data: {
            timestamp: new Date().toISOString(),
            message: "Cron job executed successfully",
        },
        message: "Cron job completed",
    });
});
`,
        );

        builder.createFile(
            "src/routes/index.ts",
            `import { Router } from 'express';
import { pingRoute } from './ping';
import { sampleRoute } from './sample';
import { cronRoute } from './cron';

const router = Router();

router.use(pingRoute);
router.use(sampleRoute);
router.use(cronRoute);

export default router;
`,
        );

        const agentsContent = `# Agent Guide: ${projectName}

## Purpose
This microservice serves as part of the backend API layer.

## Scope
- Business logic for ${projectName} features.
- Endpoint validation using Zod.
- Logging via \`astralogger\`.

## Coding Rules
- Use \`getAstraLogger()\` from the \`astralogger\` package for logging. Do not use \`console.log\`.
- Validate all route payloads using Zod schemas inside \`src/schemas/\`.
- Keep business logic in controllers, not inline in routing code.
`;

        const readmeContent = `# ${projectName}

Backend Express microservice for the IEEE RIT-B Suite.

## Getting Started

### Prerequisites
- Node.js & pnpm

### Run in Development
From the monorepo root:
\`\`\`bash
pnpm --filter ${projectName} dev
\`\`\`

## Structure
- \`src/index.ts\` - Entry point
- \`src/configs/\` - Configurations
- \`src/controllers/\` - Route handlers
- \`src/routes/\` - Route definitions
- \`src/schemas/\` - Input validations (Zod)

## Endpoints
- \`GET /api/ping\` - Health check
- \`GET /api/sample\` - Sample endpoint
- \`GET /api/cron\` - Secured cron endpoint (requires \`x-cron-secret\` header)
`;

        builder.createFile("AGENTS.md", agentsContent);
        builder.createFile("README.md", readmeContent);

        await builder.runCommand("Install dependencies", "pnpm install");

        console.log(
            chalk.green(
                `\nNew backend service ${builder.projectName} created successfully`,
            ),
        );
        builder.finalize();

        console.log(chalk.cyan("\n📋 Cron Job Setup:"));
        console.log(
            `  Generate a CRON_SECRET: ${chalk.bold("node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"")}`,
        );
        console.log(
            `  Add to ${chalk.bold(".env")}: CRON_SECRET=<generated-secret>`,
        );
        console.log(
            `  Endpoint: ${chalk.bold("GET /api/cron")} (requires ${chalk.bold("x-cron-secret")} header)`,
        );
        console.log(
            `  Secure with ${chalk.bold("cron-job.org")}: set ${chalk.bold("CRON_SECRET")} in .env and configure as a cron job target`,
        );
    } catch (err) {
        console.error(chalk.red("❌ Project creation failed:"), err);
        process.exit(1);
    }
}
