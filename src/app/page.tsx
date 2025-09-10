"use client";

import { useState } from "react";

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
  Clock,
  QrCode,
  FileText,
  Database,
  Hash,
  Globe,
  Scissors,
  Shield,
  Eye,
  ArrowRight,
  Gauge,
} from "lucide-react";

import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { useRouter } from "next/navigation";
import { ToolCard } from "@/components/tools-card";

const allTools = [
  // Generators
  {
    title: "Favicon Generator",
    description:
      "Generate favicons in all required sizes and formats for your website",
    icon: Image,
    category: "Generators",
    url: "/favicon-generator",
    isPopular: true,
    isImplemented: true,
  },
  {
    title: "PWA Generator",
    description: "Generate all required files for Progressive Web Apps",
    icon: Zap,
    category: "Generators",
    url: "/pwa-generator",
    isPopular: true,
    isImplemented: true,
  },
  {
    title: "QR Code Generator",
    description: "Generate customizable QR codes for URLs, text, and more",
    icon: QrCode,
    category: "Generators",
    url: "/qr-generator",
    isImplemented: true,
  },
  {
    title: "Form Generator",
    description:
      "Generate React forms with validation using React Hook Form and Zod",
    icon: FileText,
    category: "Generators",
    url: "/form-generator",
    isPopular: true,
    isImplemented: true,
  },
  {
    title: "UUID Generator",
    description: "Generate unique identifiers in various formats",
    icon: Hash,
    category: "Generators",
    url: "/uuid-generator",
    isImplemented: false,
  },
  {
    title: "Password Generator",
    description: "Generate secure passwords with customizable options",
    icon: Shield,
    category: "Generators",
    url: "/password-generator",
    isImplemented: false,
  },
  {
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text for your designs and mockups",
    icon: FileText,
    category: "Generators",
    url: "/lorem-generator",
    isImplemented: false,
  },
  {
    title: "Grid Layout Generator",
    description: "Generate CSS Grid layouts with visual interface",
    icon: Code2,
    category: "Generators",
    url: "/css-grid-generator",
    isImplemented: true,
  },

  // Converters
  {
    title: "Font Converter",
    description:
      "Convert fonts between different formats like TTF, WOFF, WOFF2",
    icon: Type,
    category: "Converters",
    url: "/font-converter",
    isPopular: true,
    isImplemented: true,
  },
  {
    title: "Image Converter",
    description:
      "Convert images between PNG, JPG, WebP, GIF and optimize file sizes",
    icon: Image,
    category: "Converters",
    url: "/image-converter",
    isPopular: true,
    isImplemented: true,
  },
  {
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL, and other formats",
    icon: Palette,
    category: "Converters",
    url: "/color-converter",
    isImplemented: true,
  },
  {
    title: "Background Remover",
    description: "Remove backgrounds from images using AI",
    icon: Scissors,
    category: "Converters",
    url: "/background-remover",
    isImplemented: true,
  },
  {
    title: "JSON to CSV",
    description: "Convert JSON data to CSV format for spreadsheet use",
    icon: Database,
    category: "Converters",
    url: "/json-csv-converter",
    isImplemented: false,
  },
  {
    title: "XML to JSON",
    description: "Convert XML documents to JSON format",
    icon: FileCode,
    category: "Converters",
    url: "/xml-json-converter",
    isImplemented: false,
  },

  // Decoders & Encoders
  {
    title: "JWT Decoder",
    description:
      "Decode and verify JSON Web Tokens with detailed payload inspection",
    icon: Key,
    category: "Decoders",
    url: "/jwt-decoder",
    isPopular: true,
    isImplemented: true,
  },
  {
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings with ease",
    icon: FileCode,
    category: "Decoders",
    url: "/base64-encoder",
    isImplemented: true,
  },
  {
    title: "URL Encoder/Decoder",
    description: "Encode and decode URLs for safe transmission",
    icon: Globe,
    category: "Decoders",
    url: "/url-encoder",
    isImplemented: true,
  },
  {
    title: "Hash Generator",
    description: "Generate MD5, SHA1, SHA256 and other hash values",
    icon: Hash,
    category: "Decoders",
    url: "/hash-generator",
    isImplemented: false,
  },

  // Formatters
  {
    title: "JSON Formatter",
    description: "Format, validate and beautify JSON data",
    icon: FileCode,
    category: "Formatters",
    url: "/json-formatter",
    isPopular: true,
    isImplemented: false,
  },
  {
    title: "CSS Formatter",
    description: "Format and beautify CSS code with proper indentation",
    icon: Code2,
    category: "Formatters",
    url: "/css-formatter",
    isImplemented: false,
  },
  {
    title: "HTML Formatter",
    description: "Format and beautify HTML code with proper structure",
    icon: Code2,
    category: "Formatters",
    url: "/html-formatter",
    isImplemented: false,
  },
  {
    title: "SQL Formatter",
    description: "Format and beautify SQL queries for better readability",
    icon: Database,
    category: "Formatters",
    url: "/sql-formatter",
    isImplemented: false,
  },
  {
    title: "YAML Formatter",
    description: "Format and validate YAML configuration files",
    icon: FileCode,
    category: "Formatters",
    url: "/yaml-formatter",
    isImplemented: false,
  },

  // API & Testing
  {
    title: "API Tester",
    description: "Test REST APIs with custom headers and request bodies",
    icon: Globe,
    category: "API Tools",
    url: "/api-tester",
    isPopular: true,
    isImplemented: false,
  },
  {
    title: "RegEx Tester",
    description: "Test and debug regular expressions with live matching",
    icon: Eye,
    category: "API Tools",
    url: "/regex-tester",
    isImplemented: false,
  },
  {
    title: "Cron Expression Builder",
    description: "Build and validate cron expressions for scheduled tasks",
    icon: Clock,
    category: "API Tools",
    url: "/cron-builder",
    isImplemented: false,
  },

  // Analytics & Performance
  {
    title: "SEO Analyzer",
    description: "Analyze web pages for SEO optimization opportunities",
    icon: TrendingUp,
    category: "Analytics",
    url: "/seo-analyzer",
    isImplemented: false,
  },
  {
    title: "Website Speed Test",
    description: "Test website loading speed and performance metrics",
    icon: Gauge,
    category: "Analytics",
    url: "/speed-test",
    isImplemented: false,
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // const router = useRouter();

  const filteredTools = allTools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularTools = allTools.filter((tool) => tool.isPopular);
  const implementedTools = allTools.filter((tool) => tool.isImplemented);
  const comingSoonTools = allTools.filter((tool) => !tool.isImplemented);

  const categories = [...new Set(allTools.map((tool) => tool.category))];
  const toolsByCategory = categories.map((category) => ({
    name: category,
    tools: allTools.filter((tool) => tool.category === category),
    count: allTools.filter((tool) => tool.category === category).length,
  }));

  return (
    <>
      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DevTools Kits
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your complete developer toolkit. Over {allTools.length} essential
              tools for modern development.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={setSearchQuery} />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {implementedTools.length}
              </div>
              <div className="text-sm text-muted-foreground">Available Now</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {categories.length}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {comingSoonTools.length}
              </div>
              <div className="text-sm text-muted-foreground">Coming Soon</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() =>
                document
                  .getElementById("tools")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
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
                    href={tool.url}
                    isImplemented={tool.isImplemented}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12" id="tools">
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
                    href={tool.url}
                    isImplemented={tool.isImplemented}
                  />
                ))}
              </div>
            </div>

            {/* Tools by Category */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <Code2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Browse by Category</h2>
              </div>

              {toolsByCategory.map((category) => (
                <div key={category.name} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <Badge variant="outline">
                        {category.count}{" "}
                        {category.count === 1 ? "Tool" : "Tools"}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {category.tools.map((tool) => (
                      <ToolCard
                        key={tool.title}
                        title={tool.title}
                        description={tool.description}
                        icon={tool.icon}
                        category={tool.category}
                        isPopular={tool.isPopular}
                        href={tool.url}
                        isImplemented={tool.isImplemented}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Coming Soon Section */}
            {comingSoonTools.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Coming Soon</h2>
                  <Badge variant="secondary" className="ml-2">
                    {comingSoonTools.length} More Tools
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {comingSoonTools.slice(0, 8).map((tool) => (
                    <ToolCard
                      key={tool.title}
                      title={tool.title}
                      description={tool.description}
                      icon={tool.icon}
                      category={tool.category}
                      isPopular={tool.isPopular}
                      href={tool.url}
                      isImplemented={tool.isImplemented}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
