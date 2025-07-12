import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { getCookie, setCookie } from "@/lib/cookies";

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = getCookie('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // Apply theme classes immediately for smooth transition
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('light', 'dark');
    htmlElement.classList.add(newIsDark ? 'dark' : 'light');
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newIsDark ? '#a855f7' : '#8b5cf6');
    }
    
    // Store preference in cookie
    setCookie('theme', newIsDark ? 'dark' : 'light', 365);
  };

  React.useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = getCookie('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDark(shouldBeDark);
    
    // Apply initial theme
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('light', 'dark');
    htmlElement.classList.add(shouldBeDark ? 'dark' : 'light');
    
    // Set initial meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', shouldBeDark ? '#a855f7' : '#8b5cf6');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const savedTheme = getCookie('theme');
      if (!savedTheme) {
        setIsDark(e.matches);
        htmlElement.classList.remove('light', 'dark');
        htmlElement.classList.add(e.matches ? 'dark' : 'light');
        
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', e.matches ? '#a855f7' : '#8b5cf6');
        }
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  return (
    <div className="fixed top-6 right-6 z-30">
      <button
        onClick={toggleTheme}
        className="relative bg-background/80 backdrop-blur-sm border-2 border-border rounded-full p-2 shadow-xl hover:bg-background/90 transition-all duration-500 w-20 h-10"
        aria-label="Toggle theme"
      >
        {/* Track */}
        <div className={`absolute inset-2 rounded-full transition-all duration-500 ${
          isDark ? 'bg-slate-700' : 'bg-blue-200'
        }`} />
        
        {/* Sliding button */}
        <div className={`relative w-6 h-6 rounded-full transition-all duration-500 transform flex items-center justify-center ${
          isDark 
            ? 'translate-x-10 bg-slate-900 text-yellow-400' 
            : 'translate-x-0 bg-yellow-400 text-orange-600'
        }`}>
          {isDark ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </div>
      </button>
    </div>
  );
}
