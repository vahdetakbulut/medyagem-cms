"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "@/components/admin/ui/DataTable"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Service {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  showOnHomepage: boolean
  isPublished: boolean
  order: number
  createdAt: Date
}

const columns: Column<Service>[] = [
  { key: "title", label: "Başlık" },
  { key: "slug", label: "Slug", render: (item) => `/hizmetler/${item.slug}` },
  {
    key: "showOnHomepage",
    label: "Anasayfa",
    render: (item) => item.showOnHomepage ? "Evet" : "Hayır"
  },
  { key: "isPublished", label: "Durum" },
  { key: "createdAt", label: "Tarih" },
]

export default function ServicesListPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services")
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hizmetler yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/services/${id}`, { method: "DELETE" })
    if (response.ok) {
      toast({ title: "Başarılı", description: "Hizmet silindi" })
      fetchServices()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hizmetler</h1>
          <p className="text-muted-foreground">Hizmetlerinizi yönetin</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Hizmet
          </Link>
        </Button>
      </div>

      <DataTable
        data={services}
        columns={columns}
        isLoading={isLoading}
        basePath="/admin/services"
        onDelete={handleDelete}
        draggable
        searchPlaceholder="Hizmet ara..."
        emptyMessage="Henüz hizmet eklenmemiş"
      />
    </div>
  )
}
