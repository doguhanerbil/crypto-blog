"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategories, getTags } from "@/lib/strapi";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // JWT kontrolü
  useEffect(() => {
    const token = localStorage.getItem("strapi_jwt");
    if (!token) {
      router.push("/login");
    } else {
      setJwt(token);
    }
    // eslint-disable-next-line
  }, []);

  // Listeleme
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/posts?populate=*`, {
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      });
      const data = await res.json();
      setPosts(data.data.map((item: any) => ({
        id: item.id,
        title: item.attributes.title,
        slug: item.attributes.slug,
        content: item.attributes.content,
      })));
    } catch (err) {
      setError("Postlar alınamadı.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (jwt) fetchPosts();
    // Kategorileri ve tagları çek
    getCategories().then(setCategories);
    getTags().then(setTags);
    // eslint-disable-next-line
  }, [jwt]);

  // Ekleme
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let coverImageId = null;
      let mediaIds: number[] = [];
      if (imageFile) {
        const formData = new FormData();
        formData.append("files", imageFile);
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
          body: formData,
        });
        const uploadData = await uploadRes.json();
        coverImageId = uploadData[0]?.id;
      }
      if (mediaFiles.length > 0) {
        const formData = new FormData();
        mediaFiles.forEach(file => formData.append("files", file));
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
          body: formData,
        });
        const uploadData = await uploadRes.json();
        mediaIds = uploadData.map((item: any) => item.id);
      }
      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify({
          data: {
            title,
            content,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
            category: selectedCategory,
            tags: selectedTags,
            coverImage: coverImageId,
            media: mediaIds,
          },
        }),
      });
      if (!res.ok) throw new Error("Post eklenemedi");
      setTitle("");
      setContent("");
      setSelectedCategory(null);
      setSelectedTags([]);
      setImageFile(null);
      setMediaFiles([]);
      fetchPosts();
    } catch (err) {
      setError("Post eklenemedi.");
    }
    setLoading(false);
  };

  // Silme
  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      });
      if (!res.ok) throw new Error("Post silinemedi");
      fetchPosts();
    } catch (err) {
      setError("Post silinemedi.");
    }
    setLoading(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("strapi_jwt");
    router.push("/login");
  };

  if (!jwt) return null;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Yönetim Paneli</h1>
        <button onClick={handleLogout} className="text-red-600 underline">Çıkış Yap</button>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <form onSubmit={handleAddPost} className="space-y-4">
          <input
            className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Başlık"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px]"
            placeholder="İçerik"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <select
            className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedCategory ?? ""}
            onChange={e => setSelectedCategory(Number(e.target.value) || null)}
            required
          >
            <option value="">Kategori Seç</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div>
            <label className="block mb-1 font-medium">Etiketler (opsiyonel)</label>
            <select
              className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              multiple
              value={selectedTags.map(String)}
              onChange={e => {
                const options = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                setSelectedTags(options);
              }}
            >
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">Birden fazla etiket seçmek için Ctrl (veya Mac'te Cmd) tuşunu kullanabilirsin.</div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Kapak Görseli</label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={e => setImageFile(e.target.files?.[0] || null)}
            />
            {imageFile && <div className="mt-1 text-xs text-green-600">Seçilen dosya: {imageFile.name}</div>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Ek Medya (fotoğraf, video, dosya)</label>
            <input
              type="file"
              multiple
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={e => setMediaFiles(e.target.files ? Array.from(e.target.files) : [])}
            />
            {mediaFiles.length > 0 && (
              <ul className="mt-1 text-xs text-green-600 space-y-1">
                {mediaFiles.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
          {error && <div className="text-red-600 font-medium bg-red-50 border border-red-200 rounded p-2">{error}</div>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition"
            disabled={loading}
          >
            {loading ? "Ekleniyor..." : "Yeni Post Ekle"}
          </button>
        </form>
      </div>
      <h2 className="text-xl font-bold mb-4">Postlar</h2>
      {loading && <div>Yükleniyor...</div>}
      {posts.length === 0 && !loading && <div>Henüz post yok.</div>}
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="bg-gray-50 rounded p-4 flex justify-between items-center shadow-sm">
            <div>
              <div className="font-semibold text-lg">{post.title}</div>
              <div className="text-gray-600 text-sm line-clamp-2 max-w-md">{post.content}</div>
            </div>
            <button
              onClick={() => handleDelete(post.id)}
              className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded border border-red-200 bg-red-50 hover:bg-red-100 transition"
              disabled={loading}
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 