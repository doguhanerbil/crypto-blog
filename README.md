# Kripto Blog

Modern bir kripto para blog sitesi. Next.js, PostgreSQL (Supabase) ve Strapi CMS kullanılarak geliştirilmiştir.

## Özellikler

### 🚀 Ana Özellikler
- **Blog Yönetimi**: Makaleler, analizler, videolar ve grafikler yayınlama
- **Medya Yönetimi**: Strapi CMS ile güvenli dosya depolama ve yönetimi
- **Admin Paneli**: İçerik yönetimi için kapsamlı admin arayüzü
- **Kategori ve Etiket Sistemi**: İçerikleri organize etme
- **İletişim Formu**: Ziyaretçilerden mesaj alma
- **Responsive Tasarım**: Mobil uyumlu modern arayüz

### 🔒 Güvenlik
- **NextAuth.js**: Güvenli kimlik doğrulama
- **Rate Limiting**: API koruması
- **Input Validation**: Giriş doğrulama
- **XSS/CSRF Koruması**: Güvenlik middleware'leri
- **Şifre Hashleme**: bcrypt ile güvenli şifre saklama

### 📊 Teknik Özellikler
- **PostgreSQL (Supabase)**: Modern veritabanı
- **Strapi CMS**: Medya yönetimi ve içerik API'si
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Modern UI framework

## Kurulum

### Gereksinimler
- Node.js 18+ 
- PostgreSQL (Supabase ile önerilir)
- Strapi CMS (medya yönetimi için)

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd crypto-blog
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Strapi CMS Kurulumu
```bash
# Strapi projesini oluştur (zaten oluşturulmuş)
cd strapi-cms

# Strapi'yi başlat
npm run develop
```

Strapi admin paneline http://localhost:1337/admin adresinden erişebilirsiniz.

### 4. Strapi API Token Oluşturma
1. Strapi admin paneline giriş yapın
2. Settings > API Tokens bölümüne gidin
3. "Create new API Token" butonuna tıklayın
4. Token adı: "Media API"
5. Token type: "Full access"
6. Token'ı kopyalayın

### 5. Environment Değişkenlerini Ayarlayın
```bash
cp env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
# PostgreSQL (Supabase)
DATABASE_URL=your-supabase-connection-string

# NextAuth.js
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Strapi CMS (Medya yönetimi için)
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your-strapi-api-token

# AWS S3 (Alternatif medya depolama - opsiyonel)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
```

### 6. Geliştirme Sunucusunu Başlatın
```bash
# Terminal 1: Strapi CMS
cd strapi-cms
npm run develop

# Terminal 2: Next.js
npm run dev
```

http://localhost:3000 adresinde sitenizi görebilirsiniz.

## Strapi CMS Yapılandırması

### Medya Yönetimi
Strapi otomatik olarak medya yönetimi sağlar:
- Resim optimizasyonu (thumbnail, small, medium, large)
- Video desteği
- Dosya yükleme ve organizasyon
- Medya kütüphanesi

### İçerik Tipleri Oluşturma (Opsiyonel)
Strapi'de blog yazıları için content type oluşturabilirsiniz:

1. **Content-Type Builder** > **Create new collection type**
2. **Name**: Post
3. **Fields** ekleyin:
   - Title (Text)
   - Slug (Text, unique)
   - Content (Rich text)
   - Excerpt (Text)
   - Featured Image (Media)
   - Categories (Relation)
   - Tags (Relation)
   - Status (Enumeration: draft, published)
   - Type (Enumeration: article, analysis, video, chart)

### API Endpoints
Strapi otomatik olarak şu endpoint'leri oluşturur:
- `GET /api/posts` - Blog yazılarını listele
- `GET /api/posts/:id` - Tekil yazı getir
- `POST /api/posts` - Yeni yazı oluştur
- `PUT /api/posts/:id` - Yazı güncelle
- `DELETE /api/posts/:id` - Yazı sil

## Veritabanı Şeması

