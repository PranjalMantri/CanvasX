export type ToolType = "line" | "rectangle";

export interface CreateElementType {
  id: number;
  type: ToolType;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
}
