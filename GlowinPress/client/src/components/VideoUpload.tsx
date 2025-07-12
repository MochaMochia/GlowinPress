import * as React from "react";
import { Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VideoUploadProps {
  onVideoUpload: (file: File) => void;
}

export function VideoUpload({ onVideoUpload }: VideoUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      onVideoUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      onVideoUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="relative z-10 fade-in-animation" role="button" tabIndex={0} aria-label="Video upload drop zone">
      {/* Main Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer backdrop-blur-sm shadow-2xl ${
          isDragging
            ? "border-purple-400 bg-purple-500/10 scale-[1.02] dark:border-purple-400 dark:bg-purple-500/10 shadow-3xl"
            : "border-gray-400 bg-gray-100/40 hover:bg-gray-100/60 hover:border-gray-500 dark:border-gray-600 dark:bg-gray-900/40 dark:hover:bg-gray-900/60 dark:hover:border-gray-500 hover:shadow-3xl"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleButtonClick}
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-6 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-sm border-2 border-gray-400 dark:border-gray-600 shadow-xl">
              <Upload className="h-12 w-12 text-purple-600 dark:text-purple-300 drop-shadow-lg" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white drop-shadow-lg text-shadow">Upload a Video</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg drop-shadow-md text-shadow-sm">
              Drag and drop your video here, or click to browse
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-2 border-purple-400/50 text-purple-700 hover:from-pink-500/30 hover:to-purple-600/30 hover:border-purple-300 transition-all duration-300 backdrop-blur-sm dark:text-purple-200 shadow-lg hover:shadow-xl"
          >
            <Video className="mr-2 h-5 w-5 drop-shadow-md" />
            Choose File
          </Button>
        </div>
        
        <Input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
