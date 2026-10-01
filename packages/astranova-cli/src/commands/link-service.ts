import fs from "fs";
import path from "path";
import chalk from "chalk";
import { getMonorepoRoot } from "../helper.js";

interface ClientInfo {
    file: string;
    name: string;
    key: string;
}

interface LinkEntry {
    package: string;
    subpath: string;
    mount: string;
    named?: string;
    client?: ClientInfo;
}

interface ServicesConfig {
    services: LinkEntry[];
}

const UNIFIED_DIR = ["services", "deployable-be", "unified-service"];
const CONFIG_FILE = "services.config.json";
const LINKED_FILE = ["src", "linked.ts"];

function toAlias(entry: LinkEntry): string {
    const base = entry.package
        .replace(/-service$/, "")
        .split("-")
        .map((part, index) => (index === 0 ? part : part[0].toUpperCase() + part.slice(1)))
        .join("");
    if (entry.named) return entry.named;
    if (entry.subpath === "router") return `${base}Router`;
    const sub = entry.subpath
        .split("/")
        .pop()!
        .replace(/\.routes$/, "")
        .split("-")
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join("");
    return `${base}${sub}Router`;
}

function toPascal(value: string): string {
    return value
        .split("-")
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join("");
}

function toCamel(value: string): string {
    const pascal = toPascal(value);
    return pascal[0].toLowerCase() + pascal.slice(1);
}

function toClientInfo(entry: LinkEntry): ClientInfo | undefined {
    if (!entry.client) return undefined;
    return entry.client;
}

function deriveClientInfo(packageName: string, flags: Record<string, string>): ClientInfo | undefined {
    if (flags["no-client"] !== undefined) return undefined;
    const file = flags["client-file"] ?? packageName.replace(/-service$/, "");
    return {
        file,
        name: flags["client-name"] ?? `${toPascal(file)}Client`,
        key: flags["client-key"] ?? toCamel(file),
    };
}

function toMountConst(file: string): string {
    return `${file.toUpperCase().replace(/-/g, "_")}_MOUNT`;
}

function generateClientMounts(services: LinkEntry[]): string {
    const lines = [
        "// GENERATED FILE. Do not edit by hand.",
        "// Regenerate with: pnpm rs link-service <service-name>",
    ];
    for (const entry of services) {
        const client = toClientInfo(entry);
        if (!client) continue;
        lines.push(`export const ${toMountConst(client.file)} = "${entry.mount}";`);
    }
    lines.push("");
    return lines.join("\n");
}

function generateClientStub(client: ClientInfo, mountConst: string): string {
    return [
        "// Scaffolded by pnpm rs link-service. Add endpoint methods here.",
        'import type { AxiosInstance } from "axios";',
        `import { ${mountConst} } from "./mounts.js";`,
        "",
        `export class ${client.name} {`,
        "    constructor(private readonly api: AxiosInstance) {}",
        "}",
        "",
    ].join("\n");
}

function generateClientIndex(services: LinkEntry[]): string {
    const clients: ClientInfo[] = [];
    for (const entry of services) {
        const client = toClientInfo(entry);
        if (client) clients.push(client);
    }
    const lines = [
        "// GENERATED FILE. Do not edit by hand.",
        "// Regenerate with: pnpm rs link-service <service-name>",
        'import { createApi } from "./api.js";',
    ];
    for (const client of clients) {
        lines.push(`import { ${client.name} } from "./${client.file}.js";`);
    }
    lines.push(
        "",
        'export { createApi } from "./api.js";',
        'export * from "./mounts.js";',
    );
    for (const client of clients) {
        lines.push(`export * from "./${client.file}.js";`);
    }
    lines.push(
        "",
        "export const createUnifiedClient = (baseURL: string) => {",
        "    const api = createApi(baseURL);",
        "    return {",
    );
    for (const client of clients) {
        lines.push(`        ${client.key}: new ${client.name}(api),`);
    }
    lines.push(
        "    };",
        "};",
        "",
        "export type UnifiedClient = ReturnType<typeof createUnifiedClient>;",
        "",
    );
    return lines.join("\n");
}

function generateLinkedTs(services: LinkEntry[]): string {
    const aliases = new Map<string, number>();
    const lines = [
        "// GENERATED FILE. Do not edit by hand.",
        "// Regenerate with: pnpm rs link-service <service-name>",
    ];
    const rows: string[] = [];
    for (const entry of services) {
        let alias = toAlias(entry);
        const seen = aliases.get(alias) ?? 0;
        aliases.set(alias, seen + 1);
        if (seen > 0) alias = `${alias}${seen + 1}`;
        const target = `${entry.package}/${entry.subpath}`;
        lines.push(
            entry.named
                ? entry.named === alias
                    ? `import { ${entry.named} } from "${target}";`
                    : `import { ${entry.named} as ${alias} } from "${target}";`
                : `import ${alias} from "${target}";`,
        );
        rows.push(`    { service: "${entry.package}", mount: "${entry.mount}", router: ${alias} },`);
    }
    lines.push(
        'import type { Router } from "express";',
        "",
        "export interface LinkedRouter {",
        "    service: string;",
        "    mount: string;",
        "    router: Router;",
        "}",
        "",
        "export const linkedRouters: LinkedRouter[] = [",
        ...rows,
        "];",
        "",
    );
    return lines.join("\n");
}

