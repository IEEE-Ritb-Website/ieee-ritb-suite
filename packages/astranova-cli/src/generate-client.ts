import fs from "fs";
import path from "path";
import { exec } from "child_process";
import chalk from "chalk";
import { StepLogger } from "./step-logger.js";

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
 * Matches `const Name = ...` or `export const Name = ...` and balances brackets/braces to extract the block.
 */
function extractVariableDeclarations(fileContent: string): Map<string, string> {
    const declarations = new Map<string, string>();
    const regex = /(?:export\s+)?const\s+(\w+)\s*=\s*/g;
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

function cleanZodString(str: string): string {
    return str
        .replace(/\s*\.\s*(object|string|number|boolean|date|url|any|literal|enum|array|record|pick|omit|extend|optional|nullable|default|shape|coerce|preprocess|refine|transform)\b/g, ".$1")
        .replace(/z\s*\.\s*/g, "z.")
        .replace(/z\.coerce\./g, "z.");
}

/**
 * Parses the properties inside a `z.object({ ... })` string.
 */
function parseZodObjectProperties(content: string): Map<string, string> {
    content = cleanZodString(content);
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
    expr = cleanZodString(expr);
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

function resolveReference(zodStr: string, allDeclarations: Map<string, string>): string {
    let current = zodStr.trim();
    let visited = new Set<string>();
    while (!current.startsWith("z.") && allDeclarations.has(current)) {
        if (visited.has(current)) {
            break;
        }
        visited.add(current);
        current = allDeclarations.get(current)!.trim();
    }
    return current;
}

function extractPreprocessSchema(zodStr: string): string {
    const startIdx = zodStr.indexOf("z.preprocess(");
    if (startIdx === -1) return "any";

    const innerStart = startIdx + "z.preprocess(".length;
    let parenCount = 1;
    let braceCount = 0;
    let i = innerStart;
    for (; i < zodStr.length; i++) {
        const char = zodStr[i];
        if (char === "(") parenCount++;
        else if (char === ")") parenCount--;
        else if (char === "{") braceCount++;
        else if (char === "}") braceCount--;

        if (parenCount === 0) {
            break;
        }
    }
    const innerContent = zodStr.slice(innerStart, i);

    let pCount = 0;
    let bCount = 0;
    let commaIdx = -1;
    for (let j = 0; j < innerContent.length; j++) {
        const char = innerContent[j];
        if (char === "(") pCount++;
        else if (char === ")") pCount--;
        else if (char === "{") bCount++;
        else if (char === "}") bCount--;

        if (char === "," && pCount === 0 && bCount === 0) {
            commaIdx = j;
            break;
        }
    }

    if (commaIdx !== -1) {
        return innerContent.slice(commaIdx + 1).trim();
    }
    return "any";
}

function zodPropToTs(zodStr: string, allDeclarations: Map<string, string>): string {
    zodStr = cleanZodString(zodStr);

    // Check shape lookup first before reference resolution, as shape lookups contain the base variable
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
        const baseMatch = /^(\w+)/.exec(zodStr);
        if (baseMatch && allDeclarations.has(baseMatch[1])) {
            const baseVar = baseMatch[1];
            const baseDecl = resolveReference(baseVar, allDeclarations);
            if (baseDecl.startsWith("z.object")) {
                const resolvedProps = resolveSchemaChain(zodStr, allDeclarations);
                return "{\n" + Array.from(resolvedProps.entries()).map(([k, v]) => `  ${k}: ${zodPropToTs(v, allDeclarations)};`).join("\n") + "\n}";
            } else {
                const replacedStr = baseDecl + zodStr.slice(baseVar.length);
                return zodPropToTs(replacedStr, allDeclarations);
            }
        }
        if (zodStr === "true" || zodStr === "false") return zodStr;
        return "any";
    }

    const isNullable = zodStr.includes(".nullable()");
    let baseType = "any";

    if (zodStr.startsWith("z.preprocess")) {
        const inner = extractPreprocessSchema(zodStr);
        baseType = zodPropToTs(inner, allDeclarations);
    } else if (zodStr.startsWith("z.object")) {
        const props = parseZodObjectProperties(zodStr);
        baseType = "{\n" + Array.from(props.entries()).map(([k, v]) => `  ${k}: ${zodPropToTs(v, allDeclarations)};`).join("\n") + "\n}";
    } else if (zodStr.startsWith("z.record")) {
        baseType = "Record<string, any>";
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
    } else if (zodStr.startsWith("z.literal")) {
        const match = /z\.literal\(([^)]+)\)/.exec(zodStr);
        baseType = match ? match[1].trim() : "any";
    } else if (zodStr.startsWith("z.string") || zodStr.startsWith("z.url")) {
        baseType = "string";
    } else if (zodStr.startsWith("z.number")) {
        baseType = "number";
    } else if (zodStr.startsWith("z.boolean")) {
        baseType = "boolean";
    } else if (zodStr.startsWith("z.date")) {
        baseType = "string";
    } else if (zodStr.startsWith("z.any")) {
        baseType = "any";
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

function buildUrlExpression(pathStr: string): string {
    const regex = /:(\w+)/g;
    let urlExpression = pathStr;
    let match;
    const params: string[] = [];
    while ((match = regex.exec(pathStr)) !== null) {
        params.push(match[1]);
    }

    if (params.length > 0) {
        for (const param of params) {
            urlExpression = urlExpression.replace(`:${param}`, `\${payload?.params?.${param}}`);
        }
        return "`" + urlExpression + "`";
    } else {
        return `"${pathStr}"`;
    }
}

function buildMethod(
    methodName: string,
    httpMethod: string,
    pathStr: string,
    reqType: string,
    resType: string
): string {
    const urlExpression = buildUrlExpression(pathStr);
    const hasPayload = reqType !== "any";

    let argsStr = "";
    if (hasPayload) {
        argsStr = `payload?: T.${reqType}`;
    }

    const isGet = httpMethod.toLowerCase() === "get";
    const resTypeStr = resType === "any" ? "any" : `T.${resType}`;

    let axiosCall = "";
    if (isGet) {
        if (hasPayload) {
            axiosCall = `api.get<${resTypeStr}>(${urlExpression}, { params: payload?.query })`;
        } else {
            axiosCall = `api.get<${resTypeStr}>(${urlExpression})`;
        }
    } else {
        if (hasPayload) {
            axiosCall = `api.${httpMethod.toLowerCase()}<${resTypeStr}>(${urlExpression}, payload?.body, { params: payload?.query })`;
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

function execCommandAsync(command: string, cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}



export async function runGenerateClient() {
    const serviceRoot = process.cwd();
    const routesDir = path.join(serviceRoot, "src", "routes");
    const validatorsDir = path.join(serviceRoot, "src", "validators");
    const schemasDir = path.join(serviceRoot, "src", "schemas");
    const typesDir = path.join(serviceRoot, "src", "types");

    const serviceName = getServiceName(serviceRoot);
    const logger = new StepLogger(`Generating ${serviceName} API Client SDK`, [
        "Scan API routes and definitions",
        "Resolve type mappings and schemas",
        "Write client package source files",
        "Format generated code with Prettier and ESLint",
        "Synchronize workspace package dependencies"
    ]);

    try {
        logger.startNextStep(); // step 0: Scan API routes
        const routeFiles = walkDir(routesDir);
        if (routeFiles.length === 0) {
            logger.failStep("No API routes found. Ensure you are in a backend service root.");
            process.exit(1);
        }

        // 1. Parse src/routes/index.ts to map mounted router variable names to prefixes
        const prefixMap = new Map<string, string>(); // router filename -> prefix
        const indexRoutesFile = path.join(routesDir, "index.ts");
        if (fs.existsSync(indexRoutesFile)) {
            const content = fs.readFileSync(indexRoutesFile, "utf-8");
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

            const routeRegex = /(?:[a-zA-Z_$][0-9a-zA-Z_$]*)\.(get|post|put|delete|patch)\(\s*["']([^"']+)["']/gi;
            let routeMatch;
            while ((routeMatch = routeRegex.exec(fileContent)) !== null) {
                const httpMethod = routeMatch[1].toLowerCase();
                const subPath = routeMatch[2];
                const fullPath = (prefix + subPath).replace(/\/+/g, "/");

                if (fullPath.toLowerCase().includes("cron")) {
                    continue;
                }

                const matchIndex = routeMatch.index;
                const windowText = fileContent.slice(matchIndex, matchIndex + 600);

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
                    reqType = reqValidatorName.replace(/RequestValidator$/, "Request").replace(/Validator$/, "Request");
                    if (!reqType.startsWith("I")) {
                        reqType = "I" + reqType;
                    }
                }

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
                        methodName = fullPath.replace(/:/g, "").replace(/[^a-zA-Z0-9]/g, " ");
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

        routesList.sort((a, b) => a.methodName.localeCompare(b.methodName));

        logger.succeedStep(); // step 0 succeeded

        logger.startNextStep(); // step 1: Resolve schemas

        const validatorFiles = [...walkDir(validatorsDir), ...walkDir(schemasDir), ...walkDir(typesDir)];
        const allDeclarations = new Map<string, string>();
        const directTypes = new Map<string, string>();

        for (const file of validatorFiles) {
            const fileContent = fs.readFileSync(file, "utf-8");
            const decls = extractVariableDeclarations(fileContent);
            for (const [k, v] of decls.entries()) {
                allDeclarations.set(k, v);
            }

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

        const generatedTypes = new Map<string, string>();
        const externalImports = new Set<string>();

        for (const route of routesList) {
            if (route.reqValidatorName && route.reqType !== "any") {
                const validatorExpr = allDeclarations.get(route.reqValidatorName);
                const normalizedReqName = normalizeTypeName(route.reqType);
                if (validatorExpr) {
                    try {
                        const resolvedProps = resolveSchemaChain(validatorExpr, allDeclarations);
                        let typeOutput = `export interface ${normalizedReqName} {\n`;

                        for (const key of ["params", "query", "body"]) {
                            const val = resolvedProps.get(key);
                            if (val) {
                                const innerProps = resolveSchemaChain(val, allDeclarations);
                                if (innerProps.size > 0) {
                                    let isOpt = val.includes(".optional()") || val.includes(".default(");
                                    let allFieldsOptional = true;
                                    for (const [k, v] of innerProps.entries()) {
                                        const isFieldOpt = v.includes(".optional()") || k.endsWith("?");
                                        if (!isFieldOpt) {
                                            allFieldsOptional = false;
                                        }
                                    }
                                    if (allFieldsOptional) {
                                        isOpt = true;
                                    }
                                    typeOutput += `  ${key}${isOpt ? "?" : ""}: {\n`;
                                    for (const [k, v] of innerProps.entries()) {
                                        const isOptField = v.includes(".optional()") || k.endsWith("?");
                                        const cleanKey = k.endsWith("?") ? k.slice(0, -1) : k;
                                        typeOutput += `    ${cleanKey}${isOptField ? "?" : ""}: ${zodPropToTs(v, allDeclarations)};\n`;
                                        if (v.includes("ChapterType")) {
                                            externalImports.add("ChapterType");
                                        }
                                    }
                                    typeOutput += `  };\n`;
                                } else {
                                    typeOutput += `  ${key}?: Record<string, never>;\n`;
                                }
                            } else {
                                typeOutput += `  ${key}?: Record<string, never>;\n`;
                            }
                        }

                        typeOutput += `}\n`;
                        generatedTypes.set(normalizedReqName, typeOutput);
                    } catch {
                        generatedTypes.set(normalizedReqName, `export type ${normalizedReqName} = any;`);
                    }
                } else {
                    const direct = directTypes.get(route.reqType);
                    if (direct) {
                        generatedTypes.set(normalizedReqName, direct.replace(route.reqType, normalizedReqName));
                    } else {
                        generatedTypes.set(normalizedReqName, `export type ${normalizedReqName} = any;`);
                    }
                }
            }

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
                        generatedTypes.set(normalizedResName, `export type ${normalizedResName} = any;`);
                    }
                } else {
                    const direct = directTypes.get(route.resType);
                    if (direct) {
                        generatedTypes.set(normalizedResName, direct.replace(route.resType, normalizedResName));
                    } else {
                        generatedTypes.set(normalizedResName, `export type ${normalizedResName} = any;`);
                    }
                }
            }
        }

        logger.succeedStep(); // step 1 succeeded

        logger.startNextStep(); // step 2: Write client package files

        const serviceFolder = path.basename(serviceRoot);
        const cleanName = serviceFolder.endsWith("-service") ? serviceFolder.slice(0, -8) : serviceFolder;
        const clientPkgName = `@astranova/${cleanName}-client`;

        const clientPkgDir = path.join(serviceRoot, "client");
        const clientSrcDir = path.join(clientPkgDir, "src");

        if (!fs.existsSync(clientSrcDir)) {
            fs.mkdirSync(clientSrcDir, { recursive: true });
        }

        const tsconfigContent = {
            extends: "../../../../tsconfig.base.json",
            compilerOptions: {
                target: "ES2022",
                module: "ESNext",
                moduleResolution: "bundler",
                declaration: true,
                outDir: "dist",
                strict: true,
                esModuleInterop: true,
                resolveJsonModule: true
            },
            include: ["src"],
            exclude: ["node_modules", "dist", "build", "**/*.spec.ts"]
        };
        fs.writeFileSync(path.join(clientPkgDir, "tsconfig.json"), JSON.stringify(tsconfigContent, null, 4), "utf-8");

        const clientPackageJson = {
            name: clientPkgName,
            version: "1.0.0",
            description: "",
            main: "dist/index.js",
            types: "dist/index.d.ts",
            exports: {
                ".": "./dist/index.js"
            },
            scripts: {
                build: "tsc && tsc-alias",
                clean: "rm -rf dist"
            },
            keywords: [],
            author: "",
            license: "ISC",
            dependencies: {
                axios: "^1.13.5"
            },
            devDependencies: {
                "tsc-alias": "^1.8.16"
            }
        };
        fs.writeFileSync(path.join(clientPkgDir, "package.json"), JSON.stringify(clientPackageJson, null, 2), "utf-8");

        const apiCode = `import axios from "axios";\n\nexport const API = (baseURL: string) => {\n  return axios.create({\n    baseURL,\n    timeout: 10000,\n    headers: {\n      "Content-Type": "application/json",\n    },\n  });\n};\n`;
        fs.writeFileSync(path.join(clientSrcDir, "api.ts"), apiCode, "utf-8");

        let typesCode = "";
        for (const [_, typeDef] of generatedTypes.entries()) {
            typesCode += typeDef + "\n\n";
        }
        let importHeader = "";
        if (externalImports.has("ChapterType") && typesCode.includes("ChapterType")) {
            importHeader += `import { ChapterType } from "@astranova/catalogues";\n\n`;
        }
        typesCode = importHeader + typesCode;
        if (!typesCode.trim()) {
            typesCode = "export {};\n";
        }
        fs.writeFileSync(path.join(clientSrcDir, "types.ts"), typesCode, "utf-8");

        let indexCode = `import { AxiosInstance } from "axios";\nimport { API } from "./api";\n`;
        let hasTypes = false;
        let methodsCode = "";
        for (const route of routesList) {
            const reqNorm = route.reqType !== "any" ? normalizeTypeName(route.reqType) : "any";
            const resNorm = route.resType !== "any" ? normalizeTypeName(route.resType) : "any";
            if (reqNorm !== "any" || resNorm !== "any") {
                hasTypes = true;
            }
            methodsCode += buildMethod(route.methodName, route.httpMethod, route.pathStr, reqNorm, resNorm) + "\n";
        }

        if (hasTypes) {
            indexCode += `import * as T from "./types";\n\n`;
        } else {
            indexCode += `\n`;
        }

        indexCode += methodsCode;
        indexCode += `export const createClient = (baseURL: string) => {\n  const api = API(baseURL);\n\n  return {\n`;
        for (const route of routesList) {
            indexCode += `    ${route.methodName}: ${route.methodName}(api),\n`;
        }
        indexCode += `  };\n};\n\nexport * from "./types";\n`;

        fs.writeFileSync(path.join(clientSrcDir, "index.ts"), indexCode, "utf-8");

        logger.succeedStep(); // step 2 succeeded

        logger.startNextStep(); // step 3: Format generated code

        try {
            await execCommandAsync("pnpm prettier --write client/src", serviceRoot);
        } catch {
            // ignore
        }
        try {
            await execCommandAsync("npx eslint --fix client/src", serviceRoot);
        } catch {
            // ignore
        }

        logger.succeedStep(); // step 3 succeeded

        logger.startNextStep(); // step 4: Synchronize workspace package dependencies

        let monorepoRoot = serviceRoot;
        while (monorepoRoot && !fs.existsSync(path.join(monorepoRoot, "pnpm-workspace.yaml"))) {
            const parent = path.dirname(monorepoRoot);
            if (parent === monorepoRoot) break;
            monorepoRoot = parent;
        }

        try {
            await execCommandAsync("pnpm install", monorepoRoot);
        } catch (err: any) {
            logger.failStep(err.message);
            process.exit(1);
        }

        logger.succeedStep(); // step 4 succeeded
        console.log(chalk.green.bold("\n🎉 API Client SDK generated successfully!\n"));
    } catch (err: any) {
        logger.failStep(err.message);
        process.exit(1);
    }
}
