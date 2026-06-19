"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { GITHUB_URL_REGEX, ANIMATION_VARIANTS } from "@/lib/constants";
import { LoadingSteps } from "@/components/features/loading-steps";
import type { GenerationState } from "@/types";

interface GenerateSectionProps {
  generationState: GenerationState;
  onGenerate: (url: string) => void;
}

export function GenerateSection({
  generationState,
  onGenerate,
}: GenerateSectionProps) {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateAndSubmit = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setValidationError("Please enter a GitHub repository URL");
      return;
    }
    if (!GITHUB_URL_REGEX.test(trimmed)) {
      setValidationError(
        "Please enter a valid GitHub URL (e.g. https://github.com/user/repo)"
      );
      return;
    }
    setValidationError(null);
    onGenerate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !generationState.isGenerating) {
      validateAndSubmit();
    }
  };

  return (
    <section id="generate" className="relative py-24 lg:py-32">
      {/* Background accents */}
      <div className="absolute inset-0 bg-warm-pattern opacity-60" />

      <div className="relative mx-auto max-w-4xl px-6">
        <motion.div
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-12"
        >
          <motion.span
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="inline-flex items-center gap-2 rounded-full bg-warm-yellow/30 px-4 py-1.5 text-sm font-medium text-text-dark border border-border-warm mb-4"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
            Try it now
          </motion.span>
          <motion.h2
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-4"
          >
            Generate Your README
          </motion.h2>
          <motion.p
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="text-lg text-text-muted max-w-xl mx-auto"
          >
            Paste a GitHub repository URL and let AI create a comprehensive,
            professional README for you.
          </motion.p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          variants={ANIMATION_VARIANTS.scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="glass-card-strong rounded-3xl p-8 sm:p-10">
            {/* URL Input */}
            <div className="flex flex-col gap-4">
              <label
                htmlFor="repo-url-input"
                className="text-sm font-semibold text-text-dark"
              >
                Repository URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <input
                    id="repo-url-input"
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="https://github.com/user/project"
                    disabled={generationState.isGenerating}
                    className="w-full rounded-xl border-2 border-border-warm bg-white/60 pl-12 pr-4 py-3.5 text-base text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 transition-all disabled:opacity-50"
                    aria-describedby={validationError ? "url-error" : undefined}
                    aria-invalid={!!validationError}
                  />
                </div>
                <button
                  onClick={validateAndSubmit}
                  disabled={generationState.isGenerating}
                  className="btn-gold rounded-xl px-8 py-3.5 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap min-w-[180px]"
                  id="generate-btn"
                >
                  {generationState.isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate README
                    </>
                  )}
                </button>
              </div>

              {/* Validation Error */}
              {validationError && (
                <motion.p
                  id="url-error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-sm text-red-500"
                  role="alert"
                >
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  {validationError}
                </motion.p>
              )}

              {/* API Error */}
              {generationState.error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2.5"
                  role="alert"
                >
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  {generationState.error}
                </motion.p>
              )}

              {/* Example hint */}
              <p className="text-xs text-text-muted">
                Try:{" "}
                <button
                  onClick={() => {
                    setUrl("https://github.com/vercel/next.js");
                    setValidationError(null);
                  }}
                  className="text-accent-gold-hover hover:text-accent-gold underline underline-offset-2"
                  disabled={generationState.isGenerating}
                >
                  https://github.com/vercel/next.js
                </button>
              </p>
            </div>

            {/* Loading Steps */}
            {generationState.isGenerating && (
              <div className="mt-8 pt-8 border-t border-border-warm">
                <LoadingSteps steps={generationState.steps} />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
