import * as React from "react";
import { Menu, Settings, Info, Home, Image, Video, Download, Palette, ArrowUp, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HamburgerMenuProps {
  onOpenWindow: (type: string) => void;
}

export function HamburgerMenu({ onOpenWindow }: HamburgerMenuProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
    { icon: Home, label: t('nav.home'), type: "/" },
    { 
      icon: Image, 
      label: t('nav.imageTools'), 
      type: "submenu",
      items: [
        { label: t('tools.imageCompressor'), type: "image-compressor" },
        { label: t('tools.imageConverter'), type: "image-converter" },
        { label: t('tools.imageDownloader'), type: "image-downloader" }
      ]
    },
    { 
      icon: Video, 
      label: t('nav.videoTools'), 
      type: "submenu",
      items: [
        { label: t('tools.videoConverter'), type: "video-converter" },
        { label: t('tools.videoCompressor'), type: "video-compressor" },
        { label: t('tools.videoDownloader'), type: "video-downloader" },
        { label: "AI Video Upscaler", type: "video-upscaler" }
      ]
    },
    { icon: Palette, label: "SVG Creator", type: "svg-creator" },
    { icon: Download, label: "YouTube Downloader", type: "youtube" },
    { icon: Settings, label: t('nav.settings'), type: "settings" },
    { icon: Info, label: "About", type: "about" },
  ];

  const handleMenuClick = (type: string) => {
    setIsHovered(false);
    if (type === "/") {
      navigate("/");
    } else {
      onOpenWindow(type);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-30 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hamburger Button */}
      <div className="relative">
        <button className="bg-background/80 backdrop-blur-sm border-2 border-border rounded-full p-4 shadow-xl hover:bg-background/90 transition-all duration-200 hover:shadow-2xl">
          <Menu className="w-6 h-6 text-foreground drop-shadow-md" />
        </button>

        {/* Menu Content */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-4 bg-background/90 backdrop-blur-sm border-2 border-border rounded-xl shadow-2xl overflow-hidden min-w-[240px] animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
            <div className="space-y-1 py-2">
              {/* Language Selector */}
              <div className="px-4 py-2 border-b border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Language</span>
                </div>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full glass-button border-0 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="glass rounded-xl border border-white/20 dark:border-gray-800/50">
                    <SelectItem value="en" className="text-foreground">English</SelectItem>
                    <SelectItem value="es" className="text-foreground">Español</SelectItem>
                    <SelectItem value="fr" className="text-foreground">Français</SelectItem>
                    <SelectItem value="de" className="text-foreground">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                
                if (item.type === "submenu") {
                  return (
                    <div key={index}>
                      <div className="px-4 py-2 border-b border-border/30">
                        <div className="flex items-center gap-3 text-foreground">
                          <IconComponent className="w-4 h-4 drop-shadow-sm" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      </div>
                      {item.items?.map((subItem, subIndex) => (
                        <button
                          key={subIndex}
                          onClick={() => handleMenuClick(subItem.type)}
                          className="w-full flex items-center gap-3 px-6 py-2 text-left hover:bg-muted/50 transition-colors text-foreground text-sm pl-8"
                        >
                          <span>• {subItem.label}</span>
                        </button>
                      ))}
                    </div>
                  );
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleMenuClick(item.type)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors text-foreground shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <IconComponent className="w-4 h-4 drop-shadow-sm" />
                    <span className="text-sm font-medium drop-shadow-sm text-shadow-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
