import { useRef, useCallback, useEffect } from "react";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void;
  compact?: boolean;
}

export function ImageUploader({
  onImageUpload,
  compact = false,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onImageUpload(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onImageUpload(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload],
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  // Add paste event handler
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              onImageUpload(e.target?.result as string);
            };
            reader.readAsDataURL(blob);
            break;
          }
        }
      }
    };

    // Add event listener
    document.addEventListener("paste", handlePaste);

    // Clean up
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [onImageUpload]);

  if (compact) {
    return (
      <Card className="p-6">
        <Label className="text-sm font-medium mb-4 block">
          Upload Screenshot
        </Label>
        <div
          className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground">
            Drop a new screenshot or click to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <Label className="text-sm font-medium mb-4 block">
        Upload Screenshot
      </Label>
      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          Drop your screenshot here or click to browse. (You can also paste it
          with ⌘ + v)
        </p>
        <p className="text-xs text-muted-foreground/70">
          PNG, JPG, GIF up to 10MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </Card>
  );
}
