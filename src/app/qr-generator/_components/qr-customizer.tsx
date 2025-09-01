import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { QRData } from "./QRGenerator";

interface QRCustomizerProps {
  qrData: QRData;
  setQRData: (data: QRData) => void;
}

export function QRCustomizer({ qrData, setQRData }: QRCustomizerProps) {
  const updateQRData = (updates: Partial<QRData>) => {
    setQRData({ ...qrData, ...updates });
  };

  const errorCorrectionLevels = [
    {
      value: "L",
      label: "Low (~7%)",
      description: "Best for clean environments",
    },
    {
      value: "M",
      label: "Medium (~15%)",
      description: "Recommended for most uses",
    },
    {
      value: "Q",
      label: "Quartile (~25%)",
      description: "Good for damaged surfaces",
    },
    {
      value: "H",
      label: "High (~30%)",
      description: "Best for harsh conditions",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Size */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Size: {qrData.size}×{qrData.size} pixels
        </Label>
        <Slider
          value={[qrData.size]}
          onValueChange={([value]) => updateQRData({ size: value })}
          min={128}
          max={512}
          step={32}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>128px</span>
          <span>512px</span>
        </div>
      </div>

      {/* Error Correction Level */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Error Correction Level
        </Label>
        <Select
          value={qrData.errorCorrectionLevel}
          onValueChange={(value: QRData["errorCorrectionLevel"]) =>
            updateQRData({ errorCorrectionLevel: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {errorCorrectionLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                <div>
                  <div className="font-medium">{level.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {level.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">
          Higher levels can recover from more damage but create denser codes
        </p>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Foreground Color
          </Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={qrData.foregroundColor}
              onChange={(e) =>
                updateQRData({ foregroundColor: e.target.value })
              }
              className="w-12 h-10 rounded-md border border-border cursor-pointer"
            />
            <div className="flex-1">
              <div className="text-xs font-medium text-muted-foreground">
                Dark areas
              </div>
              <div className="text-xs font-mono">{qrData.foregroundColor}</div>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            Background Color
          </Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={qrData.backgroundColor}
              onChange={(e) =>
                updateQRData({ backgroundColor: e.target.value })
              }
              className="w-12 h-10 rounded-md border border-border cursor-pointer"
            />
            <div className="flex-1">
              <div className="text-xs font-medium text-muted-foreground">
                Light areas
              </div>
              <div className="text-xs font-mono">{qrData.backgroundColor}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Color Presets */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Quick Presets</Label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { name: "Classic", fg: "#000000", bg: "#ffffff" },
            { name: "Inverted", fg: "#ffffff", bg: "#000000" },
            { name: "Blue", fg: "#1e40af", bg: "#dbeafe" },
            { name: "Green", fg: "#166534", bg: "#dcfce7" },
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() =>
                updateQRData({
                  foregroundColor: preset.fg,
                  backgroundColor: preset.bg,
                })
              }
              className="p-2 rounded-md border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="text-xs font-medium mb-1">{preset.name}</div>
              <div className="flex gap-1">
                <div
                  className="w-3 h-3 rounded-sm border border-border/50"
                  style={{ backgroundColor: preset.fg }}
                />
                <div
                  className="w-3 h-3 rounded-sm border border-border/50"
                  style={{ backgroundColor: preset.bg }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
