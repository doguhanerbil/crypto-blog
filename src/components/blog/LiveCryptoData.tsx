'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface CryptoData {
  symbol: string
  price: number
  change24h: number
  changePercent24h: number
}

export default function LiveCryptoData() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCryptoData() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,bitget-token&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true');
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error('API hatası: ' + errorText);
        }
        const data = await res.json();
        // Burada eski formatlamayı uygula
        const formattedData: CryptoData[] = [
          {
            symbol: 'BTC',
            price: data.bitcoin?.usd || 0,
            change24h: data.bitcoin?.usd_24h_change || 0,
            changePercent24h: data.bitcoin?.usd_24h_change || 0
          },
          {
            symbol: 'ETH',
            price: data.ethereum?.usd || 0,
            change24h: data.ethereum?.usd_24h_change || 0,
            changePercent24h: data.ethereum?.usd_24h_change || 0
          },
          {
            symbol: 'BGB',
            price: data['bitget-token']?.usd || 0,
            change24h: data['bitget-token']?.usd_24h_change || 0,
            changePercent24h: data['bitget-token']?.usd_24h_change || 0
          }
        ];
        setCryptoData(formattedData);
      } catch (err: any) {
        setError(err.message || 'Veri alınamadı');
        console.error(err);
      }
    }
    fetchCryptoData();
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    } else {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  const formatChange = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 rounded-lg p-[2px] bg-gradient-to-br from-black via-gray-700 to-black animate-gradient-flow"></div>
        <Card className="relative bg-white dark:bg-gray-900 rounded-lg border-0 shadow-lg">
          <CardHeader className="pt-6 pb-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 animate-pulse" />
              Canlı Veriler
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="space-y-1">
                      <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                  <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-lg p-[2px] bg-gradient-to-br from-black via-gray-700 to-black animate-gradient-flow"></div>
      <Card className="relative bg-white dark:bg-gray-900 rounded-lg border-0 shadow-lg">
        <CardHeader className="pt-6 pb-0">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Canlı Veriler
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="space-y-3">
            {cryptoData.map((crypto) => (
              <div
                key={crypto.symbol}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {crypto.symbol}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {crypto.symbol}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatPrice(crypto.price)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {crypto.changePercent24h >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      crypto.changePercent24h >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatChange(crypto.changePercent24h)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Veriler CoinGecko&apos;dan gelmektedir • 30s güncelleme
            </p>
          </div>
        </CardContent>
      </Card>
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
    </div>
  )
} 