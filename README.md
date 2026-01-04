# MedyaGem CMS

MedyaGem için özel geliştirilmiş, SEO odaklı headless CMS paneli. Çoklu site yönetimi desteği ile profesyonel içerik yönetim sistemi.

## Özellikler

- 🌐 **Çoklu Site Desteği**: Tek panelden birden fazla site yönetimi
- 📝 **Zengin İçerik Editörü**: TipTap ile güçlü metin düzenleme
- 🔍 **SEO Araçları**: Meta tag yönetimi, sitemap, schema markup
- 📱 **Responsive Tasarım**: Mobil uyumlu admin paneli
- 🌙 **Karanlık Mod**: Göz yormayan arayüz
- 🖼️ **Medya Yönetimi**: Vercel Blob ile dosya yükleme
- 🔐 **Güvenli Kimlik Doğrulama**: NextAuth.js ile oturum yönetimi

## Teknoloji Stack

- **Framework**: Next.js 14 (App Router)
- **Veritabanı**: Vercel Postgres
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **UI**: Tailwind CSS + shadcn/ui
- **Rich Text**: TipTap Editor
- **File Storage**: Vercel Blob
- **Form Validation**: Zod + React Hook Form

## Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Vercel hesabı (veritabanı ve blob storage için)

### Adımlar

1. **Repoyu klonlayın**
   ```bash
   git clone https://github.com/vahdetakbulut/medyagem-cms.git
   cd medyagem-cms
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Environment değişkenlerini ayarlayın**
   ```bash
   cp .env.example .env
   ```

   `.env` dosyasını düzenleyin ve gerekli değerleri girin:
   - `DATABASE_URL`: Vercel Postgres bağlantı URL'i
   - `DIRECT_URL`: Vercel Postgres direct URL
   - `NEXTAUTH_SECRET`: Rastgele güvenli bir anahtar
   - `BLOB_READ_WRITE_TOKEN`: Vercel Blob token

4. **Veritabanını oluşturun**
   ```bash
   npm run db:push
   ```

5. **Seed verilerini yükleyin**
   ```bash
   npm run db:seed
   ```

6. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

7. **Admin paneline erişin**
   - URL: http://localhost:3000/admin
   - E-posta: admin@medyagem.com.tr
   - Şifre: admin123

## Modüller

| Modül | Açıklama |
|-------|----------|
| Sayfalar | Statik sayfa yönetimi (Hakkımızda, İletişim vb.) |
| Hizmetler | Hizmet/ürün sayfaları |
| Hizmet Bölgeleri | Lokasyon bazlı içerik |
| Blog | SEO odaklı blog sistemi |
| SSS | Sık sorulan sorular (FAQ schema) |
| Slider | Ana sayfa hero/slider |
| Sayaçlar | İstatistik gösterimi |
| Ekip | Ekip üyeleri |
| Referanslar | Marka/müşteri logoları |
| Galeri | Foto ve video galeri |
| Menüler | Header/Footer menü yönetimi |
| Medya | Dosya yönetim sistemi |
| Mesajlar | İletişim formu mesajları |

## API Endpoints

### Public API
- `GET /api/public/site` - Site bilgileri
- `GET /api/public/pages` - Sayfa listesi
- `GET /api/public/services` - Hizmet listesi
- `GET /api/public/blogs` - Blog listesi
- `POST /api/public/contact` - İletişim formu

### Admin API
- `GET/POST /api/admin/{model}` - CRUD işlemleri
- `GET/PUT/DELETE /api/admin/{model}/{id}` - Tekil kayıt işlemleri

## Deployment

### Vercel ile Deploy

1. GitHub reposunu Vercel'e bağlayın
2. Environment değişkenlerini Vercel dashboard'dan ekleyin
3. Vercel Postgres ve Blob Storage oluşturun
4. Deploy edin

```bash
# Build komutu
prisma generate && next build

# Install komutu
npm install
```

## Lisans

Bu proje MedyaGem için özel olarak geliştirilmiştir.

## İletişim

- Website: [medyagem.com.tr](https://medyagem.com.tr)
- E-posta: info@medyagem.com.tr
