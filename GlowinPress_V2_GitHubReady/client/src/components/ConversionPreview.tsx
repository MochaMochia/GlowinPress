import * as React from 'react';

interface ConversionPreviewProps {
  originalImage: File | null;
  convertedImage: Blob | null;
  isConverting: boolean;
  error: string | null;
  targetFormat: string;
}

export function ConversionPreview({
  originalImage,
  convertedImage,
  isConverting,
  error,
  targetFormat
}: ConversionPreviewProps) {
  const [originalUrl, setOriginalUrl] = React.useState<string>('');
  const [convertedUrl, setConvertedUrl] = React.useState<string>('');

  React.useEffect(() => {
    if (originalImage) {
      const url = URL.createObjectURL(originalImage);
      setOriginalUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [originalImage]);

  React.useEffect(() => {
    if (convertedImage) {
      const url = URL.createObjectURL(convertedImage);
      setConvertedUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [convertedImage]);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1000000) {
      return (bytes / 1000000).toFixed(1) + ' MB';
    }
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const getFormatDisplay = (format: string) => {
    if (format.startsWith('image/')) {
      return format.replace('image/', '').toUpperCase();
    }
    return format.toUpperCase();
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
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Converted Image</h3>
        {isConverting ? (
          <div className="border border-gray-300 dark:border-gray-600 rounded-xl h-64 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
              <p className="text-gray-600 dark:text-gray-300">Converting image...</p>
            </div>
          </div>
        ) : convertedImage ? (
          <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
            <img
              src={convertedUrl}
              alt="Converted"
              className="w-full h-64 object-contain bg-gray-100/50 dark:bg-gray-800/50"
            />
            <div className="p-4 bg-gray-100/60 dark:bg-gray-800/60">
              <p className="text-sm text-gray-700 dark:text-gray-300">Size: {formatFileSize(convertedImage.size)}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Format: {getFormatDisplay(targetFormat)}</p>
              {originalImage && (
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Size change: {((convertedImage.size - originalImage.size) / originalImage.size * 100).toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        ) : error ? (
          <div className="border border-red-300 dark:border-red-500/50 rounded-xl h-64 flex items-center justify-center bg-red-100/50 dark:bg-red-500/10">
            <p className="text-red-600 dark:text-red-400 text-center px-4">{error}</p>
          </div>
        ) : (
          <div className="border border-gray-300 dark:border-gray-600 rounded-xl h-64 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50">
            <p className="text-gray-500 dark:text-gray-400">Upload and convert an image to see the result</p>
          </div>
        )}
      </div>
    </div>
  );
}
