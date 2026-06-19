import type { RepoMetadata, RepoTree, PackageFiles, Technology } from "@/types";
import { DETECTABLE_TECHNOLOGIES, PACKAGE_FILES } from "@/lib/constants";

const GITHUB_API = "https://api.github.com";

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "README-Wizard/1.0",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/**
 * Parse a GitHub URL into owner and repo.
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const match = url.match(
    /github\.com\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)/
  );
  if (!match) throw new Error("Invalid GitHub URL");
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

/**
 * Fetch repository metadata.
 */
export async function fetchRepoMetadata(
  owner: string,
  repo: string
): Promise<RepoMetadata> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: getHeaders(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error("Repository not found");
    if (res.status === 403) throw new Error("GitHub API rate limit exceeded. Try again later or add a GITHUB_TOKEN.");
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const data = await res.json();
  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
    topics: data.topics || [],
    defaultBranch: data.default_branch,
    htmlUrl: data.html_url,
    homepage: data.homepage,
    license: data.license
      ? { name: data.license.name, spdxId: data.license.spdx_id }
      : null,
    openIssues: data.open_issues_count,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Fetch the full repository tree recursively.
 */
export async function fetchRepoTree(
  owner: string,
  repo: string,
  branch: string
): Promise<RepoTree> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: getHeaders() }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch repository tree: ${res.status}`);
  }

  const data = await res.json();
  return {
    sha: data.sha,
    tree: data.tree.map(
      (entry: { path: string; mode: string; type: string; sha: string; size?: number }) => ({
        path: entry.path,
        mode: entry.mode,
        type: entry.type,
        sha: entry.sha,
        size: entry.size,
      })
    ),
    truncated: data.truncated,
  };
}

/**
 * Fetch file content from repository.
 */
export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
      { headers: getHeaders() }
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (data.encoding === "base64" && data.content) {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch all relevant package/config files.
 */
export async function fetchPackageFiles(
  owner: string,
  repo: string,
  treePaths: string[]
): Promise<PackageFiles> {
  const result: PackageFiles = {};

  const filesToFetch = PACKAGE_FILES.filter((f) =>
    treePaths.some((p) => p === f || p.endsWith(`/${f}`))
  );

  const fetches = filesToFetch.map(async (file) => {
    const content = await fetchFileContent(owner, repo, file);
    if (!content) return;

    switch (file) {
      case "package.json":
        try {
          result.packageJson = JSON.parse(content);
        } catch { /* ignore parse error */ }
        break;
      case "requirements.txt":
        result.requirementsTxt = content;
        break;
      case "pyproject.toml":
        result.pyprojectToml = content;
        break;
      case "Cargo.toml":
        result.cargoToml = content;
        break;
      case "composer.json":
        try {
          result.composerJson = JSON.parse(content);
        } catch { /* ignore parse error */ }
        break;
      case "pom.xml":
        result.pomXml = content;
        break;
    }
  });

  await Promise.all(fetches);
  return result;
}

/**
 * Fetch existing README.md if present.
 */
export async function fetchExistingReadme(
  owner: string,
  repo: string
): Promise<string | null> {
  // GitHub API has a dedicated README endpoint
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/readme`,
      { headers: getHeaders() }
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (data.encoding === "base64" && data.content) {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Detect technologies from tree paths and package files.
 */
export function detectTechnologies(
  treePaths: string[],
  packageFiles: PackageFiles
): Technology[] {
  const detected: Technology[] = [];
  const allText = treePaths.join(" ").toLowerCase();

  // Check for config files in tree
  const hasDockerfile = treePaths.some(
    (p) => p.toLowerCase() === "dockerfile" || p.toLowerCase().endsWith("/dockerfile")
  );
  const hasGoMod = treePaths.some((p) => p === "go.mod");
  const hasCargoToml = !!packageFiles.cargoToml;
  const hasPomXml = !!packageFiles.pomXml;

  // Gather all dependency names
  const depNames: string[] = [];

  if (packageFiles.packageJson) {
    const pkg = packageFiles.packageJson as Record<string, Record<string, string>>;
    if (pkg.dependencies) depNames.push(...Object.keys(pkg.dependencies));
    if (pkg.devDependencies) depNames.push(...Object.keys(pkg.devDependencies));
  }

  if (packageFiles.requirementsTxt) {
    const lines = packageFiles.requirementsTxt.split("\n");
    for (const line of lines) {
      const name = line.split("==")[0].split(">=")[0].split("<=")[0].trim().toLowerCase();
      if (name && !name.startsWith("#")) depNames.push(name);
    }
  }

  const depsLower = depNames.map((d) => d.toLowerCase());

  for (const tech of DETECTABLE_TECHNOLOGIES) {
    const found = tech.keywords.some(
      (kw) =>
        depsLower.includes(kw) ||
        allText.includes(kw)
    );

    if (found) {
      detected.push({
        name: tech.name,
        icon: tech.name.toLowerCase().replace(/[^a-z]/g, ""),
        category: tech.category,
      });
    }
  }

  // Manual checks
  if (hasDockerfile && !detected.find((d) => d.name === "Docker")) {
    detected.push({ name: "Docker", icon: "docker", category: "platform" });
  }
  if (hasGoMod && !detected.find((d) => d.name === "Go")) {
    detected.push({ name: "Go", icon: "go", category: "language" });
  }
  if (hasCargoToml && !detected.find((d) => d.name === "Rust")) {
    detected.push({ name: "Rust", icon: "rust", category: "language" });
  }
  if (hasPomXml && !detected.find((d) => d.name === "Java")) {
    detected.push({ name: "Java", icon: "java", category: "language" });
  }

  return detected;
}

/**
 * Build a formatted file tree string from tree entries.
 */
export function buildFileTree(treePaths: string[], maxDepth = 3): string {
  // Filter to keep reasonable files (skip hidden, node_modules, etc.)
  const filtered = treePaths.filter((p) => {
    const parts = p.split("/");
    if (parts.length > maxDepth + 1) return false;
    return !parts.some(
      (part) =>
        part.startsWith(".") ||
        part === "node_modules" ||
        part === "__pycache__" ||
        part === ".git" ||
        part === "dist" ||
        part === "build" ||
        part === ".next" ||
        part === "vendor"
    );
  });

  // Build tree structure
  interface TreeNode {
    children: Map<string, TreeNode>;
    isFile: boolean;
  }

  const root: TreeNode = { children: new Map(), isFile: false };

  for (const path of filtered) {
    const parts = path.split("/");
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current.children.has(part)) {
        current.children.set(part, {
          children: new Map(),
          isFile: i === parts.length - 1,
        });
      }
      current = current.children.get(part)!;
    }
  }

  // Render tree to string
  function renderNode(node: TreeNode, prefix: string = ""): string {
    const lines: string[] = [];
    const entries = Array.from(node.children.entries()).sort(([, a], [, b]) => {
      // Directories first
      if (!a.isFile && b.isFile) return -1;
      if (a.isFile && !b.isFile) return 1;
      return 0;
    });

    entries.forEach(([name, child], index) => {
      const isLast = index === entries.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const display = child.isFile ? name : `${name}/`;
      lines.push(`${prefix}${connector}${display}`);

      if (!child.isFile && child.children.size > 0) {
        const newPrefix = prefix + (isLast ? "    " : "│   ");
        lines.push(renderNode(child, newPrefix));
      }
    });

    return lines.join("\n");
  }

  return renderNode(root);
}
