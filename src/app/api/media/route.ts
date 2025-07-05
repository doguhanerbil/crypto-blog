import { NextRequest, NextResponse } from 'next/server';
import { strapiService } from '@/lib/strapi';
import { withAPIRateLimit } from '@/middleware/rateLimit';
import { withAdmin } from '@/middleware/auth';

// Medya dosyalarını listele (admin only)
async function listMedia(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const sort = searchParams.get('sort') || 'createdAt:desc';
    const type = searchParams.get('type'); // 'image', 'video', 'document'

    const filters: any = {};
    if (type) {
      filters.mime = {
        $contains: type === 'image' ? 'image/' : 
                   type === 'video' ? 'video/' : 
                   'application/'
      };
    }

    const result = await strapiService.listMedia({
      page,
      pageSize,
      sort,
      filters
    });

    // Medya dosyalarını dönüştür
    const media = result.data.map(item => ({
      id: item.id,
      name: item.name,
      url: strapiService.getMediaUrl(item),
      thumbnailUrl: strapiService.getMediaUrl(item, 'thumbnail'),
      size: item.size,
      type: item.type,
      width: item.width,
      height: item.height,
      formats: item.formats,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    return NextResponse.json({
      media,
      pagination: result.meta.pagination
    });

  } catch (error) {
    console.error('Media API Error:', error);
    return NextResponse.json(
      { error: 'Medya listesi alınamadı' },
      { status: 500 }
    );
  }
}

// Medya dosyası sil (admin only)
async function deleteMedia(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Medya ID gereklidir' },
        { status: 400 }
      );
    }

    await strapiService.deleteMedia(id);

    return NextResponse.json({
      success: true,
      message: 'Medya dosyası başarıyla silindi'
    });

  } catch (error) {
    console.error('Delete Media Error:', error);
    return NextResponse.json(
      { error: 'Medya dosyası silinemedi' },
      { status: 500 }
    );
  }
}

// Rate limiting uygula
export const GET = withAdmin(withAPIRateLimit(listMedia));
export const DELETE = withAdmin(withAPIRateLimit(deleteMedia)); 