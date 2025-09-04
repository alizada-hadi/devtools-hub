import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  isPopular?: boolean;
  url: string;
}

export function ToolCard({
  title,
  description,
  icon: Icon,
  category,
  isPopular,
  url,
}: ToolCardProps) {
  return (
    <Link href={url} className="block">
      <Card className="group hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all duration-300 cursor-pointer bg-background border-border hover:border-primary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors duration-300">
                  {title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-secondary/50"
                  >
                    {category}
                  </Badge>
                  {isPopular && (
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0.5 border-primary/30 text-primary"
                    >
                      Popular
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </CardDescription>

          <Button
            variant="secondary"
            size="sm"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 hover:shadow-sm"
          >
            Open Tool
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
