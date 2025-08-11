import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Blog Yazısı Bulunamadı</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Aradığınız blog yazısı mevcut değil veya silinmiş olabilir.
        </p>
        <Button asChild>
          <Link href="/">
            Ana Sayfaya Dön
          </Link>
        </Button>
      </div>
    </div>
  )
} 