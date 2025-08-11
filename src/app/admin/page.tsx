import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboard() {
  // Mock data kullan
  const posts = [
    {
      id: '1',
      title: 'Bitcoin Nedir?',
      created_at: new Date().toISOString(),
    },
    {
      id: '2', 
      title: 'Ethereum DeFi',
      created_at: new Date().toISOString(),
    },
  ]

  const categories = [
    { id: '1', name: 'Bitcoin' },
    { id: '2', name: 'Ethereum' },
  ]

  const tags = [
    { id: '1', name: 'Kripto' },
    { id: '2', name: 'DeFi' },
  ]

  const stats = [
    {
      title: 'Toplam Yazı',
      value: posts.length,
      description: 'Yayınlanan blog yazıları',
    },
    {
      title: 'Kategoriler',
      value: categories.length,
      description: 'Aktif kategoriler',
    },
    {
      title: 'Etiketler',
      value: tags.length,
      description: 'Kullanılan etiketler',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Blog yönetim paneli
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {stat.value}
              </CardTitle>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {stat.title}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son Yazılar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {post.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(post.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <a
                    href={`/admin/posts/${post.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Görüntüle
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <a
                href="/admin/posts/new"
                className="block w-full p-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yeni Yazı Oluştur
              </a>
              <a
                href="/admin/categories"
                className="block w-full p-3 text-center bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Kategorileri Yönet
              </a>
              <a
                href="/admin/settings"
                className="block w-full p-3 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ayarları Düzenle
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 