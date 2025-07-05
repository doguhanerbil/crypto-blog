import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  filename: string;
}

export class S3Service {
  // Dosya yükleme
  static async uploadFile(
    file: Buffer,
    filename: string,
    contentType: string,
    folder: string = 'uploads'
  ): Promise<UploadResult> {
    const key = `${folder}/${Date.now()}-${filename}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    return {
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      key,
      size: file.length,
      filename,
    };
  }

  // Resim yükleme ve optimize etme
  static async uploadImage(
    file: Buffer,
    filename: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp';
    } = {}
  ): Promise<UploadResult> {
    const { width, height, quality = 80, format = 'jpeg' } = options;

    let processedImage = sharp(file);

    if (width || height) {
      processedImage = processedImage.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    let processedBuffer: Buffer;
    let contentType: string;

    switch (format) {
      case 'png':
        processedBuffer = await processedImage.png({ quality }).toBuffer();
        contentType = 'image/png';
        break;
      case 'webp':
        processedBuffer = await processedImage.webp({ quality }).toBuffer();
        contentType = 'image/webp';
        break;
      default:
        processedBuffer = await processedImage.jpeg({ quality }).toBuffer();
        contentType = 'image/jpeg';
    }

    const newFilename = `${filename.split('.')[0]}.${format}`;
    return this.uploadFile(processedBuffer, newFilename, contentType, 'images');
  }

  // Video yükleme
  static async uploadVideo(
    file: Buffer,
    filename: string
  ): Promise<UploadResult> {
    return this.uploadFile(file, filename, 'video/mp4', 'videos');
  }

  // Dosya silme
  static async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  }

  // Presigned URL oluşturma (güvenli dosya erişimi için)
  static async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn });
  }

  // Dosya boyutu kontrolü
  static validateFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize;
  }

  // Dosya tipi kontrolü
  static validateFileType(mimetype: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimetype);
  }
}

// Desteklenen dosya tipleri
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg'
];

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

export const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5MB
  video: 100 * 1024 * 1024, // 100MB
  file: 10 * 1024 * 1024, // 10MB
}; 