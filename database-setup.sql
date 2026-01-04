-- ============================================
-- MedyaGem CMS Database Setup Script
-- PostgreSQL için tablo oluşturma script'i
-- ============================================

-- ENUMS
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PageTemplate" AS ENUM ('DEFAULT', 'CONTACT', 'ABOUT', 'FULL_WIDTH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "MenuLocation" AS ENUM ('HEADER', 'FOOTER', 'FOOTER_SERVICES', 'FOOTER_AREAS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- TABLES
-- ============================================

-- Sites Table
CREATE TABLE IF NOT EXISTS "sites" (
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

CREATE UNIQUE INDEX IF NOT EXISTS "sites_slug_key" ON "sites"("slug");

-- Users Table
CREATE TABLE IF NOT EXISTS "users" (
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

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Pages Table
CREATE TABLE IF NOT EXISTS "pages" (
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

CREATE UNIQUE INDEX IF NOT EXISTS "pages_site_id_slug_key" ON "pages"("site_id", "slug");

-- Services Table
CREATE TABLE IF NOT EXISTS "services" (
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

CREATE UNIQUE INDEX IF NOT EXISTS "services_site_id_slug_key" ON "services"("site_id", "slug");

-- Service Areas Table
CREATE TABLE IF NOT EXISTS "service_areas" (
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

CREATE UNIQUE INDEX IF NOT EXISTS "service_areas_site_id_slug_key" ON "service_areas"("site_id", "slug");

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS "blog_categories" (
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

CREATE UNIQUE INDEX IF NOT EXISTS "blog_categories_site_id_slug_key" ON "blog_categories"("site_id", "slug");

-- Blogs Table
CREATE TABLE IF NOT EXISTS "blogs" (
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

CREATE UNIQUE INDEX IF NOT EXISTS "blogs_site_id_slug_key" ON "blogs"("site_id", "slug");

-- FAQs Table
CREATE TABLE IF NOT EXISTS "faqs" (
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
CREATE TABLE IF NOT EXISTS "sliders" (
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
CREATE TABLE IF NOT EXISTS "counters" (
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
CREATE TABLE IF NOT EXISTS "menus" (
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
CREATE TABLE IF NOT EXISTS "contacts" (
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
CREATE TABLE IF NOT EXISTS "media" (
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
CREATE TABLE IF NOT EXISTS "team_members" (
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
CREATE TABLE IF NOT EXISTS "testimonials" (
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
CREATE TABLE IF NOT EXISTS "references" (
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
CREATE TABLE IF NOT EXISTS "galleries" (
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
CREATE TABLE IF NOT EXISTS "video_galleries" (
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
DO $$ BEGIN
    ALTER TABLE "pages" ADD CONSTRAINT "pages_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Services Foreign Keys
DO $$ BEGIN
    ALTER TABLE "services" ADD CONSTRAINT "services_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Service Areas Foreign Keys
DO $$ BEGIN
    ALTER TABLE "service_areas" ADD CONSTRAINT "service_areas_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Blog Categories Foreign Keys
DO $$ BEGIN
    ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Blogs Foreign Keys
DO $$ BEGIN
    ALTER TABLE "blogs" ADD CONSTRAINT "blogs_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- FAQs Foreign Keys
DO $$ BEGIN
    ALTER TABLE "faqs" ADD CONSTRAINT "faqs_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    ALTER TABLE "faqs" ADD CONSTRAINT "faqs_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Sliders Foreign Keys
DO $$ BEGIN
    ALTER TABLE "sliders" ADD CONSTRAINT "sliders_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Counters Foreign Keys
DO $$ BEGIN
    ALTER TABLE "counters" ADD CONSTRAINT "counters_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Menus Foreign Keys
DO $$ BEGIN
    ALTER TABLE "menus" ADD CONSTRAINT "menus_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    ALTER TABLE "menus" ADD CONSTRAINT "menus_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Contacts Foreign Keys
DO $$ BEGIN
    ALTER TABLE "contacts" ADD CONSTRAINT "contacts_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Media Foreign Keys
DO $$ BEGIN
    ALTER TABLE "media" ADD CONSTRAINT "media_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Team Members Foreign Keys
DO $$ BEGIN
    ALTER TABLE "team_members" ADD CONSTRAINT "team_members_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Testimonials Foreign Keys
DO $$ BEGIN
    ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- References Foreign Keys
DO $$ BEGIN
    ALTER TABLE "references" ADD CONSTRAINT "references_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Galleries Foreign Keys
DO $$ BEGIN
    ALTER TABLE "galleries" ADD CONSTRAINT "galleries_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Video Galleries Foreign Keys
DO $$ BEGIN
    ALTER TABLE "video_galleries" ADD CONSTRAINT "video_galleries_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Default Site
INSERT INTO "sites" ("id", "name", "slug", "schema_business_type", "created_at", "updated_at")
VALUES ('default-site', 'MedyaGem', 'default', 'LocalBusiness', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Default Admin User (password: admin123)
-- NOT: Şifre hash'i için seed script'ini çalıştırın: npm run db:seed
-- Veya manuel olarak bcrypt hash oluşturun ve aşağıdaki satırı güncelleyin
-- INSERT INTO "users" ("id", "name", "email", "password", "role", "created_at", "updated_at")
-- VALUES ('admin-user', 'Admin', 'admin@medyagem.com.tr', 'BURAYA_BCRYPT_HASH', 'ADMIN', NOW(), NOW());

