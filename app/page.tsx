"use client";

import type React from "react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ImageUploader } from "@/components/image-uploader";
import { ScreenshotControls } from "@/components/screenshot-controls";
import { ScreenshotPreview } from "@/components/screenshot-preview";
import { useScreenshotStore } from "@/store/screenshot-store";
import { BACKGROUND_OPTIONS } from "@/lib/constants";

function ScreenshotEditorContent() {
  const { uploadedImage, setUploadedImage } = useScreenshotStore();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto relative">
        <Header />

        {uploadedImage ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ScreenshotControls backgroundOptions={BACKGROUND_OPTIONS} />
            <ScreenshotPreview />
          </div>
        ) : (
          <ImageUploader onImageUpload={setUploadedImage} />
        )}

        <Footer />
      </div>
    </div>
  );
}

export default function ScreenshotEditor() {
  return <ScreenshotEditorContent />;
}
