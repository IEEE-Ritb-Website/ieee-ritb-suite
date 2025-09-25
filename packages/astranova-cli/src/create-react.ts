import fs from "fs";
import path from "path";
import ora from "ora";
import { ProjectBuilder, LANGUAGE } from "@mrknown404/create-express-app";
import { getMonorepoRoot } from "./helper";
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
        // Step 1: Scaffold Vite React + TypeScript using direct pnpm dlx approach
        const viteSpinner = ora("Scaffolding Vite React + TypeScript project...").start();
        await new Promise<void>((resolve, reject) => {
            const { exec } = require("child_process");
            const command = `pnpm dlx create-vite@latest ${projectName} --template react-ts`;

            const child = exec(command, {
                cwd: baseDir,
                env: { ...process.env, CI: "true", FORCE_COLOR: "0" }
            });

            // Handle any prompts by providing default responses
            child.stdin.write('\n'); // Send enter for any prompts
            child.stdin.end();

            child.on("close", (code: number) => {
                if (code === 0) resolve();
                else reject(new Error(`Vite CLI exited with code ${code}`));
            });
        });
        viteSpinner.succeed("Vite React + TypeScript project created!");

        // Step 2: Use ProjectBuilder for further setup (lint, extra files, dependencies)
        const builder = new ProjectBuilder({
            language: LANGUAGE.TYPESCRIPT,
            features: [],
        });
        builder.setProjectBasePath(baseDir);
        builder.projectName = projectName;

        // Step 3: Install dependencies first
        const installSpinner = ora("Installing dependencies...").start();
        await new Promise<void>((resolve, reject) => {
            const spawn = require("child_process").spawn;
            const cmd = spawn(
                "pnpm",
                ["install"],
                { cwd: projectPath, stdio: "pipe" }
            );

            cmd.stderr.on('data', (data: Buffer) => {
                const message = data.toString();
                if (message.includes('ERR') || message.includes('error')) {
                    process.stderr.write(message);
                }
            });

            cmd.on("close", (code: number) => {
                if (code === 0) resolve();
                else reject(new Error(`Dependencies installation failed with code ${code}`));
            });
        });
        installSpinner.succeed("Dependencies installed!");

        // Step 4: Install Tailwind CSS v4
        const tailwindSpinner = ora("Setting up Tailwind CSS v4").start();
        await new Promise<void>((resolve, reject) => {
            const spawn = require("child_process").spawn;
            const cmd = spawn(
                "pnpm",
                ["add", "tailwindcss", "-D", "@tailwindcss/vite"],
                { cwd: projectPath, stdio: "pipe" }
            );

            cmd.stderr.on("data", (data: Buffer) => {
                const message = data.toString();
                if (message.includes("ERR") || message.includes("error")) {
                    process.stderr.write(message);
                }
            });

            cmd.on("close", (code: number) => {
                if (code === 0) resolve();
                else reject(new Error(`Tailwind setup failed with code ${code}`));
            });
        });
        tailwindSpinner.succeed("Tailwind CSS v4 set up!");

        // Step 5: Configure vite.config.ts
        const viteConfigPath = path.join(projectPath, "vite.config.ts");
        if (fs.existsSync(viteConfigPath)) {
            let viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})`;
            fs.writeFileSync(viteConfigPath, viteConfig, "utf-8");
        }

        // Step 6: Replace index.css with Tailwind v4 import
        const styleCssPath = path.join(projectPath, "src", "index.css");
        fs.writeFileSync(styleCssPath, '@import "tailwindcss";\n', "utf-8");

        // Step 7: Ensure index.css is imported in main.tsx
        const mainFilePath = path.join(projectPath, "src", "main.tsx");
        if (fs.existsSync(mainFilePath)) {
            let mainContent = fs.readFileSync(mainFilePath, "utf-8");
            if (!mainContent.includes('index.css')) {
                mainContent = `import './index.css'\n${mainContent}`;
                fs.writeFileSync(mainFilePath, mainContent, "utf-8");
            }
        }

        // Step 8: Create App.tsx with Tailwind styling
        const appFilePath = path.join(projectPath, "src", "App.tsx");
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
        fs.writeFileSync(appFilePath, appContent, "utf-8");

        // Step 9: Update eslint.config.ts
        const eslintConfigPath = path.join(projectPath, "eslint.config.js");
        if (fs.existsSync(eslintConfigPath)) {
            let eslintConfig = fs.readFileSync(eslintConfigPath, "utf-8");
            if (!eslintConfig.includes("parserOptions")) {
                eslintConfig = eslintConfig.replace(
                    /languageOptions:\s*{([\s\S]*?)}/,
                    (match, inner) => {
                        return `languageOptions: {
${inner}
    parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
    },
}`;
                    }
                );
            }
            fs.writeFileSync(eslintConfigPath, eslintConfig, "utf-8");
        }

        // Step 10: Run pnpm install in root directory
        const rootInstallSpinner = ora("Running pnpm install in root directory...").start();
        await new Promise<void>((resolve, reject) => {
            const spawn = require("child_process").spawn;
            const cmd = spawn(
                "pnpm",
                ["install"],
                { cwd: rootDir, stdio: "pipe" }
            );

            cmd.stderr.on('data', (data: Buffer) => {
                const message = data.toString();
                if (message.includes('ERR') || message.includes('error')) {
                    process.stderr.write(message);
                }
            });

            cmd.on("close", (code: number) => {
                if (code === 0) resolve();
                else reject(new Error(`Root pnpm install failed with code ${code}`));
            });
        });
        rootInstallSpinner.succeed("Root dependencies installed!");
        console.log(chalk.green(`\n✅ Frontend project "${projectName}" created successfully at: ${projectPath}`));
        console.log(chalk.yellowBright(`\n📁 Project structure:`));
        console.log(chalk.yellowBright(`   ${projectPath}`));
        console.log(chalk.yellowBright(`   ├── src/`));
        console.log(chalk.yellowBright(`   │   ├── assets/ (custom assets folder)`));
        console.log(chalk.yellowBright(`   │   ├── App.css (custom css file)`));
        console.log(chalk.yellowBright(`   │   ├── App.tsx`));
        console.log(chalk.yellowBright(`   │   ├── index.css (Tailwind v4 configured)`));
        console.log(chalk.yellowBright(`   │   └── main.tsx`));
        console.log(chalk.yellowBright(`   ├── vite.config.ts (configured with Tailwind v4)`));
        console.log(chalk.yellowBright(`   └── package.json`));
        console.log(chalk.green(`\nNext steps:\n\tcd services/frontend/${projectName}\n\tpnpm dev
    `));
    } catch (err) {
        console.error(chalk.red("❌ Project creation failed:", err));
        process.exit(1);
    }
}
