'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface MediaItem {
  id: number;
  name: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  formats?: any;
  createdAt: string;
  updatedAt: string;
}

interface MediaManagerProps {
  onSelect?: (media: MediaItem) => void;
  onClose?: () => void;
  show?: boolean;
}

export default function MediaManager({ onSelect, onClose, show = false }: MediaManagerProps) {
  const { data: session } = useSession();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'image' | 'video' | 'document'>('image');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Medya listesini yükle
  const loadMedia = async (page = 1, type = 'all') => {
    if (!session?.user) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
        sort: 'createdAt:desc'
      });
      
      if (type !== 'all') {
        params.append('type', type);
      }

      const response = await fetch(`/api/media?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMedia(data.media);
        setTotalPages(data.pagination?.pageCount || 1);
        setCurrentPage(data.pagination?.page || 1);
      }
    } catch (error) {
      console.error('Medya yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dosya yükle
  const uploadFile = async () => {
    if (!selectedFile || !session?.user) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', uploadType);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Dosya yüklendi:', result);
        
        // Listeyi yenile
        await loadMedia(currentPage, selectedType);
        
        // Formu temizle
        setSelectedFile(null);
        setUploadType('image');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const error = await response.json();
        alert(`Yükleme hatası: ${error.error}`);
      }
    } catch (error) {
      console.error('Yükleme hatası:', error);
      alert('Dosya yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  // Dosya sil
  const deleteMedia = async (id: number) => {
    if (!session?.user || !confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        // Listeyi yenile
        await loadMedia(currentPage, selectedType);
      } else {
        const error = await response.json();
        alert(`Silme hatası: ${error.error}`);
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Dosya silinirken bir hata oluştu');
    }
  };

  // Dosya seç
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // İlk yükleme
  useEffect(() => {
    if (show && session?.user) {
      loadMedia();
    }
  }, [show, session]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Medya Yöneticisi</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Upload Bölümü */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Yeni Dosya Yükle</h3>
          
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Dosya Tipi</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as any)}
                className="w-full p-2 border rounded"
              >
                <option value="image">Resim</option>
                <option value="video">Video</option>
                <option value="document">Belge</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Dosya Seç</label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept={
                  uploadType === 'image' ? 'image/*' :
                  uploadType === 'video' ? 'video/*' :
                  '.pdf,.doc,.docx,.txt'
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {selectedFile && (
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p><strong>Seçilen dosya:</strong> {selectedFile.name}</p>
              <p><strong>Boyut:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              {uploadType === 'image' && (
                <p className="text-sm text-blue-600">
                  💡 Resim boyutu kontrolü: 300x300px minimum, 4000x4000px maksimum
                </p>
              )}
            </div>
          )}

          <button
            onClick={uploadFile}
            disabled={!selectedFile || uploading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {uploading ? 'Yükleniyor...' : 'Yükle'}
          </button>
        </div>

        {/* Filtreleme */}
        <div className="mb-6">
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
              loadMedia(1, e.target.value);
            }}
            className="p-2 border rounded"
          >
            <option value="all">Tüm Dosyalar</option>
            <option value="image">Resimler</option>
            <option value="video">Videolar</option>
            <option value="document">Belgeler</option>
          </select>
        </div>

        {/* Medya Listesi */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8">Yükleniyor...</div>
          ) : media.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Medya dosyası bulunamadı
            </div>
          ) : (
            media.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-2 hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  {item.type.startsWith('image/') && item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      className="w-full h-24 object-cover rounded cursor-pointer"
                      onClick={() => onSelect?.(item)}
                    />
                  ) : (
                    <div
                      className="w-full h-24 bg-gray-100 flex items-center justify-center rounded cursor-pointer"
                      onClick={() => onSelect?.(item)}
                    >
                      {item.type.startsWith('video/') ? '🎥' : '📄'}
                    </div>
                  )}
                  
                  <button
                    onClick={() => deleteMedia(item.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mt-2">
                  <p className="text-xs font-medium truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(item.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {item.width && item.height && (
                    <p className="text-xs text-gray-500">
                      {item.width} × {item.height}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => {
                setCurrentPage(currentPage - 1);
                loadMedia(currentPage - 1, selectedType);
              }}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Önceki
            </button>
            
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => {
                setCurrentPage(currentPage + 1);
                loadMedia(currentPage + 1, selectedType);
              }}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 