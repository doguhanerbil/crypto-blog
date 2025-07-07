"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { HexColorPicker } from "react-colorful";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import PostsDataTable from "./PostsDataTable";

interface Post {
  id: number;
  title: string;
  content: string;
  category?: { id: number; name: string };
}

interface Category {
  id: number;
  name: string;
  color: string;
}

interface Tag {
  id: number;
  name: string;
  description: string;
}

interface Media {
  id: number;
  name: string;
  url: string;
  type: string;
}

export default function ContentPanel() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-purple-100 py-10">
      <h1 className="text-2xl font-bold mb-8 text-blue-700">İçerik Yönetimi</h1>
      <Tabs defaultValue="posts" className="w-full max-w-3xl">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-white rounded-lg shadow border border-blue-100">
          <TabsTrigger value="posts" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:font-bold transition">Postlar</TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:font-bold transition">Kategoriler</TabsTrigger>
          <TabsTrigger value="tags" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:font-bold transition">Etiketler</TabsTrigger>
          <TabsTrigger value="media" className="data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:font-bold transition">Medya</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Postlar</CardTitle>
            </CardHeader>
            <CardContent>
              <PostsDataTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Kategoriler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-500">Kategori yönetimi burada olacak.</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle>Etiketler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-500">Etiket yönetimi burada olacak.</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Medya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-500">Medya yönetimi burada olacak.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 