import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function ProgressWindow() {
  const { progressItems, isVisible, setVisible, clearAll } = useProgress();
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!isVisible || progressItems.length === 0) {
    return null;
  }

  const activeItems = progressItems.filter(item => 
    item.status === 'pending' || item.status === 'processing'
  );
  
  const completedItems = progressItems.filter(item => 
    item.status === 'completed' || item.status === 'error'
  );

  const overallProgress = progressItems.length > 0 
    ? progressItems.reduce((sum, item) => sum + item.progress, 0) / progressItems.length 
    : 0;

  const totalETA = activeItems.reduce((sum, item) => sum + item.eta, 0);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="progress-window"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-white">
              {activeItems.length > 0 ? t('common.processing') : 'Complete'}
            </div>
            {totalETA > 0 && (
              <div className="flex items-center gap-1 text-xs text-white/70">
                <Clock className="w-3 h-3" />
                <span>{formatTime(totalETA)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setVisible(false)}
              className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="progress-bar-blue"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                {/* Active Items */}
                {activeItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2 rounded bg-white/10"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-medium text-white truncate flex-1">
                        {item.title}
                      </div>
                      <div className="text-xs text-white/70 ml-2">
                        {Math.round(item.progress)}%
                      </div>
                    </div>
                    <div className="text-xs text-white/60 mb-1 truncate">
                      {item.fileName}
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1">
                      <motion.div
                        className="h-1 bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    {item.eta > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-white/50" />
                        <span className="text-xs text-white/50">{formatTime(item.eta)}</span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Completed Items */}
                {completedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2 rounded bg-white/5"
                  >
                    <div className="flex items-center gap-2">
                      {item.status === 'completed' ? (
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                      )}
                      <div className="text-xs text-white/70 truncate flex-1">
                        {item.fileName}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {progressItems.length > 0 && (
                <button
                  onClick={clearAll}
                  className="w-full mt-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  Clear All
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
