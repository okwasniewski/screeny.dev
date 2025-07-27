import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useScreenshot } from "@/contexts/screenshot-context";

export function ScreenshotPreview() {
  const { canvasRef } = useScreenshot();

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