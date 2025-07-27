import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Copy, ChevronDown } from "lucide-react";
import { useScreenshotStore } from "@/store/screenshot-store";

export function ExportDropdown() {
  const {
    handleDownload,
    handleCopyToClipboard,
    copyStatus,
    clipboardSupported,
  } = useScreenshotStore();

  return (
    <div className="flex">
      {/* Main download button */}
      <Button
        onClick={handleDownload}
        size="sm"
        className="rounded-r-none border-r-0 px-3"
      >
        <Download className="h-4 w-4 mr-2" />
        Export Image
      </Button>

      {/* Dropdown trigger */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            className="rounded-l-none px-2"
          >
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
  );
}