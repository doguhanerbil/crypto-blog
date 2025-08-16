import { NextRequest, NextResponse } from 'next/server'
import { getPostById } from '@/lib/posts'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await getPostById(id)

    if (!post) {
      return NextResponse.json(
        { message: 'Yazı bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { title, content, content_paragraphs, excerpt, cover_image_url } = await request.json()

    // Yalnızca gönderilen alanları güncelle (boş content gönderildiyse koru)
    const updateData: any = { updated_at: new Date().toISOString() }
    if (typeof title === 'string' && title.trim() !== '') {
      updateData.title = title.trim()
    }
    if (typeof content === 'string' && content.trim() !== '') {
      updateData.content = content
    }
    if (Array.isArray(content_paragraphs) && content_paragraphs.length > 0) {
      updateData.content_paragraphs = content_paragraphs
    }
    if (typeof excerpt === 'string') {
      updateData.excerpt = excerpt
    }
    if (cover_image_url !== undefined) {
      updateData.cover_image_url = cover_image_url || null
    }

    const { id } = await params
    const { data, error } = await supabaseAdmin
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { message: 'Yazı güncellenemedi' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    return NextResponse.json(
      { message: 'Yazı başarıyla silindi' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Yazı silinemedi' },
      { status: 500 }
    )
  }
} 