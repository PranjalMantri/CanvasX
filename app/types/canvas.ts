import { Drawable } from "roughjs/bin/core";

export type ToolType =
  | "line"
  | "rectangle"
  | "circle"
  | "diamond"
  | "selection";

export interface CreateElementType {
  id: number;
  type: ToolType;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
  roughElement: Drawable | null;
}
