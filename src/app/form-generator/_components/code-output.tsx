/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FormField } from "./FormGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Check } from "lucide-react";
import { toast } from "sonner";

interface CodeOutputProps {
  fields: FormField[];
  formName: string;
}

export function CodeOutput({ fields, formName }: CodeOutputProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // Helper function to convert field label to camelCase variable name
  const labelToCamelCase = (label: string) => {
    return (
      label
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
        .split(" ")
        .map((word, index) =>
          index === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("")
        .replace(/\s+/g, "") || "field"
    ); // Fallback to 'field' if empty
  };

  const generateZodSchema = () => {
    if (fields.length === 0) return "// No fields to generate schema";

    const schemaFields: string[] = [];

    fields.forEach((field) => {
      let zodType = "";
      const fieldName = labelToCamelCase(field.label);

      switch (field.type) {
        case "input":
        case "textarea":
        case "password":
          zodType = "z.string()";
          if (field.validation?.minLength) {
            zodType += `.min(${field.validation.minLength}, "Minimum ${field.validation.minLength} characters required")`;
          }
          if (field.validation?.maxLength) {
            zodType += `.max(${field.validation.maxLength}, "Maximum ${field.validation.maxLength} characters allowed")`;
          }
          if (field.validation?.pattern) {
            zodType += `.regex(/${field.validation.pattern}/, "Invalid format")`;
          }
          break;
        case "select":
        case "radio":
          if (field.options && field.options.length > 0) {
            const enumValues = field.options
              .map((opt) => `"${opt}"`)
              .join(", ");
            zodType = `z.enum([${enumValues}])`;
          } else {
            zodType = "z.string()";
          }
          break;
        case "checkbox":
          zodType = "z.array(z.string())";
          break;
        case "switch":
          zodType = "z.boolean()";
          break;
        case "date":
          zodType = "z.date()";
          break;
        case "progress":
          zodType = `z.number().min(${field.min || 0}).max(${
            field.max || 100
          })`;
          break;
        default:
          zodType = "z.string()";
      }

      if (!field.required) {
        zodType += ".optional()";
      }

      schemaFields.push(`  ${fieldName}: ${zodType}`);
    });

    return `import { z } from "zod";

export const ${formName.toLowerCase()}Schema = z.object({
${schemaFields.join(",\n")}
});

export type ${formName}Data = z.infer<typeof ${formName.toLowerCase()}Schema>;`;
  };

  const generateReactComponent = () => {
    if (fields.length === 0) return "// No fields to generate component";

    // Determine which components are needed based on field types
    const usedFieldTypes = new Set(fields.map((field) => field.type));
    const imports = new Set<string>();

    // Always include basic form components
    imports.add(
      "Form, FormControl, FormField, FormItem, FormLabel, FormMessage"
    );

    // Add imports based on field types used
    if (usedFieldTypes.has("input") || usedFieldTypes.has("password")) {
      imports.add("Input");
    }
    if (usedFieldTypes.has("textarea")) {
      imports.add("Textarea");
    }
    if (usedFieldTypes.has("select")) {
      imports.add(
        "Select, SelectContent, SelectItem, SelectTrigger, SelectValue"
      );
    }
    if (usedFieldTypes.has("checkbox")) {
      imports.add("Checkbox");
    }
    if (usedFieldTypes.has("radio")) {
      imports.add("RadioGroup, RadioGroupItem");
    }
    if (usedFieldTypes.has("switch")) {
      imports.add("Switch");
    }
    if (usedFieldTypes.has("date")) {
      imports.add("Calendar, Popover, PopoverContent, PopoverTrigger");
      imports.add("CalendarIcon");
    }
    if (usedFieldTypes.has("progress")) {
      imports.add("Progress, Slider");
    }

    const renderFieldCode = (field: FormField) => {
      const fieldName = labelToCamelCase(field.label);
      const labelWithRequired = field.required
        ? `${field.label} <span className="text-destructive">*</span>`
        : field.label;

      switch (field.type) {
        case "input":
          return `          <FormField
            control={form.control}
            name="${fieldName}"
            render={({ field }) => (
              <FormItem>
                <FormLabel>${labelWithRequired}</FormLabel>
                <FormControl>
                  <Input placeholder="${field.placeholder || ""}" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />`;

        case "password":
          return `          <FormField
            control={form.control}
            name="${fieldName}"
            render={({ field }) => (
              <FormItem>
                <FormLabel>${labelWithRequired}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="${
                    field.placeholder || ""
                  }" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />`;

        case "textarea":
          return `          <FormField
            control={form.control}
            name="${fieldName}"
            render={({ field }) => (
              <FormItem>
                <FormLabel>${labelWithRequired}</FormLabel>
                <FormControl>
                  <Textarea placeholder="${
                    field.placeholder || ""
                  }" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />`;

        case "select":
          const selectOptions =
            field.options
              ?.map(
                (option: any) =>
                  `                    <SelectItem value="${option}">${option}</SelectItem>`
              )
              .join("\n") || "";

          return `          <FormField
            control={form.control}
            name="${fieldName}"
            render={({ field }) => (
              <FormItem>
                <FormLabel>${labelWithRequired}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
${selectOptions}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />`;

        case "checkbox":
          const checkboxOptions =
            field.options
              ?.map(
                (option: any) =>
                  `                  <div className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes("${option}")}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value || [], "${option}"])
                            : field.onChange(field.value?.filter((value: string) => value !== "${option}"))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">${option}</FormLabel>
                  </div>`
              )
              .join("\n") || "";

          return `          <FormField
            control={form.control}
            name="${fieldName}"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">${labelWithRequired}</FormLabel>
                </div>
${checkboxOptions}
                <FormMessage />
              </FormItem>
            )}
          />`;

        case "radio":
          const radioOptions =
            field.options
              ?.map(
                (option: any) =>
                  `                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="${option}" />
                    </FormControl>
                    <FormLabel className="font-normal">${option}</FormLabel>
                  </div>`
              )
              .join("\n") || "";

          return `          <FormField
            control={form.control}
            name="${fieldName}"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>${labelWithRequired}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
${radioOptions}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />`;

        case "switch":
          return `          <FormField
            control={form.control}
            name="${fieldName}"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">${labelWithRequired}</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />`;

        case "date":
          return `          <FormField
            control={form.control}
            name="${fieldName}"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>${labelWithRequired}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />`;

        case "progress":
          return `          <FormField
            control={form.control}
            name="${fieldName}"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>${labelWithRequired}</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${field.min || 0}</span>
                      <span>{field.value || ${field.min || 0}}</span>
                      <span>${field.max || 100}</span>
                    </div>
                    <Slider
                      value={[field.value || ${field.min || 0}]}
                      onValueChange={(value) => field.onChange(value[0])}
                      min={${field.min || 0}}
                      max={${field.max || 100}}
                      step={${field.step || 1}}
                      className="w-full"
                    />
                    <Progress value={(field.value / ${
                      field.max || 100
                    }) * 100} className="w-full" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />`;

        default:
          return `          <!-- Unknown field type: ${field.type} -->`;
      }
    };

    const fieldsCode = fields.map(renderFieldCode).join("\n\n");

    // Add conditional imports for date-fns and lucide-react
    const needsDateFns = usedFieldTypes.has("date");
    const needsLucideReact = usedFieldTypes.has("date");
    const needsUtils = usedFieldTypes.has("date");

    return `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
${
  usedFieldTypes.has("input") || usedFieldTypes.has("password")
    ? 'import { Input } from "@/components/ui/input";'
    : ""
}
${
  usedFieldTypes.has("textarea")
    ? 'import { Textarea } from "@/components/ui/textarea";'
    : ""
}
${
  usedFieldTypes.has("checkbox")
    ? 'import { Checkbox } from "@/components/ui/checkbox";'
    : ""
}
${
  usedFieldTypes.has("radio")
    ? 'import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";'
    : ""
}
${
  usedFieldTypes.has("switch")
    ? 'import { Switch } from "@/components/ui/switch";'
    : ""
}
${
  usedFieldTypes.has("select")
    ? 'import {\n  Select,\n  SelectContent,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@/components/ui/select";'
    : ""
}
${
  usedFieldTypes.has("date")
    ? 'import { Calendar } from "@/components/ui/calendar";\nimport { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";'
    : ""
}
${
  usedFieldTypes.has("progress")
    ? 'import { Progress } from "@/components/ui/progress";\nimport { Slider } from "@/components/ui/slider";'
    : ""
}
${needsLucideReact ? 'import { CalendarIcon } from "lucide-react";' : ""}
${needsDateFns ? 'import { format } from "date-fns";' : ""}
${needsUtils ? 'import { cn } from "@/lib/utils";' : ""}
import { ${formName.toLowerCase()}Schema, ${formName}Data } from "./schema";

export function ${formName}() {
  const form = useForm<${formName}Data>({
    resolver: zodResolver(${formName.toLowerCase()}Schema),
    defaultValues: {
${fields
  .map((field) => {
    const fieldName = labelToCamelCase(field.label);
    switch (field.type) {
      case "checkbox":
        return `      ${fieldName}: []`;
      case "switch":
        return `      ${fieldName}: false`;
      case "date":
        return `      ${fieldName}: undefined`;
      case "progress":
        return `      ${fieldName}: ${field.min || 0}`;
      default:
        return `      ${fieldName}: ""`;
    }
  })
  .join(",\n")}
    },
  });

  function onSubmit(values: ${formName}Data) {
    console.log(values);
    // Handle form submission here
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
${fieldsCode}
        
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}`;
  };

  const copyToClipboard = async (text: string, tabName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tabName);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const zodCode = generateZodSchema();
  const reactCode = generateReactComponent();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Generated Code</h3>
          <p className="text-sm text-muted-foreground">
            Copy and paste this code into your project
          </p>
        </div>
        <Badge variant="secondary">{fields.length} fields</Badge>
      </div>

      <Tabs defaultValue="schema" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schema">Zod Schema</TabsTrigger>
          <TabsTrigger value="component">React Component</TabsTrigger>
        </TabsList>

        <TabsContent value="schema" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">schema.ts</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(zodCode, "schema")}
                  >
                    {copiedTab === "schema" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(zodCode, "schema.ts")}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                <code>{zodCode}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="component" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{formName}.tsx</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(reactCode, "component")}
                  >
                    {copiedTab === "component" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(reactCode, `${formName}.tsx`)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                <code>{reactCode}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
