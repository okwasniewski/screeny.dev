import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Cog } from "lucide-react";
import { useScreenshotStore } from "@/store/screenshot-store";

export function ShadowControlsPopover() {
  const {
    shadowEnabled,
    setShadowEnabled,
    shadowOffsetY,
    setShadowOffsetY,
    shadowBlur,
    setShadowBlur,
    shadowOpacity,
    setShadowOpacity,
  } = useScreenshotStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 ${shadowEnabled ? "bg-accent" : ""}`}
        >
          <Cog className="h-4 w-4" />
          Shadow
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Shadow</Label>
            <Switch
              checked={shadowEnabled}
              onCheckedChange={setShadowEnabled}
            />
          </div>

          <Separator />

          <div
            className={`space-y-4 ${shadowEnabled ? "opacity-100" : "opacity-50"}`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Offset</Label>
                <span className="text-sm text-muted-foreground">
                  {shadowOffsetY}px
                </span>
              </div>
              <Slider
                value={[shadowOffsetY]}
                onValueChange={(value) => setShadowOffsetY(value[0])}
                max={50}
                min={0}
                step={1}
                className="w-full"
                disabled={!shadowEnabled}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Blur</Label>
                <span className="text-sm text-muted-foreground">
                  {shadowBlur}px
                </span>
              </div>
              <Slider
                value={[shadowBlur]}
                onValueChange={(value) => setShadowBlur(value[0])}
                max={50}
                min={0}
                step={1}
                className="w-full"
                disabled={!shadowEnabled}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Opacity</Label>
                <span className="text-sm text-muted-foreground">
                  {shadowOpacity}%
                </span>
              </div>
              <Slider
                value={[shadowOpacity]}
                onValueChange={(value) => setShadowOpacity(value[0])}
                max={100}
                min={0}
                step={5}
                className="w-full"
                disabled={!shadowEnabled}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
