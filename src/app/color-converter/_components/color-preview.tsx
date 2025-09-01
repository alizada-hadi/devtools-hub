import { useRef } from "react";
import { ColorData } from "./ColorConverter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Contrast } from "lucide-react";

interface ColorPreviewProps {
  colorData: ColorData;
  onColorChange: (color: ColorData) => void;
}

export function ColorPreview({ colorData, onColorChange }: ColorPreviewProps) {
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const handleColorPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Convert RGB to other formats (same logic as in color-input)
    const convertFromRGB = (r: number, g: number, b: number): ColorData => {
      const hex = `#${[r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")}`;

      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;

      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      const diff = max - min;

      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (diff !== 0) {
        s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

        switch (max) {
          case rNorm:
            h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0);
            break;
          case gNorm:
            h = (bNorm - rNorm) / diff + 2;
            break;
          case bNorm:
            h = (rNorm - gNorm) / diff + 4;
            break;
        }
        h /= 6;
      }

      const v = max;
      const sHsv = max === 0 ? 0 : diff / max;

      const k = 1 - max;
      const c = k === 1 ? 0 : (1 - rNorm - k) / (1 - k);
      const m = k === 1 ? 0 : (1 - gNorm - k) / (1 - k);
      const y = k === 1 ? 0 : (1 - bNorm - k) / (1 - k);

      return {
        hex,
        rgb: { r, g, b },
        hsl: {
          h: Math.round(h * 360),
          s: Math.round(s * 100),
          l: Math.round(l * 100),
        },
        hsv: {
          h: Math.round(h * 360),
          s: Math.round(sHsv * 100),
          v: Math.round(v * 100),
        },
        cmyk: {
          c: Math.round(c * 100),
          m: Math.round(m * 100),
          y: Math.round(y * 100),
          k: Math.round(k * 100),
        },
      };
    };

    onColorChange(convertFromRGB(r, g, b));
  };

  const getContrastRatio = (
    color1: string,
    color2: string = "#ffffff"
  ): number => {
    const getLuminance = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const [rs, gs, bs] = [r, g, b].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);

    return (brightest + 0.05) / (darkest + 0.05);
  };

  const contrastRatio = getContrastRatio(colorData.hex);
  const textColor = contrastRatio > 4.5 ? "#ffffff" : "#000000";

  return (
    <div className="space-y-4">
      {/* Large Color Preview */}
      <div
        className="w-full h-32 rounded-lg border border-border flex items-center justify-center cursor-pointer transition-smooth hover:scale-[1.02]"
        style={{ backgroundColor: colorData.hex }}
        onClick={() => colorPickerRef.current?.click()}
      >
        <div className="text-center" style={{ color: textColor }}>
          <Palette className="w-8 h-8 mx-auto mb-2 opacity-80" />
          <div className="text-sm font-medium">Click to pick color</div>
          <div className="text-xs opacity-80 font-mono">{colorData.hex}</div>
        </div>
      </div>

      {/* Hidden Color Picker */}
      <input
        ref={colorPickerRef}
        type="color"
        value={colorData.hex}
        onChange={handleColorPick}
        className="sr-only"
      />

      {/* Color Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Contrast className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Contrast Ratio</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{contrastRatio.toFixed(2)}</div>
            <div className="flex gap-1">
              <Badge
                variant={
                  contrastRatio >= 7
                    ? "default"
                    : contrastRatio >= 4.5
                    ? "secondary"
                    : "destructive"
                }
              >
                {contrastRatio >= 7
                  ? "AAA"
                  : contrastRatio >= 4.5
                  ? "AA"
                  : "Fail"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                vs White
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Color Temperature</div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              {colorData.hsl.h < 60 || colorData.hsl.h > 300
                ? "Warm"
                : colorData.hsl.h > 180 && colorData.hsl.h < 300
                ? "Cool"
                : "Neutral"}
            </div>
            <div className="text-xs text-muted-foreground">
              Hue: {colorData.hsl.h}°
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => colorPickerRef.current?.click()}
        >
          <Palette className="w-4 h-4 mr-2" />
          Pick Color
        </Button>
      </div>
    </div>
  );
}
