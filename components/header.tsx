import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <div className="text-center mb-8">
      {/* Added theme toggle in header */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        {/* Updated to use theme-aware text color */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground/90 to-foreground/60 bg-clip-text text-transparent">
          screeny.dev
        </h1>
        <Badge variant="secondary" className="ml-2 text-xs">
          Beta
        </Badge>
      </div>
      {/* Updated to use theme-aware text color */}
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Transform your screenshots with beautiful backgrounds and rounded
        corners. Upload, customize, and download in seconds.
      </p>
    </div>
  );
}