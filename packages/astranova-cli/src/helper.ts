import fs from "fs";
import path from "path";
import inquirer from "inquirer";
export { getMonorepoRoot } from "astranova-core/node";

export function detectServicePort(serviceDir: string): number {
    // 1. Try src/configs/index.ts first
    const configPath = path.join(serviceDir, "src", "configs", "index.ts");
    if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, "utf-8");
        const serverPortMatch = /SERVER_PORT\s*=\s*(?:process\.env\.PORT\s*\|\|)?\s*(\d+)/i.exec(content);
        if (serverPortMatch) {
            return parseInt(serverPortMatch[1], 10);
        }
        const portMatch = /port:\s*(?:process\.env\.PORT\s*\|\|)?\s*(\d+)/i.exec(content);
        if (portMatch) {
            return parseInt(portMatch[1], 10);
        }
    }
    // 2. Try .env.example
    const envExamplePath = path.join(serviceDir, ".env.example");
    if (fs.existsSync(envExamplePath)) {
        const content = fs.readFileSync(envExamplePath, "utf-8");
        const match = /PORT\s*=\s*(\d+)/i.exec(content);
        if (match) {
            return parseInt(match[1], 10);
        }
    }
    // 3. Try src/index.ts
    const indexPath = path.join(serviceDir, "src", "index.ts");
    if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, "utf-8");
        const portMatch = /(?:PORT|SERVER_PORT)\s*=\s*(?:process\.env\.PORT\s*\|\|)?\s*(\d+)/i.exec(content);
        if (portMatch) {
            return parseInt(portMatch[1], 10);
        }
    }
    return 3000;
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
