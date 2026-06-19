"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { SplineScene } from "@/components/ui/spline";
import { ANIMATION_VARIANTS } from "@/lib/constants";

export function HeroSection() {
  const scrollToGenerate = () => {
    const el = document.getElementById("generate");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToFeatures = () => {
    const el = document.getElementById("features");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-warm-pattern"
    >
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-warm-yellow/20 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent-gold/10 blur-3xl" />

      <div className="mx-auto max-w-7xl w-full px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <motion.div
            variants={ANIMATION_VARIANTS.staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 lg:gap-8"
          >
            {/* Badge */}
            <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
              <span className="inline-flex items-center gap-2 rounded-full bg-warm-yellow/40 px-4 py-1.5 text-sm font-medium text-text-dark border border-border-warm">
                <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
                AI-Powered Documentation
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={ANIMATION_VARIANTS.fadeInUp}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-text-dark"
            >
              Generate Professional{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-accent-gold to-accent-gold-hover bg-clip-text text-transparent">
                  READMEs
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-warm-yellow/40 -z-0 rounded-sm" />
              </span>{" "}
              in Seconds
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={ANIMATION_VARIANTS.fadeInUp}
              className="text-lg sm:text-xl text-text-muted max-w-lg leading-relaxed"
            >
              Paste any GitHub repository and instantly create a complete,
              polished README powered by AI.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={ANIMATION_VARIANTS.fadeInUp}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={scrollToGenerate}
                className="btn-gold rounded-full px-8 py-3.5 text-base font-semibold flex items-center gap-2"
                id="hero-generate-btn"
              >
                <Sparkles className="h-4 w-4" />
                Generate README
              </button>
              <button
                onClick={scrollToFeatures}
                className="rounded-full px-8 py-3.5 text-base font-medium text-text-dark border-2 border-border-warm hover:bg-warm-yellow/20 transition-all flex items-center gap-2"
                id="hero-demo-btn"
              >
                See How It Works
                <ArrowDown className="h-4 w-4" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={ANIMATION_VARIANTS.fadeInUp}
              className="flex gap-8 pt-4"
            >
              {[
                { value: "15+", label: "Technologies" },
                { value: "10s", label: "Avg. Generation" },
                { value: "100%", label: "Markdown" },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-text-dark">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side — Spline 3D */}
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] lg:order-last"
          >
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" />
            </div>
            {/* Glow behind the scene */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-warm-yellow/20 to-accent-gold/10 blur-2xl scale-110" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="h-5 w-5 text-text-muted/50" />
      </motion.div>
    </section>
  );
}
