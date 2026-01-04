import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create default site
  const site = await prisma.site.upsert({
    where: { slug: "default" },
    update: {},
    create: {
      id: "default-site",
      name: "MedyaGem",
      slug: "default",
      email: "info@example.com",
      phone: "+90 555 555 5555",
      address: "İstanbul, Türkiye",
      schemaBusinessType: "LocalBusiness",
    },
  })

  console.log("Created site:", site.name)

  // Create admin user
  const hashedPassword = await hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@medyagem.com.tr" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@medyagem.com.tr",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("Created admin user:", admin.email)

  // Create sample page
  await prisma.page.upsert({
    where: { siteId_slug: { siteId: site.id, slug: "hakkimizda" } },
    update: {},
    create: {
      siteId: site.id,
      title: "Hakkımızda",
      slug: "hakkimizda",
      content: "<p>Hakkımızda sayfası içeriği buraya gelecek.</p>",
      template: "ABOUT",
      isPublished: true,
      metaTitle: "Hakkımızda | MedyaGem",
      metaDescription: "MedyaGem hakkında bilgi edinin.",
    },
  })

  console.log("Created sample page")

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
