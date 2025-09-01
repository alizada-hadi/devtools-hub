/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { PWAConfig } from "./PWAGenerator";

interface AppDetailsFormProps {
  config: PWAConfig;
  onUpdate: (updates: Partial<PWAConfig>) => void;
}

const PWA_CATEGORIES = [
  "books",
  "business",
  "education",
  "entertainment",
  "finance",
  "fitness",
  "food",
  "games",
  "government",
  "health",
  "kids",
  "lifestyle",
  "magazines",
  "medical",
  "music",
  "navigation",
  "news",
  "personalization",
  "photo",
  "politics",
  "productivity",
  "security",
  "shopping",
  "social",
  "sports",
  "travel",
  "utilities",
  "weather",
];

export function AppDetailsForm({ config, onUpdate }: AppDetailsFormProps) {
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (newCategory && !config.categories.includes(newCategory)) {
      onUpdate({ categories: [...config.categories, newCategory] });
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    onUpdate({
      categories: config.categories.filter((c: any) => c !== category),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">App Name *</Label>
          <Input
            id="name"
            placeholder="My Awesome App"
            value={config.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortName">Short Name *</Label>
          <Input
            id="shortName"
            placeholder="MyApp"
            maxLength={12}
            value={config.shortName}
            onChange={(e) => onUpdate({ shortName: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Used when space is limited (max 12 chars)
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe what your app does and its key features..."
          value={config.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startUrl">Start URL</Label>
          <Input
            id="startUrl"
            placeholder="/"
            value={config.startUrl}
            onChange={(e) => onUpdate({ startUrl: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="display">Display Mode</Label>
          <Select
            value={config.display}
            onValueChange={(value) => onUpdate({ display: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standalone">Standalone</SelectItem>
              <SelectItem value="fullscreen">Fullscreen</SelectItem>
              <SelectItem value="minimal-ui">Minimal UI</SelectItem>
              <SelectItem value="browser">Browser</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="orientation">Screen Orientation</Label>
        <Select
          value={config.orientation}
          onValueChange={(value) => onUpdate({ orientation: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="portrait">Portrait</SelectItem>
            <SelectItem value="landscape">Landscape</SelectItem>
            <SelectItem value="portrait-primary">Portrait Primary</SelectItem>
            <SelectItem value="landscape-primary">Landscape Primary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Categories</Label>
        <div className="flex gap-2">
          <Select value={newCategory} onValueChange={setNewCategory}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {PWA_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addCategory} size="sm" disabled={!newCategory}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {config.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {config.categories.map((category: any) => (
              <Badge
                key={category}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {category}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeCategory(category)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
