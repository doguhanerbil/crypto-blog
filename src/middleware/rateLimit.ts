import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(private config: RateLimitConfig) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (record.count >= this.config.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemaining(identifier: string): number {
    const record = this.requests.get(identifier);
    if (!record) return this.config.maxRequests;
    return Math.max(0, this.config.maxRequests - record.count);
  }

  getResetTime(identifier: string): number {
    const record = this.requests.get(identifier);
    return record ? record.resetTime : Date.now() + this.config.windowMs;
  }
}

// Farklı rate limit konfigürasyonları
const rateLimiters = {
  auth: new RateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 5 }), // 15 dakikada 5 giriş denemesi
  api: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 100 }), // 1 dakikada 100 API isteği
  contact: new RateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 3 }), // 1 saatte 3 iletişim mesajı
  upload: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 10 }), // 1 dakikada 10 dosya yükleme
};

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

export function withRateLimit(type: keyof typeof rateLimiters) {
  return (handler: Function) => {
    return async (request: NextRequest) => {
      const clientIP = getClientIP(request);
      const limiter = rateLimiters[type];

      if (!limiter.isAllowed(clientIP)) {
        const resetTime = limiter.getResetTime(clientIP);
        return NextResponse.json(
          {
            error: 'Too many requests',
            retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limiter.config.maxRequests.toString(),
              'X-RateLimit-Remaining': limiter.getRemaining(clientIP).toString(),
              'X-RateLimit-Reset': resetTime.toString(),
              'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
            },
          }
        );
      }

      const response = await handler(request);
      
      // Rate limit bilgilerini response header'larına ekle
      if (response instanceof NextResponse) {
        response.headers.set('X-RateLimit-Limit', limiter.config.maxRequests.toString());
        response.headers.set('X-RateLimit-Remaining', limiter.getRemaining(clientIP).toString());
        response.headers.set('X-RateLimit-Reset', limiter.getResetTime(clientIP).toString());
      }

      return response;
    };
  };
}

// Özel rate limit fonksiyonları
export const withAuthRateLimit = withRateLimit('auth');
export const withAPIRateLimit = withRateLimit('api');
export const withContactRateLimit = withRateLimit('contact');
export const withUploadRateLimit = withRateLimit('upload'); 