'use client';

import { ReactNode, createContext, useContext } from 'react';
import { useJWT } from '../hooks';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => boolean;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
    getAuthHeaders
  } = useJWT();

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      login, 
      logout, 
      refreshToken,
      getAuthHeaders
    }}>
      {children}
    </AuthContext.Provider>
  );
} 