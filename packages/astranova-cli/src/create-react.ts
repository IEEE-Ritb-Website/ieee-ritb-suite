import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { getMonorepoRoot } from './helper';
import { LANGUAGE, ProjectBuilder } from '@mrknown404/create-express-app';

export async function runCreateReact(projectName?: string) {
    if (!projectName) {
        console.error('❌ Please provide a project name');
        console.error('   pnpm create-react my-frontend');
        process.exit(1);
    }

    const rootDir = getMonorepoRoot();
    const targetDir = path.join(rootDir, 'services', 'frontend', projectName);
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`🚀 Creating frontend project at: ${targetDir}`);

    try {
        process.chdir(targetDir);

        const builder = new ProjectBuilder({
            language: LANGUAGE.TYPESCRIPT,
            features: [],
        });

        await builder.init();

        builder.addStep(() => {
            console.log('📦 Creating Vite React + TS project...');
            execSync('pnpm create vite@latest . --template react-ts', { stdio: 'inherit' });
        });

        builder.addStep(() => {
            console.log('✨ Installing Tailwind CSS...');
            execSync('pnpm add tailwindcss @tailwindcss/vite', { stdio: 'inherit' });
        });

        builder.addStep(() => {
            console.log('🛠️ Customizing vite.config.ts');
            const viteConfigPath = path.join(targetDir, 'vite.config.ts');
            if (fs.existsSync(viteConfigPath)) {
                let content = fs.readFileSync(viteConfigPath, 'utf-8');
                content = content.replace(
                    'import { defineConfig } from "vite"',
                    `import { defineConfig } from "vite"\nimport tailwindcss from '@tailwindcss/vite'\n`
                );
                content = content.replace(
                    'plugins: []',
                    `plugins: [tailwindcss()]`
                );
                fs.writeFileSync(viteConfigPath, content, 'utf-8');
            }
        });

        builder.addStep(() => {
            console.log('Edit css file to include Tailwind directives');
            const cssFilePath = path.join(targetDir, 'src', 'index.css');
            if (fs.existsSync(cssFilePath)) {
                let content = fs.readFileSync(cssFilePath, 'utf-8');
                content = '@import "tailwindcss";';
                fs.writeFileSync(cssFilePath, content, 'utf-8');
            }
        });

        await builder.runCustomSteps();

        builder.finalize();

        console.log(`✅ React frontend ${projectName} created successfully at ${targetDir}`);
        console.log('📌 Next steps:');
        console.log(`  cd services/frontend/${projectName}`);
        console.log('  pnpm install');
        console.log('  pnpm dev');
    } catch (err) {
        console.error('❌ Project creation failed:', err);
        process.exit(1);
    }
}
