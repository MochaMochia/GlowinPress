import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { GlowButton } from "./GlowButton";

interface CompressionControlsProps {
  targetSize: number;
  onTargetSizeChange: (size: number) => void;
  onCompress: () => void;
  isCompressing: boolean;
  hasImage: boolean;
}

export function CompressionControls({
  targetSize,
  onTargetSizeChange,
  onCompress,
  isCompressing,
  hasImage,
}: CompressionControlsProps) {
  const handleSliderChange = (value: number[]) => {
    onTargetSizeChange(value[0]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      onTargetSizeChange(value);
    }
  };

  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border-2 border-gray-300/50 dark:border-gray-700/50 shadow-2xl">
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white drop-shadow-lg text-shadow">Compression Settings</h3>

      <div className="space-y-6">
        <div>
          <Label htmlFor="target-size" className="block mb-3 text-gray-700 dark:text-gray-300 font-medium drop-shadow-sm text-shadow-sm">
            Target File Size (KB)
          </Label>
          <div className="flex items-center space-x-4">
            <Slider
              value={[targetSize]}
              onValueChange={handleSliderChange}
              max={1000}
              min={10}
              step={10}
              className="flex-1"
            />
            <Input
              id="target-size"
              type="number"
              value={targetSize}
              onChange={handleInputChange}
              min="10"
              max="1000"
              className="w-24 bg-white/80 dark:bg-gray-800/80 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:border-purple-400 focus:ring-purple-400/20 shadow-lg"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 drop-shadow-sm text-shadow-sm">
            Adjust the target file size between 10 KB and 1 MB
          </p>
        </div>

        <div className="flex justify-center">
          <GlowButton
            onClick={onCompress}
            disabled={!hasImage || isCompressing}
            className="px-8 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base shadow-lg hover:shadow-xl"
            glowColor="rgba(236, 72, 153, 0.4)"
          >
            <span className="drop-shadow-md text-shadow-sm">
              {isCompressing ? "Compressing..." : "Compress Image"}
            </span>
          </GlowButton>
        </div>
      </div>
    </div>
  );
}
