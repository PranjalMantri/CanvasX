"use client";

import {
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import rough from "roughjs";

import { ToolType } from "../types/canvas";
import useWindowResize from "../hooks/useWindowResize";
import useDrawingLogic from "../hooks/useDrawingLogic";
import useSocketSync from "../hooks/useSocketSync";
import ToolBar from "../components/Toolbar";
import { drawElement } from "../utils/canvasUtils";
import Navbar from "../components/Navbar";
import { useStyleStore } from "../store/useStyles";
import { UtilityBar } from "../components/UtilityBar";

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

  const { color, setColor, width, setWidth } = useStyleStore();

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

  const handleSaveCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${roomId}-drawing.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [canvasRef, roomId]);

  useLayoutEffect(() => {
    const scaledWidth = dimensions.width * scale;
    const scaledHeight = dimensions.height * scale;

    const scaledOffsetX = (scaledWidth - dimensions.width) / 2;
    const scaledOffsetY = (scaledHeight - dimensions.height) / 2;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScaleOffset({ x: scaledOffsetX, y: scaledOffsetY });
  }, [scale, dimensions]);

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
  }, [elements, dimensions, panOffset, scale, action, selectedElement?.id]);

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
    <div className="bg-white">
      <Navbar />
      <ToolBar tool={tool} setTool={setTool} onSave={handleSaveCanvas} />
      {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            top:
              (selectedElement?.y1 ?? 0) +
              2 * scale +
              panOffset.y * scale -
              scaleOffset.y,
            left:
              (selectedElement?.x1 ?? 0) * scale +
              panOffset.x * scale -
              scaleOffset.x,
            fontSize: `${24 * scale}px`,
            color: color,
          }}
          className="
          fixed
          m-0 p-0 border-0 outline-none
          overflow-hidden whitespace-pre
          bg-transparent
          z-2
          font-sans
          "
        />
      ) : null}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="block absolute z-1 bg-zinc-800"
      />
      <UtilityBar
        onUndo={undo}
        onRedo={redo}
        activeColor={color}
        onColorChange={setColor}
        strokeWidth={width}
        onStrokeWidthChange={setWidth}
        scale={scale}
        setScale={setScale}
        onZoom={onZoom}
      />
    </div>
  );
}
