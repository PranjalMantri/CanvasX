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
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const diameter = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  const vertices: [number, number][] = [
    [centerX, y1],
    [x2, centerY],
    [centerX, y2],
    [x1, centerY],
  ];

  switch (type) {
    case "line":
      roughElement = generator.line(x1, y1, x2, y2);
      break;

    case "rectangle":
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
      break;

    case "circle":
      roughElement = generator.circle(centerX, centerY, diameter);
      break;

    case "diamond":
      roughElement = generator.polygon(vertices);
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

        case "circle":
          ctx.beginPath();
          ctx.arc(centerX, centerY, diameter / 2, 0, 2 * Math.PI);
          ctx.stroke();
          break;

        case "diamond":
          ctx.beginPath();
          ctx.moveTo(centerX, y1);
          ctx.lineTo(x2, centerY);
          ctx.lineTo(centerX, y2);
          ctx.lineTo(x1, centerY);
          ctx.closePath();
          ctx.stroke();
          break;
        default:
          break;
      }
    },
    roughElement,
  };
}
