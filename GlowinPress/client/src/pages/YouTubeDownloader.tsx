import * as React from "react";
import { Link, Download, AlertTriangle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { downloadYouTubeVideo } from "@/utils/youtube";

type VideoFormat = "MP4" | "MP4 4K" | "MP3" | "webm";

export function YouTubeDownloader() {
  const [urlInput, setUrlInput] = React.useState("");
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [format, setFormat] = React.useState<VideoFormat>("MP4");
  const [error, setError] = React.useState<string>("");
  const [progress, setProgress] = React.useState(0);
  const [videoInfo, setVideoInfo] = React.useState<any>(null);

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;

    setIsDownloading(true);
    setError("");
    setProgress(0);
    setVideoInfo(null);

    try {
      await downloadYouTubeVideo(urlInput, format, (progressPercent) => {
        setProgress(progressPercent);
      });

      // Reset after successful download
      setTimeout(() => {
        setProgress(0);
        setIsDownloading(false);
      }, 1000);
    } catch (error) {
      console.error("Download error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to download video",
      );
      setIsDownloading(false);
      setProgress(0);
    }
  };

  const handleUrlKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleUrlSubmit();
    }
  };

  const isValidYouTubeUrl = (url: string) => {
    return url.includes("youtube.com/watch?v=") || url.includes("youtu.be/");
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <PlayCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            YouTube Downloader
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Download YouTube videos in various qualities and formats
        </p>
      </div>

      {/* URL Input Section */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-300/50 dark:border-gray-700/50">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Enter YouTube URL
        </h3>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={handleUrlKeyPress}
                placeholder="Paste your YouTube URL here..."
                className="w-full px-4 py-3 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                disabled={isDownloading}
              />
              <Link className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="format-select"
                className="block mb-3 text-gray-700 dark:text-gray-300 font-medium"
              >
                Download Format
              </Label>
              <Select
                value={format}
                onValueChange={(value) => setFormat(value as VideoFormat)}
              >
                <SelectTrigger
                  id="format-select"
                  className="bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:border-purple-400"
                >
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-xl">
                  <SelectItem
                    value="mp4"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    MP4 (Video)
                  </SelectItem>
                  <SelectItem
                    value="mp3"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    MP3 (Audio Only)
                  </SelectItem>
                  <SelectItem
                    value="webm"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    WebM (Video)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Choose video or audio-only download
              </p>
            </div>

            <div className="flex items-end mb-[31px]">
              <Button
                onClick={handleUrlSubmit}
                disabled={
                  !urlInput.trim() ||
                  isDownloading ||
                  !isValidYouTubeUrl(urlInput)
                }
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Download className="mr-2 h-5 w-5" />
                {isDownloading
                  ? "Downloading..."
                  : `Download ${format.toUpperCase()}`}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {isDownloading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Downloading...
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This may take a few minutes depending on video length and
                quality
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100/60 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                    Download Failed
                  </p>
                  <p className="text-red-600 dark:text-red-300 text-sm mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg border border-blue-300/50 dark:border-blue-700/50">
            <strong>Supported URLs:</strong> youtube.com/watch?v=... or
            youtu.be/...
          </div>
        </div>
      </div>

      {/* Format Information */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-300/50 dark:border-gray-700/50">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Format Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-100/60 dark:bg-gray-800/60 rounded-xl">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              MP4 (Video)
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Best quality video</li>
              <li>• Universal compatibility</li>
              <li>• Larger file size</li>
              <li>• Includes audio</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-100/60 dark:bg-gray-800/60 rounded-xl">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              MP3 (Audio)
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Audio only</li>
              <li>• Much smaller size</li>
              <li>• Music/podcast use</li>
              <li>• Fast download</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-100/60 dark:bg-gray-800/60 rounded-xl">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              WebM (Video)
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Open source format</li>
              <li>• Good compression</li>
              <li>• Web optimized</li>
              <li>• Modern browsers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-300/50 dark:border-gray-700/50">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Usage Tips
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong>Video Quality:</strong> MP4 downloads use the highest
              available quality from the video
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong>Audio Quality:</strong> MP3 downloads are optimized for
              good quality at reasonable file sizes
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong>Download Time:</strong> Longer videos and higher quality
              formats take more time to process
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong>Compatibility:</strong> Some videos may be unavailable due
              to regional restrictions or privacy settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
