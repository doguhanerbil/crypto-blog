import { supabase } from '@/lib/supabase/client'

export async function getPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(full_name, avatar_url),
        categories:post_categories(category:categories(name, slug)),
        tags:post_tags(tag:tags(name, slug))
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      return []
    }

    console.log('Posts data:', data)
    return data || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getFeaturedPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(full_name, avatar_url),
        categories:post_categories(category:categories(name, slug)),
        tags:post_tags(tag:tags(name, slug))
      `)
      .eq('status', 'published')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error fetching featured posts:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(full_name, avatar_url),
        categories:post_categories(category:categories(name, slug)),
        tags:post_tags(tag:tags(name, slug)),
        post_media:post_media(order, caption, media:media_id(url, type, alt_text))
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Error fetching post by slug:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}

export async function getPostsByCategory(categorySlug: string) {
  try {
    // Önce kategori ID'sini bul
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (categoryError || !category) {
      console.error('Error fetching category:', categoryError)
      return []
    }

    // Kategoriye ait post ID'lerini bul
    const { data: postCategories, error: postCategoriesError } = await supabase
      .from('post_categories')
      .select('post_id')
      .eq('category_id', category.id)

    if (postCategoriesError) {
      console.error('Error fetching post categories:', postCategoriesError)
      return []
    }

    const postIds = postCategories.map(pc => pc.post_id)
    
    if (postIds.length === 0) {
      return []
    }

    // Post ID'leri ile postları getir
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(full_name, avatar_url),
        categories:post_categories(category:categories(name, slug)),
        tags:post_tags(tag:tags(name, slug))
      `)
      .eq('status', 'published')
      .in('id', postIds)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts by category:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }
}

export async function getPostsByTag(tagSlug: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(full_name, avatar_url),
        categories:post_categories(category:categories(name, slug)),
        tags:post_tags(tag:tags(name, slug))
      `)
      .eq('status', 'published')
      .eq('tags.tag.slug', tagSlug)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts by tag:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching posts by tag:', error)
    return []
  }
}

export async function getPostById(id: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(full_name, avatar_url),
        categories:post_categories(category:categories(name, slug)),
        tags:post_tags(tag:tags(name, slug))
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching post by id:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching post by id:', error)
    return null
  }
}

export async function getPostsByAuthor(authorName: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(full_name, avatar_url),
        categories:post_categories(category:categories(name, slug)),
        tags:post_tags(tag:tags(name, slug))
      `)
      .eq('status', 'published')
      .eq('author_name', authorName)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts by author:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching posts by author:', error)
    return []
  }
} 