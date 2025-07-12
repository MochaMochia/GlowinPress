import * as React from 'react';

interface PerformanceMetrics {
  fps: number;
  isLagging: boolean;
  performanceLevel: 'good' | 'warning' | 'poor';
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    fps: 60,
    isLagging: false,
    performanceLevel: 'good'
  });

  const frameCount = React.useRef(0);
  const lastTime = React.useRef(performance.now());
  const animationFrameId = React.useRef<number>();

  const measurePerformance = React.useCallback(() => {
    const now = performance.now();
    frameCount.current++;

    if (now - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
      
      const isLagging = fps < 30;
      let performanceLevel: 'good' | 'warning' | 'poor' = 'good';
      
      if (fps < 20) {
        performanceLevel = 'poor';
      } else if (fps < 45) {
        performanceLevel = 'warning';
      }

      setMetrics({ fps, isLagging, performanceLevel });
      
      frameCount.current = 0;
      lastTime.current = now;
    }

    animationFrameId.current = requestAnimationFrame(measurePerformance);
  }, []);

  React.useEffect(() => {
    animationFrameId.current = requestAnimationFrame(measurePerformance);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [measurePerformance]);

  return metrics;
}
