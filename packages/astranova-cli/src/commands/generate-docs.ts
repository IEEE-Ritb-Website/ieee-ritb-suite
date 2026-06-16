import fs from "fs";
import path from "path";
import os from "os";
import { runAI } from "astranova-ai/runner";
import chalk from "chalk";
import { StepLogger } from "../step-logger.js";

function walkDir(dir: string, fileList: string[] = []): string[] {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walkDir(filePath, fileList);
        } else if (file.endsWith(".ts") || file.endsWith(".js")) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

function getServiceName(serviceRoot: string): string {
    try {
        const pkgPath = path.join(serviceRoot, "package.json");
        if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
            if (pkg.name) {
                return pkg.name;
            }
        }
    } catch { }
    return path.basename(serviceRoot);
}



async function runAIWithJson<T = any>(message: string, options: any = {}): Promise<T> {
    const rawOutput = await runAI(message, options);
    const fencePattern = /^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/;
    const match = rawOutput.trim().match(fencePattern);
    const cleaned = match ? match[1].trim() : rawOutput.trim();
    try {
        return JSON.parse(cleaned) as T;
    } catch {
        throw new Error("AI did not return valid JSON. Please rerun the command to try again.");
    }
}

export async function runGenerateDocs() {
    const serviceRoot = process.cwd();
    const routesDir = path.join(serviceRoot, "src", "routes");
    const validatorsDir = path.join(serviceRoot, "src", "validators");
    const schemasDir = path.join(serviceRoot, "src", "schemas");

    const serviceName = getServiceName(serviceRoot);
    const logger = new StepLogger(`Generating ${serviceName} OpenAPI Swagger Documentation`, [
        "Scan API routes and definitions",
        "Generate specification using Astranova AI",
        "Validate and write docs/swagger.json"
    ]);

    try {
        logger.startNextStep(); // step 0: Scan API routes
        const routeFiles = walkDir(routesDir);
        const validatorFiles = walkDir(validatorsDir);
        const schemaFiles = walkDir(schemasDir);

        const allFiles = [...routeFiles, ...validatorFiles, ...schemaFiles];
        if (allFiles.length === 0) {
            logger.failStep("No API routes or validators found. Ensure you are in a backend service root.");
            process.exit(1);
        }

        let contextContent = "You are a Swagger/OpenAPI JSON generator.\n";
        contextContent += "CRITICAL RULES:\n";
        contextContent += "1. Output ONLY the raw JSON object. No prose, no markdown code fences, no YAML, no explanation.\n";
        contextContent += "2. The very first character of your response must be '{' and the very last must be '}'.\n";
        contextContent += "3. Do NOT write any files. Output the JSON directly to stdout only.\n\n";
        contextContent += "Code files to analyze:\n";

        for (const file of allFiles) {
            const relativePath = path.relative(serviceRoot, file);
            const content = fs.readFileSync(file, "utf-8");
            contextContent += `\n--- File: ${relativePath} ---\n${content}\n`;
        }

        const contextFilePath = path.join(os.tmpdir(), `astranova-docs-ctx-${Date.now()}.txt`);
        fs.writeFileSync(contextFilePath, contextContent, "utf-8");

        const message =
            "Analyze the attached source files and generate a complete, valid OpenAPI 3.0.0 JSON specification. " +
            "Output ONLY the raw JSON object with no prose, no markdown fences, no YAML.";

        logger.succeedStep(); // step 0 succeeded

        logger.startNextStep(); // step 1: Generate spec using AI

        let parsed: unknown;
        try {
            parsed = await runAIWithJson<unknown>(message, {
                cwd: serviceRoot,
                contextFilePath,
                spinnerLabel: "Generating Swagger docs",
                showSpinner: false,
            });
        } catch (err: any) {
            logger.failStep(err.message);
            try { fs.unlinkSync(contextFilePath); } catch { /* ignore */ }
            console.log(chalk.red("\n❌ Error: The AI response was not valid JSON. Please rerun the command to try again.\n"));
            process.exit(1);
        }

        try { fs.unlinkSync(contextFilePath); } catch { /* ignore */ }

        logger.succeedStep(); // step 1 succeeded

        logger.startNextStep(); // step 2: Validate and write Swagger JSON

        const docsDir = path.join(serviceRoot, "docs");
        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
        }

        const swaggerPath = path.join(docsDir, "swagger.json");
        fs.writeFileSync(swaggerPath, JSON.stringify(parsed, null, 2), "utf-8");

        logger.succeedStep(); // step 2 succeeded
        console.log(chalk.green.bold("\n🎉 Swagger documentation generated successfully!\n"));
    } catch (err: any) {
        logger.failStep(err.message);
        process.exit(1);
    }
}
