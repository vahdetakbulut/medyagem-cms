import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const siteId = searchParams.get("siteId") || "default-site"

        const pages = await prisma.page.findMany({
            where: {
                siteId,
                isPublished: true
            },
            orderBy: { order: "asc" },
            select: {
                id: true,
                title: true,
                slug: true,
                template: true,
                metaTitle: true,
                metaDescription: true,
            }
        })

        return NextResponse.json(pages)
    } catch (error) {
        console.error("Public Pages API Error:", error)
        return NextResponse.json({ error: "Sayfalar alınamadı" }, { status: 500 })
    }
}
