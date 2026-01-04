"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { SlugInput } from "@/components/admin/ui/SlugInput"
import { RichEditor } from "@/components/admin/ui/RichEditor"
import { SEOFields } from "@/components/admin/ui/SEOFields"
import { MediaPicker } from "@/components/admin/ui/MediaPicker"
import { useToast } from "@/hooks/use-toast"
import { serviceSchema, ServiceFormData } from "@/lib/validators"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ServiceEditPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(params.id !== "new")
  const isNew = params.id === "new"

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      content: "",
      icon: "",
      image: "",
      features: [],
      showOnHomepage: true,
      isPublished: false,
      order: 0,
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      robots: "index, follow",
      ogImage: "",
    },
  })

  useEffect(() => {
    if (!isNew) {
      fetchService()
    }
  }, [params.id])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/admin/services/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        form.reset(data)
      } else {
        router.push("/admin/services")
      }
    } catch (error) {
      toast({ title: "Hata", description: "Hizmet yüklenemedi", variant: "destructive" })
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (data: ServiceFormData) => {
    setIsLoading(true)
    try {
      const url = isNew ? "/api/admin/services" : `/api/admin/services/${params.id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({ title: "Başarılı", description: isNew ? "Hizmet oluşturuldu" : "Hizmet güncellendi" })
        router.push("/admin/services")
      } else {
        const error = await response.json()
        toast({ title: "Hata", description: error.message, variant: "destructive" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/services"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isNew ? "Yeni Hizmet" : "Hizmet Düzenle"}</h1>
          </div>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Kaydet
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader><CardTitle>Hizmet Bilgileri</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlık</FormLabel>
                        <FormControl><Input placeholder="Hizmet adı" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <SlugInput value={field.value} sourceValue={form.watch("title")} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kısa Açıklama</FormLabel>
                        <FormControl><Textarea rows={3} placeholder="Kısa açıklama" {...field} value={field.value || ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İçerik</FormLabel>
                        <FormControl><RichEditor content={field.value} onChange={field.onChange} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <SEOFields form={form} />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Yayın Durumu</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Yayında</FormLabel>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="showOnHomepage"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Anasayfada Göster</FormLabel>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sıralama</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Görsel</CardTitle></CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MediaPicker value={field.value || undefined} onChange={field.onChange} onRemove={() => field.onChange("")} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
