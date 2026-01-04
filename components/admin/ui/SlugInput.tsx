"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { slugify } from "@/lib/utils"
import { RefreshCw, Pencil } from "lucide-react"

interface SlugInputProps {
  value: string
  sourceValue: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function SlugInput({
  value,
  sourceValue,
  onChange,
  disabled = false,
  placeholder = "url-slug",
}: SlugInputProps) {
  const [isEditing, setIsEditing] = useState(false)

  const generateSlug = () => {
    if (sourceValue) {
      onChange(slugify(sourceValue))
    }
  }

  useEffect(() => {
    if (!value && sourceValue && !isEditing) {
      onChange(slugify(sourceValue))
    }
  }, [sourceValue, value, isEditing, onChange])

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          /
        </span>
        <Input
          value={value}
          onChange={(e) => {
            setIsEditing(true)
            onChange(slugify(e.target.value))
          }}
          disabled={disabled}
          placeholder={placeholder}
          className="pl-6"
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={generateSlug}
        disabled={disabled}
        title="Başlıktan oluştur"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  )
}
