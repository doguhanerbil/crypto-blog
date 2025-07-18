import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface JWTTokenData {
  token: string;
  user: User;
}

export function useJWT() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Token'ı localStorage'dan al
  const getStoredToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('strapi_jwt');
    }
    return null;
  };

  // Kullanıcı verilerini localStorage'dan al
  const getStoredUser = (): User | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.error('Kullanıcı verisi parse edilemedi:', error);
          return null;
        }
      }
    }
    return null;
  };

  // Token'ı localStorage'a kaydet
  const saveToken = (newToken: string, userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('strapi_jwt', newToken);
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
  };

  // Token'ı localStorage'dan sil
  const removeToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('strapi_jwt');
      localStorage.removeItem('user_data');
    }
  };

  // Token'ın geçerliliğini kontrol et
  const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Token geçerlilik kontrolü hatası:', error);
      return false;
    }
  };

  // Login işlemi
  const login = (token: string, userData: User) => {
    if (isTokenValid(token)) {
      saveToken(token, userData);
      setToken(token);
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } else {
      console.error('Geçersiz token');
      return false;
    }
  };

  // Logout işlemi
  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Token'ı yenile
  const refreshToken = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        login(data.jwt, data.user);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token yenileme hatası:', error);
      logout();
      return false;
    }
  };

  // API istekleri için authorization header'ı al
  const getAuthHeaders = () => {
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  };

  // Sayfa yüklendiğinde token kontrolü
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser && isTokenValid(storedToken)) {
      setToken(storedToken);
      setUser(storedUser);
      setIsAuthenticated(true);
    } else if (storedToken && !isTokenValid(storedToken)) {
      // Token geçersizse temizle
      removeToken();
    }

    setIsLoading(false);
  }, []);

  // Token değişikliklerini dinle
  useEffect(() => {
    if (token && !isTokenValid(token)) {
      logout();
    }
  }, [token]);

  return {
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
    getAuthHeaders,
    isTokenValid
  };
} 