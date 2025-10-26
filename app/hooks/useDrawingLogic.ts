import { useState } from "react";
import { ToolType } from "../types/canvas";
import { Action } from "../types/action";
import { createElement } from "../utils/elementFactory";
import { ElementType } from "../types/elements";
import {
  getCursorForPosition,
  getElementAtPosition,
} from "../utils/elementUtils";

export default function useDrawingLogic(
  canvas: HTMLCanvasElement | null,
  tool: ToolType
) {
  const [elements, setElements] = useState<ElementType[]>([]);
  const [action, setAction] = useState<Action>("none");
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(
    null
  );

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: ToolType
  ) => {
    const elementsCopy = [...elements];
    const oldElementId = elementsCopy.findIndex((element) => element.id === id);

    switch (type) {
      case "line":
      case "rectangle":
      case "circle":
      case "diamond":
        elementsCopy[oldElementId] = createElement(x1, y1, x2, y2, type, id);
        break;

      case "selection":
        break;
      default:
        throw new Error("Invalid type: ", type);
    }

    setElements(elementsCopy);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;

    if (
      tool === "line" ||
      tool === "rectangle" ||
      tool === "circle" ||
      tool === "diamond"
    ) {
      setAction("drawing");

      const newElement = createElement(
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );

      setSelectedElement(newElement);
      setElements((prevElements) => [...prevElements, newElement]);
    } else if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (!element) return;

      const offsetX = clientX - element.x1;
      const offsetY = clientY - element.y1;

      setSelectedElement({ ...element, offsetX, offsetY, position: undefined });

      if (element.position === "inside") {
        setAction("moving");
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;

    if (tool === "selection") {
      const hoveredElement = getElementAtPosition(clientX, clientY, elements);
      if (!canvas) return;

      if (hoveredElement?.position) {
        canvas.style.cursor = getCursorForPosition(hoveredElement.position);
      }
    }

    if (action === "drawing" && selectedElement) {
      const { id, type, x1, y1 } = selectedElement;
      updateElement(id, x1, y1, clientX, clientY, type);
    } else if (action === "moving" && selectedElement) {
      const { id, type, x1, y1, x2, y2, offsetX, offsetY } = selectedElement;

      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = clientX - offsetX!;
      const newY1 = clientY - offsetY!;

      updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type);
    }
  };

  const handleMouseUp = () => {
    setSelectedElement(null);
    setAction("none");
  };

  return {
    elements,
    setElements,
    action,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
