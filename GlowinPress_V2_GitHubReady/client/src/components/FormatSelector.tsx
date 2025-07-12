import * as React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ImageFormat } from "@/hooks/useImageConverter";

interface FormatSelectorProps {
  targetFormat: ImageFormat;
  quality: number;
  onFormatChange: (format: ImageFormat) => void;
  onQualityChange: (quality: number) => void;
}

export function FormatSelector({
  targetFormat,
  quality,
  onFormatChange,
  onQualityChange,
}: FormatSelectorProps) {
  const handleQualityChange = (value: number[]) => {
    onQualityChange(value[0] / 100);
  };

  const formatOptions = [
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WebP' },
    { value: 'heic', label: 'HEIC' },
    { value: 'gif', label: 'GIF' },
    { value: 'tiff', label: 'TIFF' },
    { value: 'svg', label: 'SVG' },
    { value: 'avif', label: 'AVIF' },
    { value: 'bmp', label: 'BMP' },
    { value: 'ico', label: 'ICO' }
  ];

  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border-2 border-gray-300/50 dark:border-gray-700/50 shadow-2xl">
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white drop-shadow-lg text-shadow">Conversion Settings</h3>

      <div className="space-y-6">
        <div>
          <Label htmlFor="format-select" className="block mb-3 text-gray-700 dark:text-gray-300 font-medium drop-shadow-sm text-shadow-sm">
            Target Format
          </Label>
          <Select value={targetFormat} onValueChange={(value) => onFormatChange(value as ImageFormat)}>
            <SelectTrigger id="format-select" className="bg-white/80 dark:bg-gray-800/80 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:border-purple-400 shadow-lg">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-2xl">
              {formatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {targetFormat !== 'png' && targetFormat !== 'gif' && targetFormat !== 'svg' && (
          <div>
            <Label htmlFor="quality-slider" className="block mb-3 text-gray-700 dark:text-gray-300 font-medium drop-shadow-sm text-shadow-sm">
              Quality: {Math.round(quality * 100)}%
            </Label>
            <Slider
              id="quality-slider"
              value={[quality * 100]}
              onValueChange={handleQualityChange}
              max={100}
              min={10}
              step={5}
              className="flex-1"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 drop-shadow-sm text-shadow-sm">
              Higher quality results in larger file sizes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
