import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ColorPaletteProps {
  baseColor: string;
}

export function ColorPalette({ baseColor }: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      toast(`Color ${color} copied to clipboard`);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      toast("Failed to copy to clipboard");
    }
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

      switch (max) {
        case r:
          h = (g - b) / diff + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / diff + 2;
          break;
        case b:
          h = (r - g) / diff + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (h >= 0 && h < 1 / 6) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 1 / 6 && h < 2 / 6) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 2 / 6 && h < 3 / 6) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 3 / 6 && h < 4 / 6) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 4 / 6 && h < 5 / 6) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 5 / 6 && h < 1) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  };

  const baseHsl = hexToHsl(baseColor);

  // Generate different variations
  const generateShades = () => {
    const shades = [];
    for (let i = 10; i <= 90; i += 10) {
      shades.push(hslToHex(baseHsl.h, baseHsl.s, i));
    }
    return shades;
  };

  const generateTints = () => {
    const tints = [];
    for (let i = 10; i <= 90; i += 10) {
      tints.push(hslToHex(baseHsl.h, i, baseHsl.l));
    }
    return tints;
  };

  const generateComplementary = () => {
    const complementaryH = (baseHsl.h + 180) % 360;
    return [
      hslToHex(complementaryH, baseHsl.s, baseHsl.l),
      hslToHex(complementaryH, baseHsl.s * 0.8, baseHsl.l * 0.9),
      hslToHex(complementaryH, baseHsl.s * 1.2, baseHsl.l * 1.1),
    ];
  };

  const generateTriadic = () => {
    return [
      hslToHex((baseHsl.h + 120) % 360, baseHsl.s, baseHsl.l),
      hslToHex((baseHsl.h + 240) % 360, baseHsl.s, baseHsl.l),
    ];
  };

  const generateAnalogous = () => {
    return [
      hslToHex((baseHsl.h + 30) % 360, baseHsl.s, baseHsl.l),
      hslToHex((baseHsl.h - 30 + 360) % 360, baseHsl.s, baseHsl.l),
      hslToHex((baseHsl.h + 60) % 360, baseHsl.s, baseHsl.l),
      hslToHex((baseHsl.h - 60 + 360) % 360, baseHsl.s, baseHsl.l),
    ];
  };

  const palettes = [
    {
      name: "Shades",
      colors: generateShades().slice(0, 5),
      description: "Lighter to darker",
    },
    {
      name: "Saturation",
      colors: generateTints().slice(0, 5),
      description: "Different saturation levels",
    },
    {
      name: "Complementary",
      colors: generateComplementary(),
      description: "Opposite on color wheel",
    },
    { name: "Triadic", colors: generateTriadic(), description: "120° apart" },
    {
      name: "Analogous",
      colors: generateAnalogous(),
      description: "Adjacent colors",
    },
  ];

  return (
    <div className="space-y-6">
      {palettes.map((palette) => (
        <div key={palette.name} className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm">{palette.name}</h3>
              <p className="text-xs text-muted-foreground">
                {palette.description}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {palette.colors.length} colors
            </Badge>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {palette.colors.map((color, index) => (
              <div key={index} className="group">
                <div
                  className="w-full h-16 rounded-lg border border-border cursor-pointer transition-smooth hover:scale-105 hover:shadow-elevated"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color)}
                />
                <div className="mt-2 text-center">
                  <div className="text-xs font-mono text-muted-foreground">
                    {color.toUpperCase()}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-smooth mt-1"
                    onClick={() => copyToClipboard(color)}
                  >
                    {copiedColor === color ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
