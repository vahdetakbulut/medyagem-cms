import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { pageSchema } from "@/lib/validators"

const DEFAULT_SITE_ID = "default-site"

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(pages)
  } catch (error) {
    return NextResponse.json({ error: "Sayfalar yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
    }

    const body = await request.json()
    const validated = pageSchema.parse(body)

    // Check slug uniqueness
    const existing = await prisma.page.findFirst({
      where: { slug: validated.slug },
    })
    if (existing) {
      return NextResponse.json({ message: "Bu slug zaten kullanılıyor" }, { status: 400 })
    }

    const page = await prisma.page.create({
      data: {
        ...validated,
        siteId: DEFAULT_SITE_ID,
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error("Create page error:", error)
    return NextResponse.json({ error: "Sayfa oluşturulamadı" }, { status: 500 })
  }
}
