'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Twitter, Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Ana Sayfa', href: '/' },
      { name: 'Blog', href: '/blog' },
      { name: 'Analiz', href: '/analysis' },
      { name: 'Hakkında', href: '/about' },
      { name: 'İletişim', href: '/contact' },
    ],
    categories: [
      { name: 'Bitcoin', href: '/category/bitcoin' },
      { name: 'Ethereum', href: '/category/ethereum' },
      { name: 'DeFi', href: '/category/defi' },
      { name: 'NFT', href: '/category/nft' },
      { name: 'Trading', href: '/category/trading' },
    ],
    resources: [
      { name: 'Teknik Analiz', href: '/resources/technical-analysis' },
      { name: 'Temel Analiz', href: '/resources/fundamental-analysis' },
      { name: 'Risk Yönetimi', href: '/resources/risk-management' },
      { name: 'Portföy Yönetimi', href: '/resources/portfolio-management' },
      { name: 'Eğitim', href: '/resources/education' },
    ],
    company: [
      { name: 'Hakkımızda', href: '/about' },
      { name: 'Ekibimiz', href: '/team' },
      { name: 'Kariyer', href: '/careers' },
      { name: 'Gizlilik', href: '/privacy' },
      { name: 'Kullanım Şartları', href: '/terms' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'YouTube', href: '#', icon: Youtube },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CryptoBlog
              </span>
            </Link>
            
            <p className="text-slate-400 mb-6 max-w-sm">
              Kripto para dünyasının en güncel haberleri, analizleri ve eğitim içerikleri. 
              Güvenilir bilgi kaynağınız.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Link href={social.href}>
                    <social.icon className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kategoriler</h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kaynaklar</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Şirket</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Güncel Kalın
            </h3>
            <p className="text-slate-400 mb-6">
              En son kripto haberleri ve analizleri için e-posta listemize katılın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Abone Ol
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@cryptoblog.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+90 (212) 123 45 67</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                Beta
              </Badge>
              <span className="text-sm text-slate-400">
                © {currentYear} CryptoBlog. Tüm hakları saklıdır.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <Button
        onClick={scrollToTop}
        variant="ghost"
        size="sm"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-slate-800 text-white hover:bg-slate-700 shadow-lg"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
};

export default Footer; 