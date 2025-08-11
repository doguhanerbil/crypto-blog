import { Suspense } from 'react'
import SearchResults from '@/components/SearchResults'

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Arama Sonuçları
        </h1>
        {query && (
          <p className="text-gray-600 dark:text-gray-400">
            "{query}" için arama sonuçları
          </p>
        )}
      </div>
      
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  )
} 