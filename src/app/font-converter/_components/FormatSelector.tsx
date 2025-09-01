import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormatSelectorProps {
  selectedFormats: string[];
  onFormatChange: (formats: string[]) => void;
  onConvert: () => void;
  isConverting: boolean;
  hasFile: boolean;
}

const formats = [
  {
    value: "ttf",
    label: "TTF",
    description: "TrueType Font",
    recommended: false,
  },
  {
    value: "woff",
    label: "WOFF",
    description: "Web Open Font Format",
    recommended: true,
  },
  {
    value: "woff2",
    label: "WOFF2",
    description: "Better compression",
    recommended: true,
  },
  {
    value: "eot",
    label: "EOT",
    description: "Internet Explorer support",
    recommended: false,
  },
  {
    value: "svg",
    label: "SVG",
    description: "Scalable Vector Graphics",
    recommended: false,
  },
];

export function FormatSelector({
  selectedFormats,
  onFormatChange,
  onConvert,
  isConverting,
  hasFile,
}: FormatSelectorProps) {
  const handleFormatToggle = (format: string) => {
    if (selectedFormats.includes(format)) {
      onFormatChange(selectedFormats.filter((f) => f !== format));
    } else {
      onFormatChange([...selectedFormats, format]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {formats.map((format) => (
          <div key={format.value} className="space-y-2">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={format.value}
                checked={selectedFormats.includes(format.value)}
                onCheckedChange={() => handleFormatToggle(format.value)}
                disabled={!hasFile}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={format.value}
                    className={cn(
                      "text-sm font-medium cursor-pointer",
                      !hasFile && "text-muted-foreground"
                    )}
                  >
                    {format.label}
                  </label>
                  {format.recommended && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "text-xs",
                    !hasFile
                      ? "text-muted-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {format.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <Button
          onClick={onConvert}
          disabled={!hasFile || selectedFormats.length === 0 || isConverting}
          className="w-full"
          size="lg"
        >
          {isConverting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4 mr-2" />
              Convert Font
            </>
          )}
        </Button>

        {selectedFormats.length === 0 && hasFile && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Select at least one output format
          </p>
        )}
      </div>
    </div>
  );
}
