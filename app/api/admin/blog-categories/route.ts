import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { blogCategorySchema } from "@/lib/validators"

const DEFAULT_SITE_ID = "default-site"

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Kategoriler yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
    }

    const body = await request.json()
    const validated = blogCategorySchema.parse(body)

    const category = await prisma.blogCategory.create({
      data: {
        ...validated,
        siteId: DEFAULT_SITE_ID,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Kategori oluşturulamadı" }, { status: 500 })
  }
}
