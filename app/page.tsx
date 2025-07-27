"use client";

import type React from "react";

import { Footer } from "@/components/footer";
import { ImageUploader } from "@/components/image-uploader";
import { BottomControlBar } from "@/components/bottom-control-bar";
import { StickyTopHeader } from "@/components/sticky-top-header";
import { ScreenshotPreview } from "@/components/screenshot-preview";
import { useScreenshotStore } from "@/store/screenshot-store";
import { BACKGROUND_OPTIONS } from "@/lib/constants";

function ScreenshotEditorContent() {
  const { uploadedImage, setUploadedImage } = useScreenshotStore();

  return (
    <div className="h-screen bg-background">
      <StickyTopHeader showActions={!!uploadedImage} />

      <div className="container mx-auto px-4">
        {uploadedImage ? (
          <div className="pt-20 pb-32">
            <ScreenshotPreview />
            <BottomControlBar backgroundOptions={BACKGROUND_OPTIONS} />
          </div>
        ) : (
          <div className="h-screen justify-center flex items-center flex-col ">
            <div className="flex flex-col items-center mb-8 mt-24">
              <h1 className="text-2xl font-bold mb-4 text-center">
                Turn your screenshots into stunning images
              </h1>
              <p className="text-gray-500">
                Upload, customize, and download in seconds.
              </p>
            </div>
            <ImageUploader onImageUpload={setUploadedImage} />
            <Footer />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScreenshotEditor() {
  return <ScreenshotEditorContent />;
}
