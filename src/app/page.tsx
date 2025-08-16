import PostList from '@/components/blog/PostList'
import Sidebar from '@/components/blog/Sidebar'
import Breadcrumb from '@/components/layout/Breadcrumb'

export default async function HomePage() {
  // API routes kullanarak veri çek - anasayfa için son 10 post
  const postsRes = await fetch('http://localhost:3000/api/posts?homepage=true', { cache: 'no-store' })
  const categoriesRes = await fetch('http://localhost:3000/api/categories', { cache: 'no-store' })
  
  const postsData = await postsRes.json()
  const categoriesData = await categoriesRes.json()

  const posts = postsData.posts || []
  const categories = categoriesData.categories || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8">
        <Breadcrumb />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Son Yazılar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kripto para ve blockchain dünyasından en güncel yazılar
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
          <div className="lg:col-span-3">
            <PostList posts={posts} />
          </div>
          <div className="lg:col-span-1">
            <Sidebar categories={categories} />
          </div>
        </div>
      </div>
    </div>
  )
}
