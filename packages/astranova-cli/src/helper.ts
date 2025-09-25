import path from "path";
import fs from "fs";
import inquirer from "inquirer";

export function getMonorepoRoot(): string {
    let dir = process.cwd();
    while (dir !== path.parse(dir).root) {
        if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml')) ||
            (fs.existsSync(path.join(dir, 'package.json')) &&
                JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8')).workspaces)) {
            return dir;
        }
        dir = path.dirname(dir);
    }
    return process.cwd();
}

export async function askProjectName(): Promise<string> {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "projectName",
            message: "Project name:",
            default: "my-express-app",
        },
    ]);
    return answer.projectName;
}
