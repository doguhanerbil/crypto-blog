'use client'
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen } from "lucide-react";
import LiveCryptoData from "./LiveCryptoData";
import { usePathname } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  post_count: number;
}

interface SidebarProps {
  categories: Category[];
}

export default function Sidebar({ categories }: SidebarProps) {
  const pathname = usePathname();
  const totalPosts = categories.reduce((sum, category) => sum + category.post_count, 0);

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card className="bg-white dark:bg-gray-900 rounded-lg border shadow-lg">
        <CardHeader className="pt-3">
          <CardTitle className="text-lg flex items-center justify-start gap-2">
            <FolderOpen className="h-5 w-5" />
            Kategoriler
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {categories.length > 0 ? (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((category) => {
                  const isActive = pathname === `/category/${category.slug}`;
                  return (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className={`flex items-center justify-between px-4 py-2 transition-colors ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        isActive
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-700 dark:text-gray-300"
                      }`}>
                        {category.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          isActive
                            ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {category.post_count}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
              <div className="border-t-2 border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Toplam Yazı
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold"
                  >
                    {totalPosts}
                  </Badge>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4 px-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Henüz kategori bulunmuyor
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Crypto Data */}
      <LiveCryptoData />
    </div>
  );
}
