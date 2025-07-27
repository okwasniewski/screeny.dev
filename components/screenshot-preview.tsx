import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useScreenshotStore } from "@/store/screenshot-store";

export function ScreenshotPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvasRef, setClipboardSupported, renderCanvas, uploadedImage } = useScreenshotStore();

  useEffect(() => {
    setCanvasRef(canvasRef);
    
    // Check clipboard support on mount
    setClipboardSupported(
      typeof navigator !== "undefined" &&
        "clipboard" in navigator &&
        "write" in navigator.clipboard,
    );
  }, [setCanvasRef, setClipboardSupported]);

  // Trigger render when canvas ref is set and we have an image
  useEffect(() => {
    if (canvasRef.current && uploadedImage) {
      renderCanvas();
    }
  }, [renderCanvas, uploadedImage]);

  return (
    <div className="lg:col-span-2">
      <Card className="p-6">
        <Label className="text-sm font-medium mb-4 block">
          Preview
        </Label>
        <div className="flex justify-center items-center">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[70vh] rounded-lg object-contain"
            style={{ imageRendering: "auto" }}
          />
        </div>
      </Card>
    </div>
  );
}