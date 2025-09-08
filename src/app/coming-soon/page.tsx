"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  Bell,
  Heart,
  Code2,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Tool data for coming soon tools
const comingSoonTools: Record<
  string,
  {
    title: string;
    description: string;
    category: string;
    estimatedDate: string;
    features: string[];
  }
> = {
  "uuid-generator": {
    title: "UUID Generator",
    description:
      "Generate unique identifiers in various formats including UUID v1, v4, and more",
    category: "Generators",
    estimatedDate: "January 2025",
    features: [
      "Multiple UUID versions",
      "Bulk generation",
      "Custom formats",
      "Copy to clipboard",
    ],
  },
  "password-generator": {
    title: "Password Generator",
    description:
      "Generate secure passwords with customizable complexity and options",
    category: "Generators",
    estimatedDate: "January 2025",
    features: [
      "Custom length",
      "Character sets",
      "Strength meter",
      "Bulk generation",
    ],
  },
  "lorem-generator": {
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text for your designs and mockups",
    category: "Generators",
    estimatedDate: "February 2025",
    features: [
      "Multiple formats",
      "Custom word count",
      "Different languages",
      "Export options",
    ],
  },
  "css-grid-generator": {
    title: "CSS Grid Generator",
    description:
      "Generate CSS Grid layouts with visual interface and live preview",
    category: "Generators",
    estimatedDate: "February 2025",
    features: [
      "Visual editor",
      "Responsive design",
      "Code export",
      "Template library",
    ],
  },
  "json-csv-converter": {
    title: "JSON to CSV Converter",
    description: "Convert JSON data to CSV format for spreadsheet applications",
    category: "Converters",
    estimatedDate: "January 2025",
    features: [
      "Nested JSON support",
      "Custom delimiters",
      "Header customization",
      "Preview mode",
    ],
  },
  "xml-json-converter": {
    title: "XML to JSON Converter",
    description: "Convert XML documents to JSON format with validation",
    category: "Converters",
    estimatedDate: "February 2025",
    features: [
      "Schema validation",
      "Pretty formatting",
      "Error handling",
      "Batch conversion",
    ],
  },
  "hash-generator": {
    title: "Hash Generator",
    description:
      "Generate MD5, SHA1, SHA256 and other cryptographic hash values",
    category: "Decoders",
    estimatedDate: "January 2025",
    features: [
      "Multiple algorithms",
      "File hashing",
      "Text hashing",
      "Verification tools",
    ],
  },
  "json-formatter": {
    title: "JSON Formatter",
    description:
      "Format, validate and beautify JSON data with syntax highlighting",
    category: "Formatters",
    estimatedDate: "December 2024",
    features: [
      "Syntax validation",
      "Pretty printing",
      "Minification",
      "Error detection",
    ],
  },
  "css-formatter": {
    title: "CSS Formatter",
    description:
      "Format and beautify CSS code with proper indentation and structure",
    category: "Formatters",
    estimatedDate: "January 2025",
    features: ["Auto-formatting", "Minification", "Vendor prefixes", "Linting"],
  },
  "html-formatter": {
    title: "HTML Formatter",
    description:
      "Format and beautify HTML code with proper structure and indentation",
    category: "Formatters",
    estimatedDate: "January 2025",
    features: [
      "Tag validation",
      "Auto-indentation",
      "Minification",
      "SEO optimization",
    ],
  },
  "sql-formatter": {
    title: "SQL Formatter",
    description:
      "Format and beautify SQL queries for better readability and debugging",
    category: "Formatters",
    estimatedDate: "February 2025",
    features: [
      "Multi-database support",
      "Syntax highlighting",
      "Query optimization",
      "Error detection",
    ],
  },
  "yaml-formatter": {
    title: "YAML Formatter",
    description:
      "Format and validate YAML configuration files with proper structure",
    category: "Formatters",
    estimatedDate: "February 2025",
    features: [
      "Schema validation",
      "Error highlighting",
      "JSON conversion",
      "Comment preservation",
    ],
  },
  "api-tester": {
    title: "API Tester",
    description:
      "Test REST APIs with custom headers, authentication, and request bodies",
    category: "API Tools",
    estimatedDate: "March 2025",
    features: [
      "Request builder",
      "Authentication support",
      "Response viewer",
      "History tracking",
    ],
  },
  "regex-tester": {
    title: "RegEx Tester",
    description:
      "Test and debug regular expressions with live matching and explanations",
    category: "API Tools",
    estimatedDate: "January 2025",
    features: [
      "Live matching",
      "Pattern explanation",
      "Test cases",
      "Cheat sheet",
    ],
  },
  "cron-builder": {
    title: "Cron Expression Builder",
    description:
      "Build and validate cron expressions for scheduled tasks with visual interface",
    category: "API Tools",
    estimatedDate: "February 2025",
    features: [
      "Visual builder",
      "Expression validation",
      "Next run preview",
      "Common templates",
    ],
  },
  "seo-analyzer": {
    title: "SEO Analyzer",
    description:
      "Analyze web pages for SEO optimization opportunities and best practices",
    category: "Analytics",
    estimatedDate: "March 2025",
    features: [
      "Page analysis",
      "Keyword density",
      "Meta tag checker",
      "Performance insights",
    ],
  },
  "speed-test": {
    title: "Website Speed Test",
    description:
      "Test website loading speed and performance metrics with detailed reports",
    category: "Analytics",
    estimatedDate: "March 2025",
    features: [
      "Performance metrics",
      "Optimization tips",
      "Mobile testing",
      "Historical data",
    ],
  },
};

