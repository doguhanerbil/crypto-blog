'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRef, useState } from 'react';

const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 800;

function getTargetFolder(mimetype: string) {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype.startsWith('video/')) return 'videos';
  return 'files';
}

export default function AdminMediaPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setLoading(true);
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mimetype = file.type;
      const folder = getTargetFolder(mimetype);

      // Boyut kontrolü
      if (folder === 'images' && file.size > MAX_IMAGE_SIZE) {
        alert('Görsel 20 MB’dan büyük olamaz!');
        continue;
      }
      if (folder === 'videos' && file.size > MAX_VIDEO_SIZE) {
        alert('Video 50 MB’dan büyük olamaz!');
        continue;
      }
      if (folder === 'files' && file.size > MAX_FILE_SIZE) {
        alert('Dosya 20 MB’dan büyük olamaz!');
        continue;
      }

      // Pixel kontrolü (sadece görseller için)
      if (folder === 'images') {
        const img = new window.Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
          alert(`Görsel en fazla ${MAX_WIDTH}x${MAX_HEIGHT} piksel olmalı!`);
          continue;
        }
      }

      // API'ye yükle
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Yükleme hatası!');
      } else {
        newUrls.push(data.url);
      }
    }
    setMediaUrls((prev) => [...prev, ...newUrls]);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Medya Kütüphanesi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Blog için medya dosyalarını yönetin
          </p>
        </div>
        <>
          <input
            type="file"
            ref={inputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
          />
          <Button onClick={() => inputRef.current?.click()} disabled={loading}>
            {loading ? 'Yükleniyor...' : 'Dosya Yükle'}
          </Button>
        </>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Yüklenen Medya Dosyaları</CardTitle>
        </CardHeader>
        <CardContent>
          {mediaUrls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Henüz yüklenmiş dosya bulunmuyor.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Blog yazılarınızda kullanmak için dosya yükleyin.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {mediaUrls.map((url, idx) => (
                <li key={idx} className="break-all">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>media_urls (Post tablosuna ekleyeceğin array)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
            {JSON.stringify(mediaUrls, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
} 