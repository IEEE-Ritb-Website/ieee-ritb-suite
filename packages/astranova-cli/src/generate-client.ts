import fs from "fs";
import path from "path";
import { execSync } from "child_process";

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

/**
 * Extracts variable declarations from TypeScript files.
 * Matches `export const Name = ...` and balances brackets/braces to extract the block.
 */
function extractVariableDeclarations(fileContent: string): Map<string, string> {
    const declarations = new Map<string, string>();
    const regex = /export\s+const\s+(\w+)\s*=\s*/g;
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
        const varName = match[1];
        const startIndex = regex.lastIndex;
        let braceCount = 0;
        let parenCount = 0;
        let bracketCount = 0;
        let inString: string | null = null;
        let i = startIndex;
        for (; i < fileContent.length; i++) {
            const char = fileContent[i];
            if (inString) {
                if (char === inString && fileContent[i - 1] !== "\\") {
                    inString = null;
                }
                continue;
            }
            if (char === '"' || char === "'" || char === "`") {
                inString = char;
                continue;
            }

            if (char === "{") braceCount++;
            else if (char === "}") braceCount--;
            else if (char === "(") parenCount++;
            else if (char === ")") parenCount--;
            else if (char === "[") bracketCount++;
            else if (char === "]") bracketCount--;

            if (braceCount === 0 && parenCount === 0 && bracketCount === 0) {
                if (char === ";") {
                    i++;
                    break;
                }
                if (char === "\n" && i > startIndex + 1) {
                    const nextLine = fileContent.slice(i + 1).trim();
                    if (nextLine.startsWith("export") || nextLine.startsWith("const") || nextLine.startsWith("function") || nextLine.startsWith("import")) {
                        break;
                    }
                }
            }
        }
        const value = fileContent.slice(startIndex, i).trim();
        declarations.set(varName, value);
    }
    return declarations;
}

/**
 * Parses the properties inside a `z.object({ ... })` string.
 */
function parseZodObjectProperties(content: string): Map<string, string> {
    const props = new Map<string, string>();
    const startIdx = content.indexOf("z.object(");
    if (startIdx === -1) return props;
    const innerStart = content.indexOf("{", startIdx + 8);
    if (innerStart === -1) return props;

    let braceCount = 1;
    let i = innerStart + 1;
    for (; i < content.length; i++) {
        if (content[i] === "{") braceCount++;
        else if (content[i] === "}") braceCount--;
        if (braceCount === 0) break;
    }
    const innerContent = content.slice(innerStart + 1, i);

    let currentKey = "";
    let currentValue = "";
    let currentParen = 0;
    let currentBrace = 0;
    let inKey = true;
    for (let j = 0; j < innerContent.length; j++) {
        const char = innerContent[j];
        if (inKey) {
            if (char === ":") {
                inKey = false;
                currentKey = currentKey.trim();
            } else {
                currentKey += char;
            }
        } else {
            if (char === "{") currentBrace++;
            else if (char === "}") currentBrace--;
            else if (char === "(") currentParen++;
            else if (char === ")") currentParen--;

            if (char === "," && currentBrace === 0 && currentParen === 0) {
                props.set(currentKey, currentValue.trim());
                currentKey = "";
                currentValue = "";
                inKey = true;
            } else {
                currentValue += char;
            }
        }
    }
    if (currentKey && currentValue) {
        props.set(currentKey.trim(), currentValue.trim());
    }
    return props;
}

function extractObjectKeys(objStr: string): string[] {
    const keys: string[] = [];
    const content = objStr.replace(/^\{/, "").replace(/\}$/, "").trim();
    const parts = content.split(",");
    for (const part of parts) {
        const colonIdx = part.indexOf(":");
        if (colonIdx !== -1) {
            keys.push(part.slice(0, colonIdx).trim());
        } else if (part.trim()) {
            keys.push(part.trim());
        }
    }
    return keys;
}

/**
 * Resolves schema operations like `.pick`, `.omit`, `.extend` recursively.
 */
