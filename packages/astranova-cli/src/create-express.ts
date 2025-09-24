import fs from 'fs';
import path from 'path';
import { ProjectBuilder, FEATURES, LANGUAGE } from '@mrknown404/create-express-app';
import { getMonorepoRoot } from './helper';

export async function runCreateBE(projectName?: string) {
    if (!projectName) {
        console.error('❌ Please provide a project name');
        process.exit(1);
    }

    const rootDir = getMonorepoRoot();
    const targetDir = path.join(rootDir, 'services', 'backend', projectName);

    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`🚀 Creating backend project at: ${targetDir}`);

    const customConfig = {
        language: LANGUAGE.TYPESCRIPT,
        features: [FEATURES.ESLINT, FEATURES.ZOD],
    };

    try {
        process.chdir(targetDir);

        const builder = new ProjectBuilder(customConfig);
        await builder.init();
        await builder.setupProject();
        builder.finalize();

        console.log(`✅ Project ${projectName} created successfully at ${targetDir}`);
    } catch (err) {
        console.error('❌ Project creation failed:', err);
        process.exit(1);
    }
}
