import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-12 text-center text-sm text-muted-foreground pb-6">
      {/* Added profile picture - made smaller */}
      <div className="flex justify-center mb-3">
        <img
          src="https://github.com/okwasniewski.png?size=200"
          alt="Oskar Kwa[niewski"
          className="h-10 w-10 rounded-full border-2 border-border"
        />
      </div>
      <p>Built by Oskar Kwaśniewski</p>
      <div className="flex items-center justify-center gap-4 mt-2">
        <a
          href="https://github.com/okwasniewski"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="h-4 w-4" />
        </a>
        <a
          href="https://x.com/o_kwasniewski"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Twitter className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
