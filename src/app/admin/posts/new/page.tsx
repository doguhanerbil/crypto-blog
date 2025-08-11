'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@supabase/supabase-js';
import Breadcrumb from '@/components/layout/Breadcrumb'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NewPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    // Kategorileri backend'den çek
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let uploadedUrl = coverImageUrl;
    if (coverImageFile) {
      const filePath = `post-media/images/${Date.now()}_${coverImageFile.name}`;
      const { data, error } = await supabase.storage
        .from('post-media')
        .upload(filePath, coverImageFile, { upsert: true });
      if (error) {
        alert('Yükleme hatası: ' + error.message);
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('post-media').getPublicUrl(filePath);
      uploadedUrl = urlData.publicUrl;
      setCoverImageUrl(uploadedUrl);
    }
    // Post kaydını yap
    const response = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        excerpt,
        cover_image_url: uploadedUrl,
        category_id: selectedCategory,
      }),
    });
    setLoading(false);
    if (response.ok) {
      toast({ title: 'Başarılı', description: 'Yeni yazı oluşturuldu.' });
      router.push('/admin/posts');
    } else {
      const error = await response.json();
      toast({ title: 'Hata', description: error.message, variant: 'destructive' });
    }
  };

  // Dosya seçildiğinde sadece file state'e yazılır
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverImageFile(file);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Yeni Yazı Oluştur
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Yeni bir blog yazısı oluşturun
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Yazı Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Yazı başlığı"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Özet</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Yazı özeti"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">İçerik</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Yazı içeriği"
                rows={15}
              />
            </div>

            <div className="space-y-2">
              <Label>Kapak Resmi Seç</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                disabled={loading}
              />
              {coverImageFile && (
                <img src={URL.createObjectURL(coverImageFile)} alt="Önizleme" style={{ width: 200, marginTop: 8 }} />
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="category">Kategori Seç</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="border px-2 py-1 rounded w-full"
                required
              >
                <option value="">Kategori seçiniz</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <Button type="submit">
                {loading ? 'Oluşturuluyor...' : 'Yazıyı Oluştur'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 