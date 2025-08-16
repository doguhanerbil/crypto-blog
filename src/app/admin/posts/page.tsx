import { getPosts } from '@/lib/posts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Link from 'next/link'
import Filters from './Filters'

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const sp = await searchParams
  const cat = sp?.category
  const q = sp?.q
  // tarih filtreleri kaldırıldı

  // backend api ile filtreli getir
  const qs = new URLSearchParams()
  if (cat) qs.set('category', cat)
  if (q) qs.set('q', q)
  // tarih parametreleri kaldırıldı
  const url = qs.toString() ? `http://localhost:3000/api/posts?${qs.toString()}` : 'http://localhost:3000/api/posts'
  const res = await fetch(url, { cache: 'no-store' })
  const data = await res.json()
  const posts = data.posts || []

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Blog Yazıları
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tüm blog yazılarını yönetin
          </p>
        </div>
        <Button asChild>
          <a href="/admin/posts/new">Yeni Yazı</a>
        </Button>
      </div>

      {/* Filtreler */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <Filters />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yazı Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center max-w-md">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#2e5dfc]/10 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#2e5dfc" xmlns="http://www.w3.org/2000/svg"><path d="M12 4a8 8 0 100 16 8 8 0 000-16zm1 5H8a1 1 0 100 2h5a1 1 0 100-2zm3 4H8a1 1 0 100 2h8a1 1 0 100-2z"/></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">İçerik bulunamadı</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Filtrelerinizi değiştirin ya da silerek tekrar deneyin.</p>
              </div>
            </div>
          ) : (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('tr-TR')}
                  </p>
                  {/* Categories of post */}
                  {Array.isArray(post.categories) && post.categories.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {post.categories.map((c: any, i: number) => (
                        c?.category?.name ? (
                          <span key={i} className="rounded bg-gray-200 px-2 py-0.5 text-[11px] text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                            {c.category.name}
                          </span>
                        ) : null
                      ))}
                    </div>
                  )}
                  {post.cover_image_url ? (
                    <img src={post.cover_image_url} alt="Kapak Resmi" className="w-32 h-20 object-cover rounded mt-2" />
                  ) : (
                    <span className="text-xs text-gray-400 italic">Kapak resmi yok</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/admin/posts/${post.id}`}>Görüntüle</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/admin/posts/${post.id}/edit`}>Düzenle</a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}