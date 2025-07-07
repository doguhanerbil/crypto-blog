"use client";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function ProfilePage() {
  // Avatar upload
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Kişisel bilgiler
  const [name, setName] = useState("Admin Kullanıcı");
  const [email, setEmail] = useState("admin@cryptoblog.com");
  const [username, setUsername] = useState("admin");

  // Şifre değiştirme
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-purple-100 py-10">
      <h1 className="text-2xl font-bold mb-8 text-blue-700">Profil Bilgileri</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {/* Avatar ve kişisel bilgiler */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Profil Fotoğrafı & Bilgiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24 text-4xl">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-24 h-24 object-cover rounded-full" />
                  ) : (
                    <span className="bg-blue-100 text-blue-700 w-24 h-24 flex items-center justify-center rounded-full font-bold">A</span>
                  )}
                </Avatar>
                <Button
                  type="button"
                  size="sm"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-full text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Fotoğraf Yükle
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            <form className="space-y-4">
              <Input
                placeholder="Ad Soyad"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Input
                placeholder="E-posta"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition">Bilgileri Kaydet</Button>
            </form>
          </CardContent>
        </Card>
        {/* Şifre değiştirme */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Şifre Değiştir</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input
                placeholder="Mevcut Şifre"
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
              />
              <Input
                placeholder="Yeni Şifre"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <Input
                placeholder="Yeni Şifre (Tekrar)"
                type="password"
                value={newPassword2}
                onChange={e => setNewPassword2(e.target.value)}
              />
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition">Şifreyi Güncelle</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 