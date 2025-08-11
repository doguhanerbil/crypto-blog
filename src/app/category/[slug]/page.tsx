import { notFound } from 'next/navigation'
import { getPostsByCategory } from '@/lib/posts'
import { getCategoryBySlug, getCategoriesWithPostCount } from '@/lib/categories'
import PostList from '@/components/blog/PostList'
import Sidebar from '@/components/blog/Sidebar'
import EmptyState from '@/components/blog/EmptyState'
import Breadcrumb from '@/components/layout/Breadcrumb'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  
  const [category, posts, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategory(slug),
    getCategoriesWithPostCount()
  ])

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Breadcrumb />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {category.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bu kategoride {posts.length} yazı bulundu
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {posts.length > 0 ? (
              <PostList posts={posts} />
            ) : (
              <EmptyState
                title={`${category.name} kategorisinde henüz yazı bulunmuyor`}
                description="Bu kategoride henüz yazı yayınlanmamış. Diğer kategorilerdeki yazıları inceleyebilir veya ana sayfaya dönebilirsiniz."
                backUrl="/"
                backText="Ana Sayfaya Dön"
              />
            )}
          </div>
          <div className="lg:col-span-1">
            <Sidebar categories={categories} />
          </div>
        </div>
      </div>
    </div>
  )
} 