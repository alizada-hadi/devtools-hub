import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import type { FaviconType } from "@/app/favicon-generator/page";
interface TypeOption {
  id: FaviconType;
  title: string;
  description: string;
  icon: LucideIcon;
  popular: boolean;
}

interface TypeSelectorProps {
  types: TypeOption[];
  selectedType: FaviconType;
  onTypeChange: (type: FaviconType) => void;
}

export function TypeSelector({
  types,
  selectedType,
  onTypeChange,
}: TypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {types.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;

        return (
          <Card
            key={type.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-glow border-border/50 bg-card/50 backdrop-blur-sm",
              "hover:scale-[1.02] hover:border-primary/50",
              isSelected && "border-primary bg-primary/5 shadow-glow"
            )}
            onClick={() => onTypeChange(type.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={cn(
                        "font-medium transition-colors",
                        isSelected ? "text-primary" : "text-card-foreground"
                      )}
                    >
                      {type.title}
                    </h3>
                    {type.popular && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5"
                      >
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
