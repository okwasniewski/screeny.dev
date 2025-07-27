import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { renderScreenshot } from "@/lib/renderer";

interface ScreenshotState {
  // Image
  uploadedImage: string | null;

  // Style settings
  borderRadius: number;
  padding: number;
  selectedBackground: string;

  // Shadow settings
  shadowOffsetY: number;
  shadowBlur: number;
  shadowOpacity: number;

  // UI state
  copyStatus: "idle" | "copying" | "success" | "error";
  clipboardSupported: boolean;

  // Canvas ref
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

interface ScreenshotActions {
  // Image actions
  setUploadedImage: (image: string) => void;

  // Style actions
  setBorderRadius: (radius: number) => void;
  setPadding: (padding: number) => void;
  setSelectedBackground: (background: string) => void;

  // Shadow actions
  setShadowOffsetY: (offset: number) => void;
  setShadowBlur: (blur: number) => void;
  setShadowOpacity: (opacity: number) => void;

  // Export actions
  handleDownload: () => void;
  handleCopyToClipboard: () => void;
}

type ScreenshotContextType = ScreenshotState & ScreenshotActions;

const ScreenshotContext = createContext<ScreenshotContextType | undefined>(
  undefined,
);

export function useScreenshot() {
  const context = useContext(ScreenshotContext);
  if (context === undefined) {
    throw new Error("useScreenshot must be used within a ScreenshotProvider");
  }
  return context;
}

interface ScreenshotProviderProps {
  children: ReactNode;
  backgroundOptions: { name: string; value: string }[];
}

export function ScreenshotProvider({
  children,
  backgroundOptions,
}: ScreenshotProviderProps) {
  // State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [borderRadius, setBorderRadius] = useState(40);
  const [padding, setPadding] = useState(95);
  const [selectedBackground, setSelectedBackground] = useState(
    backgroundOptions[0].value,
  );
  const [shadowOffsetY, setShadowOffsetY] = useState(8);
  const [shadowBlur, setShadowBlur] = useState(20);
  const [shadowOpacity, setShadowOpacity] = useState(30);
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "copying" | "success" | "error"
  >("idle");
  const [clipboardSupported, setClipboardSupported] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check clipboard support on mount
  useEffect(() => {
    setClipboardSupported(
      typeof navigator !== "undefined" &&
        "clipboard" in navigator &&
        "write" in navigator.clipboard,
    );
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

  // Copy to clipboard functionality
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

  const value: ScreenshotContextType = {
    // State
    uploadedImage,
    borderRadius,
    padding,
    selectedBackground,
    shadowOffsetY,
    shadowBlur,
    shadowOpacity,
    copyStatus,
    clipboardSupported,
    canvasRef,

    // Actions
    setUploadedImage,
    setBorderRadius,
    setPadding,
    setSelectedBackground,
    setShadowOffsetY,
    setShadowBlur,
    setShadowOpacity,
    handleDownload,
    handleCopyToClipboard,
  };

  return (
    <ScreenshotContext.Provider value={value}>
      {children}
    </ScreenshotContext.Provider>
  );
}
