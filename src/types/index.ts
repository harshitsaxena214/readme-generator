export interface RepoMetadata {
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  defaultBranch: string;
  htmlUrl: string;
  homepage: string | null;
  license: { name: string; spdxId: string } | null;
  openIssues: number;
  createdAt: string;
  updatedAt: string;
}

export interface TreeEntry {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
}

export interface RepoTree {
  sha: string;
  tree: TreeEntry[];
  truncated: boolean;
}

export interface PackageFiles {
  packageJson?: Record<string, unknown>;
  requirementsTxt?: string;
  pyprojectToml?: string;
  cargoToml?: string;
  composerJson?: Record<string, unknown>;
  pomXml?: string;
}

export interface Technology {
  name: string;
  icon: string;
  category: "framework" | "language" | "tool" | "runtime" | "platform";
}

export interface RepoAnalysis {
  metadata: RepoMetadata;
  tree: string;
  technologies: Technology[];
  packageFiles: PackageFiles;
  existingReadme: string | null;
  fileTree: string;
}

export interface GenerateRequest {
  repoUrl: string;
}

export interface GenerateResponse {
  readme: string;
  score: ReadmeScore | null;
  repoName: string;
  technologies: Technology[];
}

export interface ReadmeScore {
  score: number;
  maxScore: number;
  recommendations: string[];
  breakdown: ScoreCategory[];
}

export interface ScoreCategory {
  name: string;
  present: boolean;
  weight: number;
}

export interface LoadingStep {
  id: string;
  label: string;
  status: "pending" | "active" | "complete";
}

export interface GenerationState {
  isGenerating: boolean;
  currentStep: number;
  steps: LoadingStep[];
  error: string | null;
  result: GenerateResponse | null;
}
