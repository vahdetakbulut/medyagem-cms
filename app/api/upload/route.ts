import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const DEFAULT_SITE_ID = "default-site"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "general"

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Geçersiz dosya türü" }, { status: 400 })
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Dosya boyutu çok büyük (max 10MB)" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${folder}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    // Save to database
    const media = await prisma.media.create({
      data: {
        siteId: DEFAULT_SITE_ID,
        filename: blob.pathname,
        originalName: file.name,
        url: blob.url,
        mimeType: file.type,
        size: file.size,
        folder,
      },
    })

    return NextResponse.json({
      url: blob.url,
      id: media.id,
      filename: media.filename,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Dosya yüklenemedi" }, { status: 500 })
  }
}
