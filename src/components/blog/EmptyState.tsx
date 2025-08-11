import { FolderOpen, Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  title?: string
  description?: string
  showBackButton?: boolean
  backUrl?: string
  backText?: string
}

export default function EmptyState({
  title = "Henüz yazı bulunmuyor",
  description = "Bu kategoride henüz yazı yayınlanmamış. Yakında yeni içerikler eklenecek.",
  showBackButton = true,
  backUrl = "/",
  backText = "Ana Sayfaya Dön"
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* İkon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
          <FolderOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {/* Başlık */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
        {title}
      </h3>

      {/* Açıklama */}
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      {/* Aksiyon Butonları */}
      <div className="flex flex-col sm:flex-row gap-4">
        {showBackButton && (
          <Link href={backUrl}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {backText}
            </Button>
          </Link>
        )}
        
        <Link href="/blog">
          <Button className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Tüm Yazıları Gör
          </Button>
        </Link>
      </div>

      {/* Dekoratif Elementler */}
      <div className="mt-12 flex space-x-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  )
} 