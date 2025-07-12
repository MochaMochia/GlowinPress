import * as React from "react";
import { VideoUpload } from "../components/VideoUpload";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type VideoFormat = 'mp4' | 'webm' | 'avi' | 'mov' | 'mkv';

export function VideoConverter() {
  const [originalVideo, setOriginalVideo] = React.useState<File | null>(null);
  const [targetFormat, setTargetFormat] = React.useState<VideoFormat>('mp4');
  const [isConverting, setIsConverting] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string>("");

  const handleVideoUpload = (file: File) => {
    setOriginalVideo(file);
    setConversionError("");
  };

  const convertVideo = () => {
    setIsConverting(true);
    setConversionError("Video conversion is not yet implemented in the browser. This feature would require a backend service with FFmpeg or similar video processing tools for proper format conversion.");
    setIsConverting(false);
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

  const formatOptions = [
    { value: 'mp4', label: 'MP4' },
    { value: 'webm', label: 'WebM' },
    { value: 'avi', label: 'AVI' },
    { value: 'mov', label: 'MOV' },
    { value: 'mkv', label: 'MKV' }
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <RefreshCw className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Video Converter
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Convert videos between different formats (MP4, WebM, AVI, MOV, MKV)
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
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Conversion Settings</h3>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="format-select" className="block mb-3 text-gray-700 dark:text-gray-300 font-medium">
                  Target Format
                </Label>
                <Select value={targetFormat} onValueChange={(value) => setTargetFormat(value as VideoFormat)}>
                  <SelectTrigger id="format-select" className="bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:border-purple-400">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-xl">
                    {formatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Choose the output video format
                </p>
              </div>

              <Button
                onClick={convertVideo}
                disabled={isConverting}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                {isConverting ? "Converting..." : `Convert to ${targetFormat.toUpperCase()}`}
              </Button>

              {conversionError && (
                <div className="mt-4 p-4 bg-red-100/60 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-xl">
                  <p className="text-red-700 dark:text-red-400 text-sm">{conversionError}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}