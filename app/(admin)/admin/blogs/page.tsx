"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "@/components/admin/ui/DataTable"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Blog {
  id: string
  title: string
  slug: string
  category?: { name: string } | null
  isFeatured: boolean
  isPublished: boolean
  views: number
  createdAt: Date
}

const columns: Column<Blog>[] = [
  { key: "title", label: "Başlık" },
  { key: "category.name", label: "Kategori", render: (item) => item.category?.name || "-" },
  {
    key: "views",
    label: "Görüntülenme",
    render: (item) => (
      <span className="flex items-center gap-1">
        <Eye className="h-3 w-3" />
        {item.views}
      </span>
    ),
  },
  {
    key: "isFeatured",
    label: "Öne Çıkan",
    render: (item) =>
      item.isFeatured ? (
        <Badge variant="secondary">Öne Çıkan</Badge>
      ) : null,
  },
  { key: "isPublished", label: "Durum" },
  { key: "createdAt", label: "Tarih" },
]

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/admin/blogs")
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch (error) {
      toast({ title: "Hata", description: "Bloglar yüklenemedi", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" })
    if (response.ok) {
      toast({ title: "Başarılı", description: "Blog silindi" })
      fetchBlogs()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Yazıları</h1>
          <p className="text-muted-foreground">Blog yazılarınızı yönetin</p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Yazı
          </Link>
        </Button>
      </div>

      <DataTable
        data={blogs}
        columns={columns}
        isLoading={isLoading}
        basePath="/admin/blogs"
        onDelete={handleDelete}
        searchPlaceholder="Blog ara..."
        emptyMessage="Henüz blog yazısı eklenmemiş"
      />
    </div>
  )
}
