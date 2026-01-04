import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { pageSchema } from "@/lib/validators"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = await prisma.page.findUnique({
      where: { id: params.id },
    })
    if (!page) {
      return NextResponse.json({ error: "Sayfa bulunamadı" }, { status: 404 })
    }
    return NextResponse.json(page)
  } catch (error) {
    return NextResponse.json({ error: "Sayfa yüklenemedi" }, { status: 500 })
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
    const validated = pageSchema.parse(body)

    // Check slug uniqueness
    const existing = await prisma.page.findFirst({
      where: { slug: validated.slug, NOT: { id: params.id } },
    })
    if (existing) {
      return NextResponse.json({ message: "Bu slug zaten kullanılıyor" }, { status: 400 })
    }

    const page = await prisma.page.update({
      where: { id: params.id },
      data: validated,
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error("Update page error:", error)
    return NextResponse.json({ error: "Sayfa güncellenemedi" }, { status: 500 })
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

    await prisma.page.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Sayfa silinemedi" }, { status: 500 })
  }
}
