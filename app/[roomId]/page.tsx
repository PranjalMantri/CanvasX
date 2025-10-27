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
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });

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
    panOffset,
  } = useDrawingLogic(canvasRef, tool, textAreaRef, scale, scaleOffset);

  const onZoom = (delta: number) =>
    setScale((prev) => Math.min(Math.max(prev + delta, 0, 0.1), 2));

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

    const scaledWidth = dimensions.width * scale;
    const scaledHeight = dimensions.height * scale;

    const scaledOffsetX = (scaledWidth - dimensions.width) / 2;
    const scaledOffsetY = (scaledHeight - dimensions.height) / 2;
    setScaleOffset({ x: scaledOffsetX, y: scaledOffsetY });

    context.strokeStyle = "black";
    context.lineWidth = 2;

    context.clearRect(0, 0, dimensions.width, dimensions.height);

    context.save();
    context.translate(
      panOffset.x * scale - scaledOffsetX,
      panOffset.y * scale - scaledOffsetY
    );
    context.scale(scale, scale);

    elements.forEach((element) => {
      if (action === "writing" && selectedElement?.id === element.id) return;

      drawElement(roughCanvas, element, context, scale);
    });

    context.restore();
  }, [elements, dimensions, panOffset, scale]);

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
      <div className="absolute bottom-10 left-24 z-2">
        <button style={{ padding: "4px" }} onClick={() => onZoom(-0.1)}>
          -
        </button>
        <span
          style={{ padding: "4px", cursor: "pointer" }}
          onClick={() => setScale(1)}
        >
          {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
        </span>
        <button style={{ padding: "4px" }} onClick={() => onZoom(0.1)}>
          +
        </button>
      </div>
      {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            top:
              (selectedElement?.y1 ?? 0) +
              2 * scale +
              panOffset.y * scale -
              scaleOffset.y,
            left:
              (selectedElement?.x1 ?? 0) * scale +
              panOffset.x * scale -
              scaleOffset.x,
            font: `${24 * scale}px sans-serif`,
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
        style={{ position: "absolute", zIndex: 1 }}
      />
    </div>
  );
}
