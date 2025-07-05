// sharp ile ilgili kalan tüm fonksiyonlar ve referanslar kaldırıldı. Sadece fetch ve veri çekme fonksiyonları kalacak.

// Define the base URL for the Strapi API from environment variables
const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';

// --- INTERFACES/TYPES ---
// These interfaces define the shape of the data we expect from the Strapi API.

// Represents the different formats of a media file (e.g., thumbnail, small)
interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
}

// Represents a media object in Strapi, like an image
interface StrapiMedia {
  id: number;
  name: string;
  alternativeText: string | null;
  url: string;
  width: number;
  height: number;
  formats: {
    thumbnail: StrapiMediaFormat;
    small: StrapiMediaFormat;
    medium: StrapiMediaFormat;
    large: StrapiMediaFormat;
  };
}

// Generic types for Strapi relations (single or multiple)
// Strapi's flat response still wraps relations in a data object
interface StrapiRelation<T> {
  data: T | null;
}
interface StrapiRelationMany<T> {
  data: T[];
}

// Specific types for our blog content, matching the flat structure
export interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  coverImage: StrapiRelation<StrapiMedia>;
  category: StrapiRelation<Category>;
  tags: StrapiRelationMany<Tag>;
}

// --- API HELPER FUNCTION ---
/**
 * A generic function to fetch data from the Strapi API.
 * @param path The API path to fetch (e.g., '/posts')
 * @returns The data from the API.
 */
async function fetchStrapiAPI<T>(path: string, useToken = false): Promise<T> {
  const requestUrl = `${STRAPI_URL}/api${path}`;
  const apiToken = process.env.STRAPI_API_TOKEN;
  const headers: Record<string, string> = {};
  if (useToken && apiToken) {
    headers['Authorization'] = `Bearer ${apiToken}`;
  }
  try {
    const response = await fetch(requestUrl, {
      headers,
      cache: 'no-store',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch API: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.data as T;
  } catch (error) {
    throw new Error(`Could not fetch data from Strapi: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// --- DATA FETCHING FUNCTIONS ---
// These functions use the generic helper to fetch specific content types.

/**
 * Fetches all posts from Strapi.
 * Populates all relations to get full data for category, tags, and coverImage.
 */
export async function getPosts(): Promise<Post[]> {
  return fetchStrapiAPI<Post[]>('/posts?populate=*');
}

/**
 * Fetches a single post by its slug.
 * @param slug The slug of the post to fetch.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await fetchStrapiAPI<Post[]>(`/posts?filters[slug][$eq]=${slug}&populate=*`);
  // The API returns an array, so we take the first element.
  return posts?.[0] || null;
}

export async function getCategories(): Promise<Category[]> {
  return fetchStrapiAPI<Category[]>('/categories');
}

export async function getTags(): Promise<Tag[]> {
  return fetchStrapiAPI<Tag[]>('/tags');
}

export class StrapiService {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = process.env.STRAPI_URL || 'http://localhost:1337';
    this.token = process.env.STRAPI_TOKEN || '';
  }

  // Resim boyut kontrolü ve optimizasyonu
  async validateAndOptimizeImage(file: File): Promise<{ isValid: boolean; error?: string; optimizedBuffer?: Buffer }> {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const image = sharp(buffer);
      const metadata = await image.metadata();

      // Minimum boyut kontrolü
      if (metadata.width && metadata.width < 300) {
        return { isValid: false, error: 'Resim genişliği en az 300px olmalıdır' };
      }
      if (metadata.height && metadata.height < 300) {
        return { isValid: false, error: 'Resim yüksekliği en az 300px olmalıdır' };
      }

      // Maksimum boyut kontrolü
      if (metadata.width && metadata.width > 4000) {
        return { isValid: false, error: 'Resim genişliği en fazla 4000px olabilir' };
      }
      if (metadata.height && metadata.height > 4000) {
        return { isValid: false, error: 'Resim yüksekliği en fazla 4000px olabilir' };
      }

      // En-boy oranı kontrolü (isteğe bağlı)
      if (metadata.width && metadata.height) {
        const ratio = metadata.width / metadata.height;
        if (ratio < 0.5 || ratio > 2) {
          return { isValid: false, error: 'Resim en-boy oranı 0.5 ile 2 arasında olmalıdır' };
        }
      }

      // Resmi optimize et
      const optimizedBuffer = await image
        .jpeg({ 
          quality: 85, 
          progressive: true,
          mozjpeg: true 
        })
        .toBuffer();

      return { isValid: true, optimizedBuffer };
    } catch {
      return { isValid: false, error: 'Resim işlenirken hata oluştu' };
    }
  }

  // Dosya yükleme (resim optimizasyonu ile)
  async uploadFile(file: File): Promise<StrapiUploadResponse> {
    let uploadFile = file;
    let uploadBuffer: Buffer;

    // Resim dosyası ise optimize et
    if (file.type.startsWith('image/')) {
      const validation = await this.validateAndOptimizeImage(file);
      
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      if (validation.optimizedBuffer) {
        uploadBuffer = validation.optimizedBuffer;
        // Optimize edilmiş buffer'dan yeni File oluştur
        uploadFile = new File([uploadBuffer], file.name, {
          type: file.type,
          lastModified: file.lastModified
        });
      }
    } else {
      uploadBuffer = Buffer.from(await file.arrayBuffer());
    }

    const formData = new FormData();
    formData.append('files', uploadFile);

    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Dosya yüklenemedi');
    }

    const result = await response.json();
    return result[0];
  }

  // Medya listesi
  async listMedia(options: {
    page?: number;
    pageSize?: number;
    sort?: string;
    filters?: Record<string, unknown>;
  } = {}): Promise<{ data: StrapiMedia[]; meta: { pagination: Record<string, unknown> } }> {
    const { page = 1, pageSize = 20, sort = 'createdAt:desc', filters = {} } = options;

    const params = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': pageSize.toString(),
      'sort': sort,
      'populate': '*'
    });

    // Filtreleri ekle
    if (filters.mime && typeof filters.mime === 'object' && '$contains' in filters.mime) {
      params.append('filters[mime][$contains]', String(filters.mime.$contains));
    }

    const response = await fetch(`${this.baseUrl}/api/upload/files?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Medya listesi alınamadı');
    }

    const result = await response.json();
    return result;
  }

  // Medya silme
  async deleteMedia(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/upload/files/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Medya dosyası silinemedi');
    }
  }

  // Medya URL'lerini al
  getMediaUrl(media: StrapiUploadResponse, format?: string): string {
    if (format && media.formats && typeof media.formats === 'object' && format in media.formats) {
      const formatData = media.formats[format] as { url: string };
      return `${this.baseUrl}${formatData.url}`;
    }
    return `${this.baseUrl}${media.url}`;
  }

  // Dosya boyutu kontrolü
  validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
  }

  // Dosya tipi kontrolü
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  // Resim boyut bilgilerini al
  async getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
    if (!file.type.startsWith('image/')) {
      return null;
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const metadata = await sharp(buffer).metadata();
      
      if (metadata.width && metadata.height) {
        return { width: metadata.width, height: metadata.height };
      }
      return null;
    } catch (error) {
      console.error('Resim boyutları alınamadı:', error);
      return null;
    }
  }
}

