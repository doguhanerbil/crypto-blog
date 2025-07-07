"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

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
      // Panel'e yönlendir
      router.push("/panel");
    } catch (err: any) {
      setError(err.message || "Giriş başarısız");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <Card className="w-full max-w-sm shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-700">CryptoBlog Admin Giriş</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="E-posta veya kullanıcı adı"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required
              autoFocus
            />
            <Input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
            {error && <Alert variant="destructive">{error}</Alert>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 