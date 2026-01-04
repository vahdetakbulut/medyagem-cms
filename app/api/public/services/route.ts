import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const siteId = searchParams.get("siteId") || "default-site"

        const services = await prisma.service.findMany({
            where: {
                siteId,
                isPublished: true
            },
            orderBy: { order: "asc" },
            select: {
                id: true,
                title: true,
                slug: true,
                shortDescription: true,
                icon: true,
                image: true,
                showOnHomepage: true,
            }
        })

        return NextResponse.json(services)
    } catch (error) {
        console.error("Public Services API Error:", error)
        return NextResponse.json({ error: "Hizmetler alınamadı" }, { status: 500 })
    }
}
