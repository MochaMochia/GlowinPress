import * as React from 'react';

interface ProgressItem {
  id: string;
  title: string;
  fileName: string;
  progress: number;
  eta: number; // in seconds
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProgressContextType {
  progressItems: ProgressItem[];
  addProgressItem: (item: Omit<ProgressItem, 'id'>) => string;
  updateProgressItem: (id: string, updates: Partial<ProgressItem>) => void;
  removeProgressItem: (id: string) => void;
  clearAll: () => void;
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
}

const ProgressContext = React.createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progressItems, setProgressItems] = React.useState<ProgressItem[]>([]);
  const [isVisible, setVisible] = React.useState(false);

  const addProgressItem = React.useCallback((item: Omit<ProgressItem, 'id'>): string => {
    const id = `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem: ProgressItem = { ...item, id };
    
    setProgressItems(prev => {
      const updated = [...prev, newItem];
      // Keep only the latest 3 items
      return updated.slice(-3);
    });
    
    setVisible(true);
    return id;
  }, []);

  const updateProgressItem = React.useCallback((id: string, updates: Partial<ProgressItem>) => {
    setProgressItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const removeProgressItem = React.useCallback((id: string) => {
    setProgressItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setProgressItems([]);
    setVisible(false);
  }, []);

  // Auto-hide when all items are completed or errored
  React.useEffect(() => {
    if (progressItems.length === 0) {
      setVisible(false);
    } else {
      const hasActive = progressItems.some(item => 
        item.status === 'pending' || item.status === 'processing'
      );
      if (!hasActive) {
        // Auto-hide after 3 seconds if all items are done
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [progressItems]);

  return (
    <ProgressContext.Provider value={{
      progressItems,
      addProgressItem,
      updateProgressItem,
      removeProgressItem,
      clearAll,
      isVisible,
      setVisible
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = React.useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
