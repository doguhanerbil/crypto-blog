import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kripto Blog - Kripto Para Haberleri ve Analizleri",
  description: "Bitcoin, Ethereum ve diğer kripto paralar hakkında güncel haberler, teknik analizler ve eğitim içerikleri.",
  keywords: "kripto para, bitcoin, ethereum, blockchain, analiz, haber",
  authors: [{ name: "Kripto Blog Team" }],
  openGraph: {
    title: "Kripto Blog - Kripto Para Haberleri ve Analizleri",
    description: "Bitcoin, Ethereum ve diğer kripto paralar hakkında güncel haberler, teknik analizler ve eğitim içerikleri.",
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kripto Blog - Kripto Para Haberleri ve Analizleri",
    description: "Bitcoin, Ethereum ve diğer kripto paralar hakkında güncel haberler, teknik analizler ve eğitim içerikleri.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-white dark:bg-black">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
