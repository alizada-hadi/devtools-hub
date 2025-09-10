import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Smartphone, Tablet, Monitor } from "lucide-react";
import { GridConfig, GridItem } from "./GridGenerator";
interface GridConfiguratorProps {
  config: GridConfig;
  selectedItem: string | null;
  onConfigChange: (updates: Partial<GridConfig>) => void;
  onItemSelect: (id: string | null) => void;
  onItemUpdate: (id: string, updates: Partial<GridItem>) => void;
  onItemAdd: () => void;
  onItemRemove: (id: string) => void;
}

const gridSizeOptions = [
  { value: "1fr", label: "1fr (Flexible)" },
  { value: "2fr", label: "2fr (2x Flexible)" },
  { value: "3fr", label: "3fr (3x Flexible)" },
  { value: "auto", label: "auto (Content)" },
  { value: "min-content", label: "min-content" },
  { value: "max-content", label: "max-content" },
  { value: "minmax(100px, 1fr)", label: "minmax(100px, 1fr)" },
  { value: "minmax(200px, 1fr)", label: "minmax(200px, 1fr)" },
  { value: "50px", label: "50px" },
  { value: "100px", label: "100px" },
  { value: "150px", label: "150px" },
  { value: "200px", label: "200px" },
  { value: "250px", label: "250px" },
  { value: "300px", label: "300px" },
  { value: "20%", label: "20%" },
  { value: "25%", label: "25%" },
  { value: "33.333%", label: "33.333%" },
  { value: "50%", label: "50%" },
  { value: "75%", label: "75%" },
  { value: "100%", label: "100%" },
  { value: "10rem", label: "10rem" },
  { value: "15rem", label: "15rem" },
  { value: "20rem", label: "20rem" },
];

const backgroundOptions = [
  {
    value: "bg-primary/10",
    label: "Primary Light",
    color: "hsl(var(--primary) / 0.1)",
  },
  {
    value: "bg-primary/20",
    label: "Primary",
    color: "hsl(var(--primary) / 0.2)",
  },
  {
    value: "bg-primary/30",
    label: "Primary Medium",
    color: "hsl(var(--primary) / 0.3)",
  },
  {
    value: "bg-secondary/20",
    label: "Secondary",
    color: "hsl(var(--secondary) / 0.2)",
  },
  {
    value: "bg-secondary/30",
    label: "Secondary Medium",
    color: "hsl(var(--secondary) / 0.3)",
  },
  { value: "bg-accent/20", label: "Accent", color: "hsl(var(--accent) / 0.2)" },
  {
    value: "bg-accent/30",
    label: "Accent Medium",
    color: "hsl(var(--accent) / 0.3)",
  },
  { value: "bg-muted/40", label: "Muted", color: "hsl(var(--muted) / 0.4)" },
  {
    value: "bg-muted/60",
    label: "Muted Medium",
    color: "hsl(var(--muted) / 0.6)",
  },
  {
    value: "bg-destructive/10",
    label: "Destructive Light",
    color: "hsl(var(--destructive) / 0.1)",
  },
  {
    value: "bg-destructive/20",
    label: "Destructive",
    color: "hsl(var(--destructive) / 0.2)",
  },
  { value: "bg-blue-500/20", label: "Blue", color: "rgb(59 130 246 / 0.2)" },
  { value: "bg-green-500/20", label: "Green", color: "rgb(34 197 94 / 0.2)" },
  { value: "bg-yellow-500/20", label: "Yellow", color: "rgb(234 179 8 / 0.2)" },
  { value: "bg-red-500/20", label: "Red", color: "rgb(239 68 68 / 0.2)" },
  {
    value: "bg-purple-500/20",
    label: "Purple",
    color: "rgb(168 85 247 / 0.2)",
  },
  { value: "bg-pink-500/20", label: "Pink", color: "rgb(236 72 153 / 0.2)" },
  {
    value: "bg-gradient-to-r from-primary/20 to-accent/20",
    label: "Gradient Primary",
    color:
      "linear-gradient(to right, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2))",
  },
  {
    value: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
    label: "Gradient Blue-Purple",
    color:
      "linear-gradient(to bottom right, rgb(59 130 246 / 0.2), rgb(168 85 247 / 0.2))",
  },
];

