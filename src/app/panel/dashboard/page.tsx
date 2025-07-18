"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Eye, FileText, ArrowUpRight, ArrowDownRight, Activity, Calendar, Clock } from "lucide-react";

const stats = [
  { 
    label: "Toplam Post", 
    value: 42, 
    change: "+12%", 
    changeType: "positive",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/10 to-cyan-500/10"
  },
  { 
    label: "Toplam Görüntülenme", 
    value: 12890, 
    change: "+8.2%", 
    changeType: "positive",
    icon: Eye,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-500/10 to-emerald-500/10"
  },
  { 
    label: "Aktif Kullanıcı", 
    value: 2341, 
    change: "+15.3%", 
    changeType: "positive",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-500/10 to-pink-500/10"
  },
  { 
    label: "Ortalama Süre", 
    value: "4.2 dk", 
    change: "+2.1%", 
    changeType: "positive",
    icon: Clock,
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-500/10 to-red-500/10"
  },
];

const lastPosts = [
  { id: 1, title: "Bitcoin Analizi", date: "2024-07-01", category: "Bitcoin", views: 1200, trend: "+15%" },
  { id: 2, title: "Ethereum Merge", date: "2024-06-28", category: "Ethereum", views: 950, trend: "+8%" },
  { id: 3, title: "NFT Trendleri", date: "2024-06-25", category: "NFT", views: 800, trend: "+12%" },
  { id: 4, title: "DeFi Nedir?", date: "2024-06-20", category: "DeFi", views: 650, trend: "+5%" },
];

const chartData = [
  { name: "Mayıs", views: 1800, posts: 8 },
  { name: "Haziran", views: 2200, posts: 12 },
  { name: "Temmuz", views: 3200, posts: 15 },
  { name: "Ağustos", views: 2700, posts: 10 },
  { name: "Eylül", views: 3400, posts: 18 },
  { name: "Ekim", views: 1790, posts: 9 },
  { name: "Kasım", views: 2390, posts: 14 },
];

const categoryData = [
  { name: "Bitcoin", value: 35, color: "#f7931a" },
  { name: "Ethereum", value: 25, color: "#627eea" },
  { name: "DeFi", value: 20, color: "#ff6b6b" },
  { name: "NFT", value: 15, color: "#4ecdc4" },
  { name: "Diğer", value: 5, color: "#45b7d1" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Kripto blog performansınızı takip edin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-gray-200 dark:border-white/20 bg-white/50 dark:bg-white/10 backdrop-blur-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Son 30 gün
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:shadow-xl transition-all duration-300 group hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.bgColor} border border-white/20 dark:border-white/10`}>
                    <Icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Görüntülenme Trendi</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Son 7 ay görüntülenme istatistikleri</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#764ba2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" opacity={0.3} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="#667eea" fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="posts" stroke="#764ba2" fillOpacity={1} fill="url(#colorPosts)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Chart */}
        <Card className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Kategori Dağılımı</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Post kategorileri</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{category.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Son Postlar</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">En son yayınlanan içerikler</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lastPosts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 rounded-xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/20 dark:border-white/10">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-0">
                        {post.category}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{post.views}</span>
                    </div>
                    <div className={`flex items-center text-xs ${
                      post.trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {post.trend}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-200 dark:border-white/20 bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20">
                    Detay
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 