"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Giriş başarısız");
      // JWT'yi localStorage'a kaydet
      localStorage.setItem("strapi_jwt", data.jwt);
      // Dashboard'a yönlendir
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Giriş başarısız");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto py-20">
      <h1 className="text-2xl font-bold mb-6">Admin Giriş</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="border px-3 py-2 w-full"
          placeholder="E-posta veya kullanıcı adı"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          required
        />
        <input
          className="border px-3 py-2 w-full"
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
} 