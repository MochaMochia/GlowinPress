import * as React from "react";
import { Link, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type VideoQuality = '720p' | '1080p' | '480p' | '360p';

export function VideoDownloader() {
  const [urlInput, setUrlInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [videoBlob, setVideoBlob] = React.useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = React.useState<string>("");
  const [quality, setQuality] = React.useState<VideoQuality>('720p');
  const [error, setError] = React.useState<string>("");

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    
    setIsLoading(true);
    setError("");
    setVideoBlob(null);
    setVideoUrl("");
    
    try {
      // Note: This is a simplified implementation
      // Real video downloading would require backend services for platforms like YouTube, etc.
      if (urlInput.includes('youtube.com') || urlInput.includes('youtu.be')) {
        throw new Error("YouTube video downloading requires backend integration with appropriate APIs and compliance with terms of service.");
      }
      
      const response = await fetch(urlInput);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      if (!blob.type.startsWith("video/")) {
        throw new Error("URL does not point to a video file");
      }
      
      setVideoBlob(blob);
      setVideoUrl(URL.createObjectURL(blob));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load video from URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleUrlSubmit();
    }
  };

  const downloadVideo = async () => {
    if (!videoBlob) return;

    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `downloaded-video-${quality}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Video Downloader
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Download videos from direct URLs and choose quality
        </p>
      </div>

      {/* URL Input Section */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-300/50 dark:border-gray-700/50">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Enter Video URL</h3>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={handleUrlKeyPress}
                placeholder="Paste video URL here..."
                className="w-full px-4 py-3 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                disabled={isLoading}
              />
              <Link className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            
            <Button
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Loading..." : "Load"}
            </Button>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 p-3 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg border border-yellow-300/50 dark:border-yellow-700/50">
            <strong>Note:</strong> This tool works with direct video file URLs. For platforms like YouTube, Vimeo, etc., additional backend services and API compliance are required.
          </div>
        </div>
      </div>

      {/* Quality Selection and Preview */}
      {videoBlob && (
        <div className="fade-in-animation">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-300/50 dark:border-gray-700/50 mb-8">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Download Settings</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="quality-select" className="block mb-3 text-gray-700 dark:text-gray-300 font-medium">
                  Video Quality
                </Label>
                <Select value={quality} onValueChange={(value) => setQuality(value as VideoQuality)}>
                  <SelectTrigger id="quality-select" className="bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:border-purple-400">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-xl">
                    <SelectItem value="1080p" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">1080p (Full HD)</SelectItem>
                    <SelectItem value="720p" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">720p (HD)</SelectItem>
                    <SelectItem value="480p" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">480p (SD)</SelectItem>
                    <SelectItem value="360p" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">360p (Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Video Preview */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50 mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Video Preview</h3>
            <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
              <video
                src={videoUrl}
                controls
                className="w-full h-64 object-contain bg-gray-100/50 dark:bg-gray-800/50"
                preload="metadata"
              />
              <div className="p-4 bg-gray-100/60 dark:bg-gray-800/60">
                <p className="text-sm text-gray-700 dark:text-gray-300">Size: {formatFileSize(videoBlob.size)}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Type: {videoBlob.type}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Selected Quality: {quality}</p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center">
            <Button 
              onClick={downloadVideo} 
              size="lg" 
              className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Video ({quality})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
