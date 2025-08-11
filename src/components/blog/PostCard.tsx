import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

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
  cover_image_url?: string; // Added this line
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  // Kategori verilerini güvenli bir şekilde kontrol et
  const validCategories = post.categories?.filter(categoryItem => 
    categoryItem && 
    categoryItem.category && 
    categoryItem.category.name && 
    categoryItem.category.slug
  ) || []

  // Kategori bilgisini post.categories dizisinden al
  const category = (post.categories && post.categories[0]?.category?.name) || '';

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Image */}
      {post.cover_image_url ? (
        <img src={post.cover_image_url} alt="Kapak Resmi" className="w-full h-40 object-cover rounded-t" />
      ) : (
        <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-gray-400 text-xs italic rounded-t">
          Kapak resmi yok
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-2">
        <div className="flex items-center text-xs text-gray-500 mb-1 min-w-0">
          <span className="truncate flex-shrink-0">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
          <span className="flex-1" />
          {category && (
            <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 whitespace-nowrap ml-2 flex-shrink-0">
              {category}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {post.excerpt}
        </p>
      </div>
    </article>
  )
} 