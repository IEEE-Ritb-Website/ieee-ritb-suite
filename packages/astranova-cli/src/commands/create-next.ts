import fs from "fs";
import path from "path";
import { exec, spawn } from "child_process";
import { Spinner } from "../step-logger.js";
import { ProjectBuilder, LANGUAGE } from "@mrknown404/create-express-app";
import { getMonorepoRoot } from "../helper.js";
import chalk from "chalk";

export async function runCreateNextFE(projectName: string) {
  const rootDir = getMonorepoRoot();
  const baseDir = path.join(rootDir, "services", "frontend");
  const projectPath = path.join(baseDir, projectName);

  if (fs.existsSync(projectPath)) {
    console.log(`Directory ${projectPath} already exists. Aborting.`);
    process.exit(1);
  }

  fs.mkdirSync(baseDir, { recursive: true });

  try {
    // Step 1: Use ProjectBuilder for scaffolding infrastructure
    const builder = new ProjectBuilder({
      language: LANGUAGE.TYPESCRIPT,
      features: [],
    });
    builder.scriptName = "🚀 Create Astranova Next.js App";
    builder.setProjectBasePath(baseDir);
    builder.projectName = projectName;
    builder.init();

    // Step 2: Scaffold Next.js app using create-next-app in non-interactive mode
    const nextSpinner = new Spinner(
      "Scaffolding Next.js + TypeScript project...",
    ).start();
    await new Promise<void>((resolve, reject) => {
      const command = [
        "pnpm dlx create-next-app@latest",
        projectName,
        "--typescript",
        "--tailwind",
        "--eslint",
        "--app",
        "--src-dir",
        "--import-alias \"@/*\"",
        "--no-turbopack",
      ].join(" ");

      const child = exec(command, {
        cwd: baseDir,
        env: { ...process.env, CI: "true", FORCE_COLOR: "0" },
      });

      child.stdin?.write("\n");
      child.stdin?.end();

      child.on("close", (code: number) => {
        if (code === 0) resolve();
        else reject(new Error(`create-next-app exited with code ${code}`));
      });
    });
    nextSpinner.succeed("Next.js project scaffolded!");

    // Step 3: Upgrade Tailwind to v4 with postcss adapter
    await builder.runCommand(
      "Upgrade to Tailwind CSS v4",
      "pnpm add tailwindcss@latest @tailwindcss/postcss -D",
    );

    // Step 4: Write postcss.config.mjs for Tailwind v4
    const postcssContent = `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
`;
    builder.createFile("postcss.config.mjs", postcssContent);

    // Step 5: Replace globals.css to use @import "tailwindcss"
    const globalsCssPath = path.join(projectPath, "src", "app", "globals.css");
    if (fs.existsSync(globalsCssPath)) {
      fs.writeFileSync(
        globalsCssPath,
        '@import "tailwindcss";\n',
        "utf-8",
      );
    }

    // Step 6: Write next.config.ts with Turbopack root fix for monorepo
    const nextConfigContent = `import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd(), "../../.."),
  },
};

export default nextConfig;
`;
    builder.createFile("next.config.ts", nextConfigContent);

    // Step 7: Write tsconfig.json with monorepo-compatible settings + path alias
    const tsconfigContent = JSON.stringify(
      {
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "react-jsx",
          incremental: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./src/*"] },
        },
        include: [
          "next-env.d.ts",
          "**/*.ts",
          "**/*.tsx",
          ".next/types/**/*.ts",
          ".next/dev/types/**/*.ts",
        ],
        exclude: ["node_modules"],
      },
      null,
      2,
    );
    builder.createFile("tsconfig.json", tsconfigContent);

    // Step 8: Add shared-clients dependency for terminal logger
    const packageJsonPath = path.join(projectPath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      pkg.dependencies = pkg.dependencies ?? {};
      pkg.dependencies["shared-clients"] = "workspace:*";
      pkg.dependencies["@astranova/catalogues"] = "workspace:*";
      pkg.dependencies["astranova-core"] = "workspace:*";
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(pkg, null, 2) + "\n",
        "utf-8",
      );
    }

    // Step 9: Create Server Action for terminal logging
    const actionsDir = path.join(projectPath, "src", "actions");
    fs.mkdirSync(actionsDir, { recursive: true });

    const logTerminalActionContent = `"use server";

import { isProduction } from "astranova-core";

/**
 * Server Action: logToTerminal
 *
 * Called by client components (via registerTerminalLogger in shared-clients)
 * to forward connection warnings from the browser to the Next.js dev server
 * terminal. Server actions run on the Node.js process, so console output
 * appears directly in the terminal window running \`next dev\`.
 *
 * This is a no-op in production — the registerTerminalLogger is only
 * registered in development.
 */
export async function logToTerminal(message: string): Promise<void> {
  if (isProduction()) return;
  process.stdout.write(\`\\n\\x1b[33m\${message}\\x1b[0m\\n\\n\`);
}
`;
    fs.writeFileSync(
      path.join(actionsDir, "log-terminal.ts"),
      logTerminalActionContent,
      "utf-8",
    );

    // Step 10: Create instrumentation-client.ts — the Next.js equivalent of Vite's main.tsx.
    // Next.js automatically runs this file once in the browser before React hydrates,
    // so no provider component or layout change is needed.
    const instrumentationClientContent = `/**
 * instrumentation-client.ts — Next.js client-side instrumentation entry point.
 *
 * Next.js runs this file once in the browser before React hydration, making it
 * the equivalent of Vite's main.tsx for one-time client setup.
 *
 * Registers the shared-clients terminal logger so that backend connection
 * warnings are forwarded to the Next.js dev server terminal via a Server Action,
 * in addition to appearing in the browser console.
 */
import { registerTerminalLogger } from "shared-clients";
import { logToTerminal } from "@/actions/log-terminal";

registerTerminalLogger((message) => {
  logToTerminal(message).catch(() => {});
});
`;
    fs.writeFileSync(
      path.join(projectPath, "src", "instrumentation-client.ts"),
      instrumentationClientContent,
      "utf-8",
    );

    // Step 12: AGENTS.md and README.md
    const agentsContent = `# Agent Guide: ${projectName}

## Purpose
Next.js frontend application under the IEEE RIT-B Suite.

## Scope
- SSR pages and client components using the App Router.
- Styled using Tailwind CSS v4.

## Styling & Design Guidelines
- Use Tailwind CSS v4 utility classes. Use \`@import "tailwindcss";\` in globals.css.
- Ensure all components are written in TypeScript.
- Client components must be explicitly marked with \`"use client"\`.
- Server Actions must be in separate files marked with \`"use server"\`.

## Shared Clients
- Import service clients from \`shared-clients\` (workspace package).
- Connection warnings are forwarded to the dev terminal via \`instrumentation-client.ts\` + \`logToTerminal\` Server Action.
- Do NOT create a provider component for this — it is already wired up via \`src/instrumentation-client.ts\`.
`;

    const readmeContent = `# ${projectName}

Next.js + TypeScript + Tailwind CSS v4 frontend for the IEEE RIT-B Suite.

## Getting Started

### Run in Development
From the monorepo root:
\`\`\`bash
pnpm --filter ${projectName} dev
\`\`\`

## Tech Stack
- Next.js (App Router)
- React 19
- Tailwind CSS v4
- TypeScript
`;

    builder.createFile("AGENTS.md", agentsContent);
    builder.createFile("README.md", readmeContent);

    // Step 13: Run pnpm install in root to link workspace packages
    const rootInstallSpinner = new Spinner(
      "Running pnpm install in root directory...",
    ).start();
    await new Promise<void>((resolve, reject) => {
      const cmd = spawn("pnpm", ["install"], {
        cwd: rootDir,
        stdio: "pipe",
        shell: true,
      });

      cmd.stderr.on("data", (data: Buffer) => {
        const message = data.toString();
        if (message.includes("ERR") || message.includes("error")) {
          process.stderr.write(message);
        }
      });

      cmd.on("close", (code: number) => {
        if (code === 0) resolve();
        else reject(new Error(`Root pnpm install failed with code ${code}`));
      });
    });
    rootInstallSpinner.succeed("Root dependencies installed!");

    console.log(
      chalk.green(
        `\n✅ Next.js project "${projectName}" created successfully at: ${projectPath}`,
      ),
    );
    console.log(chalk.yellowBright(`\n📁 Project structure:`));
    console.log(chalk.yellowBright(`   ${projectPath}`));
    console.log(chalk.yellowBright(`   ├── src/`));
    console.log(chalk.yellowBright(`   │   ├── actions/log-terminal.ts`));
    console.log(chalk.yellowBright(`   │   ├── app/`));
    console.log(
      chalk.yellowBright(
        `   │   │   ├── globals.css (Tailwind v4 configured)`,
      ),
    );
    console.log(chalk.yellowBright(`   │   │   ├── layout.tsx`));
    console.log(chalk.yellowBright(`   │   │   └── page.tsx`));
    console.log(
      chalk.yellowBright(`   │   └── instrumentation-client.ts`),
    );
    console.log(
      chalk.yellowBright(`   ├── next.config.ts (monorepo Turbopack root)`),
    );
    console.log(chalk.yellowBright(`   └── package.json`));
    console.log(
      chalk.green(
        `\nNext steps:\n\tcd services/frontend/${projectName}\n\tpnpm dev\n    `,
      ),
    );
  } catch (err) {
    console.error(chalk.red("❌ Next.js project creation failed:", err));
    process.exit(1);
  }
}
