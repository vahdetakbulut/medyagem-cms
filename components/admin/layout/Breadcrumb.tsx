"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

const pathNames: Record<string, string> = {
  admin: "Gösterge Paneli",
  pages: "Sayfalar",
  services: "Hizmetler",
  "service-areas": "Hizmet Bölgeleri",
  blogs: "Blog Yazıları",
  categories: "Kategoriler",
  faqs: "Sık Sorulanlar",
  sliders: "Slider",
  counters: "Sayaçlar",
  team: "Ekip",
  testimonials: "Müşteri Yorumları",
  references: "Referanslar",
  gallery: "Foto Galeri",
  videos: "Video Galeri",
  menus: "Menüler",
  header: "Header Menü",
  footer: "Footer Menü",
  media: "Medya Kütüphanesi",
  contacts: "Gelen Kutusu",
  settings: "Site Ayarları",
  general: "Genel",
  contact: "İletişim",
  social: "Sosyal Medya",
  seo: "SEO",
  users: "Yöneticiler",
  new: "Yeni Ekle",
  edit: "Düzenle",
}

export function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  const breadcrumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`
    const isLast = index === segments.length - 1
    const isId = segment.length > 10 && !pathNames[segment]
    const label = isId ? "Düzenle" : pathNames[segment] || segment

    return {
      label,
      path,
      isLast,
    }
  })

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        href="/admin"
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.slice(1).map((item, index) => (
        <div key={item.path} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {item.isLast ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link
              href={item.path}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
