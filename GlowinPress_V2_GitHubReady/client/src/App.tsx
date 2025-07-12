import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { Navigation } from '@/components/Navigation';
import { ProgressWindow } from '@/components/ProgressWindow';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { WindowModal } from '@/components/WindowModal';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import { Home } from '@/pages/Home';
import { ImageCompressor } from '@/pages/ImageCompressor';
import { ImageConverter } from '@/pages/ImageConverter';
import { ImageDownloader } from '@/pages/ImageDownload';
import { VideoConverter } from '@/pages/VideoConverter';
import { VideoCompressor } from '@/pages/VideoCompressor';
import { VideoDownloader } from '@/pages/VideoDownloader';
import { VideoUpscaler } from '@/pages/VideoUpscaler';
import { SvgCreator } from '@/pages/SvgCreator';
import { YouTubeDownloader } from '@/pages/YouTubeDownloader';
import { Settings } from '@/pages/Settings';
import { About } from '@/pages/About';
import { NotFound } from '@/pages/NotFound';
import { getCookie } from '@/lib/cookies';

function App() {
  const [openWindow, setOpenWindow] = React.useState<string | null>(null);
  const [windowedMode, setWindowedMode] = React.useState(() => {
    const cookieValue = getCookie('windowedMode');
    return cookieValue !== 'true'; // Default to true (enabled)
  });

  React.useEffect(() => {
    // Apply CSS optimization setting on app load
    const reducedCSS = localStorage.getItem('reducedCSS') === 'true';
    if (reducedCSS) {
      document.documentElement.classList.add('reduced-css');
    }

    // Check windowed mode setting
    const handleStorageChange = () => {
      const cookieValue = getCookie('windowedMode');
      setWindowedMode(cookieValue !== 'false');
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    // Register service worker for offline support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service worker registration failed:', error);
      });
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 0 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 0 }
  };

  const pageTransition = {
    duration: 0.1,
    ease: 'linear'
  };

  const toolComponents = {
    'image-compressor': ImageCompressor,
    'image-converter': ImageConverter,
    'image-downloader': ImageDownloader,
    'video-converter': VideoConverter,
    'video-compressor': VideoCompressor,
    'video-downloader': VideoDownloader,
    'video-upscaler': VideoUpscaler,
    'svg-creator': SvgCreator,
    'youtube': YouTubeDownloader,
    'settings': Settings,
    'about': About,
  };

  const toolTitles = {
    'image-compressor': 'Image Compressor',
    'image-converter': 'Image Converter',
    'image-downloader': 'Image Downloader',
    'video-converter': 'Video Converter',
    'video-compressor': 'Video Compressor',
    'video-downloader': 'Video Downloader',
    'video-upscaler': 'AI Video Upscaler',
    'svg-creator': 'SVG Creator',
    'youtube': 'YouTube Downloader',
    'settings': 'Settings',
    'about': 'About',
  };

  const handleToolClick = (tool: string) => {
    if (windowedMode) {
      setOpenWindow(tool);
    } else {
      // Navigate normally when windowed mode is disabled
      window.location.href = `/${tool}`;
    }
  };

  const renderToolComponent = (tool: string) => {
    const Component = toolComponents[tool as keyof typeof toolComponents];
    return Component ? <Component /> : null;
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ProgressProvider>
          <Router>
            <div className="app-container text-foreground">
              <Navigation onToolClick={handleToolClick} />
              <OfflineIndicator />
              
              <main className="container mx-auto px-4 py-8 relative">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <Home onToolClick={handleToolClick} />
                      </motion.div>
                    } />
                    
                    {/* Full routes for all tools */}
                    <Route path="/image-compressor" element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <ImageCompressor />
                      </motion.div>
                    } />
                    
                    <Route path="/image-converter" element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <ImageConverter />
                      </motion.div>
                    } />
                    
                    <Route path="/image-downloader" element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <ImageDownloader />
                      </motion.div>
                    } />
                    
                    <Route path="/video-converter" element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <VideoConverter />
                      </motion.div>
                    } />
                    
                    <Route path="/video-compressor" element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <VideoCompressor />
                      </motion.div>
                    } />
                    
                    <Route path="/video-downloader" element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <VideoDownloader />
                      </motion.div>
                    } />
                    
                    <Route path="/video-upscaler" element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <VideoUpscaler />
                      </motion.div>
                    } />
                    
                    <Route path="/svg-creator" element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <SvgCreator />
                      </motion.div>
                    } />
                    
                    <Route path="/youtube" element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <YouTubeDownloader />
                      </motion.div>
                    } />
                    
                    <Route path="/settings" element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <Settings />
                      </motion.div>
                    } />
                    
                    <Route path="/about" element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <About />
                      </motion.div>
                    } />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </main>

              {/* Windowed Tools */}
              {windowedMode && openWindow && (
                <WindowModal
                  isOpen={!!openWindow}
                  onClose={() => setOpenWindow(null)}
                  title={toolTitles[openWindow as keyof typeof toolTitles]}
                >
                  {renderToolComponent(openWindow)}
                </WindowModal>
              )}
              
              {/* Hamburger Menu */}
              <HamburgerMenu onOpenWindow={handleToolClick} />
              
              {/* Progress Window */}
              <ProgressWindow />
              
              {/* Floating background elements - disabled animations */}
              <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
                <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />
              </div>
            </div>
          </Router>
        </ProgressProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
