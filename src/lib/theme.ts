// Tema yönetimi için basit utility fonksiyonları

export type Theme = 'light' | 'dark';

// Mevcut temayı al
export function getCurrentTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  // Önce localStorage'dan kontrol et
  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    return savedTheme;
  }
  
  // Sistem temasını kontrol et
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDark ? 'dark' : 'light';
}

// Temayı ayarla
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  // HTML class'ını güncelle
  const root = document.documentElement;
  
  // Önce tüm tema sınıflarını kaldır
  root.classList.remove('light', 'dark');
  
  // Yeni tema sınıfını ekle
  root.classList.add(theme);
  
  // localStorage'a kaydet
  localStorage.setItem('theme', theme);
  
  // Custom event dispatch et
  window.dispatchEvent(new CustomEvent('themeChanged'));
  
  // Debug için console log
  console.log('Theme set to:', theme, 'Classes:', root.classList.toString());
}

// Temayı değiştir
export function toggleTheme(): Theme {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
}

// Sayfa yüklendiğinde temayı uygula
export function initializeTheme(): void {
  const theme = getCurrentTheme();
  setTheme(theme);
} 