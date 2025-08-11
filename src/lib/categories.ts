import { supabase } from '@/lib/supabase/client'

export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategoriesWithPostCount() {
  try {
    // Önce tüm kategorileri al
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
      return []
    }

    // Tüm post_categories ilişkilerini al
    const { data: postCategories, error: postCategoriesError } = await supabase
      .from('post_categories')
      .select(`
        category_id,
        post:posts!inner(
          id,
          status
        )
      `)
      .eq('post.status', 'published')

    if (postCategoriesError) {
      console.error('Error fetching post categories:', postCategoriesError)
      // Hata durumunda sadece kategorileri döndür
      return categories.map(category => ({
        ...category,
        post_count: 0
      }))
    }

    // Her kategori için post sayısını hesapla
    const categoriesWithCount = categories.map(category => {
      const postCount = postCategories?.filter(pc => pc.category_id === category.id).length || 0
      return {
        ...category,
        post_count: postCount
      }
    })

    return categoriesWithCount
  } catch (error) {
    console.error('Error fetching categories with post count:', error)
    return []
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching category by slug:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching category by slug:', error)
    return null
  }
}

// Admin functions
export async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching all categories:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching all categories:', error)
    return []
  }
}

export async function createCategory(categoryData: {
  name: string
  slug: string
  description?: string
}) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating category:', error)
    return null
  }
}

export async function updateCategory(id: string, categoryData: {
  name?: string
  slug?: string
  description?: string
}) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating category:', error)
    return null
  }
}

export async function deleteCategory(id: string) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting category:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting category:', error)
    return false
  }
} 