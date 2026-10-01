#!/usr/bin/env node
import { runCreateBE } from "./commands/create-express.js";
import { runCreateFE } from "./commands/create-react.js";
import { runCreateNextFE } from "./commands/create-next.js";
import { runGenerateClient } from "./commands/generate-client.js";
import { runGenerateDocs } from "./commands/generate-docs.js";
import { runLinkService } from "./commands/link-service.js";
import { askProjectName } from "./helper.js";

async function main() {
    const rawArgs = process.argv.slice(2);

    let command: string | undefined;
    let projectName: string;

    if (rawArgs[0] === "run" && rawArgs[1]) {
        command = rawArgs[1];
        projectName = rawArgs[2];
    } else {
        command = rawArgs[0];
        projectName = rawArgs[1];
    }

    switch (command) {
        case "create-be":
            if (!projectName) {
                projectName = await askProjectName();
            }
            await runCreateBE(projectName);
            break;

        case "create-fe":
            if (!projectName) {
                projectName = await askProjectName();
            }
            await runCreateFE(projectName);
            break;

        case "create-next":
            if (!projectName) {
                projectName = await askProjectName();
            }
            await runCreateNextFE(projectName);
            break;

        case "generate-client":
            await runGenerateClient();
            break;

        case "generate-docs":
            await runGenerateDocs();
            break;

        case "link-service": {
            if (!projectName) {
                projectName = await askProjectName();
            }
            const flagArgs = (rawArgs[0] === "run" ? rawArgs.slice(3) : rawArgs.slice(2)).filter(
                (arg) => arg.startsWith("--"),
            );
            const flags: Record<string, string> = {};
            for (const arg of flagArgs) {
                const match = arg.match(/^--([^=]+)=(.+)$/);
                if (match) flags[match[1]] = match[2];
            }
            await runLinkService(projectName, flags);
            break;
        }

        default:
            console.log("No such methods defined. Available methods: create-be, create-fe, create-next, generate-client, generate-docs, link-service");
            process.exit(1);
    }
}

main();
