import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { Monitor, Moon, Sun, Palette, Sparkles } from 'lucide-react';

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Bright and clean' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-primary" />
          <Label className="text-xl font-semibold text-white">Color Theme</Label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;
            return (
              <Button
                key={option.value}
                variant="ghost"
                className={`glass-card h-24 flex-col space-y-2 transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/20 border-primary/50 glow-purple scale-105' 
                    : 'hover:bg-white/10 hover:scale-105'
                }`}
                onClick={() => setTheme(option.value as any)}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-white/70'}`} />
                <div className="text-center">
                  <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/80'}`}>
                    {option.label}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-white/80' : 'text-white/50'}`}>
                    {option.description}
                  </div>
                </div>
                {isActive && <Sparkles className="absolute top-2 right-2 h-4 w-4 text-primary animate-pulse" />}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}