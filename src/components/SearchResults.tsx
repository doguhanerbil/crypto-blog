'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User } from 'lucide-react'

interface Post {
  id: string
  title: string
  excerpt: string
  slug: string
  published_at: string
  created_at: string
  author: {
    full_name: string
  }
  author_name: string
  categories: {
    category: {
      name: string
      slug: string
    }
  }[]
  featuredImage?: string
}

export default function SearchResults({ query }: { query: string }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query.trim()) {
      setPosts([])
      return
    }

    const searchPosts = async () => {
      setLoading(true)
      setError('')
      
      try {
        const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`)
        
        if (!response.ok) {
          throw new Error('Arama sırasında bir hata oluştu')
        }
        
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(searchPosts, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600 dark:text-gray-400">Aranıyor...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    )
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 dark:text-gray-400">
          Arama yapmak için bir terim girin
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 dark:text-gray-400 mb-4">
          "{query}" için sonuç bulunamadı
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-500">
          Farklı anahtar kelimeler deneyin veya kategorileri kontrol edin
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {posts.length} sonuç bulundu
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {post.featuredImage && (
              <div className="relative h-48">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories && post.categories.map((categoryItem) => (
                  <span
                    key={categoryItem.category.slug}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    {categoryItem.category.name}
                  </span>
                ))}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author?.full_name || post.author_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.published_at || post.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
} 