import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { siteSchema } from "@/lib/validators"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const site = await prisma.site.findUnique({
      where: { id: params.id },
    })
    if (!site) {
      return NextResponse.json({ error: "Site bulunamadı" }, { status: 404 })
    }
    return NextResponse.json(site)
  } catch {
    return NextResponse.json({ error: "Site yüklenemedi" }, { status: 500 })
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
    const validated = siteSchema.parse(body)

    const existing = await prisma.site.findFirst({
      where: { slug: validated.slug, NOT: { id: params.id } },
    })
    if (existing) {
      return NextResponse.json({ message: "Bu slug zaten kullanılıyor" }, { status: 400 })
    }

    const site = await prisma.site.update({
      where: { id: params.id },
      data: validated,
    })

    return NextResponse.json(site)
  } catch (error) {
    console.error("Update site error:", error)
    return NextResponse.json({ error: "Site güncellenemedi" }, { status: 500 })
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

    await prisma.site.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Site silinemedi" }, { status: 500 })
  }
}

