import * as React from 'react';

type Language = 'en' | 'fr';

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', fr: 'Accueil' },
  'nav.imageTools': { en: 'Image Tools', fr: 'Outils Image' },
  'nav.videoTools': { en: 'Video Tools', fr: 'Outils Vidéo' },
  'nav.youtube': { en: 'YouTube', fr: 'YouTube' },
  'nav.settings': { en: 'Settings', fr: 'Paramètres' },
  
  // Home page
  'home.title': { en: 'GlowinPress', fr: 'GlowinPress' },
  'home.subtitle': { en: 'The Ultimate Media Processing Suite', fr: 'La Suite Ultime de Traitement Média' },
  'home.description': { en: 'Compress, convert, and download images and videos with privacy-first, browser-based processing', fr: 'Compressez, convertissez et téléchargez des images et vidéos avec un traitement basé sur le navigateur, respectueux de la vie privée' },
  'home.getStarted': { en: 'Get Started', fr: 'Commencer' },
  'home.youtubeDownloader': { en: 'YouTube Downloader', fr: 'YouTube Downloader' },
  
  // Tools
  'tools.imageCompressor': { en: 'Image Compressor', fr: 'Compresseur d\'Images' },
  'tools.imageConverter': { en: 'Image Converter', fr: 'Convertisseur d\'Images' },
  'tools.imageDownloader': { en: 'Image Downloader', fr: 'Téléchargeur d\'Images' },
  'tools.videoConverter': { en: 'Video Converter', fr: 'Convertisseur Vidéo' },
  'tools.videoCompressor': { en: 'Video Compressor', fr: 'Compresseur Vidéo' },
  'tools.videoDownloader': { en: 'Video Downloader', fr: 'Téléchargeur Vidéo' },
  
  // Common
  'common.upload': { en: 'Upload', fr: 'Téléverser' },
  'common.download': { en: 'Download', fr: 'Télécharger' },
  'common.convert': { en: 'Convert', fr: 'Convertir' },
  'common.compress': { en: 'Compress', fr: 'Compresser' },
  'common.processing': { en: 'Processing...', fr: 'Traitement...' },
  'common.error': { en: 'Error', fr: 'Erreur' },
  'common.success': { en: 'Success', fr: 'Succès' },
  'common.cancel': { en: 'Cancel', fr: 'Annuler' },
  'common.close': { en: 'Close', fr: 'Fermer' },
  'common.save': { en: 'Save', fr: 'Enregistrer' },
  
  // Settings
  'settings.title': { en: 'Settings', fr: 'Paramètres' },
  'settings.theme': { en: 'Theme', fr: 'Thème' },
  'settings.language': { en: 'Language', fr: 'Langue' },
  'settings.light': { en: 'Light', fr: 'Clair' },
  'settings.dark': { en: 'Dark', fr: 'Sombre' },
  'settings.system': { en: 'System', fr: 'Système' },
  
  // Offline
  'offline.title': { en: 'Offline Mode', fr: 'Mode Hors Ligne' },
  'offline.description': { en: 'Some features are not available offline', fr: 'Certaines fonctionnalités ne sont pas disponibles hors ligne' },
  'offline.indicator': { en: 'You are offline', fr: 'Vous êtes hors ligne' },
  'online.indicator': { en: 'You are online', fr: 'Vous êtes en ligne' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved) return saved;
    
    // Auto-detect language from browser
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('fr')) return 'fr';
    return 'en';
  });

  React.useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = React.useCallback((key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translation[language] || translation.en || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
