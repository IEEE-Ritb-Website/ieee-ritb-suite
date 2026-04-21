const fs = require('fs');
const files = [
  'services/frontend/landing-fe/src/components/common/AnnouncementBanner.tsx',
  'services/frontend/landing-fe/src/components/effects/MagneticCursor.tsx',
  'services/frontend/landing-fe/src/components/layout/Navigation.tsx',
  'services/frontend/landing-fe/src/components/sections/Contact.tsx',
  'services/frontend/landing-fe/src/components/sections/Features.tsx',
  'services/frontend/landing-fe/src/components/sections/Hero.tsx',
  'services/frontend/landing-fe/src/components/sections/About.tsx',
  'services/frontend/landing-fe/src/components/sections/Chapters.tsx',
  'services/frontend/landing-fe/src/components/sections/Events.tsx',
  'services/frontend/landing-fe/src/components/ui/BackToTop.tsx',
  'services/frontend/landing-fe/src/components/debug/PerformanceMonitor.tsx',
  'services/frontend/landing-fe/src/layouts/MainLayout.tsx',
  'services/frontend/landing-fe/src/pages/Home.tsx',
  'services/frontend/landing-fe/src/pages/NotFound.tsx',
  'services/frontend/landing-fe/src/pages/EventDetails.tsx',
  'services/frontend/landing-fe/src/pages/ChapterDetails.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace JSX tags
  content = content.replace(/<motion\./g, '<m.');
  content = content.replace(/<\/motion\./g, '</m.');
  
  // Replace imports. This is a bit tricky, but usually it looks like `import { motion } from 'framer-motion'`
  // Let's use a regex that matches the import from framer-motion specifically.
  content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]framer-motion['"]/g, (match, p1) => {
    const newImports = p1.split(',').map(s => {
      const trimmed = s.trim();
      return trimmed === 'motion' ? 'm' : trimmed;
    }).join(', ');
    return `import { ${newImports} } from 'framer-motion'`;
  });

  fs.writeFileSync(file, content);
});
console.log('Done');
