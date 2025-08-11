import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const limit = searchParams.get('limit')
  const offset = searchParams.get('offset')
  const isHomepage = searchParams.get('homepage') === 'true'
  
  console.log('API route called with SERVICE ROLE client')
  console.log('Environment check:')
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log('Category filter:', category)
  console.log('Limit:', limit)
  console.log('Offset:', offset)
  console.log('Is homepage:', isHomepage)
  
  try {
    console.log('Attempting to fetch posts with SERVICE ROLE client...')
    
    let query = supabaseAdmin
      .from('posts')
      .select(`
        *,
        author:profiles(full_name, avatar_url),
        categories:post_categories(category:categories(name, slug)),
        tags:post_tags(tag:tags(name, slug))
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    // Anasayfa için son 10 post
    if (isHomepage) {
      query = query.limit(10)
    }
    // Limit ve offset parametreleri varsa uygula
    else if (limit) {
      query = query.limit(parseInt(limit))
      if (offset) {
        query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)
      }
    }

    // Kategori filtresi varsa uygula
    if (category) {
      // Önce kategori ID'sini bul
      const { data: categoryData, error: categoryError } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()

      if (categoryError || !categoryData) {
        console.error('Category not found:', categoryError)
        return NextResponse.json({ posts: [] })
      }

      // Kategoriye ait post ID'lerini bul
      const { data: postCategories, error: postCategoriesError } = await supabaseAdmin
        .from('post_categories')
        .select('post_id')
        .eq('category_id', categoryData.id)

      if (postCategoriesError) {
        console.error('Error fetching post categories:', postCategoriesError)
        return NextResponse.json({ posts: [] })
      }

      const postIds = postCategories.map(pc => pc.post_id)
      
      if (postIds.length > 0) {
        query = query.in('id', postIds)
      } else {
        return NextResponse.json({ posts: [] })
      }
    }

    const { data, error } = await query

    console.log('Supabase SERVICE ROLE response:')
    console.log('Data:', data)
    console.log('Error:', error)
    console.log('Data length:', data?.length)

    if (error) {
      console.error('Supabase SERVICE ROLE error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ posts: data || [] })
  } catch (error) {
    console.error('Caught error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 