import * as React from 'react';

interface ImagePreviewProps {
  originalImage: File | null;
  compressedImage: Blob | null;
  isCompressing: boolean;
  error: string | null;
}

export function ImagePreview({
  originalImage,
  compressedImage,
  isCompressing,
  error
}: ImagePreviewProps) {
  const [originalUrl, setOriginalUrl] = React.useState<string>('');
  const [compressedUrl, setCompressedUrl] = React.useState<string>('');

  React.useEffect(() => {
    if (originalImage) {
      const url = URL.createObjectURL(originalImage);
      setOriginalUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [originalImage]);

  React.useEffect(() => {
    if (compressedImage) {
      const url = URL.createObjectURL(compressedImage);
      setCompressedUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [compressedImage]);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1000000) {
      return (bytes / 1000000).toFixed(1) + ' MB';
    }
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const getFormatDisplay = (type: string) => {
    if (type.startsWith('image/')) {
      return type.replace('image/', '').toUpperCase();
    }
    return type.toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {originalImage && (
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Original Image</h3>
          <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
            <img
              src={originalUrl}
              alt="Original"
              className="w-full h-64 object-contain bg-gray-100/50 dark:bg-gray-800/50"
            />
            <div className="p-4 bg-gray-100/60 dark:bg-gray-800/60">
              <p className="text-sm text-gray-700 dark:text-gray-300">Size: {formatFileSize(originalImage.size)}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Format: {getFormatDisplay(originalImage.type)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Compressed Image</h3>
        {isCompressing ? (
          <div className="border border-gray-300 dark:border-gray-600 rounded-xl h-64 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
              <p className="text-gray-600 dark:text-gray-300">Compressing image...</p>
            </div>
          </div>
        ) : compressedImage ? (
          <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
            <img
              src={compressedUrl}
              alt="Compressed"
              className="w-full h-64 object-contain bg-gray-100/50 dark:bg-gray-800/50"
            />
            <div className="p-4 bg-gray-100/60 dark:bg-gray-800/60">
              <p className="text-sm text-gray-700 dark:text-gray-300">Size: {formatFileSize(compressedImage.size)}</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Compression: {((1 - compressedImage.size / (originalImage?.size || 1)) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="border border-red-300 dark:border-red-500/50 rounded-xl h-64 flex items-center justify-center bg-red-100/50 dark:bg-red-500/10">
            <p className="text-red-600 dark:text-red-400 text-center px-4">{error}</p>
          </div>
        ) : (
          <div className="border border-gray-300 dark:border-gray-600 rounded-xl h-64 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50">
            <p className="text-gray-500 dark:text-gray-400">Upload and compress an image to see the result</p>
          </div>
        )}
      </div>
    </div>
  );
}
