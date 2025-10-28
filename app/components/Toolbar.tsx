"use client";

import {
  Circle,
  Diamond,
  Eraser,
  Minus,
  MousePointer2,
  Pencil,
  Save,
  Square,
  Type,
} from "lucide-react";
import { ToolType } from "../types/canvas";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const toolConfig = [
  {
    name: "selection",
    label: "Selection",
    icon: MousePointer2,
  },
  {
    name: "pencil",
    label: "Pencil",
    icon: Pencil,
  },
  {
    name: "line",
    label: "Line",
    icon: Minus,
  },
  {
    name: "rectangle",
    label: "Rectangle",
    icon: Square,
  },
  {
    name: "circle",
    label: "Circle",
    icon: Circle,
  },
  {
    name: "diamond",
    label: "Diamond",
    icon: Diamond,
  },
  {
    name: "text",
    label: "Text",
    icon: Type,
  },
  {
    name: "eraser",
    label: "Eraser",
    icon: Eraser,
  },
  {
    name: "save",
    label: "Save Canvas",
    icon: Save,
  },
] as const;

interface ToolBarProps {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
  onSave: () => void;
}

interface ToolButtonProps {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  onSave: () => void;
  isActive: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  label,
  icon: Icon,
  onClick,
  isActive,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`
            w-11 h-11  flex items-center justify-center rounded-lg
            transition-colors duration-150 ease-in-out
            ${
              isActive
                ? "bg-[#FFA500] text-white"
                : "text-gray-400 hover:text-white hover:bg-zinc-800"
            }
          `}
        >
          <Icon className="w-5 h-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>
        <p className="text-sm font-medium">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const ToolBar: React.FC<ToolBarProps> = ({ tool, setTool, onSave }) => (
  <TooltipProvider delayDuration={150}>
    <div className="z-2 fixed left-0 bg-zinc-900 text-white w-16 h-full border-r border-r-[#374151] flex flex-col items-center pt-4 space-y-2">
      {toolConfig.map((item) => (
        <ToolButton
          key={item.name}
          label={item.label}
          icon={item.icon}
          onClick={() => (item.name === "save" ? onSave() : setTool(item.name))}
          isActive={tool === item.name}
          onSave={onSave}
        />
      ))}
    </div>
  </TooltipProvider>
);

export default ToolBar;
