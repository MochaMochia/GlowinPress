import * as React from "react";
import { VideoUpload } from "../components/VideoUpload";
import { Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function VideoCompressor() {
  const [originalVideo, setOriginalVideo] = React.useState<File | null>(null);
  const [quality, setQuality] = React.useState(75);
  const [targetSize, setTargetSize] = React.useState(50);
  const [isCompressing, setIsCompressing] = React.useState(false);
  const [compressionError, setCompressionError] = React.useState<string>("");

  const handleVideoUpload = (file: File) => {
    setOriginalVideo(file);
    setCompressionError("");
  };

  const compressVideo = () => {
    setIsCompressing(true);
    setCompressionError("Video compression is not yet implemented in the browser. This feature would require a backend service with FFmpeg or similar video processing tools for proper compression algorithms.");
    setIsCompressing(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1000000000) {
      return (bytes / 1000000000).toFixed(1) + ' GB';
    }
    if (bytes >= 1000000) {
      return (bytes / 1000000).toFixed(1) + ' MB';
    }
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const handleQualityChange = (value: number[]) => {
    setQuality(value[0]);
  };

  const handleTargetSizeChange = (value: number[]) => {
    setTargetSize(value[0]);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Video Compressor
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Compress videos to reduce file size while maintaining quality
        </p>
      </div>

      <VideoUpload onVideoUpload={handleVideoUpload} />

      {originalVideo && (
        <>
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-300/50 dark:border-gray-700/50 fade-in-animation">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">File Information</h3>
            <div className="p-4 bg-gray-100/60 dark:bg-gray-800/60 rounded-xl">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>File:</strong> {originalVideo.name}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Size:</strong> {formatFileSize(originalVideo.size)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Type:</strong> {originalVideo.type}
              </p>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-300/50 dark:border-gray-700/50 fade-in-animation">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Compression Settings</h3>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="quality-slider" className="block mb-3 text-gray-700 dark:text-gray-300 font-medium">
                  Quality: {quality}%
                </Label>
                <Slider
                  id="quality-slider"
                  value={[quality]}
                  onValueChange={handleQualityChange}
                  max={100}
                  min={10}
                  step={5}
                  className="flex-1"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Higher quality results in larger file sizes
                </p>
              </div>

              <div>
                <Label htmlFor="target-size-slider" className="block mb-3 text-gray-700 dark:text-gray-300 font-medium">
                  Target Size Reduction: {targetSize}%
                </Label>
                <Slider
                  id="target-size-slider"
                  value={[targetSize]}
                  onValueChange={handleTargetSizeChange}
                  max={90}
                  min={10}
                  step={5}
                  className="flex-1"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Target percentage to reduce the original file size
                </p>
              </div>

              <Button
                onClick={compressVideo}
                disabled={isCompressing}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                <Sliders className="mr-2 h-5 w-5" />
                {isCompressing ? "Compressing..." : "Compress Video"}
              </Button>

              {compressionError && (
                <div className="mt-4 p-4 bg-red-100/60 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-xl">
                  <p className="text-red-700 dark:text-red-400 text-sm">{compressionError}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
