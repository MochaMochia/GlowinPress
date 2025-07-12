import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface BatchProgressProps {
  files: File[];
  processedFiles: number;
  currentFile?: string;
  errors?: string[];
  isProcessing: boolean;
}

export function BatchProgress({ files, processedFiles, currentFile, errors = [], isProcessing }: BatchProgressProps) {
  const progress = files.length > 0 ? (processedFiles / files.length) * 100 : 0;

  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50 fade-in-animation">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Processing Progress</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Progress: {processedFiles}/{files.length} files</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {currentFile && isProcessing && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Clock className="w-4 h-4" />
            <span>Processing: {currentFile}</span>
          </div>
        )}

        {errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Errors ({errors.length})
            </h4>
            <div className="max-h-20 overflow-y-auto space-y-1">
              {errors.map((error, index) => (
                <p key={index} className="text-xs text-red-500 dark:text-red-400">{error}</p>
              ))}
            </div>
          </div>
        )}

        {!isProcessing && processedFiles === files.length && errors.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>All files processed successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
}
