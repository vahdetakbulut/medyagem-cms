import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, phone, subject, message, siteId = "default-site" } = body

        if (!name || !message) {
            return NextResponse.json({ error: "İsim ve mesaj alanları zorunludur" }, { status: 400 })
        }

        const contact = await prisma.contact.create({
            data: {
                siteId,
                name,
                email,
                phone,
                subject,
                message,
            }
        })

        return NextResponse.json({ success: true, id: contact.id }, { status: 201 })
    } catch (error) {
        console.error("Public Contact API Error:", error)
        return NextResponse.json({ error: "Mesaj gönderilemedi" }, { status: 500 })
    }
}
