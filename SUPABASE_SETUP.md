# Supabase & PostgreSQL Kurulum Rehberi

## 1. Supabase Projesi Oluşturma

### Adım 1: Supabase Hesabı
1. https://supabase.com adresine git
2. GitHub ile giriş yap
3. "New Project" butonuna tıkla

### Adım 2: Proje Ayarları
1. **Organization**: Kendi organizasyonunu seç
2. **Name**: `crypto-blog`
3. **Database Password**: Güçlü bir şifre oluştur (unutma!)
4. **Region**: En yakın bölgeyi seç (örn: West Europe)
5. **Pricing Plan**: Free tier seç
6. "Create new project" butonuna tıkla

### Adım 3: Proje Başlatma
- Proje oluşturma 1-2 dakika sürebilir
- "Project is ready" mesajını bekle

## 2. Veritabanı Şemasını Oluşturma

### Adım 1: SQL Editor'a Git
1. Supabase Dashboard'da projene git
2. Sol menüden "SQL Editor" seç
3. "New query" butonuna tıkla

### Adım 2: Şemayı Çalıştır
1. `database-schema.sql` dosyasının içeriğini kopyala
2. SQL Editor'a yapıştır
3. "Run" butonuna tıkla

### Adım 3: Tabloları Kontrol Et
1. Sol menüden "Table Editor" seç
2. Şu tabloların oluştuğunu kontrol et:
   - `users`
   - `categories`
   - `tags`
   - `posts`
   - `post_categories`
   - `post_tags`
   - `contact_messages`

## 3. Environment Variables Ayarlama

### Adım 1: API Keys'i Al
1. Supabase Dashboard'da "Settings" > "API" seç
2. **Project URL** ve **anon public** key'i kopyala

### Adım 2: .env.local Dosyasını Güncelle
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth.js
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Strapi CMS
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your-strapi-api-token
```

### Adım 3: Service Role Key'i Al
1. Supabase Dashboard'da "Settings" > "API" seç
2. **service_role** key'i kopyala (güvenli tut!)

## 4. Strapi CMS PostgreSQL Bağlantısı

### Adım 1: Strapi .env Dosyası
```bash
cd strapi-cms
cp env.example .env
```

### Adım 2: PostgreSQL Bilgilerini Gir
```bash
# Supabase PostgreSQL bilgileri
DATABASE_CLIENT=postgres
DATABASE_HOST=your-project-ref.supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-database-password
DATABASE_SSL=true
```

### Adım 3: Strapi'yi Başlat
```bash
npm run develop
```

## 5. Test Etme

### Adım 1: Next.js Uygulamasını Test Et
```bash
npm run dev
```

### Adım 2: API Endpoint'lerini Test Et
```bash
# Categories
curl http://localhost:3000/api/categories

# Tags
curl http://localhost:3000/api/tags

# Posts
curl http://localhost:3000/api/posts
```

### Adım 3: Strapi Admin Panelini Test Et
1. http://localhost:1337/admin adresine git
2. Admin hesabı oluştur
3. Content Types'ları kontrol et

## 6. Sorun Giderme

### Bağlantı Sorunları
```bash
# Supabase bağlantısını test et
curl "https://your-project.supabase.co/rest/v1/categories?select=*" \
  -H "apikey: your-anon-key"
```

### SSL Sorunları
```bash
# Strapi database.ts'de SSL ayarlarını kontrol et
ssl: env.bool('DATABASE_SSL', false) && {
  rejectUnauthorized: false,
}
```

### Permission Sorunları
1. Supabase Dashboard'da "Authentication" > "Policies" kontrol et
2. Row Level Security (RLS) ayarlarını gözden geçir

## 7. Production Deployment

### Vercel Environment Variables
1. Vercel Dashboard'da proje ayarlarına git
2. Environment variables ekle:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

### Strapi Production
1. Strapi'yi production modunda build et
2. Environment variables'ları production sunucusuna ekle
3. Database migration'ları çalıştır

## 8. Güvenlik Kontrolleri

### Row Level Security (RLS)
```sql
-- Posts tablosu için RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Sadece published postları herkese göster
CREATE POLICY "Public posts are viewable by everyone" ON posts
  FOR SELECT USING (status = 'PUBLISHED');
```

### API Rate Limiting
- Next.js middleware'de rate limiting aktif
- Supabase'de built-in rate limiting var

### Environment Variables
- `.env.local` dosyasını `.gitignore`'a ekle
- Production'da environment variables'ları güvenli tut 