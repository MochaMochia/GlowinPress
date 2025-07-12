import * as React from 'react';

export function useImageCompression() {
  const [originalImages, setOriginalImages] = React.useState<File[]>([]);
  const [compressedImages, setCompressedImages] = React.useState<Blob[]>([]);
  const [isCompressing, setIsCompressing] = React.useState(false);
  const [compressionError, setCompressionError] = React.useState<string | null>(null);
  const [targetSize, setTargetSize] = React.useState(200);
  const [processedFiles, setProcessedFiles] = React.useState(0);
  const [currentFile, setCurrentFile] = React.useState<string>('');
  const [errors, setErrors] = React.useState<string[]>([]);

  // Legacy single file support
  const originalImage = originalImages.length > 0 ? originalImages[0] : null;
  const compressedImage = compressedImages.length > 0 ? compressedImages[0] : null;

  const handleImageUpload = (file: File) => {
    setOriginalImages([file]);
    setCompressedImages([]);
    setCompressionError(null);
    setErrors([]);
    setProcessedFiles(0);
  };

  const handleImagesUpload = (files: File[]) => {
    setOriginalImages(files);
    setCompressedImages([]);
    setCompressionError(null);
    setErrors([]);
    setProcessedFiles(0);
  };

  const compressImage = async () => {
    if (originalImages.length === 0) return;

    setIsCompressing(true);
    setCompressionError(null);
    setErrors([]);
    setProcessedFiles(0);
    setCompressedImages([]);

    const newCompressedImages: Blob[] = [];
    const newErrors: string[] = [];

    try {
      for (let i = 0; i < originalImages.length; i++) {
        const file = originalImages[i];
        setCurrentFile(file.name);

        try {
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

          let quality = 1.0;
          let blob: Blob | null = null;
          const targetSizeBytes = targetSize * 1024;

          // First try with PNG (lossless)
          blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, 'image/png', 1.0);
          });

          if (!blob) throw new Error('Failed to create PNG blob');

          // If PNG is within target size, use it
          if (blob.size <= targetSizeBytes) {
            newCompressedImages.push(blob);
          } else {
            // Fall back to JPEG with quality adjustment
            quality = 0.95;

            for (let attempts = 0; attempts < 15; attempts++) {
              blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(resolve, 'image/jpeg', quality);
              });

              if (!blob) throw new Error('Failed to create JPEG blob');

              if (blob.size <= targetSizeBytes || quality <= 0.05) {
                break;
              }

              if (quality > 0.7) {
                quality -= 0.05;
              } else if (quality > 0.3) {
                quality -= 0.1;
              } else {
                quality -= 0.05;
              }
            }

            if (!blob) throw new Error('Failed to compress image');
            newCompressedImages.push(blob);
          }

          URL.revokeObjectURL(img.src);
        } catch (error) {
          newErrors.push(`${file.name}: ${error instanceof Error ? error.message : 'Failed to compress'}`);
          // Add an empty blob to maintain array length consistency
          newCompressedImages.push(new Blob());
        }

        setProcessedFiles(i + 1);
      }

      setCompressedImages(newCompressedImages);
      setErrors(newErrors);

      if (newErrors.length > 0) {
        setCompressionError(`${newErrors.length} file(s) failed to compress`);
      }
    } catch (error) {
      setCompressionError(error instanceof Error ? error.message : 'An error occurred during compression');
    } finally {
      setIsCompressing(false);
      setCurrentFile('');
    }
  };

  const downloadCompressedImages = () => {
    if (compressedImages.length === 0 || originalImages.length === 0) return;

    compressedImages.forEach((blob, index) => {
      if (blob.size === 0) return; // Skip failed compressions

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      const fileExtension = blob.type === 'image/png' ? '.png' : '.jpg';
      const baseName = originalImages[index].name.replace(/\.[^/.]+$/, '');
      
      a.href = url;
      a.download = `compressed_${baseName}${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const downloadCompressedImage = downloadCompressedImages; // Legacy support

  return {
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
    downloadCompressedImages
  };
}
