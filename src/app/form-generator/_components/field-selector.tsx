import { Button } from "@/components/ui/button";
import {
  Type,
  FileText,
  ChevronDown,
  CheckSquare,
  Circle,
  ToggleLeft,
  Calendar,
  BarChart3,
  Lock,
} from "lucide-react";

interface FieldSelectorProps {
  onAddField: (
    type:
      | "input"
      | "textarea"
      | "select"
      | "checkbox"
      | "radio"
      | "switch"
      | "date"
      | "progress"
      | "password"
  ) => void;
}

export function FieldSelector({ onAddField }: FieldSelectorProps) {
  const fieldTypes = [
    {
      type: "input" as const,
      label: "Text Input",
      icon: Type,
      description: "Single line text input",
    },
    {
      type: "password" as const,
      label: "Password Input",
      icon: Lock,
      description: "Password input",
    },
    {
      type: "textarea" as const,
      label: "Textarea",
      icon: FileText,
      description: "Multi-line text input",
    },
    {
      type: "select" as const,
      label: "Select Dropdown",
      icon: ChevronDown,
      description: "Dropdown selection",
    },
    {
      type: "checkbox" as const,
      label: "Checkbox",
      icon: CheckSquare,
      description: "Multiple choice options",
    },
    {
      type: "radio" as const,
      label: "Radio Button",
      icon: Circle,
      description: "Single choice from options",
    },
    {
      type: "switch" as const,
      label: "Toggle Switch",
      icon: ToggleLeft,
      description: "On/off toggle",
    },
    {
      type: "date" as const,
      label: "Date Picker",
      icon: Calendar,
      description: "Date selection input",
    },
    {
      type: "progress" as const,
      label: "Progress Bar",
      icon: BarChart3,
      description: "Progress indicator",
    },
  ];

  return (
    <div className="space-y-2">
      {fieldTypes.map((field) => {
        const Icon = field.icon;
        return (
          <Button
            key={field.type}
            variant="ghost"
            className="w-full justify-start h-auto p-3 flex-col items-start space-y-1 hover:bg-primary/10"
            onClick={() => onAddField(field.type)}
          >
            <div className="flex items-center gap-2 w-full">
              <Icon className="w-4 h-4 text-primary" />
              <span className="font-medium">{field.label}</span>
            </div>
            <span className="text-xs text-muted-foreground text-left">
              {field.description}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
