import rough from "roughjs";
import { CreateElementType, ToolType } from "../types/canvas";

const generator = rough.generator();

export function createElement(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: ToolType,
  id: number = Date.now()
): CreateElementType {
  let roughElement;

  switch (type) {
    case "line":
      roughElement = generator.line(x1, y1, x2, y2);
      break;

    case "rectangle":
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
      break;

    default:
      roughElement = null;
      break;
  }

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
    roughElement,
  };
}
