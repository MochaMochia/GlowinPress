import * as React from "react";
import { Upload, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MultiVideoUploadProps {
  onVideosUpload: (files: File[]) => void;
  maxFiles?: number;
  uploadedFiles?: File[];
}

export function MultiVideoUpload({ onVideosUpload, maxFiles = 2, uploadedFiles = [] }: MultiVideoUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>(uploadedFiles);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles: File[]) => {
    const videoFiles = newFiles.filter(file => file.type.startsWith("video/"));
    const remainingSlots = maxFiles - files.length;
    const filesToAdd = videoFiles.slice(0, remainingSlots);
    
    if (filesToAdd.length > 0) {
      const updatedFiles = [...files, ...filesToAdd];
      setFiles(updatedFiles);
      onVideosUpload(updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onVideosUpload(updatedFiles);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
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
    <div className="relative z-10 fade-in-animation space-y-4">
      {/* Main Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer backdrop-blur-sm ${
          isDragging
            ? "border-purple-400 bg-purple-500/10 scale-[1.02] dark:border-purple-400 dark:bg-purple-500/10"
            : "border-gray-400 bg-gray-100/40 hover:bg-gray-100/60 hover:border-gray-500 dark:border-gray-600 dark:bg-gray-900/40 dark:hover:bg-gray-900/60 dark:hover:border-gray-500"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleButtonClick}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-sm border border-gray-400 dark:border-gray-600">
              <Upload className="h-8 w-8 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upload Videos</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Drag and drop up to {maxFiles} videos here, or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {files.length}/{maxFiles} videos selected
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="px-6 py-2 font-semibold bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-purple-400/50 text-purple-700 hover:from-pink-500/30 hover:to-purple-600/30 hover:border-purple-300 transition-all duration-300 backdrop-blur-sm dark:text-purple-200"
            disabled={files.length >= maxFiles}
          >
            <Video className="mr-2 h-4 w-4" />
            Choose Files
          </Button>
        </div>
        
        <Input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Selected Videos ({files.length})</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-100/60 dark:bg-gray-800/60 rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Video className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
