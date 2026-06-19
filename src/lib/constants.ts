import type { LoadingStep } from "@/types";

export const LOADING_STEPS: LoadingStep[] = [
  { id: "analyze", label: "Analyzing repository...", status: "pending" },
  { id: "structure", label: "Reading project structure...", status: "pending" },
  { id: "tech", label: "Understanding technologies...", status: "pending" },
  { id: "generate", label: "Generating README...", status: "pending" },
  { id: "format", label: "Formatting markdown...", status: "pending" },
];

export const GITHUB_URL_REGEX =
  /^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)\/?.*$/;

export const PACKAGE_FILES = [
  "package.json",
  "requirements.txt",
  "pyproject.toml",
  "Cargo.toml",
  "composer.json",
  "pom.xml",
] as const;

export const DETECTABLE_TECHNOLOGIES = [
  { name: "React", keywords: ["react", "react-dom"], category: "framework" as const },
  { name: "Next.js", keywords: ["next"], category: "framework" as const },
  { name: "Vite", keywords: ["vite"], category: "tool" as const },
  { name: "Express", keywords: ["express"], category: "framework" as const },
  { name: "Node.js", keywords: ["node", "nodemon"], category: "runtime" as const },
  { name: "Python", keywords: ["python", "pip"], category: "language" as const },
  { name: "FastAPI", keywords: ["fastapi"], category: "framework" as const },
  { name: "Django", keywords: ["django"], category: "framework" as const },
  { name: "Flask", keywords: ["flask"], category: "framework" as const },
  { name: "Java", keywords: ["java", "maven", "gradle"], category: "language" as const },
  { name: "Spring", keywords: ["spring-boot", "spring"], category: "framework" as const },
  { name: "Rust", keywords: ["rust", "cargo"], category: "language" as const },
  { name: "Go", keywords: ["go", "golang"], category: "language" as const },
  { name: "Docker", keywords: ["docker", "dockerfile"], category: "platform" as const },
  { name: "TypeScript", keywords: ["typescript", "ts-node"], category: "language" as const },
  { name: "Vue", keywords: ["vue", "nuxt"], category: "framework" as const },
  { name: "Angular", keywords: ["@angular/core"], category: "framework" as const },
  { name: "Svelte", keywords: ["svelte"], category: "framework" as const },
  { name: "Tailwind CSS", keywords: ["tailwindcss"], category: "tool" as const },
] as const;

export const FEATURES = [
  {
    title: "Repository Analysis",
    description:
      "Automatically detects frameworks, package managers, languages, and project structure from any GitHub repository.",
    icon: "Search",
  },
  {
    title: "AI Documentation",
    description:
      "Generates comprehensive documentation including overview, features, installation guides, usage examples, and API docs.",
    icon: "Sparkles",
  },
  {
    title: "README Scoring",
    description:
      "Analyzes existing README quality with a 0–10 score and provides actionable recommendations for improvement.",
    icon: "BarChart3",
  },
  {
    title: "Markdown Export",
    description:
      "Copy your generated README to clipboard or download it as a .md file instantly — ready to commit.",
    icon: "Download",
  },
] as const;

export const ANIMATION_VARIANTS = {
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
} as const;
