"use client";

import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const dimensions = useWindowResize();
  const {
    elements,
    setElements,
    selectedElement,
    action,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleBlur,
  } = useDrawingLogic(canvasRef, tool, textAreaRef);

  const { undo, redo } = useSocketSync({
    roomId,
    elements,
    setElements,
    action,
  });

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
      if (action === "writing" && selectedElement?.id === element.id) return;

      drawElement(roughCanvas, element, context);
    });
  }, [elements, dimensions]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (action === "writing") return;

      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      if (isCtrlOrCmd && event.key === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          redo(); // Ctrl/Cmd + Shift + Z
        } else {
          undo(); // Ctrl/Cmd + Z
        }
      } else if (isCtrlOrCmd && event.key === "y") {
        event.preventDefault();
        redo(); // Ctrl/Cmd + Y
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo, action]);

  return (
    <div>
      <ToolBar tool={tool} setTool={setTool} onUndo={undo} onRedo={redo} />
      {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            top: (selectedElement?.y1 ?? 0) + 15,
            left: selectedElement?.x1,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
            zIndex: 2,
          }}
        />
      ) : null}
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
