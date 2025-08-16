import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'
import { Calendar, User, Eye } from 'lucide-react'
import Link from 'next/link'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-2 text-[#2e5dfc]">
              <Calendar className="h-4 w-4 text-[#2e5dfc]" />
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleString('tr-TR', { year: 'numeric', month: 'long', day: '2-digit' })}
              </time>
            </span>
            <ViewCounter slug={post.slug} initial={post.view_count ?? 0} />
            {post.author_name && (
              <span className="flex items-center gap-2 text-[#2e5dfc]">
                <User className="h-4 w-4 text-[#2e5dfc]" />
                {post.author_name}
              </span>
            )}
          </div>
        </header>

        {/* Medya gösterimi */}
        {post.cover_image_url ? (
          <img src={post.cover_image_url} alt="Kapak Resmi" className="w-full h-64 object-cover rounded mb-4" />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400 text-xs italic rounded mb-4">
            Kapak resmi yok
          </div>
        )}

        {post.post_media && post.post_media.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8">
            {post.post_media.map((pm: any, idx: number) => (
              <div key={idx} className="border rounded p-2 w-48">
                {pm.media.type === 'image' ? (
                  <img src={pm.media.url} alt={pm.media.alt_text} className="w-full h-32 object-cover rounded" />
                ) : pm.media.type === 'video' ? (
                  <video src={pm.media.url} controls className="w-full h-32" />
                ) : (
                  <a href={pm.media.url} target="_blank" rel="noopener noreferrer">Dosya</a>
                )}
                <div className="text-xs text-gray-500 mt-1">{pm.caption}</div>
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          {Array.isArray((post as any).content_paragraphs) && (post as any).content_paragraphs.length > 0 ? (
            (post as any).content_paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))
          ) : (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          )}
        </div>

        {/* Son Yazılar (grid) */}
        <RecentPostsGrid currentSlug={post.slug} />
      </article>
    </div>
  )
} 

async function RecentPostsGrid({ currentSlug }: { currentSlug: string }) {
  // Basit server-side fetch (blog/index sayfasında da bu yöntem kullanılıyor)
  const res = await fetch('http://localhost:3000/api/posts?limit=6', { cache: 'no-store' })
  const data = await res.json()
  const items: Array<{ id: string; title: string; slug: string; created_at: string; cover_image_url?: string; categories?: any[] }> = (data.posts || [])
    .filter((p: any) => p.slug !== currentSlug)
    .slice(0, 3)

  if (!items.length) return null

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Son Yazılar</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="group overflow-hidden rounded-lg border hover:shadow-md transition-shadow">
            {/* Image */}
            {p.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.cover_image_url} alt={p.title} className="h-40 w-full object-cover" />
            ) : (
              <div className="h-40 w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                Kapak resmi yok
              </div>
            )}
            <div className="p-4">
              <div className="text-xs text-gray-500">
                {new Date(p.created_at).toLocaleDateString('tr-TR')}
              </div>
              <div className="mt-1 line-clamp-2 font-medium text-gray-900 dark:text-gray-100 group-hover:underline">
                {p.title}
              </div>
              {/* Categories */}
              {Array.isArray(p.categories) && p.categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.categories.slice(0, 3).map((c: any, i: number) => (
                    c?.category?.name ? (
                      <span key={i} className="rounded bg-[#2e5dfc] px-2 py-0.5 text-[11px] text-white">
                        {c.category.name}
                      </span>
                    ) : null
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// client view counter (optimistic + beacon)
function ViewCounter({ slug, initial }: { slug: string; initial: number }) {
  return (<ClientViewCounter slug={slug} initial={initial} />)
}

// @ts-nocheck
const ClientViewCounter = (() => {
  if (typeof window === 'undefined') return () => null
  const React = require('react')
  const { useEffect, useState } = React as typeof import('react')
  return function Comp({ slug, initial }: { slug: string; initial: number }) {
    const [count, setCount] = useState(initial)
    useEffect(() => {
      // optimistic UI
      setCount((c) => c + 1)
      try {
        const url = `/api/posts/${slug}/view`
        const payload = new Blob([JSON.stringify({})], { type: 'application/json' })
        if (navigator.sendBeacon) {
          navigator.sendBeacon(url, payload)
        } else {
          fetch(url, { method: 'POST', body: JSON.stringify({}), headers: { 'Content-Type': 'application/json' }, keepalive: true })
        }
      } catch {}
      // no need to await; UI zaten arttı
    }, [slug])
    return (
      <span className="flex items-center gap-2 text-[#2e5dfc]">
        <Eye className="h-4 w-4 text-[#2e5dfc]" />
        {count.toLocaleString('tr-TR')}
      </span>
    )
  }
})()