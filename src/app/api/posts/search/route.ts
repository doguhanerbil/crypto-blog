import { NextRequest, NextResponse } from 'next/server'
import { getPosts } from '@/lib/posts'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ posts: [] })
    }

    // Tüm postları al
    const allPosts = await getPosts()

    // Kategorileri içeren postları filtrele
    const filteredPosts = allPosts.filter(post => {
      const searchTerm = query.toLowerCase().trim()
      
      // Başlıkta ara (contains)
      if (post.title.toLowerCase().includes(searchTerm)) {
        return true
      }
      
      // İçerikte ara (contains)
      if (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm)) {
        return true
      }
      
      // Kategorilerde ara (contains)
      if (post.categories && Array.isArray(post.categories)) {
        const categoryMatch = post.categories.some(categoryItem => {
          if (categoryItem && categoryItem.category && categoryItem.category.name) {
            const categoryName = categoryItem.category.name.toLowerCase()
            if (categoryName.includes(searchTerm)) {
              return true
            }
          }
          return false
        })
        
        if (categoryMatch) {
          return true
        }
      }
      
      return false
    })

    // Sonuçları tarihe göre sırala (en yeni önce)
    const sortedPosts = filteredPosts.sort((a, b) => 
      new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime()
    )

    return NextResponse.json({ 
      posts: sortedPosts,
      total: sortedPosts.length,
      query: query
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Arama sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
} 