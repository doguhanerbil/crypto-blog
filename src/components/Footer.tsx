'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bitcoin, Twitter, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Ana Sayfa', href: '/' },
      { name: 'Blog', href: '/blog' },
      { name: 'Analiz', href: '/analysis' },
      { name: 'Hakkında', href: '/about' },
    ],
    categories: [
      { name: 'Bitcoin', href: '/category/bitcoin' },
      { name: 'Ethereum', href: '/category/ethereum' },
      { name: 'DeFi', href: '/category/defi' },
      { name: 'NFT', href: '/category/nft' },
    ],
    company: [
      { name: 'Hakkımızda', href: '/about' },
      { name: 'Gizlilik', href: '/privacy' },
      { name: 'Kullanım Şartları', href: '/terms' },
      { name: 'İletişim', href: '/contact' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'YouTube', href: '#', icon: Youtube },
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Bitcoin className="h-6 w-6 text-gray-900 dark:text-white" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Kripto Blog
              </span>
            </Link>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
              Kripto para dünyasının en güncel haberleri, analizleri ve eğitim içerikleri.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Kategoriler</h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Güncel Kalın
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              En son kripto haberleri için e-posta listemize katılın.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button size="sm">
                Abone Ol
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Kripto Blog. Tüm hakları saklıdır.
            </span>
            
            <div className="flex items-center space-x-6 text-sm">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 