"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { GenerateSection } from "@/components/sections/generate-section";
import { OutputSection } from "@/components/sections/output-section";
import { useGenerateReadme } from "@/hooks/use-generate-readme";
import { useReadmeScore } from "@/hooks/use-readme-score";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export default function Home() {
  const { state, markdown, setMarkdown, generate, regenerate, improve } =
    useGenerateReadme();

  const liveScore = useReadmeScore(markdown);

  const displayResult = state.result
    ? {
        ...state.result,
        score: liveScore,
      }
    : null;

  useEffect(() => {
    if (state.result && !state.isGenerating) {
      setTimeout(() => {
        const el = document.getElementById("output");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [state.result, state.isGenerating]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <GenerateSection generationState={state} onGenerate={generate} />

        <AnimatePresence mode="wait">
          {displayResult && (
            <motion.div
              key="output-container"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <OutputSection
                result={displayResult}
                markdown={markdown}
                onMarkdownChange={setMarkdown}
                onRegenerate={regenerate}
                onImprove={improve}
                isRegenerating={state.isGenerating}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
