"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SlugInput } from "@/components/admin/ui/SlugInput"
import { RichEditor } from "@/components/admin/ui/RichEditor"
import { SEOFields } from "@/components/admin/ui/SEOFields"
import { useToast } from "@/hooks/use-toast"
import { pageSchema, PageFormData } from "@/lib/validators"
import { Loader2, Save, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"

const templates = [
  { value: "DEFAULT", label: "Varsayılan" },
  { value: "CONTACT", label: "İletişim" },
  { value: "ABOUT", label: "Hakkımızda" },
  { value: "FULL_WIDTH", label: "Tam Genişlik" },
]

export default function PageEditPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(params.id !== "new")
  const isNew = params.id === "new"

  const form = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      template: "DEFAULT",
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
      fetchPage()
    }
  }, [params.id])

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/admin/pages/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        form.reset(data)
      } else {
        toast({
          title: "Hata",
          description: "Sayfa bulunamadı",
          variant: "destructive",
        })
        router.push("/admin/pages")
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Sayfa yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (data: PageFormData) => {
    setIsLoading(true)
    try {
      const url = isNew ? "/api/admin/pages" : `/api/admin/pages/${params.id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: isNew ? "Sayfa oluşturuldu" : "Sayfa güncellendi",
        })
        router.push("/admin/pages")
      } else {
        const error = await response.json()
        toast({
          title: "Hata",
          description: error.message || "Bir hata oluştu",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/pages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isNew ? "Yeni Sayfa" : "Sayfa Düzenle"}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Yeni bir sayfa oluşturun" : "Sayfa bilgilerini düzenleyin"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button variant="outline" asChild>
              <Link href={`/${form.getValues("slug")}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Önizle
              </Link>
            </Button>
          )}
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Kaydet
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sayfa Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlık</FormLabel>
                        <FormControl>
                          <Input placeholder="Sayfa başlığı" {...field} />
                        </FormControl>
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
                          <SlugInput
                            value={field.value}
                            sourceValue={form.watch("title")}
                            onChange={field.onChange}
                          />
                        </FormControl>
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
                        <FormControl>
                          <RichEditor
                            content={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
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
                <CardHeader>
                  <CardTitle>Yayın Durumu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Yayında</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şablon</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Şablon seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem
                                key={template.value}
                                value={template.value}
                              >
                                {template.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
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
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
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
