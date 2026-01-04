"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MediaPickerProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  accept?: string
  className?: string
  aspectRatio?: "square" | "video" | "wide"
}

export function MediaPicker({
  value,
  onChange,
  onRemove,
  accept = "image/*",
  className,
  aspectRatio = "video",
}: MediaPickerProps) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [mediaLibrary, setMediaLibrary] = useState<any[]>([])
  const [loadingLibrary, setLoadingLibrary] = useState(false)

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Yükleme başarısız")

      const data = await response.json()
      onChange(data.url)
      setOpen(false)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput) {
      onChange(urlInput)
      setUrlInput("")
      setOpen(false)
    }
  }

  const loadMediaLibrary = useCallback(async () => {
    setLoadingLibrary(true)
    try {
      const response = await fetch("/api/admin/media")
      if (response.ok) {
        const data = await response.json()
        setMediaLibrary(data)
      }
    } catch (error) {
      console.error("Error loading media:", error)
    } finally {
      setLoadingLibrary(false)
    }
  }, [])

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className={cn("relative overflow-hidden rounded-lg border", aspectRatioClass[aspectRatio])}>
          <Image
            src={value}
            alt="Selected media"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setOpen(true)}
            >
              Değiştir
            </Button>
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50",
            aspectRatioClass[aspectRatio]
          )}
          onClick={() => setOpen(true)}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Görsel Seç</span>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Medya Seç</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="upload" onValueChange={(v) => v === "library" && loadMediaLibrary()}>
            <TabsList className="w-full">
              <TabsTrigger value="upload" className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Yükle
              </TabsTrigger>
              <TabsTrigger value="library" className="flex-1">
                <ImageIcon className="mr-2 h-4 w-4" />
                Kütüphane
              </TabsTrigger>
              <TabsTrigger value="url" className="flex-1">
                <LinkIcon className="mr-2 h-4 w-4" />
                URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="py-4">
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8">
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Yükleniyor...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Dosya yüklemek için tıklayın veya sürükleyin
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF, WEBP (max. 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept={accept}
                      onChange={handleFileUpload}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <Button type="button" variant="secondary" className="relative">
                      Dosya Seç
                      <input
                        type="file"
                        accept={accept}
                        onChange={handleFileUpload}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="library" className="py-4">
              <ScrollArea className="h-[300px]">
                {loadingLibrary ? (
                  <div className="grid grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                  </div>
                ) : mediaLibrary.length === 0 ? (
                  <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                    Medya kütüphanesi boş
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {mediaLibrary.map((media) => (
                      <div
                        key={media.id}
                        className={cn(
                          "relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-colors",
                          value === media.url
                            ? "border-primary"
                            : "border-transparent hover:border-muted-foreground"
                        )}
                        onClick={() => {
                          onChange(media.url)
                          setOpen(false)
                        }}
                      >
                        <Image
                          src={media.url}
                          alt={media.altText || media.filename}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="url" className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Görsel URL</Label>
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button type="button" onClick={handleUrlSubmit} disabled={!urlInput}>
                  Ekle
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