function resolveSchemaChain(expr: string, allDeclarations: Map<string, string>): Map<string, string> {
    expr = expr.replace(/(?:defineRequestSchema|defineResponseSchema|validationMiddleware)\s*\(/g, "");
    expr = expr.trim();

    let currentProps = new Map<string, string>();
    let remainingChain = expr;

    if (expr.startsWith("z.object")) {
        currentProps = parseZodObjectProperties(expr);
        let braceCount = 0;
        let parenCount = 0;
        let i = 0;
        for (; i < expr.length; i++) {
            if (expr[i] === "{") braceCount++;
            else if (expr[i] === "}") braceCount--;
            else if (expr[i] === "(") parenCount++;
            else if (expr[i] === ")") parenCount--;
            if (i > 8 && braceCount === 0 && parenCount === 0) {
                i++;
                break;
            }
        }
        remainingChain = expr.slice(i);
    } else {
        const baseMatch = /^(\w+)/.exec(expr);
        if (baseMatch) {
            const baseVar = baseMatch[1];
            const baseExpr = allDeclarations.get(baseVar);
            if (baseExpr) {
                currentProps = resolveSchemaChain(baseExpr, allDeclarations);
            }
            remainingChain = expr.slice(baseVar.length);
        }
    }

    const opRegex = /\.(pick|omit|extend)\s*\(/g;
    let opMatch;
    while ((opMatch = opRegex.exec(remainingChain)) !== null) {
        const opType = opMatch[1];
        const startIdx = opRegex.lastIndex;
        let parenCount = 1;
        let i = startIdx;
        for (; i < remainingChain.length; i++) {
            if (remainingChain[i] === "(") parenCount++;
            else if (remainingChain[i] === ")") parenCount--;
            if (parenCount === 0) break;
        }
        const opArg = remainingChain.slice(startIdx, i).trim();

        if (opType === "pick") {
            const keys = extractObjectKeys(opArg);
            const newProps = new Map<string, string>();
            for (const key of keys) {
                if (currentProps.has(key)) {
                    newProps.set(key, currentProps.get(key)!);
                }
            }
            currentProps = newProps;
        } else if (opType === "omit") {
            const keys = extractObjectKeys(opArg);
            for (const key of keys) {
                currentProps.delete(key);
            }
        } else if (opType === "extend") {
            const extendProps = parseZodObjectProperties(`z.object(${opArg})`);
            for (const [key, val] of extendProps.entries()) {
                currentProps.set(key, val);
            }
        }
    }

    return currentProps;
}

function isSchemaChain(zodStr: string, allDeclarations: Map<string, string>): boolean {
    zodStr = zodStr.trim();
    const baseWord = /^(\w+)/.exec(zodStr);
    if (baseWord && allDeclarations.has(baseWord[1])) {
        return true;
    }
    return false;
}

function zodPropToTs(zodStr: string, allDeclarations: Map<string, string>): string {
    zodStr = zodStr.trim();

    // Check if it's a shape lookup, e.g. ShortUrlSchema.shape.code.optional()
    const shapeMatch = /^(\w+)\.shape\.(\w+)/.exec(zodStr);
    if (shapeMatch) {
        const baseVar = shapeMatch[1];
        const propName = shapeMatch[2];
        const baseExpr = allDeclarations.get(baseVar);
        if (baseExpr) {
            const resolvedProps = resolveSchemaChain(baseExpr, allDeclarations);
            let propExpr = resolvedProps.get(propName);
            if (propExpr) {
                if (zodStr.includes(".optional()")) {
                    propExpr += ".optional()";
                }
                if (zodStr.includes(".nullable()")) {
                    propExpr += ".nullable()";
                }
                return zodPropToTs(propExpr, allDeclarations);
            }
        }
        return "any";
    }

    if (!zodStr.startsWith("z.")) {
        if (isSchemaChain(zodStr, allDeclarations)) {
            const resolvedProps = resolveSchemaChain(zodStr, allDeclarations);
            return "{\n" + Array.from(resolvedProps.entries()).map(([k, v]) => `  ${k}: ${zodPropToTs(v, allDeclarations)};`).join("\n") + "\n}";
        }
        if (zodStr === "true" || zodStr === "false") return zodStr;
        return "any";
    }

    const isNullable = zodStr.includes(".nullable()");
    let baseType = "any";

    if (zodStr.startsWith("z.string")) {
        baseType = "string";
    } else if (zodStr.startsWith("z.number")) {
        baseType = "number";
    } else if (zodStr.startsWith("z.boolean")) {
        baseType = "boolean";
    } else if (zodStr.startsWith("z.date")) {
        baseType = "string";
    } else if (zodStr.startsWith("z.url")) {
        baseType = "string";
    } else if (zodStr.startsWith("z.any")) {
        baseType = "any";
    } else if (zodStr.startsWith("z.literal")) {
        const match = /z\.literal\(([^)]+)\)/.exec(zodStr);
        baseType = match ? match[1].trim() : "any";
    } else if (zodStr.startsWith("z.enum")) {
        const match = /z\.enum\(([^)]+)\)/.exec(zodStr);
        if (match) {
            const arg = match[1].trim();
            if (arg.startsWith("[")) {
                baseType = arg.replace(/^\[/, "").replace(/\]$/, "").split(",").map(s => s.trim()).join(" | ");
            } else {
                if (arg === "ChapterTypeValues") {
                    baseType = '"tech" | "non-tech"';
                } else {
                    baseType = "string";
                }
            }
        } else {
            baseType = "string";
        }
    } else if (zodStr.startsWith("z.array")) {
        const match = /z\.array\(([\s\S]+)\)/.exec(zodStr);
        if (match) {
            const inner = match[1].trim();
            if (inner.startsWith("z.object")) {
                const props = parseZodObjectProperties(inner);
                baseType = "{\n" + Array.from(props.entries()).map(([k, v]) => `  ${k}: ${zodPropToTs(v, allDeclarations)};`).join("\n") + "\n}[]";
            } else {
                baseType = `(${zodPropToTs(inner, allDeclarations)})[]`;
            }
        } else {
            baseType = "any[]";
        }
    } else if (zodStr.startsWith("z.object")) {
        const props = parseZodObjectProperties(zodStr);
        baseType = "{\n" + Array.from(props.entries()).map(([k, v]) => `  ${k}: ${zodPropToTs(v, allDeclarations)};`).join("\n") + "\n}";
    } else if (zodStr.startsWith("z.record")) {
        baseType = "Record<string, any>";
    }

    if (isNullable) {
        baseType += " | null";
    }
    return baseType;
}

