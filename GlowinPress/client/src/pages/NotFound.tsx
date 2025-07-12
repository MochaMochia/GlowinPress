import * as React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Blurred background effect */}
      <div className="absolute inset-0 backdrop-blur-lg bg-black/10 dark:bg-black/30" />
      
      {/* Floating "not found" card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card p-12 text-center max-w-2xl mx-4 relative z-10"
      >
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-bold gradient-text opacity-20 leading-none">
            404
          </h1>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
              Page Not Found
            </h2>
            <p className="text-lg text-black/70 dark:text-white/70 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/">
              <Button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
            
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="px-6 py-3 glass-button border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-white/10 font-semibold rounded-xl"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Helpful links */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">
              Popular pages:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link 
                to="/image-compressor" 
                className="text-primary hover:underline text-sm"
              >
                Image Compressor
              </Link>
              <Link 
                to="/image-converter" 
                className="text-primary hover:underline text-sm"
              >
                Image Converter
              </Link>
              <Link 
                to="/youtube" 
                className="text-primary hover:underline text-sm"
              >
                YouTube Downloader
              </Link>
              <Link 
                to="/settings" 
                className="text-primary hover:underline text-sm"
              >
                Settings
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"
        animate={{ 
          y: [-10, 10, -10],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-sky-400/10 rounded-full blur-3xl"
        animate={{ 
          y: [10, -10, 10],
          scale: [1.2, 1, 1.2]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
}
