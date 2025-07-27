import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Copy, ChevronDown, X, Sparkles, Check } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useScreenshotStore } from "@/store/screenshot-store";

interface StickyTopHeaderProps {
  showActions?: boolean;
}

export function StickyTopHeader({ showActions = false }: StickyTopHeaderProps) {
  const {
    handleDownload,
    handleCopyToClipboard,
    copyStatus,
    clipboardSupported,
    clearUploadedImage,
  } = useScreenshotStore();

  return (
    <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="items-center">
            <button
              onClick={clearUploadedImage}
              className="hidden sm:flex gap-2 items-center hover:opacity-80 transition-opacity cursor-pointer"
              title="Reset to home"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <h1 className="text-lg font-semibold ">screeny.dev</h1>
            </button>
          </div>

          {/* Right side - Theme toggle and Actions */}
          <div className="flex items-center gap-3">
            {/* Clear Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={clearUploadedImage}
              className="hover:bg-destructive dark:hover:text-destructive-foreground hover:text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>

            {/* Actions - only show when showActions is true */}
            {showActions && (
              <>
                {/* Export Dropdown */}
                <div className="flex">
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="rounded-r-none border-r-0 px-3"
                  >
                    {copyStatus === "success" ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : copyStatus === "copying" ? (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copying...
                      </>
                    ) : copyStatus === "error" ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Copy Failed
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export Image
                      </>
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="rounded-l-none px-2">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PNG
                      </DropdownMenuItem>
                      {clipboardSupported && (
                        <DropdownMenuItem
                          onClick={handleCopyToClipboard}
                          disabled={copyStatus === "copying"}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copyStatus === "copying" && "Copying..."}
                          {copyStatus === "success" && "✓ Copied!"}
                          {copyStatus === "error" && "✗ Copy Failed"}
                          {copyStatus === "idle" && "Copy to Clipboard"}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Theme Toggle - always visible */}
                <ModeToggle />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
