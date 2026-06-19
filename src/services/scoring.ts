import type { ReadmeScore, ScoreCategory } from "@/types";

/**
 * Score an existing README based on common best practices.
 */
export function scoreReadme(readmeContent: string | null): ReadmeScore | null {
  if (!readmeContent) return null;

  const content = readmeContent.toLowerCase();

  const categories: ScoreCategory[] = [
    {
      name: "Has title/heading",
      present: /^#\s+/m.test(readmeContent),
      weight: 1,
    },
    {
      name: "Has description/overview",
      present:
        content.includes("## overview") ||
        content.includes("## about") ||
        content.includes("## description") ||
        content.includes("## introduction"),
      weight: 1,
    },
    {
      name: "Has installation guide",
      present:
        content.includes("## install") ||
        content.includes("## getting started") ||
        content.includes("## setup") ||
        content.includes("## quick start"),
      weight: 1.5,
    },
    {
      name: "Has usage examples",
      present:
        content.includes("## usage") ||
        content.includes("## example") ||
        content.includes("## how to use"),
      weight: 1.5,
    },
    {
      name: "Has code blocks",
      present: content.includes("```"),
      weight: 1,
    },
    {
      name: "Has contributing guide",
      present:
        content.includes("## contribut") || content.includes("## development"),
      weight: 0.5,
    },
    {
      name: "Has license info",
      present: content.includes("## license") || content.includes("license"),
      weight: 0.5,
    },
    {
      name: "Has badges/shields",
      present:
        content.includes("![") && content.includes("badge") ||
        content.includes("shields.io"),
      weight: 0.5,
    },
    {
      name: "Has screenshots/images",
      present: /!\[.*\]\(.*\.(png|jpg|jpeg|gif|svg|webp)/i.test(readmeContent),
      weight: 0.5,
    },
    {
      name: "Has table of contents or structure",
      present:
        content.includes("## table of contents") ||
        content.includes("## project structure") ||
        content.includes("## folder structure"),
      weight: 0.5,
    },
  ];

  const maxScore = 10;
  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = categories
    .filter((c) => c.present)
    .reduce((sum, c) => sum + c.weight, 0);

  const score = Math.round((earnedWeight / totalWeight) * maxScore);

  const recommendations = categories
    .filter((c) => !c.present)
    .map((c) => `Add ${c.name.toLowerCase().replace("has ", "")}`);

  return {
    score,
    maxScore,
    recommendations,
    breakdown: categories,
  };
}