### Kullanıcılar (Users)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'ADMIN' | 'USER',
  image: String,
  emailVerified: Date
}
```

### Blog Yazıları (Posts)
```javascript
{
  title: String,
  slug: String (unique),
  content: String,
  excerpt: String,
  status: 'DRAFT' | 'PUBLISHED',
  type: 'ARTICLE' | 'ANALYSIS' | 'VIDEO' | 'CHART',
  author: ObjectId (ref: User),
  categories: [ObjectId] (ref: Category),
  tags: [ObjectId] (ref: Tag),
  featuredImage: String (Strapi media URL),
  media: [{
    id: Number (Strapi media ID),
    url: String,
    type: 'IMAGE' | 'VIDEO' | 'FILE' | 'CHART',
    altText: String,
    filename: String,
    size: Number,
    order: Number
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  publishedAt: Date
}
```

### Kategoriler (Categories)
```javascript
{
  name: String (unique),
  slug: String (unique),
  description: String,
  color: String,
  icon: String,
  isActive: Boolean
}
```

### Etiketler (Tags)
```javascript
{
  name: String (unique),
  slug: String (unique),
  description: String,
  color: String,
  isActive: Boolean
}
```

### İletişim Mesajları (ContactMessages)
```javascript
{
  name: String,
  email: String,
  subject: String,
  message: String,
  isRead: Boolean,
  isReplied: Boolean,
  ipAddress: String,
  userAgent: String
}
```

## API Endpoints

### Blog Yazıları
- `GET /api/posts` - Tüm yazıları listele
- `GET /api/posts/[slug]` - Tekil yazı getir
- `POST /api/posts` - Yeni yazı oluştur (admin)
- `PUT /api/posts/[slug]` - Yazı güncelle (admin)
- `DELETE /api/posts/[slug]` - Yazı sil (admin)

### Kategoriler
- `GET /api/categories` - Tüm kategorileri listele
- `POST /api/categories` - Yeni kategori oluştur (admin)

### Etiketler
- `GET /api/tags` - Tüm etiketleri listele
- `POST /api/tags` - Yeni etiket oluştur (admin)

### İletişim
- `GET /api/contact` - Mesajları listele (admin)
- `POST /api/contact` - Yeni mesaj gönder

### Medya Yönetimi (Strapi)
- `POST /api/upload` - Dosya yükle (admin)
- `GET /api/media` - Medya listesi (admin)
- `DELETE /api/media` - Medya sil (admin)

## Medya Yönetimi

### Strapi ile Medya Yönetimi
- **Otomatik optimizasyon**: Resimler için thumbnail, small, medium, large formatları
- **Dosya organizasyonu**: Kategorilere göre filtreleme
- **Güvenli yükleme**: Dosya tipi ve boyut kontrolü
- **Medya kütüphanesi**: Tüm dosyaları görüntüleme ve yönetme

### Desteklenen Dosya Tipleri
- **Resimler**: JPEG, PNG, WebP, GIF (max 5MB)
- **Videolar**: MP4, WebM, OGG (max 100MB)
- **Dosyalar**: PDF, DOC, DOCX, TXT (max 10MB)

### Medya Yöneticisi Bileşeni
`MediaManager` bileşeni ile:
- Dosya yükleme
- Medya listesi görüntüleme
- Dosya seçme (tekli/çoklu)
- Dosya silme
- Filtreleme ve sayfalama

## Admin Paneli

### Strapi Admin Paneli
- **URL**: http://localhost:1337/admin
- **Medya yönetimi**: Dosya yükleme, organizasyon, silme
- **İçerik yönetimi**: Blog yazıları, kategoriler, etiketler
- **Kullanıcı yönetimi**: Admin kullanıcıları

### Next.js Admin Paneli
- **URL**: http://localhost:3000/admin
- **Giriş**: NextAuth.js ile kimlik doğrulama
- **İçerik yönetimi**: Blog yazıları oluşturma/düzenleme
- **Medya yöneticisi**: Strapi entegrasyonu

## Güvenlik

### Rate Limiting
- **Auth**: 15 dakikada 5 giriş denemesi
- **API**: 1 dakikada 100 istek
- **Contact**: 1 saatte 3 mesaj
- **Upload**: 1 dakikada 10 dosya

### Güvenlik Middleware'leri
- Input validation
- XSS koruması
- CSRF koruması
- SQL injection koruması (PostgreSQL ile)

## Deployment

### Strapi Deployment
1. **Strapi Cloud** (önerilen)
2. **Railway**
3. **Heroku**
4. **DigitalOcean App Platform**

### Next.js Deployment
1. **Vercel** (önerilen)
2. **Netlify**
3. **Railway**
4. **DigitalOcean App Platform**

### Environment Variables
Production'da şu değişkenleri ayarlayın:
```env
STRAPI_URL=https://your-strapi-app.com
STRAPI_TOKEN=your-production-token
DATABASE_URL=your-production-supabase-connection-string
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-nextjs-app.com
```

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

Sorularınız için issue açabilir veya iletişim formunu kullanabilirsiniz.