const layoutTemplates = [
  {
    name: "Holy Grail",
    description: "Header, sidebar, content, footer",
    config: {
      columns: 3,
      rows: 3,
      columnSizes: ["200px", "1fr", "200px"],
      rowSizes: ["auto", "1fr", "auto"],
      items: [
        {
          id: "header",
          content: "Header",
          colStart: 1,
          colEnd: 4,
          rowStart: 1,
          rowEnd: 2,
          background: "bg-primary/20",
        },
        {
          id: "sidebar",
          content: "Sidebar",
          colStart: 1,
          colEnd: 2,
          rowStart: 2,
          rowEnd: 3,
          background: "bg-secondary/20",
        },
        {
          id: "content",
          content: "Main Content",
          colStart: 2,
          colEnd: 3,
          rowStart: 2,
          rowEnd: 3,
          background: "bg-accent/20",
        },
        {
          id: "aside",
          content: "Aside",
          colStart: 3,
          colEnd: 4,
          rowStart: 2,
          rowEnd: 3,
          background: "bg-muted/40",
        },
        {
          id: "footer",
          content: "Footer",
          colStart: 1,
          colEnd: 4,
          rowStart: 3,
          rowEnd: 4,
          background: "bg-destructive/10",
        },
      ],
    },
  },
  {
    name: "Dashboard",
    description: "12-column dashboard layout",
    config: {
      columns: 12,
      rows: 4,
      columnSizes: Array(12).fill("1fr"),
      rowSizes: ["auto", "1fr", "1fr", "auto"],
      items: [
        {
          id: "nav",
          content: "Navigation",
          colStart: 1,
          colEnd: 13,
          rowStart: 1,
          rowEnd: 2,
          background: "bg-primary/20",
        },
        {
          id: "sidebar",
          content: "Sidebar",
          colStart: 1,
          colEnd: 3,
          rowStart: 2,
          rowEnd: 4,
          background: "bg-secondary/20",
        },
        {
          id: "main",
          content: "Main Dashboard",
          colStart: 3,
          colEnd: 10,
          rowStart: 2,
          rowEnd: 3,
          background: "bg-accent/20",
        },
        {
          id: "widget1",
          content: "Widget 1",
          colStart: 10,
          colEnd: 13,
          rowStart: 2,
          rowEnd: 3,
          background: "bg-blue-500/20",
        },
        {
          id: "content",
          content: "Content Area",
          colStart: 3,
          colEnd: 13,
          rowStart: 3,
          rowEnd: 4,
          background: "bg-muted/40",
        },
        {
          id: "footer",
          content: "Footer",
          colStart: 1,
          colEnd: 13,
          rowStart: 4,
          rowEnd: 5,
          background: "bg-destructive/10",
        },
      ],
    },
  },
  {
    name: "Magazine",
    description: "Magazine-style layout",
    config: {
      columns: 4,
      rows: 6,
      columnSizes: ["1fr", "1fr", "1fr", "1fr"],
      rowSizes: ["auto", "300px", "200px", "200px", "200px", "auto"],
      items: [
        {
          id: "header",
          content: "Header",
          colStart: 1,
          colEnd: 5,
          rowStart: 1,
          rowEnd: 2,
          background: "bg-primary/20",
        },
        {
          id: "hero",
          content: "Hero Article",
          colStart: 1,
          colEnd: 3,
          rowStart: 2,
          rowEnd: 4,
          background: "bg-accent/30",
        },
        {
          id: "featured1",
          content: "Featured 1",
          colStart: 3,
          colEnd: 4,
          rowStart: 2,
          rowEnd: 3,
          background: "bg-blue-500/20",
        },
        {
          id: "featured2",
          content: "Featured 2",
          colStart: 4,
          colEnd: 5,
          rowStart: 2,
          rowEnd: 3,
          background: "bg-green-500/20",
        },
        {
          id: "article1",
          content: "Article 1",
          colStart: 3,
          colEnd: 5,
          rowStart: 3,
          rowEnd: 4,
          background: "bg-yellow-500/20",
        },
        {
          id: "article2",
          content: "Article 2",
          colStart: 1,
          colEnd: 2,
          rowStart: 4,
          rowEnd: 6,
          background: "bg-purple-500/20",
        },
        {
          id: "article3",
          content: "Article 3",
          colStart: 2,
          colEnd: 3,
          rowStart: 4,
          rowEnd: 5,
          background: "bg-pink-500/20",
        },
        {
          id: "article4",
          content: "Article 4",
          colStart: 3,
          colEnd: 4,
          rowStart: 4,
          rowEnd: 5,
          background: "bg-red-500/20",
        },
        {
          id: "ads",
          content: "Advertisement",
          colStart: 4,
          colEnd: 5,
          rowStart: 4,
          rowEnd: 6,
          background: "bg-muted/60",
        },
        {
          id: "article5",
          content: "Article 5",
          colStart: 2,
          colEnd: 4,
          rowStart: 5,
          rowEnd: 6,
          background: "bg-secondary/30",
        },
        {
          id: "footer",
          content: "Footer",
          colStart: 1,
          colEnd: 5,
          rowStart: 6,
          rowEnd: 7,
          background: "bg-destructive/10",
        },
      ],
    },
  },
  {
    name: "Card Grid",
    description: "Responsive card layout",
    config: {
      columns: 4,
      rows: 3,
      columnSizes: ["1fr", "1fr", "1fr", "1fr"],
      rowSizes: ["auto", "1fr", "1fr"],
      items: [
        {
          id: "title",
          content: "Page Title",
          colStart: 1,
          colEnd: 5,
          rowStart: 1,
          rowEnd: 2,
          background: "bg-primary/20",
        },
        {
          id: "card1",
          content: "Card 1",
          colStart: 1,
          colEnd: 2,
          rowStart: 2,
          rowEnd: 3,
          background: "bg-blue-500/20",
        },
        {
          id: "card2",
          content: "Card 2",
          colStart: 2,
          colEnd: 3,
          rowStart: 2,
          rowEnd: 3,
          background: "bg-green-500/20",
        },
        {
          id: "card3",
          content: "Card 3",
          colStart: 3,
          colEnd: 4,
          rowStart: 2,
          rowEnd: 3,
          background: "bg-yellow-500/20",
        },
        {
          id: "card4",
          content: "Card 4",
          colStart: 4,
          colEnd: 5,
          rowStart: 2,
          rowEnd: 3,
          background: "bg-purple-500/20",
        },
        {
          id: "card5",
          content: "Card 5",
          colStart: 1,
          colEnd: 2,
          rowStart: 3,
          rowEnd: 4,
          background: "bg-pink-500/20",
        },
        {
          id: "card6",
          content: "Card 6",
          colStart: 2,
          colEnd: 3,
          rowStart: 3,
          rowEnd: 4,
          background: "bg-red-500/20",
        },
        {
          id: "card7",
          content: "Card 7",
          colStart: 3,
          colEnd: 4,
          rowStart: 3,
          rowEnd: 4,
          background: "bg-accent/30",
        },
        {
          id: "card8",
          content: "Card 8",
          colStart: 4,
          colEnd: 5,
          rowStart: 3,
          rowEnd: 4,
          background: "bg-secondary/30",
        },
      ],
    },
  },
];