// Strapi servis instance'ı
export const strapiService = new StrapiService();

// Desteklenen dosya tipleri
export const STRAPI_ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
};

// Maksimum dosya boyutları
export const STRAPI_MAX_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  document: 10 * 1024 * 1024, // 10MB
};

// Resim boyut standartları
export const IMAGE_STANDARDS = {
  minWidth: 300,
  minHeight: 300,
  maxWidth: 4000,
  maxHeight: 4000,
  minAspectRatio: 0.5,
  maxAspectRatio: 2,
  quality: 85
};

export interface StrapiUploadResponse {
  id: number;
  name: string;
  url: string;
  size: number;
  mime: string;
  width?: number;
  height?: number;
  formats?: Record<string, { url: string; width: number; height: number }>;
  createdAt: string;
  updatedAt: string;
}

// Rate limit için örnek (gerçek uygulamada middleware ile yapılmalı)
const loginAttempts: Record<string, { count: number; lastAttempt: number }> = {};

export async function loginWithRateLimit(identifier: string, password: string, ip: string) {
  const now = Date.now();
  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 0, lastAttempt: now };
  }
  if (now - loginAttempts[ip].lastAttempt > 5 * 60 * 1000) {
    loginAttempts[ip] = { count: 0, lastAttempt: now };
  }
  loginAttempts[ip].count++;
  loginAttempts[ip].lastAttempt = now;
  if (loginAttempts[ip].count > 5) {
    throw new Error('Çok fazla deneme yaptınız. Lütfen 5 dakika sonra tekrar deneyin.');
  }
  // Burada normal login işlemini çağır
  // ...
} 