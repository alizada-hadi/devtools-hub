/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { GridConfig, GridItem } from "./GridGenerator";
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone } from "lucide-react";

interface GridPreviewProps {
  config: GridConfig;
  selectedItem: string | null;
  onItemSelect: (id: string | null) => void;
}

type ViewportMode = "desktop" | "tablet" | "mobile";

export function GridPreview({
  config,
  selectedItem,
  onItemSelect,
}: GridPreviewProps) {
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const getGridStyle = (mode: ViewportMode = "desktop") => {
    let cols, rows, gap, minHeight, maxWidth;

    switch (mode) {
      case "mobile":
        cols = `repeat(${config.responsive.sm.columns}, 1fr)`;
        rows = `repeat(${config.responsive.sm.rows}, 80px)`;
        gap = `${config.responsive.sm.gap * 4}px`;
        minHeight = "200px";
        maxWidth = "375px";
        break;
      case "tablet":
        cols = `repeat(${config.responsive.md.columns}, 1fr)`;
        rows = `repeat(${config.responsive.md.rows}, 100px)`;
        gap = `${config.responsive.md.gap * 4}px`;
        minHeight = "250px";
        maxWidth = "768px";
        break;
      default:
        cols = config.columnSizes.join(" ");
        rows = config.rowSizes.join(" ");
        gap = `${config.gap * 4}px`;
        minHeight = "300px";
        maxWidth = "100%";
    }

    return {
      display: "grid",
      gridTemplateColumns: cols,
      gridTemplateRows: rows,
      gap,
      minHeight,
      maxWidth,
      margin: mode !== "desktop" ? "0 auto" : "0",
      border: "2px dashed hsl(var(--border))",
      borderRadius: "8px",
      padding: "16px",
      backgroundColor: "hsl(var(--muted) / 0.1)",
      transition: "all 0.3s ease",
    };
  };

  const getItemStyle = (item: any) => {
    const style: React.CSSProperties = {
      border: "1px solid hsl(var(--border))",
      borderRadius: "6px",
      padding: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "14px",
      fontWeight: "500",
      position: "relative",
    };

    if (item.colStart) {
      style.gridColumnStart = item.colStart;
    }
    if (item.colEnd) {
      style.gridColumnEnd = item.colEnd;
    }
    if (item.rowStart) {
      style.gridRowStart = item.rowStart;
    }
    if (item.rowEnd) {
      style.gridRowEnd = item.rowEnd;
    }

    // Apply background classes via className instead of style
    return style;
  };

  const getVisibleItems = (mode: ViewportMode) => {
    const maxItems =
      mode === "mobile"
        ? config.responsive.sm.columns * config.responsive.sm.rows
        : mode === "tablet"
        ? config.responsive.md.columns * config.responsive.md.rows
        : config.items.length;

    return config.items.slice(0, maxItems);
  };

  return (
    <div className="space-y-6">
      {/* Viewport Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Preview Mode:</span>
          <div className="flex rounded-lg border p-1">
            <Button
              variant={viewportMode === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewportMode("desktop")}
              className="h-7 px-2"
            >
              <Monitor className="h-3 w-3 mr-1" />
              Desktop
            </Button>
            <Button
              variant={viewportMode === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewportMode("tablet")}
              className="h-7 px-2"
            >
              <Tablet className="h-3 w-3 mr-1" />
              Tablet
            </Button>
            <Button
              variant={viewportMode === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewportMode("mobile")}
              className="h-7 px-2"
            >
              <Smartphone className="h-3 w-3 mr-1" />
              Mobile
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {viewportMode === "desktop" &&
            `${config.columns}×${config.rows} grid`}
          {viewportMode === "tablet" &&
            `${config.responsive.md.columns}×${config.responsive.md.rows} grid`}
          {viewportMode === "mobile" &&
            `${config.responsive.sm.columns}×${config.responsive.sm.rows} grid`}
        </div>
      </div>

      {/* Main Grid Preview */}
      <div className="relative">
        <div style={getGridStyle(viewportMode)}>
          {getVisibleItems(viewportMode).map((item: GridItem) => (
            <div
              key={item.id}
              className={`
                ${item.background}
                ${
                  selectedItem === item.id
                    ? "ring-2 ring-primary ring-offset-2 scale-105"
                    : "hover:scale-[1.02] hover:shadow-md"
                }
              `}
              style={
                viewportMode === "desktop"
                  ? getItemStyle(item)
                  : {
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontSize: "12px",
                      fontWeight: "500",
                      position: "relative",
                    }
              }
              onClick={() =>
                onItemSelect(selectedItem === item.id ? null : item.id)
              }
            >
              {item.content}
              {selectedItem === item.id && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-background rounded-full"></div>
                </div>
              )}
            </div>
          ))}

          {/* Empty grid cells for visual reference - only for desktop */}
          {viewportMode === "desktop" &&
            Array.from({
              length: Math.max(
                0,
                config.columns * config.rows - config.items.length
              ),
            }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="border border-dashed border-muted-foreground/20 rounded-md bg-muted/5 flex items-center justify-center text-xs text-muted-foreground/50"
              >
                Empty
              </div>
            ))}
        </div>

        {/* Viewport indicator */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs text-muted-foreground border">
          {viewportMode === "desktop" && "> 1024px"}
          {viewportMode === "tablet" && "768px - 1024px"}
          {viewportMode === "mobile" && "< 768px"}
        </div>
      </div>

      {/* Grid Guidelines */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          Grid Structure
        </h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-medium">Columns:</span>
            <div className="mt-1 space-y-1">
              {config.columnSizes.map((size: string, index: number) => (
                <div
                  key={index}
                  className="flex justify-between bg-muted/20 p-1 rounded"
                >
                  <span>{index + 1}</span>
                  <span className="text-muted-foreground">{size}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="font-medium">Rows:</span>
            <div className="mt-1 space-y-1">
              {config.rowSizes.map((size: string, index: number) => (
                <div
                  key={index}
                  className="flex justify-between bg-muted/20 p-1 rounded"
                >
                  <span>{index + 1}</span>
                  <span className="text-muted-foreground">{size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Viewport Previews - only show when desktop mode is active */}
      {viewportMode === "desktop" && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            All Responsive Breakpoints
          </h4>

          <div className="grid gap-4">
            {/* Desktop Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">
                  Desktop (lg: 1024px+)
                </span>
                <span className="text-xs text-muted-foreground">
                  - Current main view
                </span>
              </div>
            </div>

            {/* Tablet Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tablet className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Tablet (md: 768px+)</span>
              </div>
              <div
                className="border-2 border-dashed border-green-200 rounded-lg p-3 bg-green-50/20 max-w-md"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${config.responsive.md.columns}, 1fr)`,
                  gridTemplateRows: `repeat(${config.responsive.md.rows}, 60px)`,
                  gap: `${config.responsive.md.gap * 4}px`,
                }}
              >
                {config.items
                  .slice(
                    0,
                    config.responsive.md.columns * config.responsive.md.rows
                  )
                  .map((item: GridItem) => (
                    <div
                      key={`md-${item.id}`}
                      className={`${item.background} border border-border rounded text-xs p-2 flex items-center justify-center font-medium`}
                    >
                      {item.content}
                    </div>
                  ))}
              </div>
            </div>

            {/* Mobile Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Mobile (sm: 640px+)</span>
              </div>
              <div
                className="border-2 border-dashed border-orange-200 rounded-lg p-3 bg-orange-50/20 max-w-sm"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${config.responsive.sm.columns}, 1fr)`,
                  gridTemplateRows: `repeat(${config.responsive.sm.rows}, 70px)`,
                  gap: `${config.responsive.sm.gap * 4}px`,
                }}
              >
                {config.items
                  .slice(
                    0,
                    config.responsive.sm.columns * config.responsive.sm.rows
                  )
                  .map((item: GridItem) => (
                    <div
                      key={`sm-${item.id}`}
                      className={`${item.background} border border-border rounded text-xs p-2 flex items-center justify-center font-medium`}
                    >
                      {item.content}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
