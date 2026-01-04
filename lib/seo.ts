// Type imports removed - types are not used in this file

// ============================================
// SEO HELPERS
// ============================================

export function generateMetaTitle(title: string, siteName?: string): string {
  if (siteName) {
    return `${title} | ${siteName}`
  }
  return title
}

export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + "..."
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

export function generateExcerpt(content: string, maxLength: number = 160): string {
  const text = stripHtml(content)
  return truncateDescription(text, maxLength)
}

// ============================================
// SCHEMA MARKUP GENERATORS
// ============================================

interface LocalBusinessSchema {
  name: string
  phone?: string | null
  email?: string | null
  address?: string | null
  priceRange?: string | null
  businessType?: string
  url?: string
  logo?: string | null
}

export function generateLocalBusinessSchema(data: LocalBusinessSchema): object {
  return {
    "@context": "https://schema.org",
    "@type": data.businessType || "LocalBusiness",
    name: data.name,
    ...(data.phone && { telephone: data.phone }),
    ...(data.email && { email: data.email }),
    ...(data.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: data.address,
      },
    }),
    ...(data.priceRange && { priceRange: data.priceRange }),
    ...(data.url && { url: data.url }),
    ...(data.logo && { logo: data.logo }),
  }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(faq.answer),
      },
    })),
  }
}

interface ArticleSchemaData {
  title: string
  description?: string | null
  image?: string | null
  publishedAt?: Date | null
  updatedAt: Date
  authorName?: string
  url?: string
}

export function generateArticleSchema(data: ArticleSchemaData): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    ...(data.description && { description: data.description }),
    ...(data.image && { image: data.image }),
    ...(data.publishedAt && { datePublished: data.publishedAt.toISOString() }),
    dateModified: data.updatedAt.toISOString(),
    ...(data.authorName && {
      author: {
        "@type": "Person",
        name: data.authorName,
      },
    }),
    ...(data.url && { url: data.url }),
  }
}

interface ServiceSchemaData {
  name: string
  description?: string | null
  image?: string | null
  provider: {
    name: string
    url?: string
  }
  areaServed?: string[]
  url?: string
}

export function generateServiceSchema(data: ServiceSchemaData): object {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.name,
    ...(data.description && { description: data.description }),
    ...(data.image && { image: data.image }),
    provider: {
      "@type": "LocalBusiness",
      name: data.provider.name,
      ...(data.provider.url && { url: data.provider.url }),
    },
    ...(data.areaServed &&
      data.areaServed.length > 0 && {
        areaServed: data.areaServed.map((area) => ({
          "@type": "City",
          name: area,
        })),
      }),
    ...(data.url && { url: data.url }),
  }
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// ============================================
// SITEMAP HELPERS
// ============================================

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
}

export function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ""}
  </url>`
    )
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`
}

export function generateRobotsTxt(domain: string, disallowPaths: string[] = ["/admin/"]): string {
  const disallowLines = disallowPaths.map((path) => `Disallow: ${path}`).join("\n")
  return `User-agent: *
Allow: /
${disallowLines}
Sitemap: ${domain}/sitemap.xml`
}

// ============================================
// SEO ANALYSIS
// ============================================

interface SEOAnalysisResult {
  score: number
  issues: string[]
  suggestions: string[]
}

export function analyzeMetaTitle(title?: string | null): SEOAnalysisResult {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 100

  if (!title) {
    issues.push("Meta başlık eksik")
    return { score: 0, issues, suggestions }
  }

  if (title.length < 30) {
    issues.push("Meta başlık çok kısa (30 karakterden az)")
    score -= 20
    suggestions.push("Meta başlığı en az 30 karakter olmalı")
  }

  if (title.length > 60) {
    issues.push("Meta başlık çok uzun (60 karakterden fazla)")
    score -= 20
    suggestions.push("Meta başlığı 60 karakteri geçmemeli")
  }

  return { score, issues, suggestions }
}

export function analyzeMetaDescription(description?: string | null): SEOAnalysisResult {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 100

  if (!description) {
    issues.push("Meta açıklama eksik")
    return { score: 0, issues, suggestions }
  }

  if (description.length < 120) {
    issues.push("Meta açıklama çok kısa (120 karakterden az)")
    score -= 20
    suggestions.push("Meta açıklama en az 120 karakter olmalı")
  }

  if (description.length > 160) {
    issues.push("Meta açıklama çok uzun (160 karakterden fazla)")
    score -= 20
    suggestions.push("Meta açıklama 160 karakteri geçmemeli")
  }

  return { score, issues, suggestions }
}

export function calculateKeywordDensity(content: string, keyword: string): number {
  if (!content || !keyword) return 0

  const text = stripHtml(content).toLowerCase()
  const keywordLower = keyword.toLowerCase()
  const words = text.split(/\s+/)
  const keywordCount = words.filter((word) => word.includes(keywordLower)).length
  const totalWords = words.length

  if (totalWords === 0) return 0
  return (keywordCount / totalWords) * 100
}