function normalizeTypeName(name: string): string {
    if (name.startsWith("I") && name.length > 1 && name.charAt(1) === name.charAt(1).toUpperCase()) {
        return name.slice(1);
    }
    return name;
}

function parseRouteParams(pathStr: string): { params: string[], urlExpression: string } {
    const params: string[] = [];
    const regex = /:(\w+)/g;
    let match;
    while ((match = regex.exec(pathStr)) !== null) {
        params.push(match[1]);
    }

    let urlExpression = pathStr;
    if (params.length > 0) {
        for (const param of params) {
            urlExpression = urlExpression.replace(`:${param}`, `\${${param}}`);
        }
        urlExpression = "`" + urlExpression + "`";
    } else {
        urlExpression = `"${pathStr}"`;
    }
    return { params, urlExpression };
}

function buildMethod(
    methodName: string,
    httpMethod: string,
    pathStr: string,
    reqType: string,
    resType: string
): string {
    const { params, urlExpression } = parseRouteParams(pathStr);
    const args: string[] = params.map(p => `${p}: string`);

    const hasPayload = reqType !== "any";
    if (hasPayload) {
        args.push(`payload: T.${reqType}`);
    }

    const argsStr = args.join(", ");
    const isGet = httpMethod.toLowerCase() === "get";
    const resTypeStr = resType === "any" ? "any" : `T.${resType}`;

    let axiosCall = "";
    if (isGet) {
        if (hasPayload) {
            axiosCall = `api.get<${resTypeStr}>(${urlExpression}, { params: payload })`;
        } else {
            axiosCall = `api.get<${resTypeStr}>(${urlExpression})`;
        }
    } else {
        if (hasPayload) {
            axiosCall = `api.${httpMethod.toLowerCase()}<${resTypeStr}>(${urlExpression}, payload)`;
        } else {
            axiosCall = `api.${httpMethod.toLowerCase()}<${resTypeStr}>(${urlExpression})`;
        }
    }

    return `export const ${methodName} =\n` +
        `  (api: AxiosInstance) =>\n` +
        `  async (${argsStr}): Promise<${resTypeStr}> => {\n` +
        `    const response = await ${axiosCall};\n` +
        `    return response.data;\n` +
        `  };\n`;
}

