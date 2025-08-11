import { getPosts } from '@/lib/posts'
import { getCategories } from '@/lib/categories'

export default async function TestPage() {
  const postsRes = await fetch('http://localhost:3000/api/posts?limit=3', { 
    cache: 'no-store' 
  })
  const postsData = await postsRes.json()
  const posts = postsData.posts || []

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(posts, null, 2)}
      </pre>
    </div>
  )
} 