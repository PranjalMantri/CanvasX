import { RoughCanvas } from "roughjs/bin/canvas";
import { ElementType } from "../types/elements";

export function drawElement(roughCanvas: RoughCanvas, element: ElementType) {
  switch (element.type) {
    case "line":
    case "rectangle":
      if (element.roughElement) {
        roughCanvas.draw(element.roughElement);
      }
      break;

    default:
      break;
  }
}
