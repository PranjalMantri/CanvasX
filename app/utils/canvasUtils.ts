import { RoughCanvas } from "roughjs/bin/canvas";
import { ElementType } from "../types/elements";
import { ToolType } from "../types/canvas";
import getStroke from "perfect-freehand";

const average = (a: number, b: number) => (a + b) / 2;

function getSvgPathFromStroke(points: any, closed = true) {
  const len = points.length;

  if (len < 4) {
    return ``;
  }

  let a = points[0];
  let b = points[1];
  const c = points[2];

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`;

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2
    )} `;
  }

  if (closed) {
    result += "Z";
  }

  return result;
}

export function drawElement(
  roughCanvas: RoughCanvas,
  element: ElementType,
  context: CanvasRenderingContext2D,
  scale: number
) {
  switch (element.type) {
    case "line":
    case "rectangle":
    case "circle":
    case "diamond":
      if (element.roughElement) {
        roughCanvas.draw(element.roughElement);
      }
      break;

    case "pencil":
      context.fillStyle = "white";
      context.lineWidth = 10;

      const stroke = getSvgPathFromStroke(
        getStroke(element.points!, { size: 8 })
      );
      context.fill(new Path2D(stroke));
      break;

    case "text":
      context.fillStyle = "white";
      context.lineWidth = 10;

      context.textBaseline = "top";
      context.font = `${24 * scale}px sans-serif`;
      context.fillText(element.text ?? "", element.x1, element.y1);
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
