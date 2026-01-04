"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "password" | "number" | "textarea" | "select" | "switch"
  placeholder?: string
  value?: string | number | boolean
  onChange?: (value: any) => void
  options?: { label: string; value: string }[]
  required?: boolean
  disabled?: boolean
  error?: string
  description?: string
  className?: string
  rows?: number
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  error,
  description,
  className,
  rows = 3,
}: FormFieldProps) {
  const id = `field-${name}`

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        {type === "switch" && (
          <Switch
            id={id}
            checked={value as boolean}
            onCheckedChange={onChange}
            disabled={disabled}
          />
        )}
      </div>

      {type === "textarea" ? (
        <Textarea
          id={id}
          name={name}
          placeholder={placeholder}
          value={value as string}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          rows={rows}
          className={cn(error && "border-destructive")}
        />
      ) : type === "select" ? (
        <Select
          value={value as string}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger className={cn(error && "border-destructive")}>
            <SelectValue placeholder={placeholder || "Seçin"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : type !== "switch" ? (
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value as string | number}
          onChange={(e) => onChange?.(type === "number" ? Number(e.target.value) : e.target.value)}
          disabled={disabled}
          className={cn(error && "border-destructive")}
        />
      ) : null}

      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
