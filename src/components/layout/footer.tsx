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
              README<span className="text-accent-gold">Wizard</span>
            </span>
          </div>

          {/* Center */}
          <p className="flex items-center gap-1.5 text-sm text-text-muted">
            Made with <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" /> using
            <span className="font-medium text-text-dark">Next.js</span> &
            <span className="font-medium text-text-dark">Google Gemini</span>
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-dark transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <span className="text-xs text-text-muted">
              © {new Date().getFullYear()} README Wizard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
