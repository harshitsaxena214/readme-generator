import { NextResponse } from "next/server";
import {
  parseGitHubUrl,
  fetchRepoMetadata,
  fetchRepoTree,
  fetchPackageFiles,
  fetchExistingReadme,
  detectTechnologies,
  buildFileTree,
} from "@/services/github";
import { generateReadme, improveReadme } from "@/services/gemini";
import { scoreReadme } from "@/services/scoring";
import { checkRateLimit, getClientIP } from "@/lib/ratelimit";
import type { GenerateResponse } from "@/types";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { repoUrl, action, currentReadme } = body as {
      repoUrl: string;
      action?: "generate" | "improve";
      currentReadme?: string;
    };

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    // Rate limiting check
    const ip = getClientIP(request);
    const rateLimit = await checkRateLimit(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded",
          message: "You have used all 5 free README generations for this hour. Please try again later." 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": rateLimit.reset.toString()
          }
        }
      );
    }




    // Parse GitHub URL
    let owner: string, repo: string;
    try {
      ({ owner, repo } = parseGitHubUrl(repoUrl));
    } catch {
      return NextResponse.json(
        { error: "Invalid GitHub URL. Please use format: https://github.com/owner/repo" },
        { status: 400 }
      );
    }

    // Fetch repository data in parallel
    const metadata = await fetchRepoMetadata(owner, repo);

    // Handle "improve" action
    if (action === "improve" && currentReadme) {
      const improved = await improveReadme(currentReadme, metadata);
      const response: GenerateResponse = {
        readme: improved,
        score: scoreReadme(improved),
        repoName: metadata.name,
        technologies: [],
      };
      return NextResponse.json(response);
    }

    // Full generation flow
    const [tree, existingReadme] = await Promise.all([
      fetchRepoTree(owner, repo, metadata.defaultBranch),
      fetchExistingReadme(owner, repo),
    ]);

    const treePaths = tree.tree.map((e) => e.path);

    // Fetch package files
    const packageFiles = await fetchPackageFiles(owner, repo, treePaths);

    // Detect technologies
    const technologies = detectTechnologies(treePaths, packageFiles);

    // Build formatted file tree
    const fileTree = buildFileTree(treePaths);

    // Generate README with Gemini
    const readme = await generateReadme({
      metadata,
      fileTree,
      technologies,
      packageFiles,
      existingReadme,
    });

    // Score existing README
    const score = scoreReadme(existingReadme);

    const response: GenerateResponse = {
      readme,
      score,
      repoName: metadata.name,
      technologies,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Generation error:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
