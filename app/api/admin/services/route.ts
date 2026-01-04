import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { auth } from "@/lib/auth"
import { serviceSchema } from "@/lib/validators"

const DEFAULT_SITE_ID = "default-site"

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: "Hizmetler yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
    }

    const body = await request.json()
    const validated = serviceSchema.parse(body)

    const existing = await prisma.service.findFirst({
      where: { slug: validated.slug },
    })
    if (existing) {
      return NextResponse.json({ message: "Bu slug zaten kullanılıyor" }, { status: 400 })
    }

    const { features, ...rest } = validated

    const service = await prisma.service.create({
      data: {
        ...rest,
        features: features ?? Prisma.JsonNull,
        siteId: DEFAULT_SITE_ID,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("Create service error:", error)
    return NextResponse.json({ error: "Hizmet oluşturulamadı" }, { status: 500 })
  }
}
