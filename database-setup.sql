-- ============================================
-- MedyaGem CMS Database Setup Script
-- PostgreSQL için tablo oluşturma script'i
-- ============================================

-- ENUMS
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');
CREATE TYPE "PageTemplate" AS ENUM ('DEFAULT', 'CONTACT', 'ABOUT', 'FULL_WIDTH');
CREATE TYPE "MenuLocation" AS ENUM ('HEADER', 'FOOTER', 'FOOTER_SERVICES', 'FOOTER_AREAS');

-- ============================================
-- TABLES
-- ============================================

-- Sites Table
CREATE TABLE "sites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "logo_light" TEXT,
    "logo_dark" TEXT,
    "favicon" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "address" TEXT,
    "working_hours" TEXT,
    "slogan" TEXT,
    "google_analytics_id" TEXT,
    "google_search_console" TEXT,
    "schema_business_type" TEXT NOT NULL DEFAULT 'LocalBusiness',
    "schema_price_range" TEXT,
    "social_facebook" TEXT,
    "social_instagram" TEXT,
    "social_twitter" TEXT,
    "social_youtube" TEXT,
    "social_linkedin" TEXT,
    "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sites_slug_key" ON "sites"("slug");

-- Users Table
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Pages Table
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "template" "PageTemplate" NOT NULL DEFAULT 'DEFAULT',
    "meta_title" TEXT,
    "meta_description" TEXT,
    "canonical_url" TEXT,
    "robots" TEXT NOT NULL DEFAULT 'index, follow',
    "og_image" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pages_site_id_slug_key" ON "pages"("site_id", "slug");

-- Services Table
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "short_description" TEXT,
    "content" TEXT NOT NULL,
    "icon" TEXT,
    "image" TEXT,
    "features" JSONB,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "canonical_url" TEXT,
    "robots" TEXT NOT NULL DEFAULT 'index, follow',
    "og_image" TEXT,
    "show_on_homepage" BOOLEAN NOT NULL DEFAULT true,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "services_site_id_slug_key" ON "services"("site_id", "slug");

-- Service Areas Table
CREATE TABLE "service_areas" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "image" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "canonical_url" TEXT,
    "robots" TEXT NOT NULL DEFAULT 'index, follow',
    "og_image" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_areas_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "service_areas_site_id_slug_key" ON "service_areas"("site_id", "slug");

-- Blog Categories Table
CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "blog_categories_site_id_slug_key" ON "blog_categories"("site_id", "slug");

-- Blogs Table
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featured_image" TEXT,
    "category_id" TEXT,
    "tags" JSONB,
    "author_id" TEXT,
    "focus_keyword" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "canonical_url" TEXT,
    "robots" TEXT NOT NULL DEFAULT 'index, follow',
    "og_image" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "blogs_site_id_slug_key" ON "blogs"("site_id", "slug");

-- FAQs Table
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "service_id" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- Sliders Table
CREATE TABLE "sliders" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "button_text" TEXT,
    "button_link" TEXT,
    "button2_text" TEXT,
    "button2_link" TEXT,
    "background_image" TEXT,
    "background_video" TEXT,
    "features" JSONB,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sliders_pkey" PRIMARY KEY ("id")
);

-- Counters Table
CREATE TABLE "counters" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "suffix" TEXT,
    "prefix" TEXT,
    "icon" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "counters_pkey" PRIMARY KEY ("id")
);

-- Menus Table
CREATE TABLE "menus" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "location" "MenuLocation" NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT,
    "target" TEXT NOT NULL DEFAULT '_self',
    "parent_id" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- Contacts Table
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "source_page" TEXT,
    "ip_address" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_starred" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- Media Table
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "alt_text" TEXT,
    "folder" TEXT NOT NULL DEFAULT 'general',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- Team Members Table
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "bio" TEXT,
    "image" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "social_linkedin" TEXT,
    "social_twitter" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- Testimonials Table
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "company" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "image" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- References Table
CREATE TABLE "references" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "references_pkey" PRIMARY KEY ("id")
);

-- Galleries Table
CREATE TABLE "galleries" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "category" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- Video Galleries Table
CREATE TABLE "video_galleries" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "video_url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_galleries_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- FOREIGN KEYS
-- ============================================

-- Pages Foreign Keys
ALTER TABLE "pages" ADD CONSTRAINT "pages_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Services Foreign Keys
ALTER TABLE "services" ADD CONSTRAINT "services_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Service Areas Foreign Keys
ALTER TABLE "service_areas" ADD CONSTRAINT "service_areas_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Blog Categories Foreign Keys
ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Blogs Foreign Keys
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- FAQs Foreign Keys
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Sliders Foreign Keys
ALTER TABLE "sliders" ADD CONSTRAINT "sliders_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Counters Foreign Keys
ALTER TABLE "counters" ADD CONSTRAINT "counters_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Menus Foreign Keys
ALTER TABLE "menus" ADD CONSTRAINT "menus_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menus" ADD CONSTRAINT "menus_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Contacts Foreign Keys
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Media Foreign Keys
ALTER TABLE "media" ADD CONSTRAINT "media_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Team Members Foreign Keys
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Testimonials Foreign Keys
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- References Foreign Keys
ALTER TABLE "references" ADD CONSTRAINT "references_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Galleries Foreign Keys
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Video Galleries Foreign Keys
ALTER TABLE "video_galleries" ADD CONSTRAINT "video_galleries_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Default Site
INSERT INTO "sites" ("id", "name", "slug", "schema_business_type", "created_at", "updated_at")
VALUES ('default-site', 'MedyaGem', 'default', 'LocalBusiness', NOW(), NOW());

-- Default Admin User (password: admin123)
-- NOT: Şifre hash'i için seed script'ini çalıştırın: npm run db:seed
-- Veya manuel olarak bcrypt hash oluşturun ve aşağıdaki satırı güncelleyin
-- INSERT INTO "users" ("id", "name", "email", "password", "role", "created_at", "updated_at")
-- VALUES ('admin-user', 'Admin', 'admin@medyagem.com.tr', 'BURAYA_BCRYPT_HASH', 'ADMIN', NOW(), NOW());

