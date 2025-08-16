'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Image as ImageIcon, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@supabase/supabase-js';
import Breadcrumb from '@/components/layout/Breadcrumb'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CategoryOption = { id: string; name: string }

export default function NewPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<string>('')
  const [excerpt, setExcerpt] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    // Kategorileri backend'den çek
    fetch('/api/categories')
      .then(res => res.json())
      .then((data: { categories?: CategoryOption[] }) => setCategories(data.categories || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let uploadedUrl = coverImageUrl;
    if (coverImageFile) {
      // Store cover images under bucket: post-media, folder: images/
      const filePath = `images/${Date.now()}_${coverImageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('post-media')
        .upload(filePath, coverImageFile, { upsert: true });
      if (uploadError) {
        alert('Yükleme hatası: ' + uploadError.message);
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('post-media').getPublicUrl(filePath);
      uploadedUrl = urlData.publicUrl;
      setCoverImageUrl(uploadedUrl);
    }
    const legacyContent = (content || '').trim()
    const cleanedParagraphs = legacyContent ? [legacyContent] : []

    // Post kaydını yap
    const response = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content: legacyContent,
        content_paragraphs: cleanedParagraphs,
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
              <Label>İçerik</Label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>

            <div className="space-y-2">
              <Label>Kapak Resmi</Label>
              <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4">
                <label htmlFor="coverImage" className="flex cursor-pointer items-center justify-center gap-3 rounded-md bg-gray-50 dark:bg-gray-800/40 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ImageIcon className="h-5 w-5" />
                  <span>Görsel yüklemek için tıklayın</span>
                </label>
                <input id="coverImage" type="file" accept="image/*" onChange={handleCoverImageChange} disabled={loading} className="hidden" />

                {(coverImageFile || coverImageUrl) && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative h-20 w-32 overflow-hidden rounded-md border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverImageFile ? URL.createObjectURL(coverImageFile) : coverImageUrl}
                        alt="Kapak önizleme"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setCoverImageFile(null)
                        setCoverImageUrl('')
                      }}
                    >
                      <X className="mr-2 h-4 w-4" /> Görseli kaldır
                    </Button>
                  </div>
                )}
              </div>
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
                {categories.map((cat: CategoryOption) => (
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