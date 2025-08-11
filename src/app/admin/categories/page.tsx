import { getCategories } from '@/lib/categories'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Kategoriler
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Blog kategorilerini yönetin
          </p>
        </div>
        <Button>Yeni Kategori</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kategori Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description || 'Açıklama yok'}
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