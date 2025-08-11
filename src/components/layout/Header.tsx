'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getCurrentTheme } from '@/lib/theme'
import SearchBar from '@/components/SearchBar'

const NAVIGATION = {
  main: [
    { title: 'Ana Sayfa', href: '/' },
    { title: 'Blog', href: '/blog' },
    { title: 'Kategoriler', href: '/category' },
    { title: 'Hakkında', href: '/about' },
  ],
}

export default function Header() {
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
    
    // Periyodik kontrol (güvenlik için)
    const interval = setInterval(() => {
      const currentTheme = getCurrentTheme()
      if (currentTheme !== theme) {
        setTheme(currentTheme)
      }
    }, 100)
    
    return () => {
      window.removeEventListener('storage', handleThemeChange)
      window.removeEventListener('themeChanged', handleCustomThemeChange)
      clearInterval(interval)
    }
  }, [theme])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300/50 backdrop-blur-2xl bg-transparent backdrop:blur-2xl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex h-16 items-center">
          {/* Logo - Sol taraf */}
          <div className="w-32 flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src={'/bitget logo.png'}
                alt="Bitget Logo"
                width={200}
                height={100}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Orta */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {NAVIGATION.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Search ve mobil menü - Sağ taraf */}
          <div className="w-32 flex items-center justify-end space-x-2 flex-shrink-0">
            <SearchBar />
            <Sheet>
              <SheetTrigger asChild>
                <Menu className="h-5 w-5 md:hidden cursor-pointer" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <DialogTitle className="sr-only">Menü</DialogTitle>
                <div className="h-full flex flex-col justify-between">
                  <nav className="flex-1 px-4 py-8 space-y-4">
                    {NAVIGATION.main.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
} 