import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";
import { GridConfig, GridItem } from "./GridGenerator";
import { toast } from "sonner";

interface GridCodeOutputProps {
  config: GridConfig;
  type: "tailwind" | "css";
}

export function GridCodeOutput({ config, type }: GridCodeOutputProps) {
  const [copied, setCopied] = useState(false);

  const generateTailwindCode = () => {
    const gapClass = `gap-${config.gap}`;
    const colsClass = `grid-cols-${config.columns}`;
    const rowsClass = `grid-rows-${config.rows}`;

    // Responsive classes
    const smColsClass = `sm:grid-cols-${config.responsive.sm.columns}`;
    const mdColsClass = `md:grid-cols-${config.responsive.md.columns}`;
    const lgColsClass = `lg:grid-cols-${config.columns}`;

    const smGapClass = `sm:gap-${config.responsive.sm.gap}`;
    const mdGapClass = `md:gap-${config.responsive.md.gap}`;
    const lgGapClass = `lg:gap-${config.gap}`;

    const containerCode = `<div class="grid ${colsClass} ${rowsClass} ${gapClass} ${smColsClass} ${smGapClass} ${mdColsClass} ${mdGapClass} ${lgColsClass} ${lgGapClass}">`;

    const itemsCode = config.items
      .map((item: GridItem) => {
        const classes = [];

        if (item.colStart && item.colEnd) {
          const colSpan = item.colEnd - item.colStart;
          if (colSpan > 1) {
            classes.push(`col-span-${colSpan}`);
          }
          classes.push(`col-start-${item.colStart}`);
        }

        if (item.rowStart && item.rowEnd) {
          const rowSpan = item.rowEnd - item.rowStart;
          if (rowSpan > 1) {
            classes.push(`row-span-${rowSpan}`);
          }
          classes.push(`row-start-${item.rowStart}`);
        }

        classes.push(item.background);
        classes.push("p-4 rounded-lg border");

        return `  <div class="${classes.join(" ")}">\n    ${
          item.content
        }\n  </div>`;
      })
      .join("\n");

    return `${containerCode}\n${itemsCode}\n</div>`;
  };

  const generateCSSCode = () => {
    const containerCSS = `.grid-container {
  display: grid;
  grid-template-columns: ${config.columnSizes.join(" ")};
  grid-template-rows: ${config.rowSizes.join(" ")};
  gap: ${config.gap * 4}px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(${config.responsive.sm.columns}, 1fr);
    grid-template-rows: repeat(${config.responsive.sm.rows}, 1fr);
    gap: ${config.responsive.sm.gap * 4}px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(${config.responsive.md.columns}, 1fr);
    grid-template-rows: repeat(${config.responsive.md.rows}, 1fr);
    gap: ${config.responsive.md.gap * 4}px;
  }
}`;

    const itemsCSS = config.items
      .map((item: GridItem, index: number) => {
        let css = `.grid-item-${index + 1} {`;

        if (item.colStart) css += `\n  grid-column-start: ${item.colStart};`;
        if (item.colEnd) css += `\n  grid-column-end: ${item.colEnd};`;
        if (item.rowStart) css += `\n  grid-row-start: ${item.rowStart};`;
        if (item.rowEnd) css += `\n  grid-row-end: ${item.rowEnd};`;

        css += `\n  padding: 1rem;`;
        css += `\n  border-radius: 0.5rem;`;
        css += `\n  border: 1px solid hsl(var(--border));`;

        // Convert Tailwind background classes to CSS
        const bgColor = item.background.includes("primary")
          ? "hsl(var(--primary) / 0.1)"
          : item.background.includes("secondary")
          ? "hsl(var(--secondary) / 0.2)"
          : item.background.includes("accent")
          ? "hsl(var(--accent) / 0.2)"
          : item.background.includes("muted")
          ? "hsl(var(--muted) / 0.4)"
          : item.background.includes("destructive")
          ? "hsl(var(--destructive) / 0.1)"
          : "hsl(var(--background))";

        css += `\n  background-color: ${bgColor};`;
        css += `\n}`;

        return css;
      })
      .join("\n\n");

    const htmlCode = `<div class="grid-container">
${config.items
  .map(
    (item: GridItem, index: number) =>
      `  <div class="grid-item-${index + 1}">${item.content}</div>`
  )
  .join("\n")}
</div>`;

    return `/* CSS Grid Styles */\n${containerCSS}\n\n${itemsCSS}\n\n/* HTML Structure */\n/*\n${htmlCode}\n*/`;
  };

  const code = type === "tailwind" ? generateTailwindCode() : generateCSSCode();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast("Copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast("Failed to copy code to clipboard.");
    }
  };

  const downloadCode = () => {
    const filename =
      type === "tailwind" ? "grid-layout.html" : "grid-layout.css";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast("Downloaded!");
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {type === "tailwind"
            ? "Ready-to-use Tailwind CSS classes"
            : "Complete CSS with responsive design"}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCode}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Code Display */}
      <div className="relative">
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-96 border">
          <code className="text-foreground">{code}</code>
        </pre>
      </div>
    </div>
  );
}
