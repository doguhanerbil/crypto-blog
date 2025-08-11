'use client'

import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Bir Hata Oluştu
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Sayfa yüklenirken beklenmeyen bir hata oluştu.
        </p>
        <div className="space-x-4">
          <Button onClick={reset}>
            Tekrar Dene
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  )
} 