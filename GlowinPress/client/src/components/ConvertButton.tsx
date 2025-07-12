import * as React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { GlowButton } from './GlowButton';

interface ConvertButtonProps {
  onConvert: () => void;
  isConverting: boolean;
  hasImage: boolean;
}

export function ConvertButton({ onConvert, isConverting, hasImage }: ConvertButtonProps) {
  return (
    <motion.div 
      className="text-center"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <GlowButton
        onClick={onConvert}
        disabled={!hasImage || isConverting}
        className="px-8 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base shadow-lg hover:shadow-xl"
        glowColor="rgba(236, 72, 153, 0.4)"
      >
        <motion.div
          animate={isConverting ? { rotate: 360 } : { rotate: 0 }}
          transition={isConverting ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
        >
          <RefreshCw className="mr-2 h-4 w-4 drop-shadow-md" />
        </motion.div>
        <span className="drop-shadow-md text-shadow-sm">
          {isConverting ? "Converting..." : "Convert Image"}
        </span>
      </GlowButton>
    </motion.div>
  );
}
