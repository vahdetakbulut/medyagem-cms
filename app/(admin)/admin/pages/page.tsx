"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "@/components/admin/ui/DataTable"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Page {
  id: string
  title: string
  slug: string
  template: string
  isPublished: boolean
  createdAt: Date
}

const columns: Column<Page>[] = [
  { key: "title", label: "Başlık" },
  { key: "slug", label: "Slug", render: (item) => `/${item.slug}` },
  { key: "template", label: "Şablon" },
  { key: "isPublished", label: "Durum" },
  { key: "createdAt", label: "Tarih" },
]

export default function PagesListPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/admin/pages")
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Sayfalar yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/pages/${id}`, {
      method: "DELETE",
    })
    if (response.ok) {
      toast({ title: "Başarılı", description: "Sayfa silindi" })
      fetchPages()
    } else {
      toast({
        title: "Hata",
        description: "Sayfa silinirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    const response = await fetch("/api/admin/pages/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
    if (response.ok) {
      toast({ title: "Başarılı", description: `${ids.length} sayfa silindi` })
      fetchPages()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sayfalar</h1>
          <p className="text-muted-foreground">
            Statik sayfaları yönetin
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Sayfa
          </Link>
        </Button>
      </div>

      <DataTable
        data={pages}
        columns={columns}
        isLoading={isLoading}
        basePath="/admin/pages"
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        searchPlaceholder="Sayfa ara..."
        emptyMessage="Henüz sayfa eklenmemiş"
      />
    </div>
  )
}
