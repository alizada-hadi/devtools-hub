import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, RefreshCw } from "lucide-react";
import { PWAConfig } from "./PWAGenerator";

interface ThemeCustomizerProps {
  config: PWAConfig;
  onUpdate: (updates: Partial<PWAConfig>) => void;
}

const PRESET_THEMES = [
  { name: "Blue Ocean", theme: "#0066CC", background: "#F0F8FF" },
  { name: "Forest Green", theme: "#228B22", background: "#F0FFF0" },
  { name: "Sunset Orange", theme: "#FF6347", background: "#FFF8DC" },
  { name: "Purple Galaxy", theme: "#6A0DAD", background: "#F8F0FF" },
  { name: "Pink Blossom", theme: "#FF69B4", background: "#FFF0F5" },
  { name: "Dark Mode", theme: "#FFFFFF", background: "#1A1A1A" },
  { name: "Minimal Gray", theme: "#4A4A4A", background: "#FAFAFA" },
  { name: "Crimson Red", theme: "#DC143C", background: "#FFF5F5" },
];

export function ThemeCustomizer({ config, onUpdate }: ThemeCustomizerProps) {
  const applyPreset = (theme: string, background: string) => {
    onUpdate({ themeColor: theme, backgroundColor: background });
  };

  const generateRandomTheme = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 40) + 60; // 60-100%
    const lightness = Math.floor(Math.random() * 30) + 40; // 40-70%

    const themeColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const backgroundColor = `hsl(${hue}, ${Math.floor(
      saturation * 0.3
    )}%, 95%)`;

    onUpdate({ themeColor, backgroundColor });
  };

  return (
    <div className="space-y-6">
      {/* Color Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="themeColor">Theme Color</Label>
          <div className="flex gap-3">
            <div className="relative">
              <Input
                id="themeColor"
                type="color"
                value={config.themeColor}
                onChange={(e) => onUpdate({ themeColor: e.target.value })}
                className="w-16 h-10 p-1 cursor-pointer"
              />
            </div>
            <Input
              type="text"
              value={config.themeColor}
              onChange={(e) => onUpdate({ themeColor: e.target.value })}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Primary color for your app&apos;s UI elements and browser chrome
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="backgroundColor">Background Color</Label>
          <div className="flex gap-3">
            <div className="relative">
              <Input
                id="backgroundColor"
                type="color"
                value={config.backgroundColor}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="w-16 h-10 p-1 cursor-pointer"
              />
            </div>
            <Input
              type="text"
              value={config.backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Background color shown while your app loads
          </p>
        </div>
      </div>

      {/* Color Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Color Preview</CardTitle>
          <CardDescription>
            See how your colors will look together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Theme Color Preview */}
            <div className="space-y-2">
              <Label className="text-sm">Theme Color</Label>
              <div
                className="h-20 rounded-lg border flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: config.themeColor }}
              >
                {config.themeColor}
              </div>
            </div>

            {/* Background Color Preview */}
            <div className="space-y-2">
              <Label className="text-sm">Background Color</Label>
              <div
                className="h-20 rounded-lg border flex items-center justify-center font-medium"
                style={{
                  backgroundColor: config.backgroundColor,
                  color: config.themeColor,
                }}
              >
                {config.backgroundColor}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preset Themes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme Presets
              </CardTitle>
              <CardDescription>
                Choose from popular color combinations
              </CardDescription>
            </div>
            <Button onClick={generateRandomTheme} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Random
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PRESET_THEMES.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                className="h-auto p-3 flex flex-col items-center gap-2"
                onClick={() => applyPreset(preset.theme, preset.background)}
              >
                <div className="flex gap-1">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: preset.theme }}
                  />
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: preset.background }}
                  />
                </div>
                <span className="text-xs font-medium">{preset.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Design Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p>
                <strong>Theme Color:</strong> Should be your brand&apos;s
                primary color and provide good contrast against white text
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p>
                <strong>Background Color:</strong> Usually light colors work
                best for splash screens and loading states
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p>
                <strong>Accessibility:</strong> Ensure sufficient contrast ratio
                (4.5:1) between text and background colors
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
