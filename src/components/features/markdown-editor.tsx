"use client";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="flex-1 min-h-[500px]">
      <textarea
        id="markdown-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full min-h-[500px] p-5 bg-transparent text-sm text-text-dark font-mono leading-relaxed resize-none focus:outline-none custom-scrollbar"
        spellCheck={false}
        aria-label="Markdown editor"
        placeholder="Your generated README will appear here..."
      />
    </div>
  );
}
