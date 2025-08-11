'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { use } from 'react'
import Breadcrumb from '@/components/layout/Breadcrumb'

interface PostEditPageProps {
  params: {
    id: string
  }
}

export default function PostEditPage({ params }: PostEditPageProps) {
  const paramsObj = use(params)
  const postId = paramsObj.id
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${postId}`)
        if (response.ok) {
          const post = await response.json()
          setTitle(post.title)
          setContent(post.content)
          setExcerpt(post.excerpt || '')
        } else {
          toast({
            title: 'Hata',
            description: 'Yazı yüklenemedi.',
            variant: 'destructive',
          })
          router.push('/admin/posts')
        }
      } catch (error) {
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
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
        }),
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
    } catch (error) {
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

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Güncelleniyor...' : 'Yazıyı Güncelle'}
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