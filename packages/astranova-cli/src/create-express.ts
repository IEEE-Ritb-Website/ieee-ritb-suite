import fs from "fs";
import path from "path";
import { ProjectBuilder, FEATURES, LANGUAGE } from "@mrknown404/create-express-app";
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
        builder.createFile("astralogger.json", JSON.stringify({
            "level": "trace",
            "transport": {
                "target": "pino-pretty",
                "options": {
                    "colorize": true
                }
            }
        }, null, 2));

        await builder.runCommand("Install dependencies", "pnpm install");

        console.log(chalk.green(`\nNew backend service ${builder.projectName} created successfully`));
        builder.finalize();
    } catch (err) {
        console.error(chalk.red("❌ Project creation failed:"), err);
        process.exit(1);
    }
}
