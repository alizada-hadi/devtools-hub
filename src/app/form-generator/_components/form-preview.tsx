/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { FormField } from "./FormGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface FormPreviewProps {
  fields: FormField[];
  formName: string;
}

export function FormPreview({ fields, formName }: FormPreviewProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const [dates, setDates] = useState<{ [key: string]: Date }>({});
  const [progressValues, setProgressValues] = useState<{
    [key: string]: number;
  }>({});

  const onSubmit = (data: any) => {
    toast.success("Form Submitted");
    console.log("Form Data:", data);
  };

  if (fields.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg mb-2">No fields added yet</p>
        <p className="text-sm">Add some fields to see the preview</p>
      </div>
    );
  }

  const renderField = (field: FormField) => {
    console.log("Field:", field);
    switch (field.type) {
      case "input":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={field.id}
              placeholder={field.placeholder}
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false,
                minLength: field.validation?.minLength
                  ? {
                      value: field.validation.minLength,
                      message: `Minimum ${field.validation.minLength} characters required`,
                    }
                  : undefined,
                maxLength: field.validation?.maxLength
                  ? {
                      value: field.validation.maxLength,
                      message: `Maximum ${field.validation.maxLength} characters allowed`,
                    }
                  : undefined,
                pattern: field.validation?.pattern
                  ? {
                      value: new RegExp(field.validation.pattern),
                      message: "Invalid format",
                    }
                  : undefined,
              })}
            />
            {errors[field.id] && (
              <p className="text-sm text-destructive">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false,
              })}
            />
            {errors[field.id] && (
              <p className="text-sm text-destructive">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Select onValueChange={(value) => setValue(field.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: any, index: number) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[field.id] && (
              <p className="text-sm text-destructive">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="space-y-3">
            <Label>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option: any, index: number) => {
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.id}_${index}`}
                      onCheckedChange={(checked) => {
                        const currentValues = getValues(field.id) || [];
                        if (checked) {
                          setValue(field.id, [...currentValues, option]);
                        } else {
                          setValue(
                            field.id,
                            currentValues.filter(
                              (val: string) => val !== option
                            )
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`${field.id}_${index}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                );
              })}
            </div>
            {errors[field.id] && (
              <p className="text-sm text-destructive">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "radio":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <RadioGroup onValueChange={(value) => setValue(field.id, value)}>
              {field.options?.map((option: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}_${index}`} />
                  <Label
                    htmlFor={`${field.id}_${index}`}
                    className="font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors[field.id] && (
              <p className="text-sm text-destructive">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "switch":
        return (
          <div key={field.id} className="flex items-center justify-between">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Switch
              id={field.id}
              onCheckedChange={(checked) => setValue(field.id, checked)}
            />
          </div>
        );

      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dates[field.id] && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dates[field.id] ? (
                    format(dates[field.id], "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dates[field.id]}
                  onSelect={(date) => {
                    if (date) {
                      setDates((prev) => ({ ...prev, [field.id]: date }));
                      setValue(field.id, date);
                    }
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors[field.id] && (
              <p className="text-sm text-destructive">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "progress":
        const currentValue = progressValues[field.id] ?? field.min ?? 0;
        const minValue = field.min ?? 0;
        const maxValue = field.max ?? 100;
        return (
          <div key={field.id} className="space-y-3">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{minValue}</span>
                <span className="font-medium">{currentValue}</span>
                <span>{maxValue}</span>
              </div>
              <Slider
                value={[currentValue]}
                onValueChange={(value) => {
                  const newValue = value[0];
                  setProgressValues((prev) => ({
                    ...prev,
                    [field.id]: newValue,
                  }));
                  setValue(field.id, newValue);
                }}
                min={minValue}
                max={maxValue}
                step={field.step || 1}
                className="w-full"
              />
            </div>
            {errors[field.id] && (
              <p className="text-sm text-destructive">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "password":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={field.id}
              type="password"
              placeholder={field.placeholder}
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false,
              })}
            />
            {errors[field.id] && (
              <p className="text-sm text-destructive">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{formName}</h2>
            <p className="text-muted-foreground">
              Preview of your generated form
            </p>
          </div>

          <div className="space-y-4">{fields.map(renderField)}</div>

          <div className="pt-4 border-t">
            <Button type="submit" className="w-full">
              Submit Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
