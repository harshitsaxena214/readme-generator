import { Wand2, Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border-warm bg-cream/80">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-gold to-accent-gold-hover">
              <Wand2 className="h-4 w-4 text-text-dark" />
            </div>
            <span className="text-base font-bold tracking-tight text-text-dark">
              SUPA<span className="text-accent-gold">DOCS</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/harshitsaxena214/readme-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-dark transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <span className="text-xs text-text-muted">
              © {new Date().getFullYear()} SUPA Docs
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
