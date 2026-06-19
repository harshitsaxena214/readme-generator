"use client";

import { useState, useCallback, useRef } from "react";
import type { GenerationState, GenerateResponse, LoadingStep } from "@/types";
import { LOADING_STEPS } from "@/lib/constants";
import { toast } from "sonner";

class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

export function useGenerateReadme() {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    currentStep: 0,
    steps: LOADING_STEPS.map((s) => ({ ...s })),
    error: null,
    result: null,
  });

  const [markdown, setMarkdown] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const lastUrlRef = useRef<string>("");

  const updateStep = useCallback((stepIndex: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: stepIndex,
      steps: prev.steps.map((step, i): LoadingStep => {
        if (i < stepIndex) return { ...step, status: "complete" };
        if (i === stepIndex) return { ...step, status: "active" };
        return { ...step, status: "pending" };
      }),
    }));
  }, []);

  const generate = useCallback(
    async (repoUrl: string) => {
      // Cancel previous request if any
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();
      lastUrlRef.current = repoUrl;

      setState({
        isGenerating: true,
        currentStep: 0,
        steps: LOADING_STEPS.map((s) => ({ ...s })),
        error: null,
        result: null,
      });

      // Simulate step progression with delays
      const stepTimers: NodeJS.Timeout[] = [];
      const stepDurations = [800, 1500, 2500, 4000]; // ms delays for each step

      for (let i = 0; i < stepDurations.length; i++) {
        const timer = setTimeout(() => updateStep(i), stepDurations[i]);
        stepTimers.push(timer);
      }

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl }),
          signal: abortRef.current.signal,
        });

        // Clear timers
        stepTimers.forEach(clearTimeout);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Request failed" }));
          if (res.status === 429) {
            throw new RateLimitError(errorData.message || "You've reached the free generation limit. Please try again later.");
          }
          throw new Error(errorData.error || `Request failed with status ${res.status}`);
        }

        const data: GenerateResponse = await res.json();

        // Complete all steps
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          currentStep: prev.steps.length,
          steps: prev.steps.map((step): LoadingStep => ({ ...step, status: "complete" })),
          error: null,
          result: data,
        }));

        setMarkdown(data.readme);
      } catch (error) {
        stepTimers.forEach(clearTimeout);

        if (error instanceof DOMException && error.name === "AbortError") {
          return; // Silently handle abort
        }

        if (error instanceof RateLimitError) {
          toast.error("Rate limit exceeded", {
            description: error.message,
            duration: 5000,
          });
          setState((prev) => ({
            ...prev,
            isGenerating: false,
            // Keep previous steps/result visible
          }));
          return;
        }

        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: error instanceof Error ? error.message : "An unexpected error occurred",
        }));
      }
    },
    [updateStep]
  );

  const regenerate = useCallback(() => {
    if (lastUrlRef.current) {
      generate(lastUrlRef.current);
    }
  }, [generate]);

  const improve = useCallback(async () => {
    if (!lastUrlRef.current || !markdown) return;

    setState((prev) => ({ ...prev, isGenerating: true, error: null }));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: lastUrlRef.current,
          action: "improve",
          currentReadme: markdown,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Request failed" }));
        if (res.status === 429) {
          throw new RateLimitError(errorData.message || "You've reached the free generation limit. Please try again later.");
        }
        throw new Error(errorData.error || "Improvement failed");
      }

      const data: GenerateResponse = await res.json();

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        result: data,
      }));

      setMarkdown(data.readme);
    } catch (error) {
      if (error instanceof RateLimitError) {
        toast.error("Rate limit exceeded", {
          description: error.message,
          duration: 5000,
        });
        setState((prev) => ({ ...prev, isGenerating: false }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }));
    }
  }, [markdown]);

  return {
    state,
    markdown,
    setMarkdown,
    generate,
    regenerate,
    improve,
  };
}