export async function runGenerateClient() {
    const serviceRoot = process.cwd();
    const routesDir = path.join(serviceRoot, "src", "routes");
    const validatorsDir = path.join(serviceRoot, "src", "validators");
    const schemasDir = path.join(serviceRoot, "src", "schemas");
    const typesDir = path.join(serviceRoot, "src", "types");

    console.log(`Scanning API definitions in ${serviceRoot}...`);

    const routeFiles = walkDir(routesDir);
    if (routeFiles.length === 0) {
        console.error("No API routes found. Make sure you run this command from the root of a backend service.");
        process.exit(1);
    }

    // 1. Parse src/routes/index.ts to map mounted router variable names to prefixes
    const prefixMap = new Map<string, string>(); // router filename -> prefix
    const indexRoutesFile = path.join(routesDir, "index.ts");
    if (fs.existsSync(indexRoutesFile)) {
        const content = fs.readFileSync(indexRoutesFile, "utf-8");
        // E.g. import shortUrlRouter from './shortUrl.routes';
        const importRegex = /import\s+(?:(\w+)|\{\s*(\w+)\s*\}|(?:\*\s+as\s+(\w+)))\s+from\s+["']\.\/([^"']+)["']/g;
        let importMatch;
        const variableToFile = new Map<string, string>();
        while ((importMatch = importRegex.exec(content)) !== null) {
            const varName = importMatch[1] || importMatch[2] || importMatch[3];
            const fileRef = importMatch[4];
            if (varName && fileRef) {
                variableToFile.set(varName, fileRef);
            }
        }
        // E.g. router.use("/api", shortUrlRouter);
        const useRegex = /router\.use\(\s*(?:["']([^"']+)["']\s*,\s*)?(\w+)\s*\)/g;
        let useMatch;
        while ((useMatch = useRegex.exec(content)) !== null) {
            const prefix = useMatch[1] || "";
            const varName = useMatch[2];
            const fileRef = variableToFile.get(varName);
            if (fileRef) {
                prefixMap.set(fileRef, prefix);
            }
        }
    }

    // 2. Scan all routes in routes files
    interface ExtractedRoute {
        httpMethod: string;
        pathStr: string;
        methodName: string;
        reqType: string;
        resType: string;
        reqValidatorName: string | null;
        resValidatorName: string | null;
    }
    const routesList: ExtractedRoute[] = [];

    for (const file of routeFiles) {
        if (file.endsWith("index.ts")) continue;
        const fileContent = fs.readFileSync(file, "utf-8");
        const baseName = path.basename(file, ".ts").replace(/\.js$/, "");
        const prefix = prefixMap.get(baseName) || "";

        // Match router calls: e.g. router.get("/path", ...)
        const routeRegex = /(?:[a-zA-Z_$][0-9a-zA-Z_$]*)\.(get|post|put|delete|patch)\(\s*["']([^"']+)["']/gi;
        let routeMatch;
        while ((routeMatch = routeRegex.exec(fileContent)) !== null) {
            const httpMethod = routeMatch[1].toLowerCase();
            const subPath = routeMatch[2];
            const fullPath = (prefix + subPath).replace(/\/+/g, "/");

            // Ignore cron routes
            if (fullPath.toLowerCase().includes("cron")) {
                continue;
            }

            const matchIndex = routeMatch.index;
            const windowText = fileContent.slice(matchIndex, matchIndex + 600);

            // Search for validators
            // withResponseValidation<IGetChaptersResponse, typeof GetChaptersRequestValidator>(...)
            const validatorRegex = /withResponseValidation\s*<\s*([\w]+)\s*,\s*(?:typeof\s+)?([\w]+)\s*>\s*\(\s*([\w]+)/;
            const valMatch = validatorRegex.exec(windowText);

            let resType = "any";
            let reqType = "any";
            let reqValidatorName: string | null = null;
            let resValidatorName: string | null = null;

            if (valMatch) {
                resType = valMatch[1];
                reqValidatorName = valMatch[2];
                resValidatorName = valMatch[3];
                // Derive request payload type name
                reqType = reqValidatorName.replace(/RequestValidator$/, "Request").replace(/Validator$/, "Request");
                if (!reqType.startsWith("I")) {
                    reqType = "I" + reqType;
                }
            }

            // Extract method name from Controllers or handlers
            let methodName = "";
            const controllerRegex = /(?:Controllers|formController|chapterController|userController|[\w]+Controller)\.([\w]+)/;
            const ctrlMatch = controllerRegex.exec(windowText);
            if (ctrlMatch) {
                methodName = ctrlMatch[1];
            } else {
                const handlerRegex = /asyncHandler\(\s*(?:[\w]+\.)?([\w]+)\s*\)/;
                const hdlMatch = handlerRegex.exec(windowText);
                if (hdlMatch) {
                    methodName = hdlMatch[1];
                } else {
                    methodName = parseRouteParams(fullPath).urlExpression.replace(/[^a-zA-Z0-9]/g, " ");
                    const parts = methodName.split(/\s+/).filter(Boolean);
                    methodName = httpMethod + parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("");
                }
            }

            routesList.push({
                httpMethod,
                pathStr: fullPath,
                methodName,
                reqType,
                resType,
                reqValidatorName,
                resValidatorName
            });
        }
    }

    // Sort routes alphabetically by methodName to ensure consistent order
    routesList.sort((a, b) => a.methodName.localeCompare(b.methodName));

    // 3. Scan validators, schemas, and types for type definitions
    const validatorFiles = [...walkDir(validatorsDir), ...walkDir(schemasDir), ...walkDir(typesDir)];
    const allDeclarations = new Map<string, string>();
    const directTypes = new Map<string, string>();

    for (const file of validatorFiles) {
        const fileContent = fs.readFileSync(file, "utf-8");
        // Extract const variables (Zod definitions)
        const decls = extractVariableDeclarations(fileContent);
        for (const [k, v] of decls.entries()) {
            allDeclarations.set(k, v);
        }

        // Extract direct interface/type declarations
        const typeRegex = /export\s+(interface|type)\s+(\w+)/g;
        let typeMatch;
        while ((typeMatch = typeRegex.exec(fileContent)) !== null) {
            const keyword = typeMatch[1];
            const typeName = typeMatch[2];
            const startIdx = typeMatch.index;

            let body = "";
            if (keyword === "interface") {
                const braceStart = fileContent.indexOf("{", startIdx);
                if (braceStart !== -1) {
                    let braceCount = 1;
                    let i = braceStart + 1;
                    for (; i < fileContent.length; i++) {
                        if (fileContent[i] === "{") braceCount++;
                        else if (fileContent[i] === "}") braceCount--;
                        if (braceCount === 0) break;
                    }
                    body = fileContent.slice(startIdx, i + 1);
                }
            } else {
                // type
                const semiIdx = fileContent.indexOf(";", startIdx);
                if (semiIdx !== -1) {
                    body = fileContent.slice(startIdx, semiIdx + 1);
                } else {
                    const newlineIdx = fileContent.indexOf("\n", startIdx);
                    body = fileContent.slice(startIdx, newlineIdx);
                }
            }
            if (body) {
                directTypes.set(typeName, body.trim());
            }
        }
    }

    // 4. Resolve types for client/types.ts
    const generatedTypes = new Map<string, string>();
    const externalImports = new Set<string>();

    for (const route of routesList) {
        // Resolve Request Type
        if (route.reqValidatorName && route.reqType !== "any") {
            const validatorExpr = allDeclarations.get(route.reqValidatorName);
            const normalizedReqName = normalizeTypeName(route.reqType);
            if (validatorExpr) {
                try {
                    const resolvedProps = resolveSchemaChain(validatorExpr, allDeclarations);
                    let targetProps = resolvedProps;
                    // If it's a request validator, look inside query (for get) or body (for others)
                    const isGet = route.httpMethod === "get";
                    const keyToLook = isGet ? "query" : "body";
                    const innerExpr = resolvedProps.get(keyToLook);
                    if (innerExpr) {
                        targetProps = resolveSchemaChain(innerExpr, allDeclarations);
                    }

                    let typeOutput = `export interface ${normalizedReqName} {\n`;
                    for (const [k, v] of targetProps.entries()) {
                        const isOpt = v.includes(".optional()") || k.endsWith("?");
                        const cleanKey = k.endsWith("?") ? k.slice(0, -1) : k;
                        typeOutput += `  ${cleanKey}${isOpt ? "?" : ""}: ${zodPropToTs(v, allDeclarations)};\n`;
                        if (v.includes("ChapterType")) {
                            externalImports.add("ChapterType");
                        }
                    }
                    typeOutput += `}\n`;
                    generatedTypes.set(normalizedReqName, typeOutput);
                } catch {
                    // fallback to any
                    generatedTypes.set(normalizedReqName, `export type ${normalizedReqName} = any;`);
                }
            } else {
                // Try direct type
                const direct = directTypes.get(route.reqType);
                if (direct) {
                    generatedTypes.set(normalizedReqName, direct.replace(route.reqType, normalizedReqName));
                } else {
                    generatedTypes.set(normalizedReqName, `export type ${normalizedReqName} = any;`);
                }
            }
        }

        // Resolve Response Type
        if (route.resValidatorName && route.resType !== "any") {
            const validatorExpr = allDeclarations.get(route.resValidatorName);
            const normalizedResName = normalizeTypeName(route.resType);
            if (validatorExpr) {
                try {
                    const resolvedProps = resolveSchemaChain(validatorExpr, allDeclarations);
                    let typeOutput = `export interface ${normalizedResName} {\n`;
                    for (const [k, v] of resolvedProps.entries()) {
                        const isOpt = v.includes(".optional()") || k.endsWith("?");
                        const cleanKey = k.endsWith("?") ? k.slice(0, -1) : k;
                        typeOutput += `  ${cleanKey}${isOpt ? "?" : ""}: ${zodPropToTs(v, allDeclarations)};\n`;
                        if (v.includes("ChapterType")) {
                            externalImports.add("ChapterType");
                        }
                    }
                    typeOutput += `}\n`;
                    generatedTypes.set(normalizedResName, typeOutput);
                } catch {
                    // fallback to any
                    generatedTypes.set(normalizedResName, `export type ${normalizedResName} = any;`);
                }
            } else {
                // Try direct type
                const direct = directTypes.get(route.resType);
                if (direct) {
                    generatedTypes.set(normalizedResName, direct.replace(route.resType, normalizedResName));
                } else {
                    generatedTypes.set(normalizedResName, `export type ${normalizedResName} = any;`);
                }
            }
        }
    }

    // Write Client SDK files
    const clientDir = path.join(serviceRoot, "src", "client");
    if (!fs.existsSync(clientDir)) {
        fs.mkdirSync(clientDir, { recursive: true });
    }

    // Write client/api.ts
    const apiCode = `import axios from "axios";\n\nexport const API = (baseURL: string) => {\n  return axios.create({\n    baseURL,\n    timeout: 10000,\n    headers: {\n      "Content-Type": "application/json",\n    },\n  });\n};\n`;
    fs.writeFileSync(path.join(clientDir, "api.ts"), apiCode, "utf-8");
    console.log("  Created src/client/api.ts");

    // Write client/types.ts
    let typesCode = "";
    if (externalImports.has("ChapterType")) {
        typesCode += `import { ChapterType } from "@astranova/catalogues";\n\n`;
    }
    for (const [_, typeDef] of generatedTypes.entries()) {
        typesCode += typeDef + "\n\n";
    }
    fs.writeFileSync(path.join(clientDir, "types.ts"), typesCode, "utf-8");
    console.log("  Created src/client/types.ts");

    // Write client/index.ts
    let indexCode = `import { AxiosInstance } from "axios";\nimport { API } from "./api";\nimport * as T from "./types";\n\n`;
    
    // Write individual methods
    for (const route of routesList) {
        const reqNorm = route.reqType !== "any" ? normalizeTypeName(route.reqType) : "any";
        const resNorm = route.resType !== "any" ? normalizeTypeName(route.resType) : "any";
        indexCode += buildMethod(route.methodName, route.httpMethod, route.pathStr, reqNorm, resNorm) + "\n";
    }

    indexCode += `export const createClient = (baseURL: string) => {\n  const api = API(baseURL);\n\n  return {\n`;
    for (const route of routesList) {
        indexCode += `    ${route.methodName}: ${route.methodName}(api),\n`;
    }
    indexCode += `  };\n};\n\nexport * from "./types";\n`;

    fs.writeFileSync(path.join(clientDir, "index.ts"), indexCode, "utf-8");
    console.log("  Created src/client/index.ts");

    // Update package.json to export client and add axios dependency
    const packageJsonPath = path.join(serviceRoot, "package.json");
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

        packageJson.exports = packageJson.exports || {};
        packageJson.exports["client"] = "./dist/client/index.js";

        packageJson.dependencies = packageJson.dependencies || {};
        if (!packageJson.dependencies["axios"]) {
            packageJson.dependencies["axios"] = "^1.13.5";
        }

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf-8");
        console.log("  Updated package.json exports and dependencies.");
    }

    // Run Prettier & ESLint to clean up formatting/styles
    try {
        console.log("Formatting generated client SDK...");
        execSync("pnpm prettier --write src/client", { cwd: serviceRoot, stdio: "ignore" });
        execSync("npx eslint --fix src/client", { cwd: serviceRoot, stdio: "ignore" });
    } catch {
        // ignore format errors
    }

    console.log("\n🎉 Axios API client successfully generated programmatically in src/client/");
}
