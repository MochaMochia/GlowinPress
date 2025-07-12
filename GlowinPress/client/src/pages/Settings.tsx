import * as React from 'react';
import { ThemeSettings } from '@/components/ThemeSettings';
import { Settings as SettingsIcon, Save, Zap, Activity, Square } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCookie, setCookie } from "@/lib/cookies";

export function Settings() {
  const [imageFormat, setImageFormat] = React.useState(() => {
    return getCookie('preferredImageFormat') || localStorage.getItem('preferredImageFormat') || 'jpeg';
  });
  
  const [videoFormat, setVideoFormat] = React.useState(() => {
    return getCookie('preferredVideoFormat') || localStorage.getItem('preferredVideoFormat') || 'mp4';
  });

  const [reducedCSS, setReducedCSS] = React.useState(() => {
    const cookieValue = getCookie('reducedCSS');
    if (cookieValue !== null) return cookieValue === 'true';
    return localStorage.getItem('reducedCSS') === 'true';
  });

  const [showPerformance, setShowPerformance] = React.useState(() => {
    const cookieValue = getCookie('showPerformance');
    if (cookieValue !== null) return cookieValue === 'true';
    return localStorage.getItem('showPerformance') === 'true';
  });

  const [windowedMode, setWindowedMode] = React.useState(() => {
    const cookieValue = getCookie('windowedMode');
    if (cookieValue !== null) return cookieValue !== 'false';
    return localStorage.getItem('windowedMode') !== 'false';
  });

  const [isSaved, setIsSaved] = React.useState(false);

  const applyCSSOptimization = (reduced: boolean) => {
    if (reduced) {
      document.documentElement.classList.add('reduced-css');
    } else {
      document.documentElement.classList.remove('reduced-css');
    }
  };

  const handleCSSOptimizationChange = (checked: boolean) => {
    setReducedCSS(checked);
    applyCSSOptimization(checked);
    setCookie('reducedCSS', checked.toString(), 365);
    localStorage.setItem('reducedCSS', checked.toString());
  };

  const handlePerformanceToggle = (checked: boolean) => {
    setShowPerformance(checked);
    setCookie('showPerformance', checked.toString(), 365);
    localStorage.setItem('showPerformance', checked.toString());
  };

  const handleWindowedModeToggle = (checked: boolean) => {
    setWindowedMode(checked);
    setCookie('windowedMode', checked.toString(), 365);
    localStorage.setItem('windowedMode', checked.toString());
  };

  React.useEffect(() => {
    applyCSSOptimization(reducedCSS);
  }, [reducedCSS]);

  const saveSettings = () => {
    // Save to both cookies and localStorage for backwards compatibility
    setCookie('preferredImageFormat', imageFormat, 365);
    setCookie('preferredVideoFormat', videoFormat, 365);
    setCookie('reducedCSS', reducedCSS.toString(), 365);
    setCookie('showPerformance', showPerformance.toString(), 365);
    setCookie('windowedMode', windowedMode.toString(), 365);
    
    localStorage.setItem('preferredImageFormat', imageFormat);
    localStorage.setItem('preferredVideoFormat', videoFormat);
    localStorage.setItem('reducedCSS', reducedCSS.toString());
    localStorage.setItem('showPerformance', showPerformance.toString());
    localStorage.setItem('windowedMode', windowedMode.toString());
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const imageFormatOptions = [
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WebP' },
    { value: 'heic', label: 'HEIC' },
    { value: 'gif', label: 'GIF' },
    { value: 'tiff', label: 'TIFF' },
    { value: 'svg', label: 'SVG' },
    { value: 'avif', label: 'AVIF' },
    { value: 'bmp', label: 'BMP' },
    { value: 'ico', label: 'ICO' }
  ];

  const videoFormatOptions = [
    { value: 'mp4', label: 'MP4' },
    { value: 'webm', label: 'WebM' },
    { value: 'avi', label: 'AVI' },
    { value: 'mov', label: 'MOV' },
    { value: 'mkv', label: 'MKV' }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <SettingsIcon className="h-16 w-16 text-primary animate-spin" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-0 h-16 w-16 text-primary/30 animate-ping">
              <SettingsIcon className="h-16 w-16" />
            </div>
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold gradient-text text-shadow-lg">
          Settings
        </h1>
        <p className="text-xl md:text-2xl text-white/80 dark:text-gray-200 text-shadow max-w-3xl mx-auto">
          Customize your GlowinPress experience with themes and preferences
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Theme Settings */}
        <div className="glass-card p-8 glow-purple">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white dark:text-gray-100">Theme & Appearance</h2>
              <p className="text-white/70 dark:text-gray-300">
                Customize the look and feel of the application to match your preferences
              </p>
            </div>
            <ThemeSettings />
          </div>
        </div>

        {/* Interface Settings */}
        <div className="glass-card p-8 glow-sky">
          <div className="flex items-center gap-3 mb-6">
            <Square className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-2xl font-bold text-white dark:text-gray-100">Interface Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="windowed-mode" className="text-white font-medium">
                  Windowed Mode
                </Label>
                <p className="text-sm text-white/60">
                  Enable popup windows for tools instead of full-page navigation
                </p>
              </div>
              <Switch
                id="windowed-mode"
                checked={windowedMode}
                onCheckedChange={handleWindowedModeToggle}
              />
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="glass-card p-8 glow-purple">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-2xl font-bold text-white dark:text-gray-100">Performance Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="reduced-css" className="text-white font-medium">
                  Reduced CSS Mode
                </Label>
                <p className="text-sm text-white/60">
                  Disable animations and effects for better performance on older devices
                </p>
              </div>
              <Switch
                id="reduced-css"
                checked={reducedCSS}
                onCheckedChange={handleCSSOptimizationChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="show-performance" className="text-white font-medium">
                  Show Performance Indicator
                </Label>
                <p className="text-sm text-white/60">
                  Display FPS and performance warnings when needed (disabled by default)
                </p>
              </div>
              <Switch
                id="show-performance"
                checked={showPerformance}
                onCheckedChange={handlePerformanceToggle}
              />
            </div>
            
            <div className="text-xs text-white/50 p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/30">
              <strong>Note:</strong> Reduced CSS mode removes animations, transforms, and backdrop blur effects to improve performance on devices with limited resources.
            </div>
          </div>
        </div>

        {/* Format Preferences */}
        <div className="glass-card p-8 glow-sky">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-2xl font-bold text-white dark:text-gray-100">Format Preferences</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="image-format-select" className="block mb-3 text-white font-medium">
                Default Image Format
              </Label>
              <Select value={imageFormat} onValueChange={setImageFormat}>
                <SelectTrigger id="image-format-select" className="glass-input border-0 text-white">
                  <SelectValue placeholder="Select image format" />
                </SelectTrigger>
                <SelectContent className="glass-card border-0">
                  {imageFormatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/10">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-white/60 mt-2">
                This format will be pre-selected in the Image Converter
              </p>
            </div>

            <div>
              <Label htmlFor="video-format-select" className="block mb-3 text-white font-medium">
                Default Video Format
              </Label>
              <Select value={videoFormat} onValueChange={setVideoFormat}>
                <SelectTrigger id="video-format-select" className="glass-input border-0 text-white">
                  <SelectValue placeholder="Select video format" />
                </SelectTrigger>
                <SelectContent className="glass-card border-0">
                  {videoFormatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/10">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-white/60 mt-2">
                This format will be pre-selected in the Video Converter
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <Button 
            onClick={saveSettings}
            className={`px-8 py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 text-base ${
              isSaved 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
            } text-white shadow-lg`}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Settings Saved!" : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
