import { NextRequest, NextResponse } from 'next/server';
import { postService } from '@/lib/database';
import { withAPIRateLimit } from '@/middleware/rateLimit';

// Tüm blog yazılarını getir (public)
async function getPosts(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as 'DRAFT' | 'PUBLISHED' | undefined;
    const type = searchParams.get('type') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const tagId = searchParams.get('tagId') || undefined;

    const posts = await postService.findAll({
      page,
      limit,
      status,
      type,
      categoryId,
      tagId
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// Yeni blog yazısı oluştur (admin only)
async function createPost(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, type, categories, tags, featuredImage, media, seo } = body;

    // Validate required fields
    if (!title || !content || !excerpt || !type) {
      return NextResponse.json(
        { error: 'Title, content, excerpt, and type are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const postData = {
      title,
      slug,
      content,
      excerpt,
      type,
      status: 'DRAFT' as const,
      authorId: 'temp-author-id', // TODO: Get from session
      featuredImage,
      media,
      seo
    };

    const post = await postService.create(postData);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// Rate limiting uygula
export const GET = withAPIRateLimit(getPosts);
export const POST = withAPIRateLimit(createPost); 