import { GoogleGenAI } from "@google/genai";
import type { RepoMetadata, Technology, PackageFiles } from "@/types";

let _ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Please add it to your .env.local file.");
  }
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

interface GenerateReadmeInput {
  metadata: RepoMetadata;
  fileTree: string;
  technologies: Technology[];
  packageFiles: PackageFiles;
  existingReadme: string | null;
}

/**
 * Generate a professional README using Gemini.
 */
export async function generateReadme(input: GenerateReadmeInput): Promise<string> {
  const { metadata, fileTree, technologies, packageFiles, existingReadme } = input;

  const techList = technologies.map((t) => t.name).join(", ");

  const depsSection = packageFiles.packageJson
    ? `\n### Package.json Dependencies:\n${JSON.stringify(
      {
        dependencies: (packageFiles.packageJson as Record<string, unknown>).dependencies,
        devDependencies: (packageFiles.packageJson as Record<string, unknown>).devDependencies,
      },
      null,
      2
    )}`
    : "";

  const pythonDeps = packageFiles.requirementsTxt
    ? `\n### Python Dependencies (requirements.txt):\n${packageFiles.requirementsTxt}`
    : "";

  const existingSection = existingReadme
    ? `\n### Existing README.md (for reference):\n${existingReadme.substring(0, 3000)}`
    : "";

  const prompt = `You are a professional technical writer. Generate a comprehensive, high-quality README.md for the following GitHub repository.

## Repository Information:
- **Name**: ${metadata.name}
- **Full Name**: ${metadata.fullName}
- **Description**: ${metadata.description || "No description provided"}
- **Primary Language**: ${metadata.language || "Not specified"}
- **Stars**: ${metadata.stars} | **Forks**: ${metadata.forks}
- **Topics**: ${metadata.topics.join(", ") || "None"}
- **License**: ${metadata.license?.name || "Not specified"}
- **Homepage**: ${metadata.homepage || "Not specified"}
- **URL**: ${metadata.htmlUrl}

## Detected Technologies:
${techList || "None detected"}

## Project Structure:
\`\`\`
${fileTree}
\`\`\`
${depsSection}
${pythonDeps}
${existingSection}

## Instructions:
Generate a complete README.md with the following sections. Use proper Markdown formatting.
Return ONLY the raw markdown content, no code fences wrapping it.

The README should include these sections (skip any that are not applicable):

1. **# Project Title** — Use the repository name, add relevant badges
2. **## Overview** — 2-3 paragraphs describing what the project does, its purpose, and key highlights
3. **## Features** — Bullet list of main features based on the project structure and technologies
4. **## Tech Stack** — Table or list of technologies used with versions if available
5. **## Prerequisites** — Required software, versions, and system requirements
6. **## Installation** — Step-by-step installation guide with code blocks
7. **## Usage** — How to run and use the project with examples
8. **## Environment Variables** — Table of required env vars if applicable (based on .env patterns in the codebase)
9. **## Project Structure** — Simplified file tree with descriptions of key directories
10. **## API Documentation** — If API routes or endpoints are detected
11. **## Contributing** — Standard contributing guidelines
12. **## License** — Based on the detected license

Make the README:
- Professional and well-organized
- Easy to follow for both beginners and experienced developers
- Include actual technology names and versions when detected
- Add helpful code examples based on the detected stack
- Use emojis sparingly for section headers where appropriate (e.g., 🚀, 📦, ⚙️)
`;

  const response = await getAI().models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned empty response");

  // Clean up: remove any wrapping code fences if present
  return text
    .replace(/^```markdown\s*/i, "")
    .replace(/^```md\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

/**
 * Improve an existing README using Gemini.
 */
export async function improveReadme(
  currentReadme: string,
  metadata: RepoMetadata
): Promise<string> {
  const prompt = `You are a professional technical writer. Improve the following README.md for the repository "${metadata.fullName}".

Current README:
${currentReadme}

Instructions:
- Improve clarity, formatting, and completeness
- Add any missing standard sections (Installation, Usage, Contributing, etc.)
- Enhance descriptions and add helpful details
- Ensure proper markdown formatting
- Keep the existing structure where it's good, improve where it's lacking
- Return ONLY the raw markdown content, no code fences wrapping it

The improved README should feel more professional, comprehensive, and polished.`;

  const response = await getAI().models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned empty response");

  return text
    .replace(/^```markdown\s*/i, "")
    .replace(/^```md\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}
