import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { serviceSchema } from "@/lib/validators"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
    })
    if (!service) {
      return NextResponse.json({ error: "Hizmet bulunamadı" }, { status: 404 })
    }
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Hizmet yüklenemedi" }, { status: 500 })
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
    const validated = serviceSchema.parse(body)

    const existing = await prisma.service.findFirst({
      where: { slug: validated.slug, NOT: { id: params.id } },
    })
    if (existing) {
      return NextResponse.json({ message: "Bu slug zaten kullanılıyor" }, { status: 400 })
    }

    const service = await prisma.service.update({
      where: { id: params.id },
      data: validated,
    })

    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Hizmet güncellenemedi" }, { status: 500 })
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

    await prisma.service.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Hizmet silinemedi" }, { status: 500 })
  }
}
