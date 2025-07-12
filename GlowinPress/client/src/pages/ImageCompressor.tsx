import * as React from "react";
import { Zap } from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";
import { MultiImageUpload } from "../components/MultiImageUpload";
import { CompressionControls } from "../components/CompressionControls";
import { ImagePreview } from "../components/ImagePreview";
import { BatchProgress } from "../components/BatchProgress";
import { DownloadButton } from "../components/DownloadButton";
import { useImageCompression } from "../hooks/useImageCompression";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ImageCompressor() {
  const [batchMode, setBatchMode] = React.useState(false);
  const {
    originalImage,
    compressedImage,
    originalImages,
    compressedImages,
    isCompressing,
    compressionError,
    targetSize,
    processedFiles,
    currentFile,
    errors,
    setTargetSize,
    handleImageUpload,
    handleImagesUpload,
    compressImage,
    downloadCompressedImage,
    downloadCompressedImages,
  } = useImageCompression();

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Image Compressor
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Upload {batchMode ? "up to 10 images" : "an image"} and compress {batchMode ? "them" : "it"} to your desired file size
        </p>
      </div>

      {/* Batch Mode Toggle */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50 fade-in-animation">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="batch-mode" className="text-gray-700 dark:text-gray-300 font-medium">
              Batch Mode
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Process multiple images at once (up to 10 images)
            </p>
          </div>
          <Switch
            id="batch-mode"
            checked={batchMode}
            onCheckedChange={setBatchMode}
          />
        </div>
      </div>

      {batchMode ? (
        <MultiImageUpload onImagesUpload={handleImagesUpload} maxFiles={10} uploadedFiles={originalImages} />
      ) : (
        <ImageUpload onImageUpload={handleImageUpload} />
      )}

      {(originalImages.length > 0) && (
        <div className="fade-in-animation">
          <CompressionControls
            targetSize={targetSize}
            onTargetSizeChange={setTargetSize}
            onCompress={compressImage}
            isCompressing={isCompressing}
            hasImage={originalImages.length > 0}
          />

          {batchMode && originalImages.length > 1 && (
            <div className="mt-8">
              <BatchProgress
                files={originalImages}
                processedFiles={processedFiles}
                currentFile={currentFile}
                errors={errors}
                isProcessing={isCompressing}
              />
            </div>
          )}

          {!batchMode && originalImage && (
            <div className="mt-8">
              <ImagePreview
                originalImage={originalImage}
                compressedImage={compressedImage}
                isCompressing={isCompressing}
                error={compressionError}
              />
            </div>
          )}

          {(compressedImages.length > 0 && compressedImages.some(blob => blob.size > 0)) && (
            <div className="mt-8 fade-in-animation">
              <DownloadButton 
                onDownload={batchMode ? downloadCompressedImages : downloadCompressedImage} 
                isConverter={false}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
