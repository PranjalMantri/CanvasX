import { ElementType } from "../types/elements";
import { positionWithinElement } from "./geometryUtils";

export function getElementAtPosition(
  x: number,
  y: number,
  elements: ElementType[]
) {
  return elements
    .map((element) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element) => element.position !== null);
}

export function getCursorForPosition(position: string) {
  switch (position) {
    // Diagonal resize (Top-Left <=> Bottom-Right)
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";

    // Diagonal resize (Top-Right <=> Bottom-Left)
    case "tr":
    case "bl":
      return "nesw-resize";

    // Vertical resize (Top <=> Bottom)
    case "top":
    case "bottom":
      return "ns-resize";

    // Horizontal resize (Left <=> Right)
    case "left":
    case "right":
      return "ew-resize";

    case "inside":
      return "grab";

    default:
      return "auto";
  }
}
