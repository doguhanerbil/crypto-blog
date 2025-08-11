import { searchPosts } from '@/lib/posts'
import PostList from '@/components/blog/PostList'

interface SearchResultsProps {
  query: string
}

export default async function SearchResults({ query }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Arama yapmak için bir terim girin.
        </p>
      </div>
    )
  }

  const posts = await searchPosts(query)

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          "{query}" için sonuç bulunamadı.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {posts.length} sonuç bulundu
      </p>
      <PostList posts={posts} />
    </div>
  )
} 