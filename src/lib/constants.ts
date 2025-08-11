export const SITE_CONFIG = {
  name: 'Bitget Blog',
  description: 'Kripto para ve blockchain hakkında blog',
  url: 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/cryptoblog',
    github: 'https://github.com/cryptoblog',
  },
}

export const NAVIGATION = {
  main: [
    { title: 'Ana Sayfa', href: '/' },
    { title: 'Blog', href: '/blog' },
    { title: 'Kategoriler', href: '/category' },
    { title: 'Hakkında', href: '/about' },
  ],
  admin: [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Yazılar', href: '/admin/posts' },
    { title: 'Kategoriler', href: '/admin/categories' },
    { title: 'Etiketler', href: '/admin/tags' },
    { title: 'Medya', href: '/admin/media' },
    { title: 'Ayarlar', href: '/admin/settings' },
  ],
}

export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

export const POST_STATUS_LABELS = {
  [POST_STATUS.DRAFT]: 'Taslak',
  [POST_STATUS.PUBLISHED]: 'Yayında',
  [POST_STATUS.ARCHIVED]: 'Arşiv',
} as const

export const PAGINATION = {
  POSTS_PER_PAGE: 12,
  ADMIN_POSTS_PER_PAGE: 20,
} as const

export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/markdown'],
} as const

export const SEO = {
  DEFAULT_TITLE: 'Bitget Blog - Kripto Dünyasının En Güncel Haberleri',
  DEFAULT_DESCRIPTION: 'Bitcoin, Ethereum ve diğer kripto para birimleri hakkında güncel haberler, analizler ve eğitim içerikleri.',
  DEFAULT_KEYWORDS: ['kripto', 'bitcoin', 'ethereum', 'blockchain', 'defi', 'nft'],
} as const 