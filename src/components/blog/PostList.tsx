import PostCard from './PostCard'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  featured_image?: string
  featured_image_alt?: string
  created_at: string
  published_at?: string
  author?: {
    full_name: string
  }
  author_name?: string
  categories?: Array<{
    category: {
      name: string
      slug: string
    } | null
  }>
}

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Henüz yazı bulunmuyor
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Yakında yeni içerikler eklenecek.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Son Yazılar
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
} 