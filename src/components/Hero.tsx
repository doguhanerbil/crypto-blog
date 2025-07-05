'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, ArrowRight, BarChart3, BookOpen, Users, Zap } from 'lucide-react';

const Hero = () => {
  const stats = [
    { label: 'Günlük Ziyaretçi', value: '10K+', icon: Users },
    { label: 'Toplam Makale', value: '500+', icon: BookOpen },
    { label: 'Market Analizi', value: '100+', icon: BarChart3 },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                <TrendingUp className="mr-2 h-3 w-3" />
                Kripto Para Analizi
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Kripto Dünyasının{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  En Güncel
                </span>{' '}
                Haberleri
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl">
                Bitcoin, Ethereum ve diğer kripto paralar hakkında uzman analizleri, 
                teknik göstergeler ve piyasa trendleri. Kripto dünyasında önde olun.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group">
                <Link href="/blog">
                  Makaleleri Keşfet
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <Link href="/analysis">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Teknik Analiz
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative z-10">
              <Card className="overflow-hidden border-0 shadow-2xl">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative">
                    {/* Mock Chart */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4">
                        <div className="flex items-end justify-between h-20 space-x-1">
                          {[20, 35, 25, 45, 30, 60, 40, 55, 70, 65, 80, 75].map((height, index) => (
                            <div
                              key={index}
                              className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>BTC/USD</span>
                          <span className="text-green-600">+2.45%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur">
                        <Zap className="mr-1 h-3 w-3" />
                        Live
                      </Badge>
                    </div>
                    
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-white/90 backdrop-blur rounded-lg p-2">
                        <div className="text-xs font-medium">$43,250.00</div>
                        <div className="text-xs text-green-600">+1.2%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Background Elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 