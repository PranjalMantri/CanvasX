import { cn } from "@/lib/utils";

interface ColorButtonProps {
  color: string;
  onClick: (color: string) => void;
  isActive: boolean;
}

export const ColorButton = ({ color, onClick, isActive }: ColorButtonProps) => {
  return (
    <button
      className="w-8 h-8 rounded-full flex items-center justify-center transition"
      onClick={() => onClick(color)}
      aria-label={`Select color ${color}`}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-full border-2 border-neutral-600",
          isActive && "ring-2 ring-white"
        )}
        style={{ backgroundColor: color }}
      />
    </button>
  );
};
