import { execSync } from "node:child_process";

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error("❌ Please provide a project name. Example:");
    console.error("   pnpm create-be new-server");
    process.exit(1);
}

const projectName = args[0];
const targetDir = `services/backend/${projectName}`;

console.log(`🚀 Creating backend project at: ${targetDir}`);

try {
    execSync(`pnpm create-express-app ${targetDir}`, {
        stdio: "inherit",
    });
} catch (error) {
    console.error("❌ Failed to create backend project:", error);
    process.exit(1);
}
