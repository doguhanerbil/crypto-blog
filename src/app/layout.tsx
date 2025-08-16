import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SITE_CONFIG, SEO } from '@/lib/constants'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BfCacheRefresh from './BfCacheRefresh'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SEO.DEFAULT_KEYWORDS],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Tüm tema sınıflarını kaldır
                  document.documentElement.classList.remove('light', 'dark');
                  
                  // localStorage'dan tema al
                  var theme = localStorage.getItem('theme');
                  var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  // Tema belirle
                  var finalTheme = 'light';
                  if (theme === 'dark' || (!theme && isDark)) {
                    finalTheme = 'dark';
                  }
                  
                  // Tema sınıfını ekle
                  document.documentElement.classList.add(finalTheme);
                  
                  console.log('Initial theme set to:', finalTheme);
                } catch (e) {
                  console.error('Theme initialization error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          <BfCacheRefresh />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
