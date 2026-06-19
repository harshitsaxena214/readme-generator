import { useMemo } from "react";
import { scoreReadme } from "@/services/scoring";
import type { ReadmeScore } from "@/types";

export function useReadmeScore(markdown: string | null): ReadmeScore | null {
  return useMemo(() => {
    if (!markdown) return null;
    return scoreReadme(markdown);
  }, [markdown]);
}
