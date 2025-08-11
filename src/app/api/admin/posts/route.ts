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
    const { title, content, excerpt, cover_image_url } = await request.json()

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
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.log('DEBUG: Genel hata:', error)
    return NextResponse.json(
      { message: 'Yazı oluşturulamadı' },
      { status: 500 }
    )
  }
} 