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

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  isPopular?: boolean;
  onClick: () => void;
}

export function ToolCard({
  title,
  description,
  icon: Icon,
  category,
  isPopular,
  onClick,
}: ToolCardProps) {
  return (
    <Card className="group hover:shadow-elevated hover:shadow-glow transition-smooth cursor-pointer bg-zinc-900 border-border/50 hover:border-primary/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 transition-smooth" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-smooth">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold group-hover:text-primary transition-smooth">
                {title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {category}
                </Badge>
                {isPopular && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 border-accent "
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
          onClick={onClick}
          variant="secondary"
          size="sm"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-smooth"
        >
          Open Tool
        </Button>
      </CardContent>
    </Card>
  );
}
