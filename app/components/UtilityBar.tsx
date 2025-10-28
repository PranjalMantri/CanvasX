import { Undo, Redo, ZoomIn, ZoomOut, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ColorButton } from "./ColorButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const COMMON_COLORS = [
  "#000000", // Black
  "#E03131", // Red
  "#F08C00", // Orange
  "#2F9E44", // Green
  "#1971C2", // Blue
  "#CCCCCC", // CHANGED: Toned down white to a light gray
];

interface UtilityBarProps {
  onUndo: () => void;
  onRedo: () => void;
  activeColor: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  scale: number;
  setScale: (scale: number) => void;
  onZoom: (delta: number) => void;
}

export const UtilityBar = ({
  onUndo,
  onRedo,
  activeColor,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  scale,
  setScale,
  onZoom,
}: UtilityBarProps) => {
  const renderTooltip = (
    child: React.ReactNode,
    label: string,
    side: "top" | "bottom" | "left" | "right" = "bottom"
  ) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>{child}</TooltipTrigger>
          <TooltipContent
            className="text-white bg-black border-black"
            side={side}
          >
            <p className="font-semibold">{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="z-50 fixed bottom-0 h-12 flex items-center justify-between w-full p-2 px-4  shadow-md bg-neutral-900 text-white border-t border-t-[#374151]">
      {/* Left Section: Undo/Redo */}
      <div className="flex items-center gap-2">
        {renderTooltip(
          <Button variant="ghost" size="icon" onClick={onUndo}>
            <Undo className="w-5 h-5" />
          </Button>,
          "Undo (Ctrl+Z)"
        )}
        {renderTooltip(
          <Button variant="ghost" size="icon" onClick={onRedo}>
            <Redo className="w-5 h-5" />
          </Button>,
          "Redo (Ctrl+Y)"
        )}
      </div>

      {/* Middle Section: Colors & Stroke */}
      <div className="flex items-center gap-4">
        {/* Colors */}
        {COMMON_COLORS.map((color) => (
          <ColorButton
            key={color}
            color={color}
            onClick={onColorChange}
            isActive={activeColor === color}
          />
        ))}

        {/* Color Picker */}
        {renderTooltip(
          <Button
            variant="ghost"
            size="icon"
            className="relative w-8 h-8 rounded-full p-0"
            asChild
          >
            <label
              htmlFor="color-picker"
              className="cursor-pointer flex items-center justify-center"
            >
              <Palette className="w-5 h-5" />
              <input
                id="color-picker"
                type="color"
                className="absolute w-full h-full opacity-0 cursor-pointer"
                value={activeColor}
                onChange={(e) => onColorChange(e.target.value)}
              />
            </label>
          </Button>,
          "More colors"
        )}

        {renderTooltip(
          <div className="flex items-center gap-2 w-32">
            <span className="text-sm font-medium w-6 text-right text-neutral-300">
              {strokeWidth}
            </span>
            <Slider
              value={[strokeWidth]}
              onValueChange={(value: any) => onStrokeWidthChange(value[0])}
              min={1}
              max={10}
              step={1}
              rangeClassName="bg-[#FFA500]"
              thumbClassName="bg-white"
            />
          </div>,
          "Stroke Width",
          "top"
        )}
      </div>

      {/* Right Section: Zoom */}
      <div className="flex items-center gap-2">
        {renderTooltip(
          <Button variant="ghost" size="icon" onClick={() => onZoom(-0.1)}>
            <ZoomOut className="w-5 h-5" />
          </Button>,
          "Zoom Out"
        )}
        {renderTooltip(
          <Button
            variant="ghost"
            className="w-16 text-sm font-semibold"
            onClick={() => setScale(1)}
          >
            {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
          </Button>,
          "Reset Zoom"
        )}
        {renderTooltip(
          <Button variant="ghost" size="icon" onClick={() => onZoom(0.1)}>
            <ZoomIn className="w-5 h-5" />
          </Button>,
          "Zoom In"
        )}
      </div>
    </div>
  );
};
