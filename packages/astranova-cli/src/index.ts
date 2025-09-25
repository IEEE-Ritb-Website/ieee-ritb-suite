#!/usr/bin/env node
import { runCreateBE } from "./create-express";
import { askProjectName } from "./helper";

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

        default:
            console.log("No such methods defined. Available methods: create-be");
            process.exit(1);
    }
}

main();
