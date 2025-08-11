import { getTags } from '@/lib/tags'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminTagsPage() {
  const tags = await getTags()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Etiketler
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Blog etiketlerini yönetin
          </p>
        </div>
        <Button>Yeni Etiket</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Etiket Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    #{tag.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tag.description || 'Açıklama yok'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Düzenle
                  </Button>
                  <Button variant="outline" size="sm">
                    Sil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 