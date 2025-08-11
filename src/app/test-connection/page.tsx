export default async function TestConnection() {
  // API routes kullanarak veri çek
  const postsRes = await fetch('http://localhost:3000/api/posts', { cache: 'no-store' })
  const categoriesRes = await fetch('http://localhost:3000/api/categories', { cache: 'no-store' })
  
  const postsData = await postsRes.json()
  const categoriesData = await categoriesRes.json()

  const posts = postsData.posts || []
  const categories = categoriesData.categories || []

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Veritabanı Bağlantı Testi</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Posts ({posts.length})</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(posts, null, 2)}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Categories ({categories.length})</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(categories, null, 2)}
        </pre>
      </div>
    </div>
  )
} 