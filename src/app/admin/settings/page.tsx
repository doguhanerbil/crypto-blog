'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function AdminSettingsPage() {
  const [siteTitle, setSiteTitle] = useState('Crypto Blog')
  const [siteDescription, setSiteDescription] = useState('Kripto para ve blockchain hakkında blog')
  const [adminEmail, setAdminEmail] = useState('admin@example.com')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteTitle,
          siteDescription,
          adminEmail,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Başarılı',
          description: 'Ayarlar güncellendi.',
        })
      } else {
        toast({
          title: 'Hata',
          description: 'Ayarlar güncellenemedi.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Bir hata oluştu.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Ayarlar
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Blog ayarlarını düzenleyin
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Ayarları</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Site Başlığı</Label>
              <Input
                id="siteTitle"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                placeholder="Site başlığı"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Açıklaması</Label>
              <Textarea
                id="siteDescription"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="Site açıklaması"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin E-posta</Label>
              <Input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Güncelleniyor...' : 'Ayarları Kaydet'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 