import * as React from "react";
import { Download, Square, Circle, Triangle, Type, Palette, Save, Undo, Redo, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface SVGElement {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'line' | 'polygon';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fontSize?: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  points?: string;
  x2?: number;
  y2?: number;
}

export function SvgCreator() {
  const [canvasSize, setCanvasSize] = React.useState({ width: 400, height: 400 });
  const [elements, setElements] = React.useState<SVGElement[]>([]);
  const [selectedTool, setSelectedTool] = React.useState<'rect' | 'circle' | 'text' | 'line' | 'triangle'>('rect');
  const [currentFill, setCurrentFill] = React.useState('#8b5cf6');
  const [currentStroke, setCurrentStroke] = React.useState('#000000');
  const [strokeWidth, setStrokeWidth] = React.useState([2]);
  const [textContent, setTextContent] = React.useState('Text');
  const [fontSize, setFontSize] = React.useState([16]);
  const [history, setHistory] = React.useState<SVGElement[][]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [startPos, setStartPos] = React.useState({ x: 0, y: 0 });

  const saveToHistory = (newElements: SVGElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  };

  const clearCanvas = () => {
    const newElements: SVGElement[] = [];
    setElements(newElements);
    saveToHistory(newElements);
  };

  const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;

    if (selectedTool === 'line') {
      if (!isDrawing) {
        setIsDrawing(true);
        setStartPos({ x, y });
      } else {
        const newElement: SVGElement = {
          id: Date.now().toString(),
          type: 'line',
          x: startPos.x,
          y: startPos.y,
          x2: x,
          y2: y,
          fill: 'none',
          stroke: currentStroke,
          strokeWidth: strokeWidth[0]
        };
        const newElements = [...elements, newElement];
        setElements(newElements);
        saveToHistory(newElements);
        setIsDrawing(false);
      }
      return;
    }

    let newElement: SVGElement;

    switch (selectedTool) {
      case 'rect':
        newElement = {
          id: Date.now().toString(),
          type: 'rect',
          x: x - 25,
          y: y - 25,
          width: 50,
          height: 50,
          fill: currentFill,
          stroke: currentStroke,
          strokeWidth: strokeWidth[0]
        };
        break;
      case 'circle':
        newElement = {
          id: Date.now().toString(),
          type: 'circle',
          x: x,
          y: y,
          radius: 25,
          fill: currentFill,
          stroke: currentStroke,
          strokeWidth: strokeWidth[0]
        };
        break;
      case 'triangle':
        const size = 30;
        newElement = {
          id: Date.now().toString(),
          type: 'polygon',
          x: x,
          y: y,
          points: `${x},${y-size} ${x-size},${y+size} ${x+size},${y+size}`,
          fill: currentFill,
          stroke: currentStroke,
          strokeWidth: strokeWidth[0]
        };
        break;
      case 'text':
        newElement = {
          id: Date.now().toString(),
          type: 'text',
          x: x,
          y: y,
          text: textContent,
          fontSize: fontSize[0],
          fill: currentFill,
          stroke: currentStroke,
          strokeWidth: strokeWidth[0]
        };
        break;
      default:
        return;
    }

    const newElements = [...elements, newElement];
    setElements(newElements);
    saveToHistory(newElements);
  };

  const generateSVG = () => {
    let svgContent = `<svg width="${canvasSize.width}" height="${canvasSize.height}" xmlns="http://www.w3.org/2000/svg">\n`;
    
    elements.forEach(element => {
      switch (element.type) {
        case 'rect':
          svgContent += `  <rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" fill="${element.fill}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}"/>\n`;
          break;
        case 'circle':
          svgContent += `  <circle cx="${element.x}" cy="${element.y}" r="${element.radius}" fill="${element.fill}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}"/>\n`;
          break;
        case 'text':
          svgContent += `  <text x="${element.x}" y="${element.y}" font-size="${element.fontSize}" fill="${element.fill}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}">${element.text}</text>\n`;
          break;
        case 'line':
          svgContent += `  <line x1="${element.x}" y1="${element.y}" x2="${element.x2}" y2="${element.y2}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}"/>\n`;
          break;
        case 'polygon':
          svgContent += `  <polygon points="${element.points}" fill="${element.fill}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}"/>\n`;
          break;
      }
    });
    
    svgContent += '</svg>';
    return svgContent;
  };

  const downloadSVG = () => {
    const svgContent = generateSVG();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'created-graphic.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const presetSizes = [
    { label: 'Square Small', width: 200, height: 200 },
    { label: 'Square Medium', width: 400, height: 400 },
    { label: 'Square Large', width: 800, height: 800 },
    { label: 'Banner', width: 728, height: 90 },
    { label: 'Card', width: 300, height: 200 },
    { label: 'Icon', width: 64, height: 64 }
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Palette className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            SVG Creator
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Create and design vector graphics with an intuitive drawing interface
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tools Panel */}
        <div className="space-y-6">
          {/* Canvas Settings */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Canvas Settings</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="block mb-2 text-gray-700 dark:text-gray-300">Preset Sizes</Label>
                <Select onValueChange={(value) => {
                  const preset = presetSizes.find(p => p.label === value);
                  if (preset) setCanvasSize({ width: preset.width, height: preset.height });
                }}>
                  <SelectTrigger className="bg-white/80 dark:bg-gray-800/80">
                    <SelectValue placeholder="Choose preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {presetSizes.map(preset => (
                      <SelectItem key={preset.label} value={preset.label}>
                        {preset.label} ({preset.width}×{preset.height})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="block mb-1 text-gray-700 dark:text-gray-300">Width</Label>
                  <Input
                    type="number"
                    value={canvasSize.width}
                    onChange={(e) => setCanvasSize(prev => ({ ...prev, width: Number(e.target.value) }))}
                    className="bg-white/80 dark:bg-gray-800/80"
                  />
                </div>
                <div>
                  <Label className="block mb-1 text-gray-700 dark:text-gray-300">Height</Label>
                  <Input
                    type="number"
                    value={canvasSize.height}
                    onChange={(e) => setCanvasSize(prev => ({ ...prev, height: Number(e.target.value) }))}
                    className="bg-white/80 dark:bg-gray-800/80"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Drawing Tools */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Drawing Tools</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { tool: 'rect', icon: Square, label: 'Rectangle' },
                { tool: 'circle', icon: Circle, label: 'Circle' },
                { tool: 'triangle', icon: Triangle, label: 'Triangle' },
                { tool: 'text', icon: Type, label: 'Text' }
              ].map(({ tool, icon: Icon, label }) => (
                <Button
                  key={tool}
                  variant={selectedTool === tool ? "default" : "outline"}
                  onClick={() => setSelectedTool(tool as any)}
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>

            {selectedTool === 'text' && (
              <div className="space-y-3">
                <div>
                  <Label className="block mb-1 text-gray-700 dark:text-gray-300">Text Content</Label>
                  <Input
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="bg-white/80 dark:bg-gray-800/80"
                  />
                </div>
                <div>
                  <Label className="block mb-2 text-gray-700 dark:text-gray-300">Font Size: {fontSize[0]}px</Label>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    min={8}
                    max={72}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Style Settings */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Style Settings</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="block mb-2 text-gray-700 dark:text-gray-300">Fill Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={currentFill}
                    onChange={(e) => setCurrentFill(e.target.value)}
                    className="w-12 h-10 p-1 rounded cursor-pointer"
                  />
                  <Input
                    value={currentFill}
                    onChange={(e) => setCurrentFill(e.target.value)}
                    className="flex-1 bg-white/80 dark:bg-gray-800/80"
                  />
                </div>
              </div>
              
              <div>
                <Label className="block mb-2 text-gray-700 dark:text-gray-300">Stroke Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={currentStroke}
                    onChange={(e) => setCurrentStroke(e.target.value)}
                    className="w-12 h-10 p-1 rounded cursor-pointer"
                  />
                  <Input
                    value={currentStroke}
                    onChange={(e) => setCurrentStroke(e.target.value)}
                    className="flex-1 bg-white/80 dark:bg-gray-800/80"
                  />
                </div>
              </div>
              
              <div>
                <Label className="block mb-2 text-gray-700 dark:text-gray-300">Stroke Width: {strokeWidth[0]}px</Label>
                <Slider
                  value={strokeWidth}
                  onValueChange={setStrokeWidth}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Actions</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button
                onClick={undo}
                disabled={historyIndex <= 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Undo className="w-4 h-4" />
                Undo
              </Button>
              <Button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Redo className="w-4 h-4" />
                Redo
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={clearCanvas}
                variant="outline"
                className="w-full flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear Canvas
              </Button>
              
              <Button
                onClick={downloadSVG}
                disabled={elements.length === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download SVG
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-300/50 dark:border-gray-700/50">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Canvas ({canvasSize.width}×{canvasSize.height})
            </h3>
            
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
              <svg
                width={canvasSize.width}
                height={canvasSize.height}
                className="cursor-crosshair"
                onClick={handleCanvasClick}
                style={{ maxWidth: '100%', height: 'auto' }}
              >
                {/* Grid pattern */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Render elements */}
                {elements.map(element => {
                  switch (element.type) {
                    case 'rect':
                      return (
                        <rect
                          key={element.id}
                          x={element.x}
                          y={element.y}
                          width={element.width}
                          height={element.height}
                          fill={element.fill}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                        />
                      );
                    case 'circle':
                      return (
                        <circle
                          key={element.id}
                          cx={element.x}
                          cy={element.y}
                          r={element.radius}
                          fill={element.fill}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                        />
                      );
                    case 'text':
                      return (
                        <text
                          key={element.id}
                          x={element.x}
                          y={element.y}
                          fontSize={element.fontSize}
                          fill={element.fill}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                        >
                          {element.text}
                        </text>
                      );
                    case 'line':
                      return (
                        <line
                          key={element.id}
                          x1={element.x}
                          y1={element.y}
                          x2={element.x2}
                          y2={element.y2}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                        />
                      );
                    case 'polygon':
                      return (
                        <polygon
                          key={element.id}
                          points={element.points}
                          fill={element.fill}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                        />
                      );
                    default:
                      return null;
                  }
                })}
                
                {/* Show preview for line drawing */}
                {isDrawing && selectedTool === 'line' && (
                  <line
                    x1={startPos.x}
                    y1={startPos.y}
                    x2={startPos.x}
                    y2={startPos.y}
                    stroke={currentStroke}
                    strokeWidth={strokeWidth[0]}
                    strokeDasharray="5,5"
                    opacity="0.5"
                  />
                )}
              </svg>
            </div>
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Click to add shapes. For lines, click once to start and again to finish.</p>
              <p>Elements: {elements.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
