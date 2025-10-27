import { useState } from "react";
import { ToolType } from "../types/canvas";
import { Action } from "../types/action";
import { createElement } from "../utils/elementFactory";
import { ElementType } from "../types/elements";
import {
  getCursorForPosition,
  getElementAtPosition,
  resizedCoordinates,
} from "../utils/elementUtils";
import {
  adjustElementCoordinates,
  adjustmentRequired,
} from "../utils/canvasUtils";

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
      case "pencil":
        elementsCopy[oldElementId].points = [
          ...(elementsCopy[oldElementId].points ?? []),
          { x: x2, y: y2 },
        ];
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
      tool === "diamond" ||
      tool === "pencil"
    ) {
      const newElement = createElement(
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );

      setSelectedElement(newElement);
      setElements((prevElements) => [...prevElements, newElement]);
      setAction("drawing");
    } else if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (!element) return;

      if (element.type === "pencil") {
        const xOffsets = element.points!!.map((point) => clientX - point.x);
        const yOffsets = element.points!!.map((point) => clientY - point.y);

        setSelectedElement({
          ...element,
          xOffsets,
          yOffsets,
          position: element.position ?? undefined,
        });
      } else {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;

        setSelectedElement({
          ...element,
          offsetX,
          offsetY,
          position: element.position ?? undefined,
        });
      }

      if (element.position === "inside") {
        setAction("moving");
      } else {
        setAction("resizing");
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvas) return;
    const { clientX, clientY } = event;

    if (action === "none") {
      canvas.style.cursor = "default";
    }

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

      if (selectedElement.type === "pencil") {
        const newPoints = selectedElement.points!.map((_, index) => ({
          x: clientX - selectedElement.xOffsets![index],
          y: clientY - selectedElement.yOffsets![index],
        }));

        const newElement = { ...selectedElement, points: newPoints };

        const index = elements.findIndex((element) => element.id === id);
        const elementsCopy = [...elements];
        elementsCopy[index] = newElement;
        setElements(elementsCopy);
      } else {
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX!;
        const newY1 = clientY - offsetY!;

        updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type);
      }
    } else if (action === "resizing" && selectedElement) {
      const { id, type, position, ...coordinates } = selectedElement;

      const resized = resizedCoordinates(
        clientX,
        clientY,
        position!,
        coordinates,
        type
      );

      if (resized) {
        const { x1, y1, x2, y2 } = resized;
        updateElement(id, x1, y1, x2, y2, type);
      }
    }
  };

  const handleMouseUp = () => {
    if (!selectedElement) {
      setAction("none");
      return;
    }

    const { id, type } = selectedElement;

    if (
      (action === "drawing" || action === "resizing") &&
      adjustmentRequired(type)
    ) {
      const element = elements.find((el) => el.id === id);
      if (!element) return;

      const adjusted = adjustElementCoordinates(element);

      if (adjusted) {
        const { x1, y1, x2, y2 } = adjusted;
        updateElement(id, x1, y1, x2, y2, type);
      }
    }

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
