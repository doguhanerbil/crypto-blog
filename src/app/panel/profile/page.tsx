"use client";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Camera, User, Mail, Shield, Key, Settings, Bell, Globe, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function ProfilePage() {
  const { user } = useAuth();
  
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
  const [name, setName] = useState(user?.username || "Admin Kullanıcı");
  const [email, setEmail] = useState(user?.email || "admin@example.com");
  const [username, setUsername] = useState(user?.username || "admin");

  // Şifre değiştirme
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profil Bilgileri</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Hesap bilgilerinizi ve güvenlik ayarlarınızı yönetin</p>
        </div>
        <Badge className="bg-green-100 text-green-700 border-0">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          Aktif
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avatar & Basic Info */}
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Profil Bilgileri</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-20 h-20 border-2 border-gray-200 dark:border-gray-700">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-2xl font-bold">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Avatar>
                  <Button
                    type="button"
                    size="icon"
                    className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Admin • Son giriş: Bugün</p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ad Soyad</label>
                  <Input
                    placeholder="Ad Soyad"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kullanıcı Adı</label>
                  <Input
                    placeholder="Kullanıcı Adı"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-posta</label>
                  <Input
                    placeholder="E-posta"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button className="w-full">
                Bilgileri Kaydet
              </Button>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
                <Key className="h-5 w-5 text-green-600" />
                <span>Şifre Değiştir</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mevcut Şifre</label>
                <div className="relative">
                  <Input
                    placeholder="Mevcut Şifre"
                    type={showPasswords ? "text" : "password"}
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Yeni Şifre</label>
                  <Input
                    placeholder="Yeni Şifre"
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Yeni Şifre (Tekrar)</label>
                  <Input
                    placeholder="Yeni Şifre (Tekrar)"
                    type={showPasswords ? "text" : "password"}
                    value={newPassword2}
                    onChange={e => setNewPassword2(e.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full">
                Şifreyi Güncelle
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Hesap Durumu</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Durum</span>
                <Badge className="bg-green-100 text-green-700 border-0">
                  Aktif
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rol</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Admin</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Son Giriş</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Bugün</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Üyelik</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Premium</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <span>Hızlı İşlemler</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Bildirim Ayarları
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Dil Ayarları
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Lock className="h-4 w-4 mr-2" />
                Güvenlik Ayarları
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 