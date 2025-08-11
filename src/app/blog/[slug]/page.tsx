import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'

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
            <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
            {post.author_name && (
              <span>Yazar: {post.author_name}</span>
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

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  )
} 