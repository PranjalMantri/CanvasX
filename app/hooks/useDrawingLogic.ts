import { useState } from "react";
import { ToolType } from "../types/canvas";
import { Action } from "../types/action";
import { createElement } from "../utils/elementFactory";
import { ElementType } from "../types/elements";

export default function useDrawingLogic(tool: ToolType) {
  const [elements, setElements] = useState<ElementType[]>([]);
  const [action, setAction] = useState<Action>("none");
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(
    null
  );

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;

    if (tool === "line" || tool === "rectangle") {
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
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;

    if (action === "drawing" && selectedElement) {
      const { id, type, x1, y1 } = selectedElement;

      const updatedElement = createElement(x1, y1, clientX, clientY, type, id);

      setElements((prevElements) => {
        const elementsCopy = [...prevElements];
        const index = elementsCopy.findIndex((element) => element.id === id);

        if (index !== -1) {
          elementsCopy[index] = updatedElement;
        }

        return elementsCopy;
      });
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
