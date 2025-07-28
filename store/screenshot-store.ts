"use client";

import { create } from "zustand";
import { BACKGROUND_OPTIONS } from "@/lib/constants";
import html2canvas from "html2canvas-pro";

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
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

  // Preview ref
  previewRef: React.RefObject<HTMLDivElement | null> | null;
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
  setPreviewRef: (ref: React.RefObject<HTMLDivElement | null>) => void;

  // Export actions
  handleDownload: () => Promise<void>;
  handleCopyToClipboard: () => Promise<void>;
}

type ScreenshotStore = ScreenshotState & ScreenshotActions;

export const useScreenshotStore = create<ScreenshotStore>((set, get) => ({
  // Initial state
  uploadedImage: null,
  borderRadius: 16,
  padding: 50,
  selectedBackground: BACKGROUND_OPTIONS[0].value, // Default to first background option
  shadowEnabled: true,
  shadowOffsetY: 8,
  shadowBlur: 20,
  shadowOpacity: 30,
  copyStatus: "idle",
  clipboardSupported: false,
  previewRef: null,

  // Actions
  setUploadedImage: (image: string) => {
    set({ uploadedImage: image });
  },

  clearUploadedImage: () => {
    set({ uploadedImage: null });
  },

  setBorderRadius: (radius: number) => {
    set({ borderRadius: radius });
  },

  setPadding: (padding: number) => {
    set({ padding });
  },

  setSelectedBackground: (background: string) => {
    set({ selectedBackground: background });
  },

  setShadowEnabled: (enabled: boolean) => {
    set({ shadowEnabled: enabled });
  },

  setShadowOffsetY: (offset: number) => {
    set({ shadowOffsetY: offset });
  },

  setShadowBlur: (blur: number) => {
    set({ shadowBlur: blur });
  },

  setShadowOpacity: (opacity: number) => {
    set({ shadowOpacity: opacity });
  },

  setCopyStatus: (status: "idle" | "copying" | "success" | "error") => {
    set({ copyStatus: status });
  },

  setClipboardSupported: (supported: boolean) => {
    set({ clipboardSupported: supported });
  },

  setPreviewRef: (ref: React.RefObject<HTMLDivElement | null>) => {
    set({ previewRef: ref });
  },

  // Download functionality
  handleDownload: async () => {
    const { previewRef } = get();
    if (!previewRef?.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `screenshot-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  },

  // Copy to clipboard functionality
  handleCopyToClipboard: async () => {
    const { clipboardSupported, previewRef, setCopyStatus } = get();
    if (!clipboardSupported || !previewRef?.current) return;

    try {
      setCopyStatus("copying");

      const item = new ClipboardItem({
        "image/png": new Promise(async (resolve) => {
          if (!previewRef.current) {
            throw new Error("Preview reference is not set");
          }

          const canvas = await html2canvas(previewRef.current, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            allowTaint: true,
          });

          const blob = await canvasToBlob(canvas);
          resolve(blob);
        }),
      });

      await navigator.clipboard.write([item]);

      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 3000);
    }
  },
}));
