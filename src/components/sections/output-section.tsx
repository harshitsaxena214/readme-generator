"use client";

import { motion } from "framer-motion";
import { ANIMATION_VARIANTS } from "@/lib/constants";
import { MarkdownEditor } from "@/components/features/markdown-editor";
import { MarkdownPreview } from "@/components/features/markdown-preview";
import { ReadmeScoreCard } from "@/components/features/readme-score";
import { ActionButtons } from "@/components/features/action-buttons";
import type { GenerateResponse } from "@/types";

interface OutputSectionProps {
  result: GenerateResponse;
  markdown: string;
  onMarkdownChange: (value: string) => void;
  onRegenerate: () => void;
  onImprove: () => void;
  isRegenerating: boolean;
}

export function OutputSection({
  result,
  markdown,
  onMarkdownChange,
  onRegenerate,
  onImprove,
  isRegenerating,
}: OutputSectionProps) {
  return (
    <section id="output" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Section Header */}
          <motion.div
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="text-center mb-8"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-dark mb-2">
              Your Generated README
            </h2>
            <p className="text-text-muted">
              for{" "}
              <span className="font-semibold text-text-dark">
                {result.repoName}
              </span>
            </p>
          </motion.div>

          {/* Score + Actions Row */}
          <motion.div
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            {result.score && <ReadmeScoreCard score={result.score} />}
            <ActionButtons
              markdown={markdown}
              repoName={result.repoName}
              onRegenerate={onRegenerate}
              onImprove={onImprove}
              isRegenerating={isRegenerating}
            />
          </motion.div>

          {/* Editor + Preview */}
          <motion.div
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Left: Markdown Editor */}
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border-warm bg-warm-yellow/10">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                  <div className="h-3 w-3 rounded-full bg-green-400/60" />
                </div>
                <span className="text-xs font-medium text-text-muted ml-2">
                  README.md — Editor
                </span>
              </div>
              <MarkdownEditor value={markdown} onChange={onMarkdownChange} />
            </div>

            {/* Right: Live Preview */}
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border-warm bg-warm-yellow/10">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                  <div className="h-3 w-3 rounded-full bg-green-400/60" />
                </div>
                <span className="text-xs font-medium text-text-muted ml-2">
                  Live Preview
                </span>
              </div>
              <MarkdownPreview content={markdown} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
