"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, BarChart3, Download } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { FEATURES, ANIMATION_VARIANTS } from "@/lib/constants";

const ICON_MAP: Record<string, React.ReactNode> = {
  Search: <Search className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  BarChart3: <BarChart3 className="h-6 w-6" />,
  Download: <Download className="h-6 w-6" />,
};

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.span
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="inline-flex items-center gap-2 rounded-full bg-warm-yellow/30 px-4 py-1.5 text-sm font-medium text-text-dark border border-border-warm mb-4"
          >
            How it works
          </motion.span>
          <motion.h2
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-4"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="text-lg text-text-muted max-w-2xl mx-auto"
          >
            From repository analysis to polished markdown output — README Wizard
            handles every step of documentation.
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES.map((feature, index) => (
            <motion.div key={feature.title} variants={ANIMATION_VARIANTS.fadeInUp}>
              <Spotlight className="h-full rounded-2xl">
                <div className="glass-card rounded-2xl p-6 h-full flex flex-col gap-4 group hover:shadow-lg hover:shadow-gold-glow/20 transition-all duration-300 hover:-translate-y-1">
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-warm-yellow/60 to-accent-gold/30 text-accent-gold-hover group-hover:from-accent-gold group-hover:to-accent-gold-hover group-hover:text-text-dark transition-all duration-300">
                    {ICON_MAP[feature.icon]}
                  </div>

                  {/* Number */}
                  <span className="text-xs font-bold text-accent-gold/50 uppercase tracking-widest">
                    0{index + 1}
                  </span>

                  {/* Title */}
                  <h3 className="font-heading text-lg font-bold text-text-dark">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-text-muted leading-relaxed flex-1">
                    {feature.description}
                  </p>
                </div>
              </Spotlight>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
