"use client";

import { use, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs";

import { ToolType } from "../types/canvas";
import useWindowResize from "../hooks/useWindowResize";
import useDrawingLogic from "../hooks/useDrawingLogic";
import useSocketSync from "../hooks/useSocketSync";
import ToolBar from "../components/Toolbar";
import { drawElement } from "../utils/canvasUtils";

export default function HomePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const [tool, setTool] = useState<ToolType>("line");
  const { roomId } = use(params);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dimensions = useWindowResize();
  const {
    elements,
    setElements,
    action,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useDrawingLogic(tool);

  useSocketSync({ roomId, elements, setElements, action });

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const roughCanvas = rough.canvas(canvas);

    context.strokeStyle = "black";
    context.lineWidth = 2;

    context.clearRect(0, 0, dimensions.width, dimensions.height);

    elements.forEach((element) => {
      drawElement(roughCanvas, element);
    });
  }, [elements, dimensions]);

  return (
    <div>
      <ToolBar tool={tool} setTool={setTool} />
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="block"
      />
    </div>
  );
}
