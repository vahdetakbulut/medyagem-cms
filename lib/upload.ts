import { put, del, list } from "@vercel/blob"

// ============================================
// UPLOAD CONFIGURATION
// ============================================

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// ============================================
// FILE UPLOAD HELPERS
// ============================================

export interface UploadResult {
  url: string
  filename: string
  size: number
  contentType: string
}

export async function uploadFile(
  file: File,
  folder: string = "general"
): Promise<UploadResult> {
  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(
      `Geçersiz dosya türü. İzin verilen türler: ${ALLOWED_FILE_TYPES.join(", ")}`
    )
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Dosya boyutu çok büyük. Maksimum: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Generate unique filename
  const timestamp = Date.now()
  const extension = file.name.split(".").pop()
  const filename = `${folder}/${timestamp}-${generateSlug(file.name)}.${extension}`

  // Upload to Vercel Blob
  const blob = await put(filename, file, {
    access: "public",
  })

  return {
    url: blob.url,
    filename: blob.pathname,
    size: file.size,
    contentType: file.type,
  }
}

export async function deleteFile(url: string): Promise<void> {
  await del(url)
}

export async function listFiles(prefix?: string) {
  const { blobs } = await list({ prefix })
  return blobs
}

// ============================================
// IMAGE HELPERS
// ============================================

export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/")
}

// ============================================
// SLUG HELPERS
// ============================================

const turkishCharMap: Record<string, string> = {
  ç: "c",
  Ç: "C",
  ğ: "g",
  Ğ: "G",
  ı: "i",
  I: "I",
  İ: "I",
  i: "i",
  ö: "o",
  Ö: "O",
  ş: "s",
  Ş: "S",
  ü: "u",
  Ü: "U",
}

export function generateSlug(text: string): string {
  let slug = text.toLowerCase()

  // Replace Turkish characters
  for (const [turkish, english] of Object.entries(turkishCharMap)) {
    slug = slug.replace(new RegExp(turkish, "g"), english.toLowerCase())
  }

  // Remove special characters and replace spaces with dashes
  slug = slug
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  return slug
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || ""
}

export function getMimeTypeFromExtension(extension: string): string {
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    pdf: "application/pdf",
  }
  return mimeTypes[extension] || "application/octet-stream"
}
