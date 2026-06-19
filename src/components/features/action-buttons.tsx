"use client";

import { useState } from "react";
import { Copy, Download, RefreshCw, Wand2, Check } from "lucide-react";

interface ActionButtonsProps {
  markdown: string;
  repoName: string;
  onRegenerate: () => void;
  onImprove: () => void;
  isRegenerating: boolean;
}

export function ActionButtons({
  markdown,
  repoName,
  onRegenerate,
  onImprove,
  isRegenerating,
}: ActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `README-${repoName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Copy */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 rounded-xl border-2 border-border-warm bg-white/60 px-4 py-2.5 text-sm font-medium text-text-dark hover:bg-warm-yellow/20 transition-all"
        id="copy-readme-btn"
        aria-label="Copy README to clipboard"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy
          </>
        )}
      </button>

      {/* Download */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 rounded-xl border-2 border-border-warm bg-white/60 px-4 py-2.5 text-sm font-medium text-text-dark hover:bg-warm-yellow/20 transition-all"
        id="download-readme-btn"
        aria-label="Download README as markdown file"
      >
        <Download className="h-4 w-4" />
        Download
      </button>

      {/* Regenerate */}
      <button
        onClick={onRegenerate}
        disabled={isRegenerating}
        className="flex items-center gap-2 rounded-xl border-2 border-border-warm bg-white/60 px-4 py-2.5 text-sm font-medium text-text-dark hover:bg-warm-yellow/20 transition-all disabled:opacity-50"
        id="regenerate-btn"
        aria-label="Regenerate README"
      >
        <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
        Regenerate
      </button>

      {/* Improve */}
      <button
        onClick={onImprove}
        disabled={isRegenerating}
        className="btn-gold flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
        id="improve-readme-btn"
        aria-label="Improve README with AI"
      >
        <Wand2 className="h-4 w-4" />
        Improve
      </button>
    </div>
  );
}
