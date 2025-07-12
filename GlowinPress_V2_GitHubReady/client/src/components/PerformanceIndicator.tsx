import * as React from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { getCookie } from '@/lib/cookies';

export function PerformanceIndicator() {
  const { fps, isLagging, performanceLevel } = usePerformanceMonitor();
  const [showIndicator, setShowIndicator] = React.useState(false);
  const [showPerformance, setShowPerformance] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const cookieValue = getCookie('showPerformance');
      return cookieValue === 'true';
    }
    return false;
  });

  React.useEffect(() => {
    const handleStorageChange = () => {
      const cookieValue = getCookie('showPerformance');
      setShowPerformance(cookieValue === 'true');
    };

    // Listen for cookie changes through storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for cookie changes
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    if (isLagging && showPerformance) {
      setShowIndicator(true);
      const timer = setTimeout(() => setShowIndicator(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLagging, showPerformance]);

  const getMessage = () => {
    switch (performanceLevel) {
      case 'poor':
        return `Low Performance (${fps} FPS)`;
      case 'warning':
        return `Reduced Performance (${fps} FPS)`;
      default:
        return `Good Performance (${fps} FPS)`;
    }
  };

  if (!showPerformance || (!showIndicator && performanceLevel === 'good')) {
    return null;
  }

  return (
    <div className={`performance-indicator ${performanceLevel} ${showIndicator ? 'show' : ''}`}>
      {getMessage()}
    </div>
  );
}
