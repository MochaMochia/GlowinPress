import * as React from "react";
import { RefreshCw } from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";
import { MultiImageUpload } from "../components/MultiImageUpload";
import { FormatSelector } from "../components/FormatSelector";
import { ConversionPreview } from "../components/ConversionPreview";
import { BatchProgress } from "../components/BatchProgress";
import { ConvertButton } from "../components/ConvertButton";
import { DownloadButton } from "../components/DownloadButton";
import { useImageConverter } from "../hooks/useImageConverter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ImageConverter() {
  const [batchMode, setBatchMode] = React.useState(false);
  const {
    originalImage,
    convertedImage,
    originalImages,
    convertedImages,
    isConverting,
    conversionError,
    targetFormat,
    quality,
    processedFiles,
    currentFile,
    errors,
    setTargetFormat,
    setQuality,
    handleImageUpload,
    handleImagesUpload,
    convertImage,
    downloadConvertedImage,
    downloadConvertedImages,
  } = useImageConverter();

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <RefreshCw className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Image Converter
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Convert {batchMode ? "up to 10 images" : "images"} between different formats
          (JPEG, PNG, WebP, HEIC, GIF, TIFF...)
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
              Convert multiple images at once (up to 10 images)
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
          <FormatSelector
            targetFormat={targetFormat}
            quality={quality}
            onFormatChange={setTargetFormat}
            onQualityChange={setQuality}
          />

          <div className="mt-8">
            <ConvertButton
              onConvert={convertImage}
              isConverting={isConverting}
              hasImage={originalImages.length > 0}
            />
          </div>

          {batchMode && originalImages.length > 1 && (
            <div className="mt-8">
              <BatchProgress
                files={originalImages}
                processedFiles={processedFiles}
                currentFile={currentFile}
                errors={errors}
                isProcessing={isConverting}
              />
            </div>
          )}

          {!batchMode && originalImage && (
            <div className="mt-8">
              <ConversionPreview
                originalImage={originalImage}
                convertedImage={convertedImage}
                isConverting={isConverting}
                error={conversionError}
                targetFormat={targetFormat}
              />
            </div>
          )}

          {(convertedImages.length > 0 && convertedImages.some(blob => blob.size > 0)) && (
            <div className="mt-8 fade-in-animation">
              <DownloadButton 
                onDownload={batchMode ? downloadConvertedImages : downloadConvertedImage} 
                isConverter={true} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
