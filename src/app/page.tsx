"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Code2,
  Image,
  Type,
  Key,
  Palette,
  FileCode,
  Zap,
  Sparkles,
  TrendingUp,
  FormInputIcon,
} from "lucide-react";
import { useState } from "react";
import { ToolCard } from "@/components/tools-card";
import { SearchBar } from "@/components/search-bar";

const allTools = [
  {
    title: "Form Generator",
    description:
      "Create beautiful forms with validation. Generate React Hook Form + Zod code instantly.",
    icon: FormInputIcon,
    category: "Generators",
    url: "/form-generator",
    isPopular: true,
  },
  {
    title: "Favicon Generator",
    description:
      "Generate favicons in all required sizes and formats for your website",
    icon: Image,
    category: "Generators",
    url: "/favicon-generator",
    isPopular: true,
  },
  {
    title: "JWT Decoder",
    description:
      "Decode and verify JSON Web Tokens with detailed payload inspection",
    icon: Key,
    category: "Decoders",
    url: "/jwt-decoder",
    isPopular: true,
  },
  {
    title: "Font Converter",
    description:
      "Convert fonts between different formats like TTF, WOFF, WOFF2",
    icon: Type,
    category: "Converters",
    url: "/font-converter",
    isPopular: true,
  },
  {
    title: "PWA Icon Generator",
    description: "Generate all required icon sizes for Progressive Web Apps",
    icon: Zap,
    category: "Generators",
    url: "/pwa-icons",
  },
  {
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL, and other formats",
    icon: Palette,
    category: "Converters",
    url: "/color-converter",
  },
  {
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings with ease",
    icon: FileCode,
    category: "Encoders",
    url: "/base64-encoder",
  },
  {
    title: "QR Code Generator",
    description: "Generate customizable QR codes for URLs, text, and more",
    icon: Code2,
    category: "Generators",
    url: "/qr-generator",
  },
  {
    title: "URL Encoder/Decoder",
    description: "Encode and decode URLs for safe transmission",
    icon: FileCode,
    category: "Encoders",
    url: "/url-encoder",
  },
];
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = allTools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularTools = allTools.filter((tool) => tool.isPopular);

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            DevTools Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All your essential development tools in one place. Fast, reliable,
            and always free.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button size="lg">
            <Sparkles className="w-5 h-5" />
            Explore Tools
          </Button>
          <Button variant="outline" size="lg">
            <Code2 className="w-5 h-5" />
            View Source
          </Button>
        </div>
      </div>

      {/* Search Results or Tool Categories */}
      {searchQuery ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Search Results ({filteredTools.length})
            </h2>
            {filteredTools.length > 0 && (
              <Button variant="ghost" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>

          {filteredTools.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-secondary">
              <CardContent>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Code2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">No tools found</h3>
                  <p className="text-muted-foreground">
                    Try searching for something else or browse our categories
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setSearchQuery("")}
                  >
                    Browse All Tools
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.title}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  category={tool.category}
                  isPopular={tool.isPopular}
                  url={tool.url}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Popular Tools */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Popular Tools</h2>
              <Badge variant="secondary" className="ml-2">
                Most Used
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTools.map((tool) => (
                <ToolCard
                  key={tool.title}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  category={tool.category}
                  isPopular={tool.isPopular}
                  url={tool.url}
                />
              ))}
            </div>
          </div>

          {/* All Tools */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Code2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">All Tools</h2>
              <Badge variant="outline" className="ml-2">
                {allTools.length} Tools
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allTools.map((tool) => (
                <ToolCard
                  key={tool.title}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  category={tool.category}
                  isPopular={tool.isPopular}
                  url={tool.url}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
