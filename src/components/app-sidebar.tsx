"use client";

import {
  Code2,
  Type,
  Key,
  Palette,
  FileCode,
  Zap,
  Search,
  QrCode,
  FileText,
  Hash,
  Shield,
  Scissors,
  Database,
  Globe,
  Eye,
  Clock,
  TrendingUp,
  Gauge,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import NextImage from "next/image";
import { Badge } from "./ui/badge";

// Tool categories
const toolCategories = [
  {
    label: "Generators",
    items: [
      {
        title: "Favicon Generator",
        url: "/favicon-generator",
        icon: ImageIcon,
        isImplemented: true,
      },
      {
        title: "PWA Generator",
        url: "/pwa-generator",
        icon: Zap,
        isImplemented: true,
      },
      {
        title: "QR Code Generator",
        url: "/qr-generator",
        icon: QrCode,
        isImplemented: true,
      },
      {
        title: "Form Generator",
        url: "/form-generator",
        icon: FileText,
        isImplemented: true,
      },
      {
        title: "UUID Generator",
        url: "/uuid-generator",
        icon: Hash,
        isImplemented: false,
      },
      {
        title: "Password Generator",
        url: "/password-generator",
        icon: Shield,
        isImplemented: false,
      },
      {
        title: "Lorem Ipsum",
        url: "/lorem-generator",
        icon: FileText,
        isImplemented: false,
      },
      {
        title: "CSS Grid Generator",
        url: "/css-grid-generator",
        icon: Code2,
        isImplemented: false,
      },
    ],
  },
  {
    label: "Converters",
    items: [
      {
        title: "Font Converter",
        url: "/font-converter",
        icon: Type,
        isImplemented: true,
      },
      {
        title: "Image Converter",
        url: "/image-converter",
        icon: ImageIcon,
        isImplemented: true,
      },
      {
        title: "Background Remover",
        url: "/background-remover",
        icon: Scissors,
        isImplemented: true,
      },
      {
        title: "Color Converter",
        url: "/color-converter",
        icon: Palette,
        isImplemented: true,
      },
      {
        title: "JSON to CSV",
        url: "/json-csv-converter",
        icon: Database,
        isImplemented: false,
      },
      {
        title: "XML to JSON",
        url: "/xml-json-converter",
        icon: FileCode,
        isImplemented: false,
      },
    ],
  },
  {
    label: "Decoders & Encoders",
    items: [
      {
        title: "JWT Decoder",
        url: "/jwt-decoder",
        icon: Key,
        isImplemented: true,
      },
      {
        title: "Base64 Encoder",
        url: "/base64-encoder",
        icon: FileCode,
        isImplemented: true,
      },
      {
        title: "URL Encoder",
        url: "/url-encoder",
        icon: Globe,
        isImplemented: true,
      },
      {
        title: "Hash Generator",
        url: "/hash-generator",
        icon: Hash,
        isImplemented: false,
      },
    ],
  },
  {
    label: "Formatters",
    items: [
      {
        title: "JSON Formatter",
        url: "/json-formatter",
        icon: FileCode,
        isImplemented: false,
      },
      {
        title: "CSS Formatter",
        url: "/css-formatter",
        icon: Code2,
        isImplemented: false,
      },
      {
        title: "HTML Formatter",
        url: "/html-formatter",
        icon: Code2,
        isImplemented: false,
      },
      {
        title: "SQL Formatter",
        url: "/sql-formatter",
        icon: Database,
        isImplemented: false,
      },
      {
        title: "YAML Formatter",
        url: "/yaml-formatter",
        icon: FileCode,
        isImplemented: false,
      },
    ],
  },
  {
    label: "API & Testing",
    items: [
      {
        title: "API Tester",
        url: "/api-tester",
        icon: Globe,
        isImplemented: false,
      },
      {
        title: "RegEx Tester",
        url: "/regex-tester",
        icon: Eye,
        isImplemented: false,
      },
      {
        title: "Cron Builder",
        url: "/cron-builder",
        icon: Clock,
        isImplemented: false,
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        title: "SEO Analyzer",
        url: "/seo-analyzer",
        icon: TrendingUp,
        isImplemented: false,
      },
      {
        title: "Speed Test",
        url: "/speed-test",
        icon: Gauge,
        isImplemented: false,
      },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => pathname === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-glow"
      : "hover:bg-sidebar-accent/50 transition-smooth";

  return (
    <Sidebar collapsible="icon">
      {/* Sidebar Header */}
      <SidebarHeader className=" border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <NextImage
              src="/images/logo-white.png"
              alt="DevTool Kits Logo"
              className="object-cover w-9 h-9"
              width={36}
              height={36}
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                DevTool Kits
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                All-in-one toolkit
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="">
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={getNavCls({ isActive: isActive("/") })}
                >
                  <Link href="/">
                    <Search className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>Dashboard</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tool Categories */}
        {toolCategories.map((category) => (
          <SidebarGroup key={category.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2">
                {category.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {category.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={getNavCls({ isActive: isActive(item.url) })}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {!collapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm truncate">
                              {item.title}
                            </span>
                            {!item.isImplemented && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5 ml-2"
                              >
                                Soon
                              </Badge>
                            )}
                          </div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Settings */}
      </SidebarContent>
    </Sidebar>
  );
}
