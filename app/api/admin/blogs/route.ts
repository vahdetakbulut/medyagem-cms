import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { auth } from "@/lib/auth"
import { blogSchema } from "@/lib/validators"

const DEFAULT_SITE_ID = "default-site"

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: { select: { name: true } } },
    })
    return NextResponse.json(blogs)
  } catch (error) {
    return NextResponse.json({ error: "Bloglar yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
    }

    const body = await request.json()
    const validated = blogSchema.parse(body)

    const existing = await prisma.blog.findFirst({
      where: { slug: validated.slug },
    })
    if (existing) {
      return NextResponse.json({ message: "Bu slug zaten kullanılıyor" }, { status: 400 })
    }

    const { tags, ...rest } = validated

    const blog = await prisma.blog.create({
      data: {
        ...rest,
        tags: tags ?? Prisma.JsonNull,
        siteId: DEFAULT_SITE_ID,
        authorId: session.user.id,
        publishedAt: validated.isPublished ? new Date() : null,
      },
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error("Create blog error:", error)
    return NextResponse.json({ error: "Blog oluşturulamadı" }, { status: 500 })
  }
}
