"use client"

import { UseFormReturn } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface SEOFieldsProps {
  form: UseFormReturn<any>
  showCanonical?: boolean
  showRobots?: boolean
  showOgImage?: boolean
  showFocusKeyword?: boolean
}

export function SEOFields({
  form,
  showCanonical = true,
  showRobots = true,
  showOgImage = true,
  showFocusKeyword = false,
}: SEOFieldsProps) {
  const metaTitle = form.watch("metaTitle") || ""
  const metaDescription = form.watch("metaDescription") || ""

  const titleLength = metaTitle.length
  const descriptionLength = metaDescription.length

  const titleScore = titleLength >= 30 && titleLength <= 60 ? 100 : titleLength > 0 ? 50 : 0
  const descriptionScore =
    descriptionLength >= 120 && descriptionLength <= 160 ? 100 : descriptionLength > 0 ? 50 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">SEO Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showFocusKeyword && (
          <FormField
            control={form.control}
            name="focusKeyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odak Anahtar Kelime</FormLabel>
                <FormControl>
                  <Input placeholder="Örn: web tasarım" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  İçeriğinizin optimize edilmesini istediğiniz ana anahtar kelime
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="metaTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Başlık</FormLabel>
              <FormControl>
                <Input
                  placeholder="Sayfa başlığı (30-60 karakter)"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <div className="flex items-center gap-2">
                <Progress
                  value={titleScore}
                  className={cn(
                    "h-2",
                    titleScore === 100
                      ? "[&>div]:bg-green-500"
                      : titleScore > 0
                        ? "[&>div]:bg-yellow-500"
                        : "[&>div]:bg-gray-300"
                  )}
                />
                <span
                  className={cn(
                    "text-xs",
                    titleLength >= 30 && titleLength <= 60
                      ? "text-green-600"
                      : titleLength > 60
                        ? "text-red-600"
                        : "text-muted-foreground"
                  )}
                >
                  {titleLength}/60
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Açıklama</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Sayfa açıklaması (120-160 karakter)"
                  rows={3}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <div className="flex items-center gap-2">
                <Progress
                  value={descriptionScore}
                  className={cn(
                    "h-2",
                    descriptionScore === 100
                      ? "[&>div]:bg-green-500"
                      : descriptionScore > 0
                        ? "[&>div]:bg-yellow-500"
                        : "[&>div]:bg-gray-300"
                  )}
                />
                <span
                  className={cn(
                    "text-xs",
                    descriptionLength >= 120 && descriptionLength <= 160
                      ? "text-green-600"
                      : descriptionLength > 160
                        ? "text-red-600"
                        : "text-muted-foreground"
                  )}
                >
                  {descriptionLength}/160
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {showCanonical && (
          <FormField
            control={form.control}
            name="canonicalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canonical URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/sayfa"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Yinelenen içerik varsa orijinal URL&apos;yi belirtin
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {showRobots && (
          <FormField
            control={form.control}
            name="robots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Robots Meta</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || "index, follow"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="index, follow">Index, Follow</SelectItem>
                    <SelectItem value="noindex, follow">NoIndex, Follow</SelectItem>
                    <SelectItem value="index, nofollow">Index, NoFollow</SelectItem>
                    <SelectItem value="noindex, nofollow">NoIndex, NoFollow</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {showOgImage && (
          <FormField
            control={form.control}
            name="ogImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OG Görseli</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/og-image.jpg"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Sosyal medyada paylaşıldığında görünecek görsel (1200x630px önerilir)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  )
}
