"use client";

import { create } from "zustand";
import { renderScreenshot } from "@/lib/renderer";
import { BACKGROUND_OPTIONS } from "@/lib/constants";

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Blob creation failed"));
      }
    });
  });
}

interface ScreenshotState {
  // Image
  uploadedImage: string | null;

  // Style settings
  borderRadius: number;
  padding: number;
  selectedBackground: string;

  // Shadow settings
  shadowEnabled: boolean;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowOpacity: number;

  // UI state
  copyStatus: "idle" | "copying" | "success" | "error";
  clipboardSupported: boolean;

  // Canvas ref
  canvasRef: React.RefObject<HTMLCanvasElement | null> | null;
}

interface ScreenshotActions {
  // Image actions
  setUploadedImage: (image: string) => void;
  clearUploadedImage: () => void;

  // Style actions
  setBorderRadius: (radius: number) => void;
  setPadding: (padding: number) => void;
  setSelectedBackground: (background: string) => void;

  // Shadow actions
  setShadowEnabled: (enabled: boolean) => void;
  setShadowOffsetY: (offset: number) => void;
  setShadowBlur: (blur: number) => void;
  setShadowOpacity: (opacity: number) => void;

  // UI actions
  setCopyStatus: (status: "idle" | "copying" | "success" | "error") => void;
  setClipboardSupported: (supported: boolean) => void;
  setCanvasRef: (ref: React.RefObject<HTMLCanvasElement | null>) => void;

  // Export actions
  handleDownload: () => void;
  handleCopyToClipboard: () => void;

  // Canvas rendering
  renderCanvas: () => Promise<void>;
}

type ScreenshotStore = ScreenshotState & ScreenshotActions;

export const useScreenshotStore = create<ScreenshotStore>((set, get) => ({
  // Initial state
  uploadedImage: null,
  borderRadius: 40,
  padding: 95,
  selectedBackground: BACKGROUND_OPTIONS[0].value, // Default to first background option
  shadowEnabled: true,
  shadowOffsetY: 8,
  shadowBlur: 20,
  shadowOpacity: 30,
  copyStatus: "idle",
  clipboardSupported: false,
  canvasRef: null,

  // Actions
  setUploadedImage: (image: string) => {
    set({ uploadedImage: image });
    get().renderCanvas();
  },

  clearUploadedImage: () => {
    set({ uploadedImage: null });
  },

  setBorderRadius: (radius: number) => {
    set({ borderRadius: radius });
    get().renderCanvas();
  },

  setPadding: (padding: number) => {
    set({ padding });
    get().renderCanvas();
  },

  setSelectedBackground: (background: string) => {
    set({ selectedBackground: background });
    get().renderCanvas();
  },

  setShadowEnabled: (enabled: boolean) => {
    set({ shadowEnabled: enabled });
    get().renderCanvas();
  },

  setShadowOffsetY: (offset: number) => {
    set({ shadowOffsetY: offset });
    get().renderCanvas();
  },

  setShadowBlur: (blur: number) => {
    set({ shadowBlur: blur });
    get().renderCanvas();
  },

  setShadowOpacity: (opacity: number) => {
    set({ shadowOpacity: opacity });
    get().renderCanvas();
  },

  setCopyStatus: (status: "idle" | "copying" | "success" | "error") => {
    set({ copyStatus: status });
  },

  setClipboardSupported: (supported: boolean) => {
    set({ clipboardSupported: supported });
  },

  setCanvasRef: (ref: React.RefObject<HTMLCanvasElement | null>) => {
    set({ canvasRef: ref });
  },

  // Download functionality
  handleDownload: () => {
    const { canvasRef } = get();
    if (!canvasRef?.current) return;

    const dataUrl = canvasRef.current.toDataURL("image/png", 1.0);
    const link = document.createElement("a");
    link.download = `screenshot-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Copy to clipboard functionality
  handleCopyToClipboard: async () => {
    const { clipboardSupported, canvasRef, setCopyStatus } = get();
    if (!clipboardSupported || !canvasRef?.current) return;

    try {
      setCopyStatus("copying");

      try {
        const item = new ClipboardItem({
          "image/png": canvasToBlob(canvasRef.current),
        });

        await navigator.clipboard.write([item]);

        setCopyStatus("success");
        setTimeout(() => setCopyStatus("idle"), 2000);
      } catch (error) {
        setCopyStatus("error");
        setTimeout(() => setCopyStatus("idle"), 2000);
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 3000);
    }
  },

  // Render to canvas
  renderCanvas: async () => {
    const {
      uploadedImage,
      canvasRef,
      padding,
      borderRadius,
      selectedBackground,
      shadowEnabled,
      shadowOffsetY,
      shadowBlur,
      shadowOpacity,
    } = get();

    if (!uploadedImage || !canvasRef?.current) return;

    try {
      await renderScreenshot({
        canvas: canvasRef.current,
        imageData: uploadedImage,
        padding,
        borderRadius,
        background: selectedBackground,
        shadowOffsetY: shadowEnabled ? shadowOffsetY : 0,
        shadowBlur: shadowEnabled ? shadowBlur : 0,
        shadowOpacity: shadowEnabled ? shadowOpacity : 0,
      });
    } catch (error) {
      console.error("Rendering failed:", error);
    }
  },
}));
