import React, { useEffect, useState } from "react";
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
import usePressedKeys from "./usePressedKeys";

export default function useDrawingLogic(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  tool: ToolType,
  textAreaRef: any,
  scale: number,
  scaleOffset: any
) {
  const [elements, setElements] = useState<ElementType[]>([]);
  const [action, setAction] = useState<Action>("none");
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(
    null
  );
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const pressedKeys = usePressedKeys();

  useEffect(() => {
    if (action === "writing") {
      const textArea = textAreaRef.current;
      setTimeout(() => textArea.focus(), 0);
      textArea.value = selectedElement?.text ?? "";
    }
  }, [action, selectedElement]);

  useEffect(() => {
    const panFunction = (event: WheelEvent): void => {
      setPanOffset((prevState) => ({
        x: prevState.x - event.deltaX,
        y: prevState.y - event.deltaY,
      }));
    };

    document.addEventListener("wheel", panFunction);
    return () => {
      document.removeEventListener("wheel", panFunction);
    };
  }, []);

  const getMouseCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const clientX =
      (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
    const clientY =
      (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;
    return { clientX, clientY };
  };

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: ToolType,
    options?: any
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

      case "text":
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.font = `${24 * scale}px sans-serif`;

        const textWidth = ctx.measureText(options.text).width ?? 0;

        const textHeight = 24 * scale;
        elementsCopy[oldElementId] = {
          ...createElement(x1, y1, x1 + textWidth, y1 + textHeight, type, id),
          text: options.text,
        };
        break;
      default:
        throw new Error("Invalid type: ", type);
    }

    setElements(elementsCopy);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (action === "writing") return;

    const { clientX, clientY } = getMouseCoordinates(event);

    if (event.button === 1 || pressedKeys.has(" ")) {
      setAction("panning");
      setStartPanMousePosition({ x: event.clientX, y: event.clientY });
      return;
    }

    if (
      tool === "line" ||
      tool === "rectangle" ||
      tool === "circle" ||
      tool === "diamond" ||
      tool === "pencil" ||
      tool === "text"
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
      setAction(tool === "text" ? "writing" : "drawing");
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { clientX, clientY } = getMouseCoordinates(event);

    if (action === "panning") {
      const deltaX = event.clientX - startPanMousePosition.x;
      const deltaY = event.clientY - startPanMousePosition.y;

      setPanOffset((prevState) => ({
        x: prevState.x + deltaX,
        y: prevState.y + deltaY,
      }));

      setStartPanMousePosition({ x: event.clientX, y: event.clientY });
      return;
    }

    if (action === "none") {
      canvas.style.cursor = "default";
    }

    if (tool === "selection") {
      const hoveredElement = getElementAtPosition(clientX, clientY, elements);

      if (hoveredElement?.position) {
        canvas.style.cursor = getCursorForPosition(hoveredElement.position);
      } else {
        canvas.style.cursor = "default";
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
        const options = type === "text" ? { text: selectedElement.text } : {};

        updateElement(
          id,
          newX1,
          newY1,
          newX1 + width,
          newY1 + height,
          type,
          options
        );
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

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (action === "writing") {
      return;
    }

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

    if (
      selectedElement.type === "text" &&
      action === "moving" &&
      selectedElement.x1 === clientX - selectedElement.offsetX! &&
      selectedElement.y1 === clientY - selectedElement.offsetY!
    ) {
      setAction("writing");
      return;
    }

    setAction("none");
    setSelectedElement(null);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (!selectedElement) return;

    const { id, x1, y1, type } = selectedElement;

    setAction("none");
    setSelectedElement(null);

    updateElement(id, x1, y1, -1, -1, type, {
      text: event.target.value,
    });
  };

  return {
    elements,
    setElements,
    selectedElement,
    action,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleBlur,
    panOffset,
    scale,
    scaleOffset,
  };
}
