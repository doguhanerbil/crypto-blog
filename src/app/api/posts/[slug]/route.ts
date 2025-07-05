import { NextRequest, NextResponse } from 'next/server';
import Post from '@/models/Post';
import { withAPIRateLimit } from '@/middleware/rateLimit';

// Tekil blog yazısını getir
async function getPost(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await Post.findOne({ 
      slug: params.slug,
      status: 'PUBLISHED'
    })
    .populate('author', 'name image')
    .populate('categories', 'name slug color')
    .populate('tags', 'name slug color')
    .lean();

    if (!post) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);

  } catch (error) {
    console.error('Post API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Blog yazısını güncelle (admin only)
async function updatePost(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { title, content, excerpt, type, categories, tags, featuredImage, media, seo, status } = body;

    const post = await Post.findOne({ slug: params.slug });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    // Güncelleme
    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (type) post.type = type;
    if (categories) post.categories = categories;
    if (tags) post.tags = tags;
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    if (media) post.media = media;
    if (seo) post.seo = seo;
    if (status) post.status = status;

    await post.save();

    return NextResponse.json(post);

  } catch (error: any) {
    console.error('Update Post Error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Bu slug zaten kullanılıyor' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Blog yazısını sil (admin only)
async function deletePost(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await Post.findOneAndDelete({ slug: params.slug });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Blog yazısı başarıyla silindi' });

  } catch (error) {
    console.error('Delete Post Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Rate limiting uygula
export const GET = withAPIRateLimit(getPost);
export const PUT = withAPIRateLimit(updatePost);
export const DELETE = withAPIRateLimit(deletePost); 