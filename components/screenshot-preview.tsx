import { useRef, useEffect } from "react";
import { useScreenshotStore } from "@/store/screenshot-store";

export function ScreenshotPreview() {
  const previewRef = useRef<HTMLDivElement>(null);
  const {
    setPreviewRef,
    setClipboardSupported,
    uploadedImage,
    borderRadius,
    padding,
    selectedBackground,
    shadowEnabled,
    shadowOffsetY,
    shadowBlur,
    shadowOpacity,
  } = useScreenshotStore();

  useEffect(() => {
    setPreviewRef(previewRef);

    // Check clipboard support on mount
    setClipboardSupported(
      typeof navigator !== "undefined" &&
        "clipboard" in navigator &&
        "write" in navigator.clipboard,
    );
  }, [setPreviewRef, setClipboardSupported]);

  if (!uploadedImage) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4"></div>
        <div className="flex justify-center items-center min-h-[calc(100vh-300px)]">
          <div className="text-muted-foreground">No image uploaded</div>
        </div>
      </div>
    );
  }

  const shadowStyle = shadowEnabled
    ? {
        filter: `drop-shadow(0 ${shadowOffsetY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity / 100}))`,
      }
    : {};

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4"></div>
      <div className="flex justify-center items-center min-h-[calc(100vh-300px)]">
        <div
          ref={previewRef}
          className="relative"
          style={{
            background: selectedBackground,
            padding: `${padding}px`,
            borderRadius: "8px",
          }}
        >
          <img
            src={uploadedImage}
            alt="Screenshot preview"
            className="max-w-full max-h-[calc(100vh-400px)] object-contain"
            style={{
              borderRadius: `${borderRadius}px`,
              ...shadowStyle,
            }}
          />
        </div>
      </div>
    </div>
  );
}
