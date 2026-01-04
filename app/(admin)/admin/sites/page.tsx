"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "@/components/admin/ui/DataTable"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Site {
  id: string
  name: string
  slug: string
  domain: string | null
  maintenanceMode: boolean
  createdAt: Date
}

const columns: Column<Site>[] = [
  { key: "name", label: "Site Adı" },
  { key: "slug", label: "Slug" },
  {
    key: "domain",
    label: "Domain",
    render: (item) => item.domain || <span className="text-muted-foreground">-</span>,
  },
  {
    key: "maintenanceMode",
    label: "Durum",
    render: (item) =>
      item.maintenanceMode ? (
        <Badge variant="destructive">Bakım Modu</Badge>
      ) : (
        <Badge variant="default">Aktif</Badge>
      ),
  },
  { key: "createdAt", label: "Oluşturulma" },
]

export default function SitesListPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchSites = async () => {
    try {
      const response = await fetch("/api/admin/sites")
      if (response.ok) {
        const data = await response.json()
        setSites(data)
      }
    } catch {
      toast({
        title: "Hata",
        description: "Siteler yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSites()
  }, [])

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/sites/${id}`, { method: "DELETE" })
    if (response.ok) {
      toast({ title: "Başarılı", description: "Site silindi" })
      fetchSites()
    } else {
      toast({
        title: "Hata",
        description: "Site silinirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Siteler</h1>
          <p className="text-muted-foreground">Sitelerinizi yönetin</p>
        </div>
        <Button asChild>
          <Link href="/admin/sites/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Site
          </Link>
        </Button>
      </div>

      <DataTable
        data={sites}
        columns={columns}
        isLoading={isLoading}
        basePath="/admin/sites"
        onDelete={handleDelete}
        searchPlaceholder="Site ara..."
        emptyMessage="Henüz site eklenmemiş"
      />
    </div>
  )
}

