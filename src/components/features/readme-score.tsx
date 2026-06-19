"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ReadmeScore } from "@/types";

interface ReadmeScoreCardProps {
  score: ReadmeScore;
}

export function ReadmeScoreCard({ score }: ReadmeScoreCardProps) {
  const percentage = (score.score / score.maxScore) * 100;

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-500";
  };

  const getScoreBg = () => {
    if (percentage >= 80) return "from-green-100 to-green-50";
    if (percentage >= 50) return "from-yellow-100 to-yellow-50";
    return "from-red-100 to-red-50";
  };

  const getScoreIcon = () => {
    if (percentage >= 80) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (percentage >= 50) return <TrendingUp className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Score Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`flex items-center gap-3 rounded-2xl bg-gradient-to-r ${getScoreBg()} px-5 py-3 border border-border-warm`}
      >
        {getScoreIcon()}
        <div>
          <span className={`text-2xl font-bold ${getScoreColor()}`}>
            {score.score}
          </span>
          <span className="text-sm text-text-muted">/{score.maxScore}</span>
        </div>
        <span className="text-xs text-text-muted font-medium ml-1">
          README Score
        </span>
      </motion.div>

      {/* Recommendations */}
      {score.recommendations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {score.recommendations.slice(0, 3).map((rec, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full bg-warm-yellow/20 px-3 py-1 text-xs text-text-muted border border-border-warm"
            >
              {rec}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
