import * as React from "react";
import { Link, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type DownloadFormat = 'png' | 'jpg' | 'webp';

export function ImageDownloader() {
  const [urlInput, setUrlInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageBlob, setImageBlob] = React.useState<Blob | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [targetFormat, setTargetFormat] = React.useState<DownloadFormat>('png');
  const [error, setError] = React.useState<string>("");

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    
    setIsLoading(true);
    setError("");
    setImageBlob(null);
    setImageUrl("");
    
    try {
      const response = await fetch(urlInput);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      if (!blob.type.startsWith("image/")) {
        throw new Error("URL does not point to an image");
      }
      
      setImageBlob(blob);
      setImageUrl(URL.createObjectURL(blob));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load image from URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleUrlSubmit();
    }
  };

  const downloadImage = async () => {
    if (!imageBlob) return;

    let finalBlob = imageBlob;
    let fileName = `downloaded-image.${targetFormat === 'jpg' ? 'jpg' : targetFormat}`;

    // If format conversion is needed
    if (targetFormat !== 'png' || !imageBlob.type.includes('png')) {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const mimeType = targetFormat === 'jpg' ? 'image/jpeg' : `image/${targetFormat}`;
        const quality = targetFormat === 'jpg' ? 0.9 : undefined;

        finalBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, mimeType, quality);
        });

        if (!finalBlob) throw new Error('Failed to convert image');
      } catch (error) {
        setError("Failed to convert image format");
        return;
      }
    }

    const url = URL.createObjectURL(finalBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1000000) {
      return (bytes / 1000000).toFixed(1) + ' MB';
    }
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Image Downloader
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Download images from URLs and convert to different formats
        </p>
      </div>

      {/* URL Input Section */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-300/50 dark:border-gray-700/50">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Enter Image URL</h3>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={handleUrlKeyPress}
                placeholder="Paste image URL here..."
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
        </div>
      </div>

      {/* Format Selection and Preview */}
      {imageBlob && (
        <div className="fade-in-animation">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-300/50 dark:border-gray-700/50 mb-8">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Download Settings</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="format-select" className="block mb-3 text-gray-700 dark:text-gray-300 font-medium">
                  Download Format
                </Label>
                <Select value={targetFormat} onValueChange={(value) => setTargetFormat(value as DownloadFormat)}>
                  <SelectTrigger id="format-select" className="bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:border-purple-400">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-xl">
                    <SelectItem value="png" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">PNG</SelectItem>
                    <SelectItem value="jpg" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">JPG</SelectItem>
                    <SelectItem value="webp" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50 mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Image Preview</h3>
            <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
              <img
                src={imageUrl}
                alt="Downloaded"
                className="w-full h-64 object-contain bg-gray-100/50 dark:bg-gray-800/50"
              />
              <div className="p-4 bg-gray-100/60 dark:bg-gray-800/60">
                <p className="text-sm text-gray-700 dark:text-gray-300">Size: {formatFileSize(imageBlob.size)}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Type: {imageBlob.type}</p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center">
            <Button 
              onClick={downloadImage} 
              size="lg" 
              className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Image as {targetFormat.toUpperCase()}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
