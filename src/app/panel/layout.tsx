"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Menu } from "lucide-react";
import * as React from "react";

const navItems = [
  { href: "/panel/dashboard", label: "Dashboard" },
  { href: "/panel/content", label: "İçerik Yönetimi" },
  { href: "/panel/profile", label: "Profil" },
];

function getBreadcrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [];
  let href = "";
  for (let i = 0; i < parts.length; i++) {
    href += "/" + parts[i];
    crumbs.push({
      href,
      label: parts[i][0].toUpperCase() + parts[i].slice(1),
    });
  }
  return crumbs;
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const breadcrumbs = getBreadcrumbs(pathname).filter(c => c.label !== "Panel");

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-blue-100 shadow-lg py-8 px-4">
        <div className="text-2xl font-bold text-blue-700 mb-10">CryptoBlog Admin</div>
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded font-medium transition",
                pathname.startsWith(item.href)
                  ? "bg-blue-600 text-white shadow"
                  : "text-blue-700 hover:bg-blue-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-30">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full bg-white py-8 px-4">
            <div className="text-2xl font-bold text-blue-700 mb-10">CryptoBlog Admin</div>
            <nav className="flex flex-col gap-2">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded font-medium transition",
                    pathname.startsWith(item.href)
                      ? "bg-blue-600 text-white shadow"
                      : "text-blue-700 hover:bg-blue-100"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white/80 border-b border-blue-100 px-6 py-4 shadow-sm sticky top-0 z-20 backdrop-blur">
          <div className="flex items-center gap-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link href="/panel/dashboard">Dashboard</Link>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={crumb.href}>
                    <BreadcrumbSeparator>/</BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-blue-700 font-medium">admin@cryptoblog.com</span>
            <Avatar>
              <span className="bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full font-bold">A</span>
            </Avatar>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
} 