import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const siteId = searchParams.get("siteId") || "default-site"

        const blogs = await prisma.blog.findMany({
            where: {
                siteId,
                isPublished: true
            },
            orderBy: { createdAt: "desc" },
            include: {
                category: {
                    select: {
                        name: true,
                        slug: true
                    }
                },
                author: {
                    select: {
                        name: true,
                        avatar: true
                    }
                }
            }
        })

        return NextResponse.json(blogs)
    } catch (error) {
        console.error("Public Blogs API Error:", error)
        return NextResponse.json({ error: "Blog yazıları alınamadı" }, { status: 500 })
    }
}
