import * as React from "react";
import { Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
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
    <div className="relative z-10 fade-in-animation">
      {/* Main Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer backdrop-blur-sm ${
          isDragging
            ? "border-purple-400 bg-purple-500/10 scale-[1.02] dark:border-purple-400 dark:bg-purple-500/10"
            : "border-gray-400 bg-gray-100/40 hover:bg-gray-100/60 hover:border-gray-500 dark:border-gray-600 dark:bg-gray-900/40 dark:hover:bg-gray-900/60 dark:hover:border-gray-500"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleButtonClick}
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-6 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-sm border border-gray-400 dark:border-gray-600">
              <Upload className="h-12 w-12 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Upload an Image</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Drag and drop your image here, or click to browse
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-purple-400/50 text-purple-700 hover:from-pink-500/30 hover:to-purple-600/30 hover:border-purple-300 transition-all duration-300 backdrop-blur-sm dark:text-purple-200"
          >
            <Image className="mr-2 h-5 w-5" />
            Choose File
          </Button>
        </div>
        
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
