import { NextRequest, NextResponse } from 'next/server';
import { tagService } from '@/lib/database';
import { withAPIRateLimit } from '@/middleware/rateLimit';

// Tüm etiketleri getir (public)
async function getTags(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false';

    const tags = await tagService.findAll(activeOnly);

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// Yeni etiket oluştur (admin only)
async function createTag(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const tagData = {
      name,
      slug,
      description,
      color,
      isActive: true
    };

    const tag = await tagService.create(tagData);

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}

// Rate limiting uygula
export const GET = withAPIRateLimit(getTags);
export const POST = withAPIRateLimit(createTag); 