'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SITE_CONFIG } from '@/lib/constants'
import { Twitter, Github } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getCurrentTheme } from '@/lib/theme'

export default function Footer() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setTheme(getCurrentTheme())
    
    // Tema değişikliklerini dinle
    const handleThemeChange = () => {
      setTheme(getCurrentTheme())
    }
    
    // Storage event'ini dinle
    window.addEventListener('storage', handleThemeChange)
    
    // Custom event için listener
    const handleCustomThemeChange = () => {
      setTheme(getCurrentTheme())
    }
    
    window.addEventListener('themeChanged', handleCustomThemeChange)
    
    return () => {
      window.removeEventListener('storage', handleThemeChange)
      window.removeEventListener('themeChanged', handleCustomThemeChange)
    }
  }, [])

  return (
    <footer className="border-t border-gray-300/50 dark:border-gray-700/50 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src={theme === 'dark' ? '/bitget_logo_white.png' : '/bitget logo.png'}
                alt="Bitget Logo"
                width={100}
                height={100}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kripto dünyasının en güncel haberleri ve analizleri
            </p>
            <div className="flex space-x-4">
              <Link
                href={SITE_CONFIG.links.twitter}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href={SITE_CONFIG.links.github}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Hızlı Linkler
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Hakkında
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Kategoriler
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/bitcoin"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Bitcoin
                </Link>
              </li>
              <li>
                <Link
                  href="/category/ethereum"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Ethereum
                </Link>
              </li>
              <li>
                <Link
                  href="/category/defi"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  DeFi
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Yasal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 {SITE_CONFIG.name}. Tüm hakları saklıdır.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Next.js ve Supabase ile güçlendirilmiştir.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 