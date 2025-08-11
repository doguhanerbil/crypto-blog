'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

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
                return idx === segments.length - 1 ? (
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{capitalized}</span>
                ) : (
                  <Link href={'/' + segments.slice(0, idx + 1).join('/')} className="hover:underline">
                    {capitalized}
                  </Link>
                )
              })()}
            </span>
          ))}
      </div>
    </nav>
  )
} 