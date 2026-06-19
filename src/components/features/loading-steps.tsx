"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { LoadingStep } from "@/types";

interface LoadingStepsProps {
  steps: LoadingStep[];
}

export function LoadingSteps({ steps }: LoadingStepsProps) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Generation progress">
      <AnimatePresence mode="sync">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {step.status === "complete" ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100"
                >
                  <Check className="h-3.5 w-3.5 text-green-600" />
                </motion.div>
              ) : step.status === "active" ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warm-yellow/50">
                  <Loader2 className="h-3.5 w-3.5 text-accent-gold-hover animate-spin" />
                </div>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <div className="h-2 w-2 rounded-full bg-gray-300" />
                </div>
              )}
            </div>

            {/* Label */}
            <span
              className={`text-sm transition-colors duration-200 ${
                step.status === "complete"
                  ? "text-green-700 font-medium"
                  : step.status === "active"
                  ? "text-text-dark font-medium"
                  : "text-text-muted"
              }`}
            >
              {step.label}
            </span>

            {/* Progress bar for active */}
            {step.status === "active" && (
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden ml-2 max-w-[120px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-gold to-warm-yellow rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
