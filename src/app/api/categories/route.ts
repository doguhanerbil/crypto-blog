import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/lib/database';
import { withAPIRateLimit } from '@/middleware/rateLimit';

// Tüm kategorileri getir (public)
async function getCategories(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false';

    const categories = await categoryService.findAll(activeOnly);

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Yeni kategori oluştur (admin only)
async function createCategory(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color, icon } = body;

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

    const categoryData = {
      name,
      slug,
      description,
      color,
      icon,
      isActive: true
    };

    const category = await categoryService.create(categoryData);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// Rate limiting uygula
export const GET = withAPIRateLimit(getCategories);
export const POST = withAPIRateLimit(createCategory); 