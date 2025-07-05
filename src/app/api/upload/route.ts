import { NextRequest, NextResponse } from 'next/server';
import { strapiService, STRAPI_ALLOWED_TYPES, STRAPI_MAX_SIZES } from '@/lib/strapi';
import { withUploadRateLimit } from '@/middleware/rateLimit';
import { withAdmin } from '@/middleware/auth';

async function uploadFile(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image', 'video', 'document'

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya gereklidir' },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü
    const maxSize = STRAPI_MAX_SIZES[type as keyof typeof STRAPI_MAX_SIZES] || STRAPI_MAX_SIZES.document;
    if (!strapiService.validateFileSize(file, maxSize)) {
      return NextResponse.json(
        { error: `Dosya boyutu çok büyük. Maksimum: ${Math.round(maxSize / 1024 / 1024)}MB` },
        { status: 400 }
      );
    }

    // Dosya tipi kontrolü
    let allowedTypes: string[];
    switch (type) {
      case 'image':
        allowedTypes = STRAPI_ALLOWED_TYPES.image;
        break;
      case 'video':
        allowedTypes = STRAPI_ALLOWED_TYPES.video;
        break;
      case 'document':
        allowedTypes = STRAPI_ALLOWED_TYPES.document;
        break;
      default:
        return NextResponse.json(
          { error: 'Geçersiz dosya tipi' },
          { status: 400 }
        );
    }

    if (!strapiService.validateFileType(file, allowedTypes)) {
      return NextResponse.json(
        { error: 'Desteklenmeyen dosya tipi' },
        { status: 400 }
      );
    }

    // Resim dosyası ise boyut kontrolü yap
    if (file.type.startsWith('image/')) {
      const dimensions = await strapiService.getImageDimensions(file);
      if (dimensions) {
        const { width, height } = dimensions;
        
        // Minimum boyut kontrolü
        if (width < 300 || height < 300) {
          return NextResponse.json(
            { error: 'Resim boyutu en az 300x300px olmalıdır' },
            { status: 400 }
          );
        }

        // Maksimum boyut kontrolü
        if (width > 4000 || height > 4000) {
          return NextResponse.json(
            { error: 'Resim boyutu en fazla 4000x4000px olabilir' },
            { status: 400 }
          );
        }

        // En-boy oranı kontrolü
        const ratio = width / height;
        if (ratio < 0.5 || ratio > 2) {
          return NextResponse.json(
            { error: 'Resim en-boy oranı 0.5 ile 2 arasında olmalıdır' },
            { status: 400 }
          );
        }
      }
    }

    // Strapi'ye yükle (otomatik optimizasyon ile)
    const uploadedMedia = await strapiService.uploadFile(file);

    return NextResponse.json({
      success: true,
      data: {
        id: uploadedMedia.id,
        url: strapiService.getMediaUrl(uploadedMedia),
        thumbnailUrl: strapiService.getMediaUrl(uploadedMedia, 'thumbnail'),
        name: uploadedMedia.name,
        size: uploadedMedia.size,
        type: uploadedMedia.mime,
        width: uploadedMedia.width,
        height: uploadedMedia.height,
        formats: uploadedMedia.formats,
        createdAt: uploadedMedia.createdAt
      }
    });

  } catch (error) {
    console.error('Upload Error:', error);
    
    // Hata mesajını kullanıcı dostu hale getir
    let errorMessage = 'Dosya yükleme hatası';
    if (error instanceof Error) {
      if (error.message.includes('Resim genişliği')) {
        errorMessage = error.message;
      } else if (error.message.includes('Resim yüksekliği')) {
        errorMessage = error.message;
      } else if (error.message.includes('Resim en-boy oranı')) {
        errorMessage = error.message;
      } else if (error.message.includes('Resim boyutu')) {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Admin yetkisi ve rate limiting uygula
export const POST = withAdmin(withUploadRateLimit(uploadFile)); 