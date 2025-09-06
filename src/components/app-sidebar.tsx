"use client";

import {
  Code2,
  Image as ImageIcon,
  Type,
  Key,
  Palette,
  FileCode,
  Zap,
  Search,
  FormInputIcon,
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
import Image from "next/image";

// Tool categories
const toolCategories = [
  {
    label: "Generators",
    items: [
      { title: "Form Generator", url: "/form-generator", icon: FormInputIcon },
      {
        title: "Favicon Generator",
        url: "/favicon-generator",
        icon: ImageIcon,
      },
      { title: "PWA Icons", url: "/pwa-generator", icon: Zap },
      { title: "QR Code", url: "/qr-generator", icon: Code2 },
    ],
  },
  {
    label: "Converters",
    items: [
      { title: "Font Converter", url: "/font-converter", icon: Type },
      { title: "Image Converter", url: "/image-converter", icon: ImageIcon },
      { title: "Color Converter", url: "/color-converter", icon: Palette },
    ],
  },
  {
    label: "Decoders & Encoders",
    items: [
      { title: "JWT Decoder", url: "/jwt-decoder", icon: Key },
      { title: "Base64 Encoder", url: "/base64-encoder", icon: FileCode },
      { title: "URL Encoder", url: "/url-encoder", icon: Code2 },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => pathname === path;
  const getNavCls = (active: boolean) =>
    active
      ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-glow"
      : "hover:bg-sidebar-accent/50 transition-smooth";

  return (
    <Sidebar collapsible="icon">
      {/* Sidebar Header */}
      <SidebarHeader className=" border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Image
              src="/images/logo-white.png"
              alt="CodeKit"
              className="object-cover w-9 h-9"
              width={1000}
              height={1000}
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                CodeKit
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
                <SidebarMenuButton asChild className={getNavCls(isActive("/"))}>
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
                      className={getNavCls(isActive(item.url))}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {!collapsed && (
                          <span className="text-sm truncate">{item.title}</span>
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
