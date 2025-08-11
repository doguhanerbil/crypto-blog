import PostList from '@/components/blog/PostList'
import Sidebar from '@/components/blog/Sidebar'
import Pagination from '@/components/blog/Pagination'
import Breadcrumb from '@/components/layout/Breadcrumb'

interface BlogPageProps {
  searchParams: { page?: string }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = parseInt(searchParams.page || '1')
  const postsPerPage = 10
  const offset = (currentPage - 1) * postsPerPage

  // API'den paginated postları al
  const postsRes = await fetch(`http://localhost:3000/api/posts?limit=${postsPerPage}&offset=${offset}`, { 
    cache: 'no-store' 
  })
  const postsData = await postsRes.json()
  const posts = postsData.posts || []

  // Toplam post sayısını al (sadece sayı için)
  const totalPostsRes = await fetch('http://localhost:3000/api/posts', { 
    cache: 'no-store' 
  })
  const totalPostsData = await totalPostsRes.json()
  const totalPosts = totalPostsData.posts?.length || 0
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  // Kategorileri al
  const categoriesRes = await fetch('http://localhost:3000/api/categories', { 
    cache: 'no-store' 
  })
  const categoriesData = await categoriesRes.json()
  const categories = categoriesData.categories || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Breadcrumb />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Blog Yazıları
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kripto para ve blockchain dünyasından en güncel yazılar
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Toplam {totalPosts} yazı • Sayfa {currentPage} / {totalPages}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <PostList posts={posts} />
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/blog"
            />
          </div>
          <div className="lg:col-span-1">
            <Sidebar categories={categories} />
          </div>
        </div>
      </div>
    </div>
  )
} 