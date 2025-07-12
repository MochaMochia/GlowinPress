import * as React from 'react';

export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'heic' | 'gif' | 'tiff' | 'svg' | 'avif' | 'bmp' | 'ico';

export function useImageConverter() {
  const [originalImages, setOriginalImages] = React.useState<File[]>([]);
  const [convertedImages, setConvertedImages] = React.useState<Blob[]>([]);
  const [isConverting, setIsConverting] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [targetFormat, setTargetFormat] = React.useState<ImageFormat>(() => {
    const preferredFormat = localStorage.getItem('preferredImageFormat');
    return (preferredFormat as ImageFormat) || 'jpeg';
  });
  const [quality, setQuality] = React.useState(0.9);
  const [processedFiles, setProcessedFiles] = React.useState(0);
  const [currentFile, setCurrentFile] = React.useState<string>('');
  const [errors, setErrors] = React.useState<string[]>([]);

  // Legacy single file support
  const originalImage = originalImages.length > 0 ? originalImages[0] : null;
  const convertedImage = convertedImages.length > 0 ? convertedImages[0] : null;

  const handleImageUpload = (file: File) => {
    setOriginalImages([file]);
    setConvertedImages([]);
    setConversionError(null);
    setErrors([]);
    setProcessedFiles(0);
  };

  const handleImagesUpload = (files: File[]) => {
    setOriginalImages(files);
    setConvertedImages([]);
    setConversionError(null);
    setErrors([]);
    setProcessedFiles(0);
  };

  const convertImage = async () => {
    if (originalImages.length === 0) return;

    setIsConverting(true);
    setConversionError(null);
    setErrors([]);
    setProcessedFiles(0);
    setConvertedImages([]);

    const newConvertedImages: Blob[] = [];
    const newErrors: string[] = [];

    try {
      for (let i = 0; i < originalImages.length; i++) {
        const file = originalImages[i];
        setCurrentFile(file.name);

        try {
          // Handle SVG differently
          if (targetFormat === 'svg') {
            if (file.type === 'image/svg+xml') {
              newConvertedImages.push(file);
            } else {
              throw new Error('Cannot convert raster images to SVG format');
            }
          } else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            const img = new Image();
            
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = URL.createObjectURL(file);
            });

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const mimeType = `image/${targetFormat}`;
            const useQuality = targetFormat !== 'png' && targetFormat !== 'gif' && targetFormat !== 'svg';

            const blob = await new Promise<Blob | null>((resolve) => {
              if (useQuality) {
                canvas.toBlob(resolve, mimeType, quality);
              } else {
                canvas.toBlob(resolve, mimeType);
              }
            });

            if (!blob) throw new Error('Failed to convert image');

            newConvertedImages.push(blob);
            URL.revokeObjectURL(img.src);
          }
        } catch (error) {
          newErrors.push(`${file.name}: ${error instanceof Error ? error.message : 'Failed to convert'}`);
          // Add an empty blob to maintain array length consistency
          newConvertedImages.push(new Blob());
        }

        setProcessedFiles(i + 1);
      }

      setConvertedImages(newConvertedImages);
      setErrors(newErrors);

      if (newErrors.length > 0) {
        setConversionError(`${newErrors.length} file(s) failed to convert`);
      }
    } catch (error) {
      setConversionError(error instanceof Error ? error.message : 'An error occurred during conversion');
    } finally {
      setIsConverting(false);
      setCurrentFile('');
    }
  };

  const downloadConvertedImages = () => {
    if (convertedImages.length === 0 || originalImages.length === 0) return;

    convertedImages.forEach((blob, index) => {
      if (blob.size === 0) return; // Skip failed conversions

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      const baseName = originalImages[index].name.replace(/\.[^/.]+$/, '');
      let fileExtension = `.${targetFormat}`;
      
      if (targetFormat === 'jpeg') fileExtension = '.jpg';
      
      a.href = url;
      a.download = `converted_${baseName}${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const downloadConvertedImage = downloadConvertedImages; // Legacy support

  return {
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
    downloadConvertedImages
  };
}
