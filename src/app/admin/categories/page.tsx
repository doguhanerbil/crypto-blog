"use client"
import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/categories'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Array<{id:string; name:string; slug:string; description?:string}>>([])
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null)
  const [editing, setEditing] = useState<{id:string|null; name:string; slug:string; description:string}>({id:null, name:'', slug:'', description:''})
  const { toast } = useToast()

  useEffect(() => {
    (async () => {
      const list = await getCategories()
      setCategories(Array.isArray(list) ? (list as Array<{id:string; name:string; slug:string; description?:string}>) : [])
    })()
  }, [])

  const resetForm = () => setEditing({ id: null, name: '', slug: '', description: '' })

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

  const handleSave = async () => {
    if (!editing.name.trim()) {
      toast({ variant: 'destructive', title: 'Geçersiz', description: 'Kategori adı gerekli.' })
      return
    }
    try {
      if (editing.id) {
        const updated = await updateCategory(editing.id, { name: editing.name, description: editing.description })
        if (updated) {
          const u = updated as {id:string; name:string; slug:string; description?:string}
          setCategories(prev => prev.map(c => c.id === u.id ? u : c))
          toast({ variant: 'success', title: 'Güncellendi', description: 'Kategori güncellendi.' })
        } else {
          throw new Error('Güncelleme başarısız')
        }
      } else {
        const created = await createCategory({ name: editing.name, description: editing.description })
        if (created) {
          const cr = created as {id:string; name:string; slug:string; description?:string}
          setCategories(prev => [cr, ...prev])
          toast({ variant: 'success', title: 'Oluşturuldu', description: 'Yeni kategori eklendi.' })
        } else {
          throw new Error('Oluşturma başarısız')
        }
      }
      setOpen(false)
      resetForm()
    } catch {
      toast({ variant: 'destructive', title: 'Hata', description: 'İşlem başarısız' })
    }
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    const id = toDelete.id
    const ok = await deleteCategory(id)
    setConfirmOpen(false)
    if (ok) {
      setCategories(prev => prev.filter(c => c.id !== id))
      toast({ variant: 'success', title: 'Silindi', description: 'Kategori silindi.' })
    } else {
      toast({ variant: 'destructive', title: 'Silinemedi', description: 'Bu kategoriye bağlı yazılar olabilir. Önce ilişkileri temizleyin.' })
    }
    setToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Kategoriler</h1>
          <p className="text-gray-600 dark:text-gray-400">Blog kategorilerini yönetin</p>
        </div>
        <Dialog open={open} onOpenChange={(o)=>{setOpen(o); if(!o) resetForm()}}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4"/> Yeni Kategori</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Tag className="h-4 w-4"/>
                {editing.id ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Ad</Label>
                <Input value={editing.name} onChange={(e)=>{
                  const value = e.target.value
                  setEditing(prev=>({
                    ...prev,
                    name: value,
                    slug: prev.slug ? prev.slug : slugify(value)
                  }))
                }} placeholder="Kategori adı" />
              </div>
              {/* Slug artık kullanıcı tarafından düzenlenmez */}
              <div>
                <Label>Açıklama</Label>
                <Input value={editing.description} onChange={(e)=>setEditing(prev=>({...prev, description:e.target.value}))} placeholder="İsteğe bağlı" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={()=>{setOpen(false); resetForm()}}>İptal</Button>
                <Button onClick={handleSave}>{editing.id ? 'Güncelle' : 'Kaydet'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kategori Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.length === 0 ? (
              <div className="rounded-xl border bg-white/40 dark:bg-gray-900/40 p-6 text-center text-sm text-gray-500">Henüz kategori yok.</div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="group flex items-center justify-between rounded-xl border bg-white dark:bg-gray-900 p-4 transition-shadow hover:shadow-sm"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500">/{category.slug}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {category.description || 'Açıklama yok'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="default" size="sm" className="gap-1" onClick={()=>{setEditing({ id: category.id, name: category.name, slug: category.slug, description: category.description || ''}); setOpen(true)}}>
                      <Pencil className="h-4 w-4"/> Düzenle
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={()=>{ setToDelete({ id: category.id, name: category.name }); setConfirmOpen(true); }}>
                      <Trash2 className="h-4 w-4"/> Sil
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      {/* Delete confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={(o)=>{ setConfirmOpen(o); if(!o) setToDelete(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bu kategoriyi silmek istiyor musunuz?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400">{toDelete ? `"${toDelete.name}" kategorisini sildiğinizde geri alamazsınız. Bu kategoriye bağlı yazılar varsa silme engellenir.` : ''}</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={()=>{ setConfirmOpen(false); setToDelete(null) }}>Vazgeç</Button>
            <Button variant="default" className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete}>Evet, Sil</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 