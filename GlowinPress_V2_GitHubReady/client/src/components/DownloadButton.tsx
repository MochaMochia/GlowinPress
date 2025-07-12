import * as React from 'react';
import { Download } from 'lucide-react';
import { GlowButton } from './GlowButton';

interface DownloadButtonProps {
  onDownload: () => void;
  isConverter?: boolean;
}

export function DownloadButton({ onDownload, isConverter = false }: DownloadButtonProps) {
  return (
    <div className="text-center">
      <GlowButton 
        onClick={onDownload} 
        className="px-8 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 text-base shadow-lg hover:shadow-xl"
        glowColor="rgba(34, 197, 94, 0.4)"
      >
        <Download className="mr-2 h-4 w-4 drop-shadow-md" />
        <span className="drop-shadow-md text-shadow-sm">
          {isConverter ? "Download Converted Image" : "Download Compressed Image"}
        </span>
      </GlowButton>
    </div>
  );
}
