# Crypto Blog

Basit ve modern bir kripto para blog'u. Next.js 15, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

- **Basit Route Yapısı**: Karmaşık route groups olmadan temiz URL'ler
- **Admin Panel**: Site sahibi için basit yönetim paneli
- **Responsive Design**: Mobil ve desktop uyumlu
- **Dark Mode**: Otomatik tema değiştirme
- **Mock Data**: Geliştirme için hazır veriler

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Ana sayfa
│   ├── blog/[slug]/       # Blog yazıları
│   ├── admin/             # Admin paneli
│   ├── login/             # Admin girişi
│   └── api/               # API routes
├── components/            # React component'leri
│   ├── blog/             # Blog component'leri
│   ├── admin/            # Admin component'leri
│   └── ui/               # UI component'leri
└── lib/                  # Utility fonksiyonları
    ├── posts.ts          # Blog yazıları
    ├── categories.ts     # Kategoriler
    └── supabase.ts       # Supabase client
```

## 🔗 URL Yapısı

### Public
- `/` - Ana sayfa
- `/blog/post-title` - Blog yazısı
- `/category/tech` - Kategori
- `/tag/nextjs` - Tag
- `/search` - Arama
- `/login` - Admin girişi

### Admin
- `/admin` - Dashboard
- `/admin/posts` - Yazı yönetimi
- `/admin/posts/new` - Yeni yazı
- `/admin/categories` - Kategoriler
- `/admin/settings` - Ayarlar

## 🛠️ Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Environment variables'ları ayarlayın:**
```bash
cp env.example env.local
```

3. **Development server'ı başlatın:**
```bash
npm run dev
```

## 🔐 Admin Girişi

- **E-posta:** admin@example.com
- **Şifre:** admin123

## 🎨 Teknolojiler

- **Next.js 15** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI component'leri
- **Supabase** - Backend (opsiyonel)

## 📝 Mock Data

Proje geliştirme için hazır mock data içerir:
- 3 örnek blog yazısı
- 4 kategori
- 4 tag

## 🚀 Deployment

```bash
npm run build
npm start
```

## 📄 Lisans

MIT
