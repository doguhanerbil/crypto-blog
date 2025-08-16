
import { notFound } from 'next/navigation'
import { getPostById } from '@/lib/posts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Breadcrumb from '@/components/layout/Breadcrumb'

interface PostViewPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostViewPage({ params }: PostViewPageProps) {
  const { id } = await params
  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Yazı Görüntüle
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Blog yazısının detaylarını görüntüleyin
          </p>
        </div>
        <Button asChild>
          <a href={`/admin/posts/${id}/edit`}>Düzenle</a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Özet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {post.excerpt || 'Özet bulunmuyor'}
            </p>
          </div>

          <div>
            {post.cover_image_url ? (
              <Image src={post.cover_image_url} alt={post.title} width={1200} height={600} className="w-full h-auto rounded" />
            ) : null}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              İçerik
            </h3>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Oluşturulma Tarihi
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(post.created_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Güncellenme Tarihi
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(post.updated_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Slug
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {post.slug}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 