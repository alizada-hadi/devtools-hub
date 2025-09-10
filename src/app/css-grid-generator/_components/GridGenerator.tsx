"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Download, Eye, Code, Grid3X3 } from "lucide-react";
import { GridConfigurator } from "./GridConfigurator";
import { GridPreview } from "./GridPreview";
import { GridCodeOutput } from "./GridCodeOutput";

export interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
  columnSizes: string[];
  rowSizes: string[];
  responsive: {
    sm: { columns: number; rows: number; gap: number };
    md: { columns: number; rows: number; gap: number };
    lg: { columns: number; rows: number; gap: number };
  };
  items: GridItem[];
}

export interface GridItem {
  id: string;
  content: string;
  colStart?: number;
  colEnd?: number;
  rowStart?: number;
  rowEnd?: number;
  background: string;
}

const defaultGridConfig: GridConfig = {
  columns: 3,
  rows: 3,
  gap: 4,
  columnSizes: ["1fr", "1fr", "1fr"],
  rowSizes: ["1fr", "1fr", "1fr"],
  responsive: {
    sm: { columns: 1, rows: 3, gap: 2 },
    md: { columns: 2, rows: 3, gap: 3 },
    lg: { columns: 3, rows: 3, gap: 4 },
  },
  items: [
    {
      id: "1",
      content: "Header",
      colStart: 1,
      colEnd: 4,
      rowStart: 1,
      rowEnd: 2,
      background: "bg-primary/20",
    },
    {
      id: "2",
      content: "Sidebar",
      colStart: 1,
      colEnd: 2,
      rowStart: 2,
      rowEnd: 3,
      background: "bg-secondary/20",
    },
    {
      id: "3",
      content: "Main Content",
      colStart: 2,
      colEnd: 4,
      rowStart: 2,
      rowEnd: 3,
      background: "bg-accent/20",
    },
    {
      id: "4",
      content: "Footer",
      colStart: 1,
      colEnd: 4,
      rowStart: 3,
      rowEnd: 4,
      background: "bg-muted/40",
    },
  ],
};

export default function CSSGridGenerator() {
  const [gridConfig, setGridConfig] = useState<GridConfig>(defaultGridConfig);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const updateGridConfig = (updates: Partial<GridConfig>) => {
    setGridConfig((prev) => ({ ...prev, ...updates }));
  };

  const addGridItem = () => {
    const newItem: GridItem = {
      id: `item_${Date.now()}`,
      content: `Item ${gridConfig.items.length + 1}`,
      background: "bg-primary/10",
    };
    setGridConfig((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setSelectedItem(newItem.id);
  };

  const updateGridItem = (id: string, updates: Partial<GridItem>) => {
    setGridConfig((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  const removeGridItem = (id: string) => {
    setGridConfig((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
    if (selectedItem === id) {
      setSelectedItem(null);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Grid Layout Generator
              </h1>
              <p className="text-muted-foreground">
                Create powerful CSS Grid layouts with Tailwind CSS classes
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Grid Configuration
                </CardTitle>
                <CardDescription>
                  Configure your grid layout and items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GridConfigurator
                  config={gridConfig}
                  selectedItem={selectedItem}
                  onConfigChange={updateGridConfig}
                  onItemSelect={setSelectedItem}
                  onItemUpdate={updateGridItem}
                  onItemAdd={addGridItem}
                  onItemRemove={removeGridItem}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview and Code */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  Interactive preview of your CSS Grid layout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GridPreview
                  config={gridConfig}
                  selectedItem={selectedItem}
                  onItemSelect={setSelectedItem}
                />
              </CardContent>
            </Card>

            {/* Code Output */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Generated Code
                </CardTitle>
                <CardDescription>
                  Copy the generated CSS and Tailwind classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tailwind" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="tailwind">Tailwind CSS</TabsTrigger>
                    <TabsTrigger value="css">Pure CSS</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tailwind">
                    <GridCodeOutput config={gridConfig} type="tailwind" />
                  </TabsContent>
                  <TabsContent value="css">
                    <GridCodeOutput config={gridConfig} type="css" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