export function GridConfigurator({
  config,
  selectedItem,
  onConfigChange,
  onItemSelect,
  onItemUpdate,
  onItemAdd,
  onItemRemove,
}: GridConfiguratorProps) {
  const [activeTab, setActiveTab] = useState("grid");

  const applyTemplate = (template: (typeof layoutTemplates)[0]) => {
    onConfigChange({
      columns: template.config.columns,
      rows: template.config.rows,
      columnSizes: template.config.columnSizes,
      rowSizes: template.config.rowSizes,
      items: template.config.items,
    });
    onItemSelect(null);
  };

  const updateColumns = (columns: number) => {
    const newColumnSizes = Array(columns).fill("1fr");
    onConfigChange({
      columns,
      columnSizes: newColumnSizes.map((_, i) => config.columnSizes[i] || "1fr"),
    });
  };

  const updateRows = (rows: number) => {
    const newRowSizes = Array(rows).fill("1fr");
    onConfigChange({
      rows,
      rowSizes: newRowSizes.map((_, i) => config.rowSizes[i] || "1fr"),
    });
  };

  const updateColumnSize = (index: number, size: string) => {
    const newColumnSizes = [...config.columnSizes];
    newColumnSizes[index] = size;
    onConfigChange({ columnSizes: newColumnSizes });
  };

  const updateRowSize = (index: number, size: string) => {
    const newRowSizes = [...config.rowSizes];
    newRowSizes[index] = size;
    onConfigChange({ rowSizes: newRowSizes });
  };

  const selectedItemData = selectedItem
    ? config.items.find((item: GridItem) => item.id === selectedItem)
    : null;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates" className="text-xs">
            Templates
          </TabsTrigger>
          <TabsTrigger value="grid" className="text-xs">
            Grid
          </TabsTrigger>
          <TabsTrigger value="items" className="text-xs">
            Items
          </TabsTrigger>
          <TabsTrigger value="responsive" className="text-xs">
            Responsive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Layout Templates</Label>
            <p className="text-xs text-muted-foreground">
              Start with a pre-built layout template
            </p>
            <div className="grid gap-3">
              {layoutTemplates.map((template) => (
                <Card
                  key={template.name}
                  className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => applyTemplate(template)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{template.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {template.config.columns}×{template.config.rows}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {template.description}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {template.config.items.slice(0, 5).map((item, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-sm ${item.background}`}
                        />
                      ))}
                      {template.config.items.length > 5 && (
                        <span className="text-xs text-muted-foreground">
                          +{template.config.items.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          {/* Grid Dimensions */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Grid Dimensions</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="columns"
                  className="text-xs text-muted-foreground"
                >
                  Columns
                </Label>
                <Select
                  value={config.columns.toString()}
                  onValueChange={(value) => updateColumns(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rows" className="text-xs text-muted-foreground">
                  Rows
                </Label>
                <Select
                  value={config.rows.toString()}
                  onValueChange={(value) => updateRows(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Gap */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Gap: {config.gap * 4}px
            </Label>
            <Slider
              value={[config.gap]}
              onValueChange={([value]) => onConfigChange({ gap: value })}
              max={16}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0px</span>
              <span>64px</span>
            </div>
          </div>

          <Separator />

          {/* Column Sizes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Column Sizes</Label>
            <div className="space-y-2">
              {config.columnSizes.map((size: string, index: number) => (
                <div key={`col-${index}`} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-8">
                    C{index + 1}
                  </span>
                  <Select
                    value={size}
                    onValueChange={(value) => updateColumnSize(index, value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gridSizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* Row Sizes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Row Sizes</Label>
            <div className="space-y-2">
              {config.rowSizes.map((size: string, index: number) => (
                <div key={`row-${index}`} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-8">
                    R{index + 1}
                  </span>
                  <Select
                    value={size}
                    onValueChange={(value) => updateRowSize(index, value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gridSizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          {/* Add Item Button */}
          <Button onClick={onItemAdd} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Grid Item
          </Button>

          {/* Item List */}
          <div className="space-y-2">
            {config.items.map((item: GridItem) => (
              <Card
                key={item.id}
                className={`p-3 cursor-pointer transition-colors ${
                  selectedItem === item.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onItemSelect(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${item.background}`} />
                    <span className="text-sm font-medium">{item.content}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemRemove(item.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                {(item.colStart || item.rowStart) && (
                  <div className="mt-2 flex gap-2">
                    {item.colStart && (
                      <Badge variant="secondary" className="text-xs">
                        Col: {item.colStart}-{item.colEnd || item.colStart + 1}
                      </Badge>
                    )}
                    {item.rowStart && (
                      <Badge variant="secondary" className="text-xs">
                        Row: {item.rowStart}-{item.rowEnd || item.rowStart + 1}
                      </Badge>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Selected Item Properties */}
          {selectedItemData && (
            <Card className="p-4">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-sm">Item Properties</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <div>
                  <Label
                    htmlFor="content"
                    className="text-xs text-muted-foreground"
                  >
                    Content
                  </Label>
                  <Input
                    id="content"
                    value={selectedItemData.content}
                    onChange={(e) =>
                      onItemUpdate(selectedItem!, { content: e.target.value })
                    }
                    placeholder="Item content..."
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">
                    Background
                  </Label>
                  <Select
                    value={selectedItemData.background}
                    onValueChange={(value) =>
                      onItemUpdate(selectedItem!, { background: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {backgroundOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded ${option.value}`}
                            />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label
                      htmlFor="colStart"
                      className="text-xs text-muted-foreground"
                    >
                      Col Start
                    </Label>
                    <Input
                      id="colStart"
                      type="number"
                      min="1"
                      max={config.columns}
                      value={selectedItemData.colStart || ""}
                      onChange={(e) =>
                        onItemUpdate(selectedItem!, {
                          colStart: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="colEnd"
                      className="text-xs text-muted-foreground"
                    >
                      Col End
                    </Label>
                    <Input
                      id="colEnd"
                      type="number"
                      min="1"
                      max={config.columns + 1}
                      value={selectedItemData.colEnd || ""}
                      onChange={(e) =>
                        onItemUpdate(selectedItem!, {
                          colEnd: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label
                      htmlFor="rowStart"
                      className="text-xs text-muted-foreground"
                    >
                      Row Start
                    </Label>
                    <Input
                      id="rowStart"
                      type="number"
                      min="1"
                      max={config.rows}
                      value={selectedItemData.rowStart || ""}
                      onChange={(e) =>
                        onItemUpdate(selectedItem!, {
                          rowStart: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="rowEnd"
                      className="text-xs text-muted-foreground"
                    >
                      Row End
                    </Label>
                    <Input
                      id="rowEnd"
                      type="number"
                      min="1"
                      max={config.rows + 1}
                      value={selectedItemData.rowEnd || ""}
                      onChange={(e) =>
                        onItemUpdate(selectedItem!, {
                          rowEnd: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="responsive" className="space-y-4">
          <div className="space-y-4">
            {/* Mobile */}
            <Card className="p-4">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile (sm)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label
                      htmlFor="sm-cols"
                      className="text-xs text-muted-foreground"
                    >
                      Columns
                    </Label>
                    <Select
                      value={config.responsive.sm.columns.toString()}
                      onValueChange={(value) =>
                        onConfigChange({
                          responsive: {
                            ...config.responsive,
                            sm: {
                              ...config.responsive.sm,
                              columns: parseInt(value),
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="sm-rows"
                      className="text-xs text-muted-foreground"
                    >
                      Rows
                    </Label>
                    <Select
                      value={config.responsive.sm.rows.toString()}
                      onValueChange={(value) =>
                        onConfigChange({
                          responsive: {
                            ...config.responsive,
                            sm: {
                              ...config.responsive.sm,
                              rows: parseInt(value),
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="sm-gap"
                      className="text-xs text-muted-foreground"
                    >
                      Gap
                    </Label>
                    <Select
                      value={config.responsive.sm.gap.toString()}
                      onValueChange={(value) =>
                        onConfigChange({
                          responsive: {
                            ...config.responsive,
                            sm: {
                              ...config.responsive.sm,
                              gap: parseInt(value),
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 6, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tablet */}
            <Card className="p-4">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Tablet className="h-4 w-4" />
                  Tablet (md)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label
                      htmlFor="md-cols"
                      className="text-xs text-muted-foreground"
                    >
                      Columns
                    </Label>
                    <Select
                      value={config.responsive.md.columns.toString()}
                      onValueChange={(value) =>
                        onConfigChange({
                          responsive: {
                            ...config.responsive,
                            md: {
                              ...config.responsive.md,
                              columns: parseInt(value),
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="md-rows"
                      className="text-xs text-muted-foreground"
                    >
                      Rows
                    </Label>
                    <Select
                      value={config.responsive.md.rows.toString()}
                      onValueChange={(value) =>
                        onConfigChange({
                          responsive: {
                            ...config.responsive,
                            md: {
                              ...config.responsive.md,
                              rows: parseInt(value),
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="md-gap"
                      className="text-xs text-muted-foreground"
                    >
                      Gap
                    </Label>
                    <Select
                      value={config.responsive.md.gap.toString()}
                      onValueChange={(value) =>
                        onConfigChange({
                          responsive: {
                            ...config.responsive,
                            md: {
                              ...config.responsive.md,
                              gap: parseInt(value),
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 6, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Desktop */}
            <Card className="p-4">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Desktop (lg)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label
                      htmlFor="lg-cols"
                      className="text-xs text-muted-foreground"
                    >
                      Columns
                    </Label>
                    <Select
                      value={config.responsive.lg.columns.toString()}
                      onValueChange={(value) =>
                        onConfigChange({
                          responsive: {
                            ...config.responsive,
                            lg: {
                              ...config.responsive.lg,
                              columns: parseInt(value),
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 8, 12].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="lg-rows"
                      className="text-xs text-muted-foreground"
                    >
                      Rows
                    </Label>
                    <Select
                      value={config.responsive.lg.rows.toString()}
                      onValueChange={(value) =>
                        onConfigChange({
                          responsive: {
                            ...config.responsive,
                            lg: {
                              ...config.responsive.lg,
                              rows: parseInt(value),
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="lg-gap"
                      className="text-xs text-muted-foreground"
                    >
                      Gap
                    </Label>
                    <Select
                      value={config.responsive.lg.gap.toString()}
                      onValueChange={(value) =>
                        onConfigChange({
                          responsive: {
                            ...config.responsive,
                            lg: {
                              ...config.responsive.lg,
                              gap: parseInt(value),
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 6, 8, 10, 12].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
