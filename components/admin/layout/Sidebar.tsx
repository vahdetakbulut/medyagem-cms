"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  ExternalLink,
  Construction,
  FileText,
  Briefcase,
  MapPin,
  PenSquare,
  HelpCircle,
  Images,
  Hash,
  Users,
  Quote,
  Award,
  Image,
  Video,
  Menu,
  PanelBottom,
  FolderOpen,
  Inbox,
  Settings,
  UserCog,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { signOut } from "next-auth/react"

interface NavItem {
  name: string
  slug: string
  icon: React.ReactNode
  path?: string
  action?: string
  type?: string
  badge?: string
  submenu?: { name: string; path: string }[]
}

interface NavGroup {
  group: string
  items: NavItem[]
}

const navigation: NavGroup[] = [
  {
    group: "GENEL",
    items: [
      {
        name: "Gösterge Paneli",
        slug: "dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
        path: "/admin",
      },
      {
        name: "Siteye Git",
        slug: "view-site",
        icon: <ExternalLink className="h-5 w-5" />,
        action: "open_site_new_tab",
      },
    ],
  },
  {
    group: "IÇERIK",
    items: [
      {
        name: "Sayfalar",
        slug: "pages",
        icon: <FileText className="h-5 w-5" />,
        path: "/admin/pages",
      },
      {
        name: "Hizmetler",
        slug: "services",
        icon: <Briefcase className="h-5 w-5" />,
        path: "/admin/services",
      },
      {
        name: "Hizmet Bölgeleri",
        slug: "service-areas",
        icon: <MapPin className="h-5 w-5" />,
        path: "/admin/service-areas",
      },
      {
        name: "Blog Yazıları",
        slug: "blogs",
        icon: <PenSquare className="h-5 w-5" />,
        path: "/admin/blogs",
        submenu: [
          { name: "Tüm Yazılar", path: "/admin/blogs" },
          { name: "Kategoriler", path: "/admin/blogs/categories" },
        ],
      },
      {
        name: "Sık Sorulanlar",
        slug: "faqs",
        icon: <HelpCircle className="h-5 w-5" />,
        path: "/admin/faqs",
      },
    ],
  },
  {
    group: "MODÜLLER",
    items: [
      {
        name: "Slider",
        slug: "sliders",
        icon: <Images className="h-5 w-5" />,
        path: "/admin/sliders",
      },
      {
        name: "Sayaçlar",
        slug: "counters",
        icon: <Hash className="h-5 w-5" />,
        path: "/admin/counters",
      },
      {
        name: "Ekip",
        slug: "team",
        icon: <Users className="h-5 w-5" />,
        path: "/admin/team",
      },
      {
        name: "Müşteri Yorumları",
        slug: "testimonials",
        icon: <Quote className="h-5 w-5" />,
        path: "/admin/testimonials",
      },
      {
        name: "Referanslar",
        slug: "references",
        icon: <Award className="h-5 w-5" />,
        path: "/admin/references",
      },
      {
        name: "Foto Galeri",
        slug: "gallery",
        icon: <Image className="h-5 w-5" />,
        path: "/admin/gallery",
      },
      {
        name: "Video Galeri",
        slug: "videos",
        icon: <Video className="h-5 w-5" />,
        path: "/admin/videos",
      },
    ],
  },
  {
    group: "MENÜ",
    items: [
      {
        name: "Header Menü",
        slug: "header-menu",
        icon: <Menu className="h-5 w-5" />,
        path: "/admin/menus/header",
      },
      {
        name: "Footer Menü",
        slug: "footer-menu",
        icon: <PanelBottom className="h-5 w-5" />,
        path: "/admin/menus/footer",
      },
    ],
  },
  {
    group: "MEDYA",
    items: [
      {
        name: "Medya Kütüphanesi",
        slug: "media",
        icon: <FolderOpen className="h-5 w-5" />,
        path: "/admin/media",
      },
    ],
  },
  {
    group: "ILETIŞIM",
    items: [
      {
        name: "Gelen Kutusu",
        slug: "contacts",
        icon: <Inbox className="h-5 w-5" />,
        path: "/admin/contacts",
        badge: "unread_count",
      },
    ],
  },
  {
    group: "AYARLAR",
    items: [
      {
        name: "Site Ayarları",
        slug: "settings",
        icon: <Settings className="h-5 w-5" />,
        path: "/admin/settings",
        submenu: [
          { name: "Genel", path: "/admin/settings/general" },
          { name: "İletişim", path: "/admin/settings/contact" },
          { name: "Sosyal Medya", path: "/admin/settings/social" },
          { name: "SEO", path: "/admin/settings/seo" },
        ],
      },
      {
        name: "Yöneticiler",
        slug: "users",
        icon: <UserCog className="h-5 w-5" />,
        path: "/admin/users",
      },
    ],
  },
  {
    group: "OTURUM",
    items: [
      {
        name: "Çıkış Yap",
        slug: "logout",
        icon: <LogOut className="h-5 w-5" />,
        action: "logout",
      },
    ],
  },
]

interface SidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function Sidebar({ collapsed = false, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (slug: string) => {
    setExpandedItems((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  const isActive = (path?: string) => {
    if (!path) return false
    if (path === "/admin") return pathname === "/admin"
    return pathname.startsWith(path)
  }

  const handleAction = (action?: string) => {
    if (action === "logout") {
      signOut({ callbackUrl: "/login" })
    } else if (action === "open_site_new_tab") {
      window.open("/", "_blank")
    }
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-[280px]"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              M
            </div>
            <span className="font-semibold">MedyaGem CMS</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapsedChange?.(!collapsed)}
          className={cn(collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <nav className="space-y-2 p-4">
          {navigation.map((group) => (
            <div key={group.group} className="space-y-1">
              {!collapsed && (
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.group}
                </p>
              )}
              {group.items.map((item) => (
                <div key={item.slug}>
                  {item.path ? (
                    <>
                      {item.submenu ? (
                        <div>
                          <button
                            onClick={() => toggleExpanded(item.slug)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                              isActive(item.path)
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            {item.icon}
                            {!collapsed && (
                              <>
                                <span className="flex-1 text-left">{item.name}</span>
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 transition-transform",
                                    expandedItems.includes(item.slug) && "rotate-180"
                                  )}
                                />
                              </>
                            )}
                          </button>
                          {!collapsed && expandedItems.includes(item.slug) && (
                            <div className="ml-9 mt-1 space-y-1">
                              {item.submenu.map((sub) => (
                                <Link
                                  key={sub.path}
                                  href={sub.path}
                                  className={cn(
                                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                                    pathname === sub.path
                                      ? "bg-muted font-medium text-foreground"
                                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                  )}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.path}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive(item.path)
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {item.icon}
                          {!collapsed && (
                            <>
                              <span className="flex-1">{item.name}</span>
                              {item.badge && (
                                <Badge variant="destructive" className="ml-auto">
                                  0
                                </Badge>
                              )}
                            </>
                          )}
                        </Link>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => handleAction(item.action)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.icon}
                      {!collapsed && <span>{item.name}</span>}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}
