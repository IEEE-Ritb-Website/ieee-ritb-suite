import fs from "fs";
import path from "path";
import os from "os";
import { runAI } from "astranova-ai/runner";

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

function stripMarkdownFences(text: string): string {
    const fencePattern = /^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/;
    const match = text.trim().match(fencePattern);
    return match ? match[1].trim() : text.trim();
}

export async function runGenerateDocs() {
    const serviceRoot = process.cwd();
    const routesDir = path.join(serviceRoot, "src", "routes");
    const validatorsDir = path.join(serviceRoot, "src", "validators");
    const schemasDir = path.join(serviceRoot, "src", "schemas");

    console.log(`Scanning API definitions in ${serviceRoot}...`);

    const routeFiles = walkDir(routesDir);
    const validatorFiles = walkDir(validatorsDir);
    const schemaFiles = walkDir(schemasDir);

    const allFiles = [...routeFiles, ...validatorFiles, ...schemaFiles];
    if (allFiles.length === 0) {
        console.error("No API routes or validators found. Make sure you run this command from the root of a backend service.");
        process.exit(1);
    }

    // Build a context file with source content + instructions.
    // Passed via opencode's -f flag so the message arg stays short (avoids cmd.exe 8191-char limit).
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

    console.log("Generating API Swagger documentation using Astranova AI...\n");

    let rawOutput: string;
    try {
        rawOutput = await runAI(message, {
            cwd: serviceRoot,
            contextFilePath,
            spinnerLabel: "Generating Swagger docs",
        });
    } catch (err: any) {
        console.error(`\n❌ AI generation failed: ${err.message}`);
        process.exit(1);
    } finally {
        try { fs.unlinkSync(contextFilePath); } catch { /* ignore */ }
    }

    const cleaned = stripMarkdownFences(rawOutput);

    let parsed: unknown;
    try {
        parsed = JSON.parse(cleaned);
    } catch {
        console.error("\n❌ AI did not output valid JSON. Raw output was:");
        console.log(rawOutput);
        process.exit(1);
    }

    const docsDir = path.join(serviceRoot, "docs");
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
    }

    const swaggerPath = path.join(docsDir, "swagger.json");
    fs.writeFileSync(swaggerPath, JSON.stringify(parsed, null, 2), "utf-8");

    console.log(`\n🎉 Swagger documentation successfully generated at docs/swagger.json`);
}
