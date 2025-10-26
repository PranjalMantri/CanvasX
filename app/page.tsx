"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createElement } from "./utils/elementFactory";
import { ToolType } from "./types/canvas";
import rough from "roughjs";
import { RoughCanvas } from "roughjs/bin/canvas";

function drawElement(roughCanvas: RoughCanvas, element: any) {
  switch (element.type) {
    case "line":
    case "rectangle":
      roughCanvas.draw(element.roughElement);
      break;

    default:
      throw new Error("Invalid type: ", element.type);
  }
}

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tool, setTool] = useState<ToolType>("line");
  const [action, setAction] = useState("drawing");
  const [elements, setElements] = useState<any>([]);
  const [selectedElement, setSelectedElement] = useState<any>();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const roughCanvas = rough.canvas(canvas);

    context.strokeStyle = "black";
    context.lineWidth = 2;

    context.clearRect(0, 0, dimensions.width, dimensions.height);

    elements.forEach((element: any) => {
      // element.draw(context);
      drawElement(roughCanvas, element);
    });
  }, [dimensions, elements]);

  const updateElement = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: ToolType,
    id: number
  ) => {
    const elementsCopy = [...elements];
    const index = elements.findIndex((element: any) => element.id === id);
    if (index === -1) return;

    switch (type) {
      case "line":
      case "rectangle":
        elementsCopy[index] = createElement(x1, y1, x2, y2, type, id);
        break;
      default:
        throw new Error("Invalid type: ", type);
    }

    setElements(elementsCopy);
    console.log(elements.length);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
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
      setElements([...elements, newElement]);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;

    if (action === "drawing" && selectedElement) {
      const { id, type, x1, y1 } = selectedElement;
      console.log(id, type);

      updateElement(x1, y1, clientX, clientY, type, id);
    }
  };

  const handleMouseUp = () => {
    setSelectedElement(null);
    setAction("none");
  };

  return (
    <div>
      <div>
        <input
          type="radio"
          name="toolType"
          value={"line"}
          checked={tool === "line"}
          onChange={() => setTool("line")}
        />
        <label htmlFor="line">Line</label>
        <input
          type="radio"
          name="toolType"
          value={"rectangle"}
          checked={tool === "rectangle"}
          onChange={() => setTool("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle</label>
      </div>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="block"
      ></canvas>
    </div>
  );
}
