"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function PanelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <h1 className="text-3xl font-bold mb-10 text-blue-700">Yönetim Paneli</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="w-80 shadow-xl border-0 hover:scale-105 transition-transform cursor-pointer" onClick={() => router.push("/panel/content") }>
          <CardHeader className="flex flex-col items-center">
            <Avatar className="mb-2 bg-blue-100 text-blue-700"><span className="text-2xl">📄</span></Avatar>
            <CardTitle className="text-xl font-semibold text-blue-700">İçerik Yönetimi</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Postlar, kategoriler, etiketler ve medya dosyalarını yönetin.
            <Button className="w-full mt-4" variant="outline" onClick={e => {e.stopPropagation(); router.push("/panel/content");}}>Yönet</Button>
          </CardContent>
        </Card>
        <Card className="w-80 shadow-xl border-0 hover:scale-105 transition-transform cursor-pointer" onClick={() => router.push("/panel/profile") }>
          <CardHeader className="flex flex-col items-center">
            <Avatar className="mb-2 bg-purple-100 text-purple-700"><span className="text-2xl">👤</span></Avatar>
            <CardTitle className="text-xl font-semibold text-purple-700">Profil Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            E-posta ve şifrenizi güncelleyin, profil bilgilerinizi yönetin.
            <Button className="w-full mt-4" variant="outline" onClick={e => {e.stopPropagation(); router.push("/panel/profile");}}>Profil</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 