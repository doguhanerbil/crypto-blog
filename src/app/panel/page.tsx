"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, FolderOpen, Tag, Image, TrendingUp, Eye, Users, Clock, Plus, BarChart3, Activity } from "lucide-react";

export default function PanelPage() {
  const router = useRouter();

  const menuItems = [
    {
      title: "İçerik Yönetimi",
      description: "Postlar, kategoriler, etiketler ve medya dosyalarını yönetin",
      icon: FileText,
      href: "/panel/content",
      color: "bg-blue-500",
      count: "24 yazı"
    },
    {
      title: "Profil Bilgileri",
      description: "E-posta ve şifrenizi güncelleyin, profil bilgilerinizi yönetin",
      icon: Users,
      href: "/panel/profile",
      color: "bg-purple-500",
      count: "Aktif"
    }
  ];

  const stats = [
    {
      title: "Toplam Görüntülenme",
      value: "12.5K",
      change: "+12%",
      icon: Eye,
      color: "text-blue-600"
    },
    {
      title: "Aktif Yazılar",
      value: "24",
      change: "+3",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Ortalama Okuma Süresi",
      value: "5.2 dk",
      change: "+0.3 dk",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Haftalık Ziyaretçi",
      value: "2.1K",
      change: "+8%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const recentPosts = [
    {
      title: "Bitcoin'in Geleceği: 2024 Analizi",
      category: "Bitcoin",
      views: 1200,
      date: "2 saat önce",
      status: "published"
    },
    {
      title: "Ethereum 2.0: Değişim Süreci",
      category: "Ethereum",
      views: 950,
      date: "1 gün önce",
      status: "published"
    },
    {
      title: "DeFi Nedir? Kapsamlı Rehber",
      category: "DeFi",
      views: 800,
      date: "2 gün önce",
      status: "draft"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-700 border-0">Yayında</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-700 border-0">Taslak</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Blog performansınızı ve içerik yönetiminizi takip edin
          </p>
        </div>
        <Button onClick={() => router.push("/panel/content")}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Yazı
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {menuItems.map((item) => (
                <Card 
                  key={item.href}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
                  onClick={() => router.push(item.href)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${item.color} text-white`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {item.count}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white">Son Yazılar</CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push("/panel/content")}>
                  Tümünü Gör
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        {getStatusBadge(post.status)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {post.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Haftalık Aktivite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Grafik burada görünecek</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 