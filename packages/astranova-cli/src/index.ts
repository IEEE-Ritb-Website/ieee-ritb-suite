#!/usr/bin/env node
import { runCreateBE } from "./commands/create-express.js";
import { runCreateFE } from "./commands/create-react.js";
import { runGenerateClient } from "./commands/generate-client.js";
import { runGenerateDocs } from "./commands/generate-docs.js";
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

        case "generate-client":
            await runGenerateClient();
            break;

        case "generate-docs":
            await runGenerateDocs();
            break;

        default:
            console.log("No such methods defined. Available methods: create-be, create-fe, generate-client, generate-docs");
            process.exit(1);
    }
}

main();
