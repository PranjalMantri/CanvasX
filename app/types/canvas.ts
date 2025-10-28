import { Drawable } from "roughjs/bin/core";

export type ToolType =
  | "line"
  | "rectangle"
  | "circle"
  | "diamond"
  | "selection"
  | "pencil"
  | "text"
  | "eraser";

export interface Point {
  x: number;
  y: number;
}

export interface CreateElementType {
  id: number;
  type: ToolType;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
  roughElement: Drawable | null;
  points?: Array<{ x: number; y: number }>;
  text?: string;
}
