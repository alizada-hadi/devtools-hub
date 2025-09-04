"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldSelector } from "./field-selector";
import { FieldConfigurator } from "./field-configurator";
import { FormPreview } from "./form-preview";
import { CodeOutput } from "./code-output";
import { Eye, Code, Plus, FormInputIcon } from "lucide-react";

export interface FormField {
  id: string;
  type:
    | "input"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "switch"
    | "date"
    | "progress"
    | "password";
  label: string;
  placeholder?: string;
  required: boolean;
  isChecked?: boolean;
  options?: string[]; // for select, radio
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  // Additional props for new field types
  min?: number; // for progress
  max?: number; // for progress
  step?: number; // for progress
}

export default function FormGenerator() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [formName, setFormName] = useState("MyForm");

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      isChecked: false,
      placeholder:
        type === "input" || type === "textarea" || type === "password"
          ? `Enter ${type}...`
          : undefined,
      options:
        type === "select" || type === "radio" || type === "checkbox"
          ? ["Option 1", "Option 2"]
          : undefined,
      min: type === "progress" ? 0 : undefined,
      max: type === "progress" ? 100 : undefined,
      step: type === "progress" ? 1 : undefined,
    };

    setFields([...fields, newField]);
    setSelectedField(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    if (selectedField === id) {
      setSelectedField(null);
    }
  };

  const reorderFields = (fromIndex: number, toIndex: number) => {
    const newFields = [...fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    setFields(newFields);
  };

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <FormInputIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Form Generator
              </h1>
              <p className="text-muted-foreground">
                Create beautiful forms with validation. Generate React Hook Form
                + Zod code instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Field Selector */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Fields
              </CardTitle>
              <CardDescription>Click to add form fields</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldSelector onAddField={addField} />
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="builder" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="builder"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Builder
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Code
                </TabsTrigger>
              </TabsList>

              <TabsContent value="builder" className="space-y-4">
                <FieldConfigurator
                  fields={fields}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                  onUpdateField={updateField}
                  onDeleteField={deleteField}
                  onReorderFields={reorderFields}
                  formName={formName}
                  onFormNameChange={setFormName}
                />
              </TabsContent>

              <TabsContent value="preview">
                <Card>
                  <CardHeader>
                    <CardTitle>Form Preview</CardTitle>
                    <CardDescription>
                      Preview your form as users will see it
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormPreview fields={fields} formName={formName} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code">
                <CodeOutput fields={fields} formName={formName} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
