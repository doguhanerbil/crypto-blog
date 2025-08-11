import { NextRequest, NextResponse } from 'next/server'
import { getPostById } from '@/lib/posts'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await getPostById(params.id)

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
  { params }: { params: { id: string } }
) {
  try {
    const { title, content, excerpt } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Başlık ve içerik gerekli' },
        { status: 400 }
      )
    }

    const updatedPost = {
      id: params.id,
      title,
      content,
      excerpt,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(updatedPost)
  } catch (error) {
    return NextResponse.json(
      { message: 'Yazı güncellenemedi' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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