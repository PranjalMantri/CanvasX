import { RoughCanvas } from "roughjs/bin/canvas";
import { ElementType } from "../types/elements";
import { ToolType } from "../types/canvas";

export function drawElement(roughCanvas: RoughCanvas, element: ElementType) {
  switch (element.type) {
    case "line":
    case "rectangle":
    case "circle":
    case "diamond":
      if (element.roughElement) {
        roughCanvas.draw(element.roughElement);
      }
      break;

    default:
      console.log("Invalid element type: ", element.type);
      break;
  }
}

export function adjustElementCoordinates(element: ElementType) {
  const { type, x1, y1, x2, y2 } = element;

  switch (type) {
    case "line":
      if (x1 < x2 || (x1 == x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    case "rectangle":
    case "circle":
    case "diamond":
      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const maxX = Math.max(x1, x2);
      const maxY = Math.max(y1, y2);

      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    default:
      console.log("Invalid element type: ", type);
      return null;
  }
}

export function adjustmentRequired(type: ToolType) {
  return ["line", "rectangle", "circle", "diamond"].includes(type);
}
