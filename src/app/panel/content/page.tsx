"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, FileText, Tag, Image, FolderOpen, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import PostsDataTable from "./PostsDataTable";
import PostEditor from "./PostEditor";

export default function ContentPanel() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const handleNewPost = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleSavePost = (postData: any) => {
    console.log("Saving post:", postData);
    setShowEditor(false);
    setEditingPost(null);
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  if (showEditor) {
    return (
      <PostEditor
        post={editingPost}
        onSave={handleSavePost}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            İçerik Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Postlar, kategoriler, etiketler ve medya dosyalarınızı yönetin
          </p>
        </div>
        <Button onClick={handleNewPost}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Yazı
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="posts" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Postlar</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4" />
            <span>Kategoriler</span>
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>Etiketler</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center space-x-2">
            <Image className="h-4 w-4" />
            <span>Medya</span>
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="mt-8">
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Postlar</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Tüm blog postlarınızı yönetin
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Başlık, kategori veya özet ara..."
                      className="pl-10 w-80"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrele
                  </Button>
                  <Button onClick={handleNewPost}>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Post
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PostsDataTable onEditPost={handleEditPost} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="mt-8">
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Kategoriler</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Blog kategorilerini organize edin
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Kategori
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Bitcoin", count: 15, color: "#f7931a" },
                  { name: "Ethereum", count: 12, color: "#627eea" },
                  { name: "DeFi", count: 8, color: "#ff6b6b" },
                  { name: "NFT", count: 6, color: "#4ecdc4" },
                  { name: "Güvenlik", count: 4, color: "#45b7d1" },
                  { name: "Eğitim", count: 10, color: "#a855f7" },
                ].map((category, index) => (
                  <div key={index} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{category.count} post</span>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags" className="mt-8">
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Etiketler</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Blog etiketlerini yönetin
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Etiket
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Kripto Para", count: 25, color: "#f7931a" },
                  { name: "Blockchain", count: 18, color: "#627eea" },
                  { name: "DeFi", count: 12, color: "#ff6b6b" },
                  { name: "NFT", count: 8, color: "#4ecdc4" },
                  { name: "Güvenlik", count: 15, color: "#45b7d1" },
                  { name: "Analiz", count: 22, color: "#a855f7" },
                ].map((tag, index) => (
                  <div key={index} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">{tag.name}</h3>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{tag.count} kullanım</span>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="mt-8">
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Medya</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Medya dosyalarınızı yönetin
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Dosya Yükle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { name: "bitcoin-chart.png", type: "image", size: "2.3 MB" },
                  { name: "ethereum-logo.svg", type: "image", size: "45 KB" },
                  { name: "crypto-video.mp4", type: "video", size: "15.2 MB" },
                  { name: "defi-guide.pdf", type: "document", size: "1.8 MB" },
                  { name: "nft-collection.jpg", type: "image", size: "3.1 MB" },
                  { name: "blockchain-diagram.png", type: "image", size: "892 KB" },
                ].map((file, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {file.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 