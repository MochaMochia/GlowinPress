import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, Sparkles } from 'lucide-react';
import { convertFile } from '@/utils/convert';

export function UploadForm() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [format, setFormat] = React.useState<string>('mp4');
  const [isConverting, setIsConverting] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    }
  });

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setIsConverting(true);
    setProgress(0);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await convertFile(file, format);
        setProgress(((i + 1) / files.length) * 100);
      }
      
      // Save to recent conversions
      const recent = JSON.parse(localStorage.getItem('recentConversions') || '[]');
      const newConversions = files.map(file => ({
        name: file.name,
        format,
        timestamp: new Date().toISOString()
      }));
      localStorage.setItem('recentConversions', JSON.stringify([...newConversions, ...recent].slice(0, 10)));
      
      setFiles([]);
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`upload-zone p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'drag-active scale-105' : 'hover:scale-102'
        }`}
      >
        <input {...getInputProps()} />
        <div className="relative inline-block mb-4">
          <Upload className="mx-auto h-12 w-12 text-white/70 dark:text-gray-300" />
          {isDragActive && (
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-pulse" />
          )}
        </div>
        {isDragActive ? (
          <p className="text-lg font-medium text-white">Drop the files here...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-lg font-medium text-white">Drag & drop files here</p>
            <p className="text-sm text-white/60 dark:text-gray-400">or click to select files</p>
            <p className="text-xs text-white/50 dark:text-gray-500">Supports videos and images</p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-glass">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 glass rounded-xl">
                <div className="flex items-center space-x-3">
                  <File className="h-4 w-4 text-white/70" />
                  <span className="text-sm text-white font-medium">{file.name}</span>
                  <span className="text-xs text-white/50">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}
                  className="text-white/70 hover:text-white hover:bg-red-500/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="w-36 glass-input border-0 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-0">
                <SelectItem value="mp4">MP4 Video</SelectItem>
                <SelectItem value="mp3">MP3 Audio</SelectItem>
                <SelectItem value="webm">WebM Video</SelectItem>
                <SelectItem value="jpg">JPG Image</SelectItem>
                <SelectItem value="png">PNG Image</SelectItem>
                <SelectItem value="webp">WebP Image</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={handleConvert} 
              disabled={isConverting}
              className="glass-button border-0 text-white font-medium glow-purple disabled:opacity-50"
            >
              {isConverting ? (
                <div className="flex items-center space-x-2">
                  <div className="spinner"></div>
                  <span>Converting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Convert</span>
                </div>
              )}
            </Button>
          </div>

          {isConverting && (
            <div className="space-y-3">
              <div className="progress-glass p-1">
                <div 
                  className="h-2 bg-gradient-to-r from-purple-500 to-sky-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-center text-white/70">
                Converting files... {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}