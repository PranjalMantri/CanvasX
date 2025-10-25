"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tool, setTool] = useState("line");

  const canvasRef = useRef(null);

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    requestAnimationFrame(() => {
      context.strokeStyle = "black";
      context.lineWidth = 2;

      context.strokeRect(10, 10, 150, 150);

      context.beginPath();
      context.moveTo(10, 10);
      context.lineTo(110, 110);
      context.stroke();
    });
  }, [dimensions]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
      ></canvas>
    </div>
  );
}
