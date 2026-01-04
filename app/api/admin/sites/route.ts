import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { siteSchema } from "@/lib/validators"

export async function GET() {
  try {
    const sites = await prisma.site.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(sites)
  } catch {
    return NextResponse.json({ error: "Siteler yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
    }

    const body = await request.json()
    const validated = siteSchema.parse(body)

    const existing = await prisma.site.findFirst({
      where: { slug: validated.slug },
    })
    if (existing) {
      return NextResponse.json({ message: "Bu slug zaten kullanılıyor" }, { status: 400 })
    }

    const site = await prisma.site.create({
      data: validated,
    })

    return NextResponse.json(site, { status: 201 })
  } catch (error) {
    console.error("Create site error:", error)
    return NextResponse.json({ error: "Site oluşturulamadı" }, { status: 500 })
  }
}

