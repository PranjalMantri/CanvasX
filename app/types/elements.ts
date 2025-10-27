import { Drawable } from "roughjs/bin/core";
import { ToolType } from "./canvas";

export interface ElementType {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: ToolType;
  roughElement: Drawable | null;
  offsetX?: number;
  offsetY?: number;
  position?: string;
  points?: any[];
  xOffsets?: any[];
  yOffsets?: any[];
}
