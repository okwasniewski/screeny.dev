"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Download, Copy } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ImageUploader } from "@/components/image-uploader";
import { renderScreenshot } from "@/lib/renderer";

const BACKGROUND_OPTIONS = [
  {
    name: "Blue Gradient",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    name: "Purple Gradient",
    value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    name: "Green Gradient",
    value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    name: "Orange Gradient",
    value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  { name: "Dark", value: "#1a1a1a" },
  { name: "Light", value: "#f8f9fa" },
  { name: "White", value: "#ffffff" },
];

export default function ScreenshotEditor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [borderRadius, setBorderRadius] = useState(40);
  const [padding, setPadding] = useState(95);
  const [selectedBackground, setSelectedBackground] = useState(
    BACKGROUND_OPTIONS[0].value,
  );
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "copying" | "success" | "error"
  >("idle");
  const [clipboardSupported, setClipboardSupported] = useState(false);
  const [shadowOffsetY, setShadowOffsetY] = useState(8);
  const [shadowBlur, setShadowBlur] = useState(20);
  const [shadowOpacity, setShadowOpacity] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((imageData: string) => {
    setUploadedImage(imageData);
  }, []);

  // Render to canvas whenever settings change
  useEffect(() => {
    const renderCanvas = async () => {
      if (!uploadedImage || !canvasRef.current) return;

      try {
        await renderScreenshot({
          canvas: canvasRef.current,
          imageData: uploadedImage,
          padding,
          borderRadius,
          background: selectedBackground,
          shadowOffsetY,
          shadowBlur,
          shadowOpacity,
        });
      } catch (error) {
        console.error("Rendering failed:", error);
      }
    };

    renderCanvas();
  }, [
    uploadedImage,
    borderRadius,
    padding,
    selectedBackground,
    shadowOffsetY,
    shadowBlur,
    shadowOpacity,
  ]);

  // Download functionality
  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;

    const dataUrl = canvasRef.current.toDataURL("image/png", 1.0);
    const link = document.createElement("a");
    link.download = `screenshot-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Check clipboard support on mount
  useEffect(() => {
    setClipboardSupported(
      typeof navigator !== "undefined" &&
        "clipboard" in navigator &&
        "write" in navigator.clipboard,
    );
  }, []);

  // Simple copy to clipboard functionality
  const handleCopyToClipboard = useCallback(async () => {
    if (!clipboardSupported || !canvasRef.current) return;

    try {
      setCopyStatus("copying");

      canvasRef.current.toBlob(
        async (blob) => {
          if (!blob) {
            setCopyStatus("error");
            setTimeout(() => setCopyStatus("idle"), 3000);
            return;
          }

          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ]);

            setCopyStatus("success");
            setTimeout(() => setCopyStatus("idle"), 2000);
          } catch (error) {
            console.error("Failed to copy to clipboard:", error);
            setCopyStatus("error");
            setTimeout(() => setCopyStatus("idle"), 3000);
          }
        },
        "image/png",
        1.0,
      );
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 3000);
    }
  }, [clipboardSupported]);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto relative">
        <Header />

        {!uploadedImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          // Show editor interface after image is uploaded
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Upload Area (smaller when image is already uploaded) */}
              <ImageUploader onImageUpload={handleImageUpload} compact />

              {/* Background Selection */}
              <Card className="p-6">
                <Label className="text-sm font-medium mb-4 block">
                  Background
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {BACKGROUND_OPTIONS.map((bg) => (
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

            {/* Preview Area */}
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
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
