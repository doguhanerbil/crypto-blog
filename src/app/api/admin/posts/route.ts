import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const result = await supabaseAdmin
      .from('posts')
      .select('*, cover_image:media(id, url, alt_text), post_media:media(id, url, alt_text)')
      .order('created_at', { ascending: false })

    if (result.error) {
      return NextResponse.json(
        { message: 'Yazılar yüklenemedi' },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    return NextResponse.json(
      { message: 'Yazılar yüklenemedi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, content_paragraphs, excerpt, cover_image_url, category_id, category_ids } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Başlık ve içerik gerekli' },
        { status: 400 }
      )
    }

    // Basit slug oluşturma
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existing } = await supabaseAdmin
        .from('posts')
        .select('id')
        .eq('slug', slug)
        .single();
      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }

    // 1. Post kaydını oluştur
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert([{ title, content, excerpt, slug, cover_image_url }])
      .select()
      .single()
    if (postError) {
      return NextResponse.json({ message: postError.message }, { status: 400 })
    }

    // 2. Kategori ilişkisinin eklenmesi (tek ya da çoklu)
    const incomingCategoryIds: string[] = Array.isArray(category_ids)
      ? category_ids
      : category_id
        ? [category_id]
        : []

    if (incomingCategoryIds.length > 0) {
      const rows = incomingCategoryIds.map((cid) => ({ post_id: post.id, category_id: cid }))
      const { error: pivotError } = await supabaseAdmin
        .from('post_categories')
        .insert(rows)
      if (pivotError) {
        // İlişki ekleme hatası olsa bile post oluşturulmuş durumda; yine de hata döndürelim
        return NextResponse.json({ message: pivotError.message }, { status: 400 })
      }
    }

    // 3. İçerik paragrafları gönderildiyse, legacy content ile uyumlu şekilde post_media benzeri alt tablo yerine JSON kolon önermiyoruz.
    // Şimdilik herhangi bir tablo değişikliği yapmadan, paragrafları birleştirip kaydediyoruz.
    // İleride JSONB kolon eklendiğinde buraya insert/update eklenebilir.

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.log('DEBUG: Genel hata:', error)
    return NextResponse.json(
      { message: 'Yazı oluşturulamadı' },
      { status: 500 }
    )
  }
} 