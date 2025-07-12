import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = React.useState(false);
  const { t } = useLanguage();

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show indicator initially if offline
    if (!navigator.onLine) {
      setShowIndicator(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={isOnline ? 'online-indicator' : 'offline-indicator'}
        >
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isOnline ? t('online.indicator') : t('offline.indicator')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
