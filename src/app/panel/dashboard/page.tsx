"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const stats = [
  { label: "Toplam Post", value: 42, color: "bg-blue-600" },
  { label: "Toplam Görüntülenme", value: 12890, color: "bg-green-600" },
];

const lastPosts = [
  { id: 1, title: "Bitcoin Analizi", date: "2024-07-01", category: "Bitcoin", views: 1200 },
  { id: 2, title: "Ethereum Merge", date: "2024-06-28", category: "Ethereum", views: 950 },
  { id: 3, title: "NFT Trendleri", date: "2024-06-25", category: "NFT", views: 800 },
];

const chartData = [
  { name: "Mayıs", views: 1800 },
  { name: "Haziran", views: 2200 },
  { name: "Temmuz", views: 3200 },
  { name: "Ağustos", views: 2700 },
  { name: "Eylül", views: 3400 },
  { name: "Ekim", views: 1790 },
  { name: "Kasım", views: 2390 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-purple-100 py-10">
      <h1 className="text-2xl font-bold mb-8 text-blue-700">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-10">
        {stats.map(stat => (
          <Card key={stat.label} className="flex flex-col items-center py-6 shadow-lg border-0">
            <CardTitle className={`text-lg font-semibold mb-2 ${stat.color} text-white px-4 py-2 rounded-full`}>{stat.label}</CardTitle>
            <CardContent className="text-3xl font-bold text-gray-800">{stat.value}</CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Son Postlar</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {lastPosts.map(post => (
                <li key={post.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-2">
                  <div>
                    <span className="font-semibold text-blue-700">{post.title}</span>
                    <Badge className="ml-2 bg-purple-100 text-purple-700">{post.category}</Badge>
                    <div className="text-xs text-gray-500">{post.date}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span className="text-xs text-green-700 font-semibold">{post.views} görüntülenme</span>
                    <Button variant="outline" size="sm">Detay</Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle>Görüntülenme Grafiği</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="#2563eb" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 