import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { auth } from "@/lib/auth"
import { blogSchema } from "@/lib/validators"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
      include: { category: true, author: { select: { name: true } } },
    })
    if (!blog) {
      return NextResponse.json({ error: "Blog bulunamadı" }, { status: 404 })
    }
    return NextResponse.json(blog)
  } catch (error) {
    return NextResponse.json({ error: "Blog yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
    }

    const body = await request.json()
    const validated = blogSchema.parse(body)

    const existing = await prisma.blog.findFirst({
      where: { slug: validated.slug, NOT: { id: params.id } },
    })
    if (existing) {
      return NextResponse.json({ message: "Bu slug zaten kullanılıyor" }, { status: 400 })
    }

    const currentBlog = await prisma.blog.findUnique({ where: { id: params.id } })

    const { categoryId, tags, ...rest } = validated

    const blog = await prisma.blog.update({
      where: { id: params.id },
      data: {
        ...rest,
        categoryId: categoryId || null,
        tags: tags ?? Prisma.JsonNull,
        publishedAt: validated.isPublished && !currentBlog?.publishedAt ? new Date() : currentBlog?.publishedAt,
      },
    })

    return NextResponse.json(blog)
  } catch (error) {
    return NextResponse.json({ error: "Blog güncellenemedi" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
    }

    await prisma.blog.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Blog silinemedi" }, { status: 500 })
  }
}