export default function ComingSoon() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [animatedStars, setAnimatedStars] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);
  const [tool, setTool] = useState<(typeof comingSoonTools)[string] | null>(
    null
  );

  // Extract tool ID from current URL path
  useEffect(() => {
    const pathname = window.location.pathname;
    const toolId = pathname.replace(/^\//, "").replace(/\/$/, ""); // Remove leading slash and trailing slash
    const foundTool = comingSoonTools[toolId];
    setTool(foundTool || null);
  }, []);

  useEffect(() => {
    // Generate animated stars
    const stars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setAnimatedStars(stars);
  }, []);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  if (!tool) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center bg-gradient-secondary">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Code2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Tool Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The tool you&apos;re looking for doesn&apos;t exist or hasn&apos;t
              been planned yet.
            </p>
            <Button onClick={handleBackToHome} variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {animatedStars.map((star) => (
            <div
              key={star.id}
              className="absolute animate-pulse"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                animationDelay: `${star.delay}s`,
              }}
            >
              <Star className="w-2 h-2 text-primary/20 fill-current" />
            </div>
          ))}

          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-accent opacity-10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Badge variant="secondary" className="px-3 py-1">
              {tool.category}
            </Badge>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              {/* Large animated icon */}
              <div className="relative mb-8">
                <div
                  className="w-32 h-32 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow animate-bounce"
                  style={{ animationDuration: "3s" }}
                >
                  <Clock className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div
                    className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center animate-spin"
                    style={{ animationDuration: "4s" }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
                {tool.title}
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                {tool.description}
              </p>

              <div className="flex items-center justify-center gap-2 text-primary font-medium">
                <Zap className="w-5 h-5" />
                <span>Coming Soon</span>
              </div>
            </div>

            {/* Feature Preview */}
            <Card className="mb-12 bg-gradient-secondary border-border/50 shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  What to Expect
                </CardTitle>
                <CardDescription>
                  Here&apos;s what we&apos;re building for you with lots of love
                  and attention to detail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notify Me Section */}
            <Card className="text-center bg-gradient-accent/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">Stay in the Loop!</h3>
                  <p className="text-muted-foreground mb-6">
                    We&apos;re working hard to bring you this amazing tool. Want
                    to be the first to know when it&apos;s ready?
                  </p>

                  {isSubscribed ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Heart className="w-5 h-5 fill-current" />
                        <span className="font-medium">
                          Thank you! We&apos;ll notify you soon.
                        </span>
                      </div>
                      <Button variant="secondary" onClick={handleBackToHome}>
                        Explore Other Tools
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleNotifyMe} className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1"
                          required
                        />
                        <Button
                          type="submit"
                          className="bg-gradient-primary hover:opacity-90"
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          Notify Me
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        No spam, just updates about this tool. We respect your
                        privacy! ❤️
                      </p>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress Indicator */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm text-primary font-medium">
                  Development in Progress
                </span>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