function generateLinkedModulesDts(services: LinkEntry[]): string {
    const lines = [
        "// GENERATED FILE. Do not edit by hand.",
        "// Regenerate with: pnpm rs link-service <service-name>",
    ];
    const targets: Record<string, string[]> = {};
    for (const entry of services) {
        const target = `${entry.package}/${entry.subpath}`;
        targets[target] = targets[target] ?? [];
        if (entry.named && !targets[target].includes(entry.named)) targets[target].push(entry.named);
    }
    for (const target of Object.keys(targets)) {
        lines.push(
            `declare module "${target}" {`,
            `    const router: import("express").Router;`,
            `    export default router;`,
        );
        for (const name of targets[target]) {
            lines.push(`    export const ${name}: import("express").Router;`);
        }
        lines.push("}");
    }
    lines.push(
        `declare module "form-service/db" {`,
        `    export const connectToDatabase: () => Promise<import("mongodb").Db>;`,
        `    export const getDb: () => import("mongodb").Db;`,
        `}`,
    );
    lines.push("");
    return lines.join("\n");
}

export async function runLinkService(serviceName: string, flags: Record<string, string>) {
    const rootDir = getMonorepoRoot();
    const serviceDir = path.join(rootDir, "services", "backend", serviceName);
    const unifiedDir = path.join(rootDir, ...UNIFIED_DIR);

    if (!fs.existsSync(path.join(serviceDir, "src", "routes"))) {
        console.log(chalk.red(`No service ${serviceName} with src/routes found under services/backend. Aborting.`));
        process.exit(1);
    }

    const servicePkgPath = path.join(serviceDir, "package.json");
    const servicePkg = JSON.parse(fs.readFileSync(servicePkgPath, "utf-8"));
    const subpath = flags["subpath"] ?? "router";
    servicePkg.exports = servicePkg.exports ?? {};
    servicePkg.exports[`./${subpath}`] = `./dist/${flags["dist"] ?? `routes/${subpath === "router" ? "index" : subpath}.js`}`;
    fs.writeFileSync(servicePkgPath, JSON.stringify(servicePkg, null, 2) + "\n");

    const unifiedPkgPath = path.join(unifiedDir, "package.json");
    const unifiedPkg = JSON.parse(fs.readFileSync(unifiedPkgPath, "utf-8"));
    unifiedPkg.dependencies = unifiedPkg.dependencies ?? {};
    unifiedPkg.dependencies[servicePkg.name ?? serviceName] = "workspace:*";
    const sortedDeps: Record<string, string> = {};
    for (const key of Object.keys(unifiedPkg.dependencies).sort()) {
        sortedDeps[key] = unifiedPkg.dependencies[key];
    }
    unifiedPkg.dependencies = sortedDeps;
    fs.writeFileSync(unifiedPkgPath, JSON.stringify(unifiedPkg, null, 2) + "\n");

    const configPath = path.join(unifiedDir, CONFIG_FILE);
    const config: ServicesConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const mount = flags["mount"] ?? `/api/${serviceName.replace(/-service$/, "")}`;
    const named = flags["named"];
    const pkgName = servicePkg.name ?? serviceName;
    const existing = config.services.findIndex(
        (entry) =>
            entry.package === pkgName &&
            entry.subpath === subpath &&
            (entry.named ?? null) === (named ?? null),
    );
    const hasClientFlags =
        flags["client-file"] !== undefined ||
        flags["client-name"] !== undefined ||
        flags["client-key"] !== undefined ||
        flags["no-client"] !== undefined;
    const client = hasClientFlags
        ? deriveClientInfo(pkgName, flags)
        : existing >= 0
          ? config.services[existing].client
          : deriveClientInfo(pkgName, flags);
    const entry: LinkEntry = {
        package: pkgName,
        subpath,
        mount,
        ...(named ? { named } : {}),
        ...(client ? { client } : {}),
    };
    if (existing >= 0) config.services[existing] = entry;
    else config.services.push(entry);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");

    fs.writeFileSync(path.join(unifiedDir, ...LINKED_FILE), generateLinkedTs(config.services));
    fs.writeFileSync(
        path.join(unifiedDir, "src", "linked-modules.d.ts"),
        generateLinkedModulesDts(config.services),
    );

    const clientDir = path.join(unifiedDir, "client", "src");
    fs.writeFileSync(path.join(clientDir, "mounts.ts"), generateClientMounts(config.services));
    fs.writeFileSync(path.join(clientDir, "index.ts"), generateClientIndex(config.services));
    const entryClient = toClientInfo(entry);
    if (entryClient) {
        const stubPath = path.join(clientDir, `${entryClient.file}.ts`);
        if (!fs.existsSync(stubPath)) {
            fs.writeFileSync(stubPath, generateClientStub(entryClient, toMountConst(entryClient.file)));
            console.log(chalk.yellow(`Scaffolded client/src/${entryClient.file}.ts, add endpoint methods for ${entry.package}.`));
        }
    }

    console.log(chalk.green(`\nLinked ${entry.package}/${entry.subpath} at ${entry.mount}`));
    console.log(`Next: pnpm install && pnpm --filter ${entry.package} build && pnpm --filter unified-service build`);
}
