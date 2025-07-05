import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

export interface LocalMedia {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export class LocalStorageService {
  private uploadDir: string;
  private baseUrl: string;

  constructor() {
    this.uploadDir = join(process.cwd(), 'public', 'uploads');
    this.baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  }

  // Dosya yükleme
  async uploadFile(
    file: Buffer,
    filename: string,
    contentType: string
  ): Promise<LocalMedia> {
    const id = this.generateId();
    const ext = this.getFileExtension(filename);
    const newFilename = `${id}_${filename}`;
    
    // Upload dizinini oluştur
    await this.ensureUploadDir();

    // Dosya tipine göre işle
    let finalFilename = newFilename;
    let width: number | undefined;
    let height: number | undefined;
    let thumbnailUrl: string | undefined;

    if (contentType.startsWith('image/')) {
      // Resim optimizasyonu
      const image = sharp(file);
      const metadata = await image.metadata();
      width = metadata.width;
      height = metadata.height;

      // Ana resmi kaydet
      await image
        .jpeg({ quality: 80 })
        .toFile(join(this.uploadDir, finalFilename));

      // Thumbnail oluştur
      const thumbnailFilename = `thumb_${newFilename}`;
      await image
        .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 70 })
        .toFile(join(this.uploadDir, thumbnailFilename));

      thumbnailUrl = `/uploads/${thumbnailFilename}`;
    } else {
      // Diğer dosya tipleri
      await writeFile(join(this.uploadDir, finalFilename), file);
    }

    const url = `/uploads/${finalFilename}`;

    return {
      id,
      name: filename,
      url,
      thumbnailUrl,
      size: file.length,
      type: contentType,
      width,
      height,
      createdAt: new Date().toISOString()
    };
  }

  // Dosya silme
  async deleteFile(filename: string): Promise<void> {
    const filePath = join(this.uploadDir, filename);
    const thumbnailPath = join(this.uploadDir, `thumb_${filename}`);

    try {
      await unlink(filePath);
    } catch (error) {
      console.error('Ana dosya silinemedi:', error);
    }

    try {
      await unlink(thumbnailPath);
    } catch (error) {
      // Thumbnail yoksa hata verme
    }
  }

  // Upload dizinini oluştur
  private async ensureUploadDir(): Promise<void> {
    try {
      await mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      // Dizin zaten varsa hata verme
    }
  }

  // Benzersiz ID oluştur
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Dosya uzantısını al
  private getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
  }

  // Dosya boyutu kontrolü
  validateFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize;
  }

  // Dosya tipi kontrolü
  validateFileType(mimetype: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimetype);
  }

  // URL'den dosya adını çıkar
  extractFilenameFromUrl(url: string): string | null {
    const match = url.match(/\/uploads\/(.+)$/);
    return match ? match[1] : null;
  }
}

// Local storage instance'ı
export const localStorageService = new LocalStorageService();

// Desteklenen dosya tipleri
export const LOCAL_ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
};

export const LOCAL_MAX_SIZES = {
  image: 5 * 1024 * 1024, // 5MB
  video: 100 * 1024 * 1024, // 100MB
  document: 10 * 1024 * 1024, // 10MB
}; 