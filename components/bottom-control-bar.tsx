import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ShadowControlsPopover } from "@/components/shadow-controls-popover";
import { useScreenshotStore } from "@/store/screenshot-store";

interface BottomControlBarProps {
  backgroundOptions: { name: string; value: string }[];
}

export function BottomControlBar({ backgroundOptions }: BottomControlBarProps) {
  const {
    selectedBackground,
    setSelectedBackground,
    borderRadius,
    setBorderRadius,
    padding,
    setPadding,
  } = useScreenshotStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          {/* Background Selection */}
          <div className="flex items-center gap-3 overflow-scroll">
            <Label className="text-sm font-medium whitespace-nowrap">
              Background:
            </Label>
            <div className="flex gap-2">
              {backgroundOptions.map((bg) => (
                <button
                  key={bg.name}
                  className={`w-8 h-8 rounded-md border-2 transition-all ${
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
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 flex-wrap">
            {/* Border Radius */}
            <div className="flex items-center gap-3 min-w-32">
              <Label className="text-sm font-medium whitespace-nowrap">
                Radius:
              </Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[borderRadius]}
                  onValueChange={(value) => setBorderRadius(value[0])}
                  max={50}
                  min={0}
                  step={1}
                  className="w-20"
                />
                <span className="text-xs text-muted-foreground w-8">
                  {borderRadius}
                </span>
              </div>
            </div>

            {/* Padding */}
            <div className="flex items-center gap-3 min-w-32">
              <Label className="text-sm font-medium whitespace-nowrap">
                Padding:
              </Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[padding]}
                  onValueChange={(value) => setPadding(value[0])}
                  max={200}
                  min={10}
                  step={5}
                  className="w-20"
                />
                <span className="text-xs text-muted-foreground w-8">
                  {padding}
                </span>
              </div>
            </div>

            {/* Shadow Controls */}
            <ShadowControlsPopover />
          </div>
        </div>
      </div>
    </div>
  );
}
