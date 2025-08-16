"use client"
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { Calendar, Eye } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  featured_image?: string
  featured_image_alt?: string
  created_at: string
  published_at?: string
  view_count?: number
  author?: {
    full_name: string
  }
  author_name?: string
  categories?: Array<{
    category: {
      name: string
      slug: string
    } | null
  }>
  cover_image_url?: string; // Added this line
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  // Kategori bilgisini post.categories dizisinden al
  const category = (post.categories && post.categories[0]?.category?.name) || '';
  const isRecent = (() => {
    const created = new Date(post.created_at).getTime()
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
    return Date.now() - created <= sevenDaysMs
  })()

  const [viewCount, setViewCount] = useState<number>(post.view_count ?? 0)

  const sendIncrement = useCallback(() => {
    try {
      const url = `/api/posts/${post.slug}/view`
      const payload = new Blob([JSON.stringify({})], { type: 'application/json' })
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, payload)
      } else {
        fetch(url, { method: 'POST', body: JSON.stringify({}), headers: { 'Content-Type': 'application/json' }, keepalive: true })
      }
    } catch {}
  }, [post.slug])

  const handleClick = () => {
    // optimistic artış
    setViewCount((c) => c + 1)
    sendIncrement()
  }

  const handleAuxClick = () => {
    // orta tık/yeni sekme
    setViewCount((c) => c + 1)
    sendIncrement()
  }

  return (
    <Link href={`/blog/${post.slug}`} className="block group" onClick={handleClick} onAuxClick={handleAuxClick} prefetch>
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow relative min-h-[300px] flex flex-col">
        {isRecent && (
          <span className="absolute left-2 top-2 z-10 rounded bg-black/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Yeni
          </span>
        )}
        {/* Image */}
        {post.cover_image_url ? (
          <img src={post.cover_image_url} alt={post.featured_image_alt || post.title || 'Kapak Resmi'} className="w-full h-40 object-cover rounded-t" />
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-gray-400 text-xs italic rounded-t">
            Kapak resmi yok
          </div>
        )}

        {/* Content */}
        <div className="px-4 py-2 flex-1 flex flex-col">
          <div className="flex items-center text-xs text-gray-500 mb-1 min-w-0">
            <span className="flex items-center gap-1 truncate flex-shrink-0 text-[#2e5dfc]">
              <Calendar className="h-3.5 w-3.5 text-[#2e5dfc]" />
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleString('tr-TR', { year: 'numeric', month: 'short', day: '2-digit' })}
              </time>
            </span>
            <span className="mx-2 text-gray-300">·</span>
            <span className="flex items-center gap-1 flex-shrink-0 text-[#2e5dfc]">
              <Eye className="h-3.5 w-3.5 text-[#2e5dfc]" />
              {viewCount.toLocaleString('tr-TR')}
            </span>
            <span className="flex-1" />
            {category && (
              <span className="px-2 py-0.5 rounded bg-[#2e5dfc] text-white whitespace-nowrap ml-2 flex-shrink-0">
                {category}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:underline">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mt-auto">
            {post.excerpt}
          </p>
        </div>
      </article>
    </Link>
  )
} 