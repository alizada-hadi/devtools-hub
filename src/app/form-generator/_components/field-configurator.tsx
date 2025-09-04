/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormField } from "./FormGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Trash2,
  GripVertical,
  Plus,
  Minus,
  Settings,
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

interface FieldConfiguratorProps {
  fields: FormField[];
  selectedField: string | null;
  onSelectField: (id: string | null) => void;
  onUpdateField: (id: string, updates: Partial<FormField>) => void;
  onDeleteField: (id: string) => void;
  onReorderFields: (fromIndex: number, toIndex: number) => void;
  formName: string;
  onFormNameChange: (name: string) => void;
}

export function FieldConfigurator({
  fields,
  selectedField,
  onSelectField,
  onUpdateField,
  onDeleteField,
  formName,
  onFormNameChange,
}: FieldConfiguratorProps) {
  const getFieldIcon = (type: FormField["type"]) => {
    const iconMap = {
      input: Type,
      textarea: FileText,
      select: ChevronDown,
      checkbox: CheckSquare,
      radio: Circle,
      switch: ToggleLeft,
      date: Calendar,
      progress: BarChart3,
      password: Lock,
    };
    return iconMap[type];
  };

  const selectedFieldData = fields.find((f) => f.id === selectedField);

  const addOption = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field?.options) {
      onUpdateField(fieldId, {
        options: [...field.options, `Option ${field.options.length + 1}`],
      });
    }
  };

  const removeOption = (fieldId: string, optionIndex: number) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field?.options) {
      onUpdateField(fieldId, {
        options: field.options.filter(
          (_: any, index: number) => index !== optionIndex
        ),
      });
    }
  };

  const updateOption = (
    fieldId: string,
    optionIndex: number,
    value: string
  ) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field?.options) {
      const newOptions = [...field.options];
      newOptions[optionIndex] = value;
      onUpdateField(fieldId, { options: newOptions });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Form Settings & Fields List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Form Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Form Name */}
          <div className="space-y-2">
            <Label htmlFor="formName">Form Name</Label>
            <Input
              id="formName"
              value={formName}
              onChange={(e) => onFormNameChange(e.target.value)}
              placeholder="Enter form name..."
            />
          </div>

          <Separator />

          {/* Fields List */}
          <div className="space-y-2">
            <Label>Form Fields ({fields.length})</Label>
            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No fields added yet. Use the field selector to add fields.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {fields.map((field) => {
                  const Icon = getFieldIcon(field.type);
                  return (
                    <div
                      key={field.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                        selectedField === field.id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => onSelectField(field.id)}
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <Icon className="w-4 h-4 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {field.label}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {field.type}
                        </p>
                      </div>
                      {field.required && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteField(field.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Field Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Field Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedFieldData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                {(() => {
                  const Icon = getFieldIcon(selectedFieldData.type);
                  return <Icon className="w-4 h-4 text-primary" />;
                })()}
                <Badge variant="outline" className="capitalize">
                  {selectedFieldData.type}
                </Badge>
              </div>

              {/* Label */}
              <div className="space-y-2">
                <Label htmlFor="fieldLabel">Label</Label>
                <Input
                  id="fieldLabel"
                  value={selectedFieldData.label}
                  onChange={(e) =>
                    onUpdateField(selectedFieldData.id, {
                      label: e.target.value,
                    })
                  }
                />
              </div>

              {/* Placeholder (for input, textarea, and password) */}
              {(selectedFieldData.type === "input" ||
                selectedFieldData.type === "textarea" ||
                selectedFieldData.type === "password") && (
                <div className="space-y-2">
                  <Label htmlFor="fieldPlaceholder">Placeholder</Label>
                  <Input
                    id="fieldPlaceholder"
                    value={selectedFieldData.placeholder || ""}
                    onChange={(e) =>
                      onUpdateField(selectedFieldData.id, {
                        placeholder: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {/* Required Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="fieldRequired">Required Field</Label>
                <Switch
                  id="fieldRequired"
                  checked={selectedFieldData.required}
                  onCheckedChange={(checked) =>
                    onUpdateField(selectedFieldData.id, { required: checked })
                  }
                />
              </div>

              {/* Options (for select and radio) */}
              {(selectedFieldData.type === "select" ||
                selectedFieldData.type === "radio" ||
                selectedFieldData.type === "checkbox") && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Options</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(selectedFieldData.id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {selectedFieldData.options?.map(
                      (option: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) =>
                              updateOption(
                                selectedFieldData.id,
                                index,
                                e.target.value
                              )
                            }
                            placeholder={`Option ${index + 1}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-2"
                            onClick={() =>
                              removeOption(selectedFieldData.id, index)
                            }
                            disabled={selectedFieldData.options!.length <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Progress Bar Settings */}
              {selectedFieldData.type === "progress" && (
                <div className="space-y-3">
                  <Label>Progress Settings</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="minValue" className="text-xs">
                        Min Value
                      </Label>
                      <Input
                        id="minValue"
                        type="number"
                        value={selectedFieldData.min || 0}
                        onChange={(e) =>
                          onUpdateField(selectedFieldData.id, {
                            min: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="maxValue" className="text-xs">
                        Max Value
                      </Label>
                      <Input
                        id="maxValue"
                        type="number"
                        value={selectedFieldData.max || 100}
                        onChange={(e) =>
                          onUpdateField(selectedFieldData.id, {
                            max: parseInt(e.target.value) || 100,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="stepValue" className="text-xs">
                        Step
                      </Label>
                      <Input
                        id="stepValue"
                        type="number"
                        min="1"
                        value={selectedFieldData.step || 1}
                        onChange={(e) =>
                          onUpdateField(selectedFieldData.id, {
                            step: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Validation (for input) */}
              {selectedFieldData.type === "input" && (
                <div className="space-y-3">
                  <Label>Validation Rules</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="minLength" className="text-xs">
                        Min Length
                      </Label>
                      <Input
                        id="minLength"
                        type="number"
                        min="0"
                        value={selectedFieldData.validation?.minLength || ""}
                        onChange={(e) =>
                          onUpdateField(selectedFieldData.id, {
                            validation: {
                              ...selectedFieldData.validation,
                              minLength: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="maxLength" className="text-xs">
                        Max Length
                      </Label>
                      <Input
                        id="maxLength"
                        type="number"
                        min="0"
                        value={selectedFieldData.validation?.maxLength || ""}
                        onChange={(e) =>
                          onUpdateField(selectedFieldData.id, {
                            validation: {
                              ...selectedFieldData.validation,
                              maxLength: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pattern" className="text-xs">
                      Pattern (Regex)
                    </Label>
                    <Input
                      id="pattern"
                      value={selectedFieldData.validation?.pattern || ""}
                      placeholder="e.g., ^[a-zA-Z]+$"
                      onChange={(e) =>
                        onUpdateField(selectedFieldData.id, {
                          validation: {
                            ...selectedFieldData.validation,
                            pattern: e.target.value || undefined,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Select a field to configure its properties</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
