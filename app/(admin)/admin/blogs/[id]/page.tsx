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
import { MediaPicker } from "@/components/admin/ui/MediaPicker"
import { useToast } from "@/hooks/use-toast"
import { blogSchema, BlogFormData } from "@/lib/validators"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BlogEditPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(params.id !== "new")
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const isNew = params.id === "new"

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      categoryId: "",
      tags: [],
      focusKeyword: "",
      isFeatured: false,
      isPublished: false,
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      robots: "index, follow",
      ogImage: "",
    },
  })

  useEffect(() => {
    fetchCategories()
    if (!isNew) fetchBlog()
  }, [params.id])

  const fetchCategories = async () => {
    const response = await fetch("/api/admin/blog-categories")
    if (response.ok) setCategories(await response.json())
  }

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/admin/blogs/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        form.reset(data)
      } else {
        router.push("/admin/blogs")
      }
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true)
    try {
      const url = isNew ? "/api/admin/blogs" : `/api/admin/blogs/${params.id}`
      const response = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({ title: "Başarılı", description: isNew ? "Blog oluşturuldu" : "Blog güncellendi" })
        router.push("/admin/blogs")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/blogs"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? "Yeni Blog Yazısı" : "Blog Düzenle"}</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Kaydet
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader><CardTitle>Blog Bilgileri</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Başlık</FormLabel>
                      <FormControl><Input placeholder="Blog başlığı" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <SlugInput value={field.value} sourceValue={form.watch("title")} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="excerpt" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Özet</FormLabel>
                      <FormControl><Textarea rows={3} placeholder="Kısa özet" {...field} value={field.value || ""} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="content" render={({ field }) => (
                    <FormItem>
                      <FormLabel>İçerik</FormLabel>
                      <FormControl><RichEditor content={field.value} onChange={field.onChange} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
              <SEOFields form={form} showFocusKeyword />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Yayın</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="isPublished" render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Yayında</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="isFeatured" render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Öne Çıkan</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="categoryId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Kategori seçin" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Öne Çıkan Görsel</CardTitle></CardHeader>
                <CardContent>
                  <FormField control={form.control} name="featuredImage" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MediaPicker value={field.value || undefined} onChange={field.onChange} onRemove={() => field.onChange("")} />
                      </FormControl>
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
