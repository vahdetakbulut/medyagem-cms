import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const site = await prisma.site.findFirst({
      where: { slug: "default" },
    })
    
    if (!site) {
      return NextResponse.json({ error: "Site bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(site)
  } catch (error) {
    console.error("Public Site API Error:", error)
    return NextResponse.json({ error: "Site bilgileri alınamadı" }, { status: 500 })
  }
}
