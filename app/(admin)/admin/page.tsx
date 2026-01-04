import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Briefcase,
  MapPin,
  PenSquare,
  Inbox,
  Eye,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatRelativeTime } from "@/lib/utils"

async function getStats() {
  const [
    pagesCount,
    servicesCount,
    serviceAreasCount,
    blogsCount,
    unreadContactsCount,
  ] = await Promise.all([
    prisma.page.count(),
    prisma.service.count(),
    prisma.serviceArea.count(),
    prisma.blog.count(),
    prisma.contact.count({ where: { isRead: false } }),
  ])

  return {
    pages: pagesCount,
    services: servicesCount,
    serviceAreas: serviceAreasCount,
    blogs: blogsCount,
    unreadContacts: unreadContactsCount,
  }
}

async function getRecentBlogs() {
  return prisma.blog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      isPublished: true,
      createdAt: true,
      views: true,
    },
  })
}

async function getRecentContacts() {
  return prisma.contact.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      subject: true,
      isRead: true,
      createdAt: true,
    },
  })
}

export default async function DashboardPage() {
  const [stats, recentBlogs, recentContacts] = await Promise.all([
    getStats(),
    getRecentBlogs(),
    getRecentContacts(),
  ])

  const statCards = [
    {
      title: "Toplam Sayfa",
      value: stats.pages,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      href: "/admin/pages",
    },
    {
      title: "Toplam Hizmet",
      value: stats.services,
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      href: "/admin/services",
    },
    {
      title: "Hizmet Bölgesi",
      value: stats.serviceAreas,
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      href: "/admin/service-areas",
    },
    {
      title: "Blog Yazısı",
      value: stats.blogs,
      icon: PenSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      href: "/admin/blogs",
    },
    {
      title: "Okunmamış Mesaj",
      value: stats.unreadContacts,
      icon: Inbox,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      href: "/admin/contacts",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gösterge Paneli</h1>
        <p className="text-muted-foreground">
          MedyaGem CMS yönetim paneline hoş geldiniz
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Son Blog Yazıları</CardTitle>
            <Link
              href="/admin/blogs"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Tümünü Gör
            </Link>
          </CardHeader>
          <CardContent>
            {recentBlogs.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                Henüz blog yazısı yok
              </p>
            ) : (
              <div className="space-y-4">
                {recentBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/admin/blogs/${blog.id}`}
                    className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{blog.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(blog.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {blog.views}
                      </div>
                      <Badge
                        variant={blog.isPublished ? "default" : "secondary"}
                        className={
                          blog.isPublished
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : ""
                        }
                      >
                        {blog.isPublished ? "Yayında" : "Taslak"}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Son Mesajlar</CardTitle>
            <Link
              href="/admin/contacts"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Tümünü Gör
            </Link>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                Henüz mesaj yok
              </p>
            ) : (
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <Link
                    key={contact.id}
                    href={`/admin/contacts/${contact.id}`}
                    className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {!contact.isRead && (
                          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
                        )}
                        {contact.name}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {contact.subject || "Konu belirtilmemiş"}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatRelativeTime(contact.createdAt)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
