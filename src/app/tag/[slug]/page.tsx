import { notFound } from 'next/navigation'
import { getPostsByTag } from '@/lib/posts'
import { getTagBySlug } from '@/lib/tags'
import PostList from '@/components/blog/PostList'
import Breadcrumb from '@/components/layout/Breadcrumb'

interface TagPageProps {
  params: {
    slug: string
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = await getTagBySlug(params.slug)
  const posts = await getPostsByTag(params.slug)

  if (!tag) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb />
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            #{tag.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bu etiketle {posts.length} yazı bulundu
          </p>
        </header>
        
        <PostList posts={posts} />
      </div>
    </div>
  )
} 