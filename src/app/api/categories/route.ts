import { NextRequest, NextResponse } from 'next/server';
import { getCategoriesWithPostCount, createCategory as createCategoryLib } from '@/lib/categories';

// Tüm kategorileri getir (public) - post sayıları ile birlikte
export async function GET() {
  try {
    const categories = await getCategoriesWithPostCount();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Yeni kategori oluştur (admin only, burada kontrol yok)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color } = body;

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
    };

    const category = await createCategoryLib(categoryData);
    if (!category) {
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 