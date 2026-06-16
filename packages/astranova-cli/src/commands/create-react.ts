import fs from "fs";
import path from "path";
import { exec, spawn } from "child_process";
import { Spinner } from "../step-logger.js";
import { ProjectBuilder, LANGUAGE } from "@mrknown404/create-express-app";
import { getMonorepoRoot } from "../helper.js";
import chalk from "chalk";

export async function runCreateFE(projectName: string) {
  const rootDir = getMonorepoRoot();
  const baseDir = path.join(rootDir, "services", "frontend");
  const projectPath = path.join(baseDir, projectName);

  if (fs.existsSync(projectPath)) {
    console.log(`Directory ${projectPath} already exists. Aborting.`);
    process.exit(1);
  }

  fs.mkdirSync(baseDir, { recursive: true }); // only create the parent folder

  try {
    // Step 1: Use ProjectBuilder for further setup (lint, extra files, dependencies)
    const builder = new ProjectBuilder({
      language: LANGUAGE.TYPESCRIPT,
      features: [],
    });
    builder.scriptName = "🚀 Create Astranova React App";
    builder.setProjectBasePath(baseDir);
    builder.projectName = projectName;
    builder.init();

    // Step 2: Scaffold Vite React + TypeScript using direct pnpm dlx approach
    const viteSpinner = new Spinner(
      "Scaffolding Vite React + TypeScript project...",
    ).start();
    await new Promise<void>((resolve, reject) => {
      const command = `pnpm dlx create-vite@latest ${projectName} --template react-ts`;

      const child = exec(command, {
        cwd: baseDir,
        env: { ...process.env, CI: "true", FORCE_COLOR: "0" },
      });

      // Handle any prompts by providing default responses
      child.stdin?.write("\n");
      child.stdin?.end();

      child.on("close", (code: number) => {
        if (code === 0) resolve();
        else reject(new Error(`Vite CLI exited with code ${code}`));
      });
    });
    viteSpinner.succeed("Vite React + TypeScript project created!");

    // Step 3: Install Tailwind CSS v4
    await builder.runCommand(
      "Setup Tailwind",
      "pnpm add tailwindcss -D @tailwindcss/vite",
    );

    // Step 3b: Inject shared-clients workspace dependency into scaffolded package.json
    const generatedPkgPath = path.join(projectPath, "package.json");
    if (fs.existsSync(generatedPkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(generatedPkgPath, "utf-8"));
      pkg.dependencies = pkg.dependencies ?? {};
      pkg.dependencies["shared-clients"] = "workspace:*";
      pkg.dependencies["@astranova/catalogues"] = "workspace:*";
      pkg.dependencies["astranova-core"] = "workspace:*";
      fs.writeFileSync(
        generatedPkgPath,
        JSON.stringify(pkg, null, 2) + "\n",
        "utf-8",
      );
    }

    // Step 4: Configure vite.config.ts with terminal logger plugin
    const viteConfigContent = `import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

/**
 * Vite plugin that listens for \`astranova:terminal-log\` events sent by the
 * browser via \`import.meta.hot.send(...)\` and prints them to the Node.js
 * terminal. This makes shared-clients connection warnings visible server-side.
 */
function terminalLoggerPlugin(): Plugin {
  return {
    name: "astranova-terminal-logger",
    configureServer(server) {
      server.hot.on(
        "astranova:terminal-log",
        (data: { message: string }, client) => {
          process.stdout.write(
            \`\\n\\x1b[33m\${data.message}\\x1b[0m\\n\\n\`,
          );
          // Acknowledge so the client doesn't retry
          client.send("astranova:terminal-log:ack", {});
        },
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), terminalLoggerPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})`;
    builder.createFile("vite.config.ts", viteConfigContent);

    // Step 5: Replace index.css with Tailwind v4 import
    builder.createFile("src/index.css", '@import "tailwindcss";\n');

    // Step 6: Ensure index.css is imported and terminal logger is registered in main.tsx
    const mainFilePath = path.join(projectPath, "src", "main.tsx");
    if (fs.existsSync(mainFilePath)) {
      let mainContent = fs.readFileSync(mainFilePath, "utf-8");
      if (!mainContent.includes("index.css")) {
        mainContent = `import './index.css'\n${mainContent}`;
      }
      if (!mainContent.includes("registerTerminalLogger")) {
        // Inject after all import lines
        mainContent = mainContent.replace(
          /^(import [^\n]+\n)+/m,
          (match) =>
            match +
            `import { registerTerminalLogger } from 'shared-clients'\n` +
            `\n` +
            `// Forward shared-clients connection warnings to the Vite dev server terminal\n` +
            `// via the HMR WebSocket. In production, import.meta.hot is undefined so this is a no-op.\n` +
            `if (import.meta.hot) {\n` +
            `  registerTerminalLogger((message) => {\n` +
            `    import.meta.hot!.send("astranova:terminal-log", { message });\n` +
            `  });\n` +
            `}\n\n`,
        );
      }
      fs.writeFileSync(mainFilePath, mainContent, "utf-8");
    }

    // Step 7: Create App.tsx with Tailwind styling
    const appContent = `import { useState } from 'react'
import reactLogo from './assets/react.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center space-y-6">
        <div className="flex justify-center space-x-4 mb-6">
          <a href="https://react.dev" target="_blank" className="transition-transform hover:scale-110">
            <img src={reactLogo} className="h-16 w-16 animate-spin" alt="React logo" />
          </a>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ${projectName}
        </h1>
        
        <p className="text-gray-600 mb-6">
          Vite + React + TypeScript + Tailwind CSS v4
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold 
                     hover:bg-indigo-700 transition-colors transform hover:scale-105 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Count is {count}
          </button>
          
          <p className="text-sm text-gray-500">
            Edit <code className="bg-gray-100 px-2 py-1 rounded text-indigo-600 font-mono">src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
`;
    builder.createFile("src/App.tsx", appContent);

    // Step 8: Add README.md and AGENTS.md
    const agentsContent = `# Agent Guide: ${projectName}

## Purpose
Frontend application under the IEEE RIT-B Suite.

## Scope
- Client-side UI components and page routing.
- Styled using Tailwind CSS v4.

## Styling & Design Guidelines
- Design custom, high-fidelity components matching the premium monorepo aesthetic.
- Use Tailwind CSS v4 utility classes for styling. Avoid writing custom raw CSS files.
- Ensure all components are written in TypeScript.
`;

    const readmeContent = `# ${projectName}

Vite + React + TypeScript + Tailwind CSS v4 frontend application for the IEEE RIT-B Suite.

## Getting Started

### Prerequisites
- Node.js & pnpm

### Run in Development
From the monorepo root:
\`\`\`bash
pnpm --filter ${projectName} dev
\`\`\`

## Tech Stack
- React 19
- Tailwind CSS v4
- TypeScript
- Vite
`;

    builder.createFile("AGENTS.md", agentsContent);
    builder.createFile("README.md", readmeContent);

    // Step 9: Update eslint.config.ts
    const eslintConfigPath = path.join(projectPath, "eslint.config.js");
    if (fs.existsSync(eslintConfigPath)) {
      let eslintConfig = fs.readFileSync(eslintConfigPath, "utf-8");
      if (!eslintConfig.includes("parserOptions")) {
        eslintConfig = eslintConfig.replace(
          /languageOptions:\s*{([\s\S]*?)}/,
          (_, inner) => {
            return `languageOptions: {
${inner}
    parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
    },
}`;
          },
        );
      }
      fs.writeFileSync(eslintConfigPath, eslintConfig, "utf-8");
    }

    // Step 10: Run pnpm install in root directory
    const rootInstallSpinner = new Spinner(
      "Running pnpm install in root directory...",
    ).start();
    await new Promise<void>((resolve, reject) => {
      const cmd = spawn("pnpm", ["install"], { cwd: rootDir, stdio: "pipe", shell: true });

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
        `\n✅ Frontend project "${projectName}" created successfully at: ${projectPath}`,
      ),
    );
    console.log(chalk.yellowBright(`\n📁 Project structure:`));
    console.log(chalk.yellowBright(`   ${projectPath}`));
    console.log(chalk.yellowBright(`   ├── src/`));
    console.log(
      chalk.yellowBright(`   │   ├── assets/ (custom assets folder)`),
    );
    console.log(chalk.yellowBright(`   │   ├── App.css (custom css file)`));
    console.log(chalk.yellowBright(`   │   ├── App.tsx`));
    console.log(
      chalk.yellowBright(`   │   ├── index.css (Tailwind v4 configured)`),
    );
    console.log(chalk.yellowBright(`   │   └── main.tsx`));
    console.log(
      chalk.yellowBright(`   ├── vite.config.ts (configured with Tailwind v4)`),
    );
    console.log(chalk.yellowBright(`   └── package.json`));
    console.log(
      chalk.green(`\nNext steps:\n\tcd services/frontend/${projectName}\n\tpnpm dev
    `),
    );
  } catch (err) {
    console.error(chalk.red("❌ Project creation failed:", err));
    process.exit(1);
  }
}
