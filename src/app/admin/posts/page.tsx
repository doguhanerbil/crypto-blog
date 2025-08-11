import { getPosts } from '@/lib/posts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Breadcrumb from '@/components/layout/Breadcrumb'

export default async function AdminPostsPage() {
  const posts = await getPosts()

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

      <Card>
        <CardHeader>
          <CardTitle>Yazı Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
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
        </CardContent>
      </Card>
    </div>
  )
} 