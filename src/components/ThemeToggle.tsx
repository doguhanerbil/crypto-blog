'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
        disabled
      >
        <div className="w-4 h-4 animate-pulse bg-gray-400 rounded-full" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 group"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
      ) : (
        <Sun className="h-4 w-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
      )}
    </Button>
  );
} 