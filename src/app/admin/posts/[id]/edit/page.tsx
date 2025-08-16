'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Image as ImageIcon, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
 
import { createClient } from '@supabase/supabase-js'
import Breadcrumb from '@/components/layout/Breadcrumb'
import RichTextEditor from '@/components/admin/RichTextEditor'

interface PostEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PostEditPage({ params }: PostEditPageProps) {
  const paramsObj = use(params)
  const postId = paramsObj.id
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<string>('')
  const [excerpt, setExcerpt] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${postId}`)
        if (response.ok) {
          const post = await response.json()
          setTitle(post.title)
          setContent(post.content || '')
          setExcerpt(post.excerpt || '')
          setCoverImageUrl(post.cover_image_url || '')
        } else {
          toast({
            title: 'Hata',
            description: 'Yazı yüklenemedi.',
            variant: 'destructive',
          })
          router.push('/admin/posts')
        }
      } catch {
        toast({
          title: 'Hata',
          description: 'Bir hata oluştu.',
          variant: 'destructive',
        })
        router.push('/admin/posts')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchPost()
  }, [postId, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const legacyContent = (content || '').trim()
      let uploadedUrl = coverImageUrl
      if (coverImageFile) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        // Store cover images under bucket: post-media, folder: images/
        const filePath = `images/${Date.now()}_${coverImageFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(filePath, coverImageFile, { upsert: true })
        if (uploadError) {
          setLoading(false)
          return
        }
        const { data: urlData } = supabase.storage.from('post-media').getPublicUrl(filePath)
        uploadedUrl = urlData.publicUrl
        setCoverImageUrl(uploadedUrl)
      }
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content: legacyContent, excerpt, cover_image_url: uploadedUrl }),
      })

      if (response.ok) {
        toast({
          title: 'Başarılı',
          description: 'Yazı güncellendi.',
        })
        router.push('/admin/posts')
      } else {
        const error = await response.json()
        toast({
          title: 'Hata',
          description: error.message || 'Yazı güncellenemedi.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Hata',
        description: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Yazı Düzenle
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Blog yazısını düzenleyin
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

            {/* Kapak Resmi */}
            <div className="space-y-2">
              <Label>Kapak Resmi</Label>
              <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4">
                <label htmlFor="coverImageEdit" className="flex cursor-pointer items-center justify-center gap-3 rounded-md bg-gray-50 dark:bg-gray-800/40 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ImageIcon className="h-5 w-5" />
                  <span>Görsel yüklemek için tıklayın</span>
                </label>
                <input id="coverImageEdit" type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setCoverImageFile(file)
                }} className="hidden" />

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

            <div className="flex space-x-4">
              <Button variant="default" type="submit" disabled={loading}>
                {loading ? 'Güncelleniyor...' : 'Yazıyı Güncelle'}
              </Button>
              <Button type="button" variant="destructive" onClick={() => router.back()}>
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 