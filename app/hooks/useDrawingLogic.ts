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
import useHistory from "./useHistory";

export default function useDrawingLogic(
  canvas: HTMLCanvasElement | null,
  tool: ToolType
) {
  // 2. Replace useState with useHistory for elements
  const [elements, setElements, undo, redo] = useHistory<ElementType[]>([]);
  const [action, setAction] = useState<Action>("none");
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(
    null
  );
  // 3. Add state to track if we are in the middle of an action
  const [isWritingHistory, setIsWritingHistory] = useState(false);

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: ToolType,
    overwrite: boolean = false // 4. Add overwrite parameter
  ) => {
    // Note: This logic assumes 'elements' from useHistory is the current state array
    const elementsCopy = [...elements];
    const oldElementId = elementsCopy.findIndex((element) => element.id === id);

    if (oldElementId === -1) return; // Guard clause if element not found

    switch (type) {
      case "line":
      case "rectangle":
      case "circle":
      case "diamond":
        elementsCopy[oldElementId] = createElement(x1, y1, x2, y2, type, id);
        break;

      case "selection":
        // Selection tool doesn't modify elements directly, it's for moving/resizing
        break;
      default:
        throw new Error("Invalid type: " + type);
    }

    setElements(elementsCopy, overwrite); // 5. Pass overwrite to setElements
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;

    if (
      tool === "line" ||
      tool === "rectangle" ||
      tool === "circle" ||
      tool === "diamond"
    ) {
      const newElement = createElement(
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );

      setSelectedElement(newElement);
      // This creates a NEW history entry (overwrite=false by default)
      setElements((prevElements) => [...prevElements, newElement]);

      setAction("drawing");
      setIsWritingHistory(true); // 6. Mark that we've started an action
    } else if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (!element) return;

      const offsetX = clientX - element.x1;
      const offsetY = clientY - element.y1;

      setSelectedElement({
        ...element,
        offsetX,
        offsetY,
        position: element.position ?? undefined,
      });

      // Note: We don't set isWritingHistory here.
      // We wait for the *first* mouseMove to create the new history state.
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

    // Cursor logic (unchanged)
    if (action === "none") {
      canvas.style.cursor = "default";
    }
    if (tool === "selection") {
      const hoveredElement = getElementAtPosition(clientX, clientY, elements);
      // canvas null check already done above
      if (hoveredElement?.position) {
        canvas.style.cursor = hoveredElement
          ? getCursorForPosition(hoveredElement.position)
          : "default";
      }
    }

    // --- History-aware updates ---

    if (action === "drawing" && selectedElement) {
      const { id, type, x1, y1 } = selectedElement;
      // 7. Always overwrite while drawing (part of the same action)
      updateElement(id, x1, y1, clientX, clientY, type, true);
    } else if (action === "moving" && selectedElement) {
      const { id, type, x1, y1, x2, y2, offsetX, offsetY } = selectedElement;

      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = clientX - offsetX!;
      const newY1 = clientY - offsetY!;

      // 8. Overwrite only if we've already started this action
      const overwrite = isWritingHistory;
      updateElement(
        id,
        newX1,
        newY1,
        newX1 + width,
        newY1 + height,
        type,
        overwrite
      );
      if (!isWritingHistory) setIsWritingHistory(true); // Mark as started after first move
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
        // 9. Same logic as "moving"
        const overwrite = isWritingHistory;
        updateElement(id, x1, y1, x2, y2, type, overwrite);
        if (!isWritingHistory) setIsWritingHistory(true); // Mark as started after first resize
      }
    }
  };

  const handleMouseUp = () => {
    if (selectedElement) {
      const { id, type } = selectedElement;

      if (
        (action === "drawing" || action === "resizing") &&
        adjustmentRequired(type)
      ) {
        // Find the element from the *current* state
        const element = elements.find((el) => el.id === id);
        if (element) {
          const adjusted = adjustElementCoordinates(element);
          if (adjusted) {
            const { x1, y1, x2, y2 } = adjusted;
            // 10. Overwrite the final adjustment
            updateElement(id, x1, y1, x2, y2, type, true);
          }
        }
      }
    }

    // 11. Reset for the next action
    setIsWritingHistory(false);
    setSelectedElement(null);
    setAction("none");
  };

  return {
    elements,
    setElements, // You might not want to expose the history 'set' directly
    action,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    undo, // 12. Expose undo
    redo, // 13. Expose redo
  };
}
