import { CreateElementType, ToolType } from "../types/canvas";

export function createElement(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: ToolType,
  id: number = Date.now()
): CreateElementType {
  return {
    id,
    x1,
    y1,
    x2,
    y2,
    type,
    draw: (ctx) => {
      switch (type) {
        case "line":
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          break;

        case "rectangle":
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
          break;

        default:
          break;
      }
    },
  };
}
