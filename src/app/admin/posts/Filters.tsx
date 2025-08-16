'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Category = { id: string; name: string; slug: string }

export default function Filters() {
  const router = useRouter()
  const sp = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState(sp.get('category') || '')
  const [q, setQ] = useState(sp.get('q') || '')
  // tarih filtreleri kaldırıldı

  useEffect(() => {
    fetch('/api/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => setCategories([]))
  }, [])

  const apply = () => {
    const params = new URLSearchParams()
    if (selectedCat) params.set('category', selectedCat)
    if (q) params.set('q', q)
    // tarih parametreleri kaldırıldı
    const s = params.toString()
    router.push(s ? `/admin/posts?${s}` : '/admin/posts')
  }

  const reset = () => {
    setSelectedCat('')
    setQ('')
    // tarih state'leri kaldırıldı
    router.push('/admin/posts')
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Kategori</label>
        <div className="relative">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full h-9 appearance-none rounded border px-3 pr-8 text-sm"
          >
            <option value="">Tümü</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#2e5dfc]">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="#2e5dfc" xmlns="http://www.w3.org/2000/svg"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.172l3.71-2.94a.75.75 0 01.94 1.17l-4.2 3.33a.75.75 0 01-.94 0l-4.2-3.33a.75.75 0 01-.02-1.06z"/></svg>
          </span>
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Başlık Ara</label>
        <input
          type="text"
          placeholder="post title"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full h-9 rounded border px-3 text-sm"
        />
      </div>
      <div className="md:col-span-1 flex items-end gap-2">
        <button onClick={apply} className="inline-flex h-9 items-center rounded bg-black px-4 text-white">Filtrele</button>
        <button onClick={reset} className="inline-flex h-9 items-center rounded border px-4">Temizle</button>
      </div>
    </div>
  )
}

