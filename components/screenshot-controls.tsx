import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Download, Copy } from "lucide-react";
import { ImageUploader } from "@/components/image-uploader";
import { useScreenshot } from "@/contexts/screenshot-context";

interface ScreenshotControlsProps {
  backgroundOptions: { name: string; value: string }[];
}

export function ScreenshotControls({ backgroundOptions }: ScreenshotControlsProps) {
  const {
    selectedBackground,
    setSelectedBackground,
    borderRadius,
    setBorderRadius,
    padding,
    setPadding,
    shadowOffsetY,
    setShadowOffsetY,
    shadowBlur,
    setShadowBlur,
    shadowOpacity,
    setShadowOpacity,
    setUploadedImage,
    handleDownload,
    handleCopyToClipboard,
    copyStatus,
    clipboardSupported,
  } = useScreenshot();
  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Upload Area (smaller when image is already uploaded) */}
      <ImageUploader onImageUpload={setUploadedImage} compact />

      {/* Background Selection */}
      <Card className="p-6">
        <Label className="text-sm font-medium mb-4 block">Background</Label>
        <div className="grid grid-cols-2 gap-2">
          {backgroundOptions.map((bg) => (
            <button
              key={bg.name}
              className={`h-12 rounded-lg border-2 transition-all ${
                selectedBackground === bg.value
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={{ background: bg.value }}
              onClick={() => setSelectedBackground(bg.value)}
              title={bg.name}
            />
          ))}
        </div>
      </Card>

      {/* Border Radius Control */}
      <Card className="p-6">
        <Label className="text-sm font-medium mb-4 block">
          Border Radius: {borderRadius}px
        </Label>
        <Slider
          value={[borderRadius]}
          onValueChange={(value) => setBorderRadius(value[0])}
          max={50}
          min={0}
          step={1}
          className="w-full"
        />
      </Card>

      {/* Padding Control */}
      <Card className="p-6">
        <Label className="text-sm font-medium mb-4 block">
          Padding: {padding}px
        </Label>
        <Slider
          value={[padding]}
          onValueChange={(value) => setPadding(value[0])}
          max={200}
          min={10}
          step={5}
          className="w-full"
        />
      </Card>

      {/* Shadow Controls */}
      <Card className="p-6">
        <Label className="text-sm font-medium mb-4 block">Shadow</Label>
        
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Offset: {shadowOffsetY}px
            </Label>
            <Slider
              value={[shadowOffsetY]}
              onValueChange={(value) => setShadowOffsetY(value[0])}
              max={50}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Blur: {shadowBlur}px
            </Label>
            <Slider
              value={[shadowBlur]}
              onValueChange={(value) => setShadowBlur(value[0])}
              max={50}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Opacity: {shadowOpacity}%
            </Label>
            <Slider
              value={[shadowOpacity]}
              onValueChange={(value) => setShadowOpacity(value[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Export Buttons */}
      <div className="space-y-3">
        <Button className="w-full" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download Image
        </Button>
        {clipboardSupported && (
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleCopyToClipboard}
            disabled={copyStatus === "copying"}
          >
            <Copy className="w-4 h-4 mr-2" />
            {copyStatus === "copying" && "Copying..."}
            {copyStatus === "success" && "✓ Copied!"}
            {copyStatus === "error" && "✗ Copy Failed"}
            {copyStatus === "idle" && "Copy to Clipboard"}
          </Button>
        )}
      </div>
    </div>
  );
}