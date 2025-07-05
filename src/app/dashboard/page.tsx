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
          },
        }),
      });
      if (!res.ok) throw new Error("Post eklenemedi");
      setTitle("");
      setContent("");
      setSelectedCategory(null);
      setSelectedTags([]);
      setImageFile(null);
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
      <form onSubmit={handleAddPost} className="mb-8 space-y-2">
        <input
          className="border px-3 py-2 w-full"
          placeholder="Başlık"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border px-3 py-2 w-full"
          placeholder="İçerik"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <select
          className="border px-3 py-2 w-full"
          value={selectedCategory ?? ""}
          onChange={e => setSelectedCategory(Number(e.target.value) || null)}
          required
        >
          <option value="">Kategori Seç</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          className="border px-3 py-2 w-full"
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
        <input
          type="file"
          accept="image/*"
          className="border px-3 py-2 w-full"
          onChange={e => setImageFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Ekleniyor..." : "Yeni Post Ekle"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <h2 className="text-xl font-semibold mb-2">Postlar</h2>
      <ul className="space-y-2">
        {posts.map(post => (
          <li key={post.id} className="border p-3 flex justify-between items-center">
            <div>
              <div className="font-bold">{post.title}</div>
              <div className="text-gray-600 text-sm">{post.slug}</div>
            </div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleDelete(post.id)}
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