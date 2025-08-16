'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Breadcrumb() {
  const pathname = usePathname()
  // 'edit' segmentini gizle
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((seg) => seg !== 'edit')

  // /admin/posts/[id] → label olarak slug göster
  const [slugLabel, setSlugLabel] = useState<string | null>(null)
  useEffect(() => {
    async function resolve() {
      try {
        if (segments[0] === 'admin' && segments[1] === 'posts' && segments[2] && segments[2] !== 'new') {
          const id = segments[2]
          const res = await fetch(`/api/admin/posts/${id}`, { cache: 'no-store' })
          if (res.ok) {
            const post = await res.json()
            if (post?.slug) setSlugLabel(post.slug)
            else setSlugLabel(null)
          } else {
            setSlugLabel(null)
          }
        } else {
          setSlugLabel(null)
        }
      } catch {
        setSlugLabel(null)
      }
    }
    resolve()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
      <div className="inline-block px-5 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium">
        <Link href="/" className="hover:underline">Ana Sayfa</Link>
        {segments.length > 0 &&
          segments.map((seg, idx) => (
            <span key={idx}>
              <span className="mx-1">/</span>
              {(() => {
                const text = decodeURIComponent(seg)
                const capitalized = text.charAt(0).toLocaleUpperCase('tr-TR') + text.slice(1)
                const computed = (segments[0] === 'admin' && segments[1] === 'posts' && seg === segments[2] && slugLabel)
                  ? slugLabel
                  : capitalized
                return idx === segments.length - 1 ? (
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{computed}</span>
                ) : (
                  <Link href={'/' + segments.slice(0, idx + 1).join('/')} className="hover:underline">
                    {computed}
                  </Link>
                )
              })()}
            </span>
          ))}
      </div>
    </nav>
  )
} 