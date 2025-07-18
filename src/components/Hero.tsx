'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, ArrowRight, BarChart3, BookOpen, Users, Zap, Bitcoin, Coins } from 'lucide-react';

const Hero = () => {
  const stats = [
    { label: 'Günlük Ziyaretçi', value: '10K+', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Toplam Makale', value: '500+', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'Market Analizi', value: '100+', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 min-h-screen">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/20 dark:bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500/20 dark:bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 dark:bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30 dark:border-white/20 text-gray-700 dark:text-white">
                <TrendingUp className="mr-2 h-4 w-4" />
                Kripto Para Analizi
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
                Kripto Dünyasının{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  En Güncel
                </span>{' '}
                Haberleri
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                Bitcoin, Ethereum ve diğer kripto paralar hakkında uzman analizleri, 
                teknik göstergeler ve piyasa trendleri. Kripto dünyasında önde olun.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 text-white font-semibold px-8 py-3">
                <Link href="/blog">
                  Makaleleri Keşfet
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 backdrop-blur-sm">
                <Link href="/analysis">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Teknik Analiz
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-3">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative z-10">
              <Card className="overflow-hidden border-0 shadow-2xl bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30 dark:border-white/20">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative">
                    {/* Crypto Chart */}
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div className="w-full h-40 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 backdrop-blur-sm border border-white/30 dark:border-white/20">
                        <div className="flex items-end justify-between h-24 space-x-1 mb-4">
                          {[20, 35, 25, 45, 30, 60, 40, 55, 70, 65, 80, 75].map((height, index) => (
                            <div
                              key={index}
                              className="flex-1 bg-gradient-to-t from-blue-400 to-purple-400 rounded-t transition-all duration-300 hover:scale-105"
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Bitcoin className="h-5 w-5 text-yellow-500" />
                            <span className="text-gray-900 dark:text-white font-semibold">BTC/USD</span>
                          </div>
                          <span className="text-green-600 dark:text-green-400 font-bold">+2.45%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-green-500/90 backdrop-blur-sm border border-green-400/50 text-white">
                        <Zap className="mr-1 h-3 w-3" />
                        Live
                      </Badge>
                    </div>
                    
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/30 dark:border-white/20">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">$43,250.00</div>
                        <div className="text-xs text-green-600 dark:text-green-400">+1.2%</div>
                      </div>
                    </div>

                    {/* Crypto Icons */}
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-yellow-400/30">
                          <Bitcoin className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-400/30">
                          <Coins className="h-4 w-4 text-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Background Elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 