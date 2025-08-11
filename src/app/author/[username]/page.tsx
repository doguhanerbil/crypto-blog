import { notFound } from 'next/navigation'
import { getPostsByAuthor } from '@/lib/posts'
import Breadcrumb from '@/components/layout/Breadcrumb'

interface AuthorPageProps {
  params: {
    username: string
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const posts = await getPostsByAuthor(params.username)

  if (posts.length === 0) {
    notFound()
  }

  const author = posts[0]?.author || params.username

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb />
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {author}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bu yazarın {posts.length} yazısı bulundu
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('tr-TR')}
                  </span>
                  <a 
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Devamını Oku →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 