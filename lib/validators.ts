import { z } from "zod"

// ============================================
// COMMON SCHEMAS
// ============================================

export const seoSchema = z.object({
  metaTitle: z.string().max(60).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  canonicalUrl: z.string().url().optional().nullable().or(z.literal("")),
  robots: z.string(),
  ogImage: z.string().optional().nullable(),
})

// ============================================
// SITE SCHEMAS
// ============================================

export const siteSchema = z.object({
  name: z.string().min(1, "Site adı zorunludur"),
  slug: z.string().min(1, "Slug zorunludur"),
  domain: z.string().optional().nullable(),
  logoLight: z.string().optional().nullable(),
  logoDark: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable(),
  workingHours: z.string().optional().nullable(),
  slogan: z.string().optional().nullable(),
  googleAnalyticsId: z.string().optional().nullable(),
  googleSearchConsole: z.string().optional().nullable(),
  schemaBusinessType: z.string().default("LocalBusiness"),
  schemaPriceRange: z.string().optional().nullable(),
  socialFacebook: z.string().optional().nullable(),
  socialInstagram: z.string().optional().nullable(),
  socialTwitter: z.string().optional().nullable(),
  socialYoutube: z.string().optional().nullable(),
  socialLinkedin: z.string().optional().nullable(),
  maintenanceMode: z.boolean().default(false),
})

// ============================================
// USER SCHEMAS
// ============================================

export const userSchema = z.object({
  name: z.string().min(1, "İsim zorunludur"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır").optional(),
  role: z.enum(["ADMIN", "EDITOR"]).default("EDITOR"),
  avatar: z.string().optional().nullable(),
})

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(1, "Şifre zorunludur"),
})

// ============================================
// PAGE SCHEMAS
// ============================================

export const pageSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  slug: z.string().min(1, "Slug zorunludur"),
  content: z.string().min(1, "İçerik zorunludur"),
  template: z.enum(["DEFAULT", "CONTACT", "ABOUT", "FULL_WIDTH"]).default("DEFAULT"),
  isPublished: z.boolean().default(false),
  order: z.number().default(0),
  ...seoSchema.shape,
})

// ============================================
// SERVICE SCHEMAS
// ============================================

export const serviceSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  slug: z.string().min(1, "Slug zorunludur"),
  shortDescription: z.string().optional().nullable(),
  content: z.string().min(1, "İçerik zorunludur"),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  features: z.array(z.string()).optional().nullable(),
  showOnHomepage: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  order: z.number().default(0),
  ...seoSchema.shape,
})

// ============================================
// SERVICE AREA SCHEMAS
// ============================================

export const serviceAreaSchema = z.object({
  name: z.string().min(1, "İsim zorunludur"),
  slug: z.string().min(1, "Slug zorunludur"),
  city: z.string().min(1, "Şehir zorunludur"),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
  order: z.number().default(0),
  ...seoSchema.shape,
})

// ============================================
// BLOG SCHEMAS
// ============================================

export const blogSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  slug: z.string().min(1, "Slug zorunludur"),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "İçerik zorunludur"),
  featuredImage: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  focusKeyword: z.string().optional().nullable(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  publishedAt: z.date().optional().nullable(),
  ...seoSchema.shape,
})

export const blogCategorySchema = z.object({
  name: z.string().min(1, "Kategori adı zorunludur"),
  slug: z.string().min(1, "Slug zorunludur"),
  description: z.string().optional().nullable(),
  order: z.number().default(0),
  metaTitle: z.string().max(60).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
})

// ============================================
// FAQ SCHEMAS
// ============================================

export const faqSchema = z.object({
  question: z.string().min(1, "Soru zorunludur"),
  answer: z.string().min(1, "Cevap zorunludur"),
  category: z.string().optional().nullable(),
  serviceId: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
})

// ============================================
// SLIDER SCHEMAS
// ============================================

export const sliderSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().optional().nullable(),
  button2Text: z.string().optional().nullable(),
  button2Link: z.string().optional().nullable(),
  backgroundImage: z.string().optional().nullable(),
  backgroundVideo: z.string().optional().nullable(),
  features: z.array(z.string()).optional().nullable(),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
})

// ============================================
// COUNTER SCHEMAS
// ============================================

export const counterSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  value: z.string().min(1, "Değer zorunludur"),
  suffix: z.string().optional().nullable(),
  prefix: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
})

// ============================================
// MENU SCHEMAS
// ============================================

export const menuSchema = z.object({
  location: z.enum(["HEADER", "FOOTER", "FOOTER_SERVICES", "FOOTER_AREAS"]),
  title: z.string().min(1, "Başlık zorunludur"),
  link: z.string().optional().nullable(),
  target: z.string().default("_self"),
  parentId: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
})

// ============================================
// CONTACT SCHEMAS
// ============================================

export const contactSchema = z.object({
  name: z.string().min(1, "İsim zorunludur"),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  message: z.string().min(1, "Mesaj zorunludur"),
  sourcePage: z.string().optional().nullable(),
})

// ============================================
// TEAM MEMBER SCHEMAS
// ============================================

export const teamMemberSchema = z.object({
  name: z.string().min(1, "İsim zorunludur"),
  title: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  socialLinkedin: z.string().optional().nullable(),
  socialTwitter: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
})

// ============================================
// TESTIMONIAL SCHEMAS
// ============================================

export const testimonialSchema = z.object({
  name: z.string().min(1, "İsim zorunludur"),
  title: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  content: z.string().min(1, "Yorum zorunludur"),
  rating: z.number().min(1).max(5).default(5),
  image: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
})

// ============================================
// REFERENCE SCHEMAS
// ============================================

export const referenceSchema = z.object({
  name: z.string().min(1, "İsim zorunludur"),
  logo: z.string().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
})

// ============================================
// GALLERY SCHEMAS
// ============================================

export const gallerySchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  description: z.string().optional().nullable(),
  image: z.string().min(1, "Görsel zorunludur"),
  category: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
})

export const videoGallerySchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  description: z.string().optional().nullable(),
  videoUrl: z.string().min(1, "Video URL zorunludur"),
  thumbnail: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
})

// ============================================
// TYPES
// ============================================

export type SiteFormData = z.infer<typeof siteSchema>
export type UserFormData = z.infer<typeof userSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type PageFormData = z.infer<typeof pageSchema>
export type ServiceFormData = z.infer<typeof serviceSchema>
export type ServiceAreaFormData = z.infer<typeof serviceAreaSchema>
export type BlogFormData = z.infer<typeof blogSchema>
export type BlogCategoryFormData = z.infer<typeof blogCategorySchema>
export type FAQFormData = z.infer<typeof faqSchema>
export type SliderFormData = z.infer<typeof sliderSchema>
export type CounterFormData = z.infer<typeof counterSchema>
export type MenuFormData = z.infer<typeof menuSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type TeamMemberFormData = z.infer<typeof teamMemberSchema>
export type TestimonialFormData = z.infer<typeof testimonialSchema>
export type ReferenceFormData = z.infer<typeof referenceSchema>
export type GalleryFormData = z.infer<typeof gallerySchema>
export type VideoGalleryFormData = z.infer<typeof videoGallerySchema>
