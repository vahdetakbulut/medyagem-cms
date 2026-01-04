"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  isPublished: boolean
  className?: string
}

export function StatusBadge({ isPublished, className }: StatusBadgeProps) {
  return (
    <Badge
      variant={isPublished ? "default" : "secondary"}
      className={cn(
        isPublished
          ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300",
        className
      )}
    >
      {isPublished ? "Yayında" : "Taslak"}
    </Badge>
  )
}
