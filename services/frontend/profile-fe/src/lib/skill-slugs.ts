/**
 * Maps display skill names (from AVAILABLE_SKILLS) to their Simple Icons slugs.
 * Only skills that have a corresponding Simple Icon are listed here.
 * Skills without icons will fall back to plain SkillTag badges.
 * Slugs reference: https://simpleicons.org/
 */
export const SKILL_TO_SLUG: Record<string, string> = {
  // Embedded Systems & Hardware
  "Arduino": "arduino",
  "Raspberry Pi": "raspberrypi",
  "ESP32": "espressif",

  // Languages
  "C": "c",
  "C++": "cplusplus",
  "C#": "csharp",
  "Java": "java",
  "Python": "python",
  "JavaScript": "javascript",
  "TypeScript": "typescript",
  "Rust": "rust",
  "Go": "go",
  "Kotlin": "kotlin",
  "Swift": "swift",
  "SQL": "sqlite",
  "Bash": "gnubash",
  "PHP": "php",

  // Frontend
  "HTML5/CSS3": "html5",
  "React": "react",
  "Next.js": "nextdotjs",
  "Vue.js": "vuedotjs",
  "TailwindCSS": "tailwindcss",
  "Svelte": "svelte",
  "Angular": "angular",
  "Flutter": "flutter",
  "React Native": "react",
  "Three.js": "threedotjs",

  // Backend & Databases
  "Node.js": "nodedotjs",
  "Express": "express",
  "FastAPI": "fastapi",
  "Django": "django",
  "Spring Boot": "spring",
  "GraphQL": "graphql",
  "PostgreSQL": "postgresql",
  "MongoDB": "mongodb",
  "MySQL": "mysql",
  "Redis": "redis",
  "Elasticsearch": "elasticsearch",

  // DevOps & Cloud
  "Linux/Unix": "linux",
  "Git": "git",
  "Docker": "docker",
  "Kubernetes": "kubernetes",
  "AWS": "amazonaws",
  "Google Cloud (GCP)": "googlecloud",
  "Azure": "microsoftazure",
  "CI/CD (GitHub Actions)": "githubactions",
  "Terraform": "terraform",
  "Nginx": "nginx",

  // AI/ML
  "PyTorch": "pytorch",
  "TensorFlow": "tensorflow",
  "OpenCV": "opencv",
  "Numpy": "numpy",
  "Pandas": "pandas",
};
