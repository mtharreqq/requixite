"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;
interface GridOffset {
  x: number;
  y: number;
}

interface SquaresProps {
  direction?: "diagonal" | "up" | "right" | "down" | "left";
  speed?: number;
  borderColor?: CanvasStrokeStyle; // fallback jika autoBorder=false
  autoBorder?: boolean; // << NEW: auto pakai warna tema
  squareSize?: number;
  hoverFillColor?: CanvasStrokeStyle;
}

const Squares: React.FC<SquaresProps> = ({
  direction = "right",
  speed = 1,
  borderColor = "#999",
  autoBorder = true,
  squareSize = 40,
  hoverFillColor = "#222",
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);

  const gradientRef = useRef<CanvasGradient | null>(null);
  const borderStyleRef = useRef<CanvasStrokeStyle>(borderColor); // << NEW
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const buildGradient = () => {
      const { w, h } = sizeRef.current;
      const g = ctx.createRadialGradient(
        w / 2,
        h / 2,
        0,
        w / 2,
        h / 2,
        Math.hypot(w, h) / 2,
      );
      if (isDark) {
        g.addColorStop(0, "rgba(0, 0, 0, 0)");
        g.addColorStop(0.7, "#0A0A0A");
      } else {
        g.addColorStop(0, "rgba(255, 255, 255, 0)");
        g.addColorStop(1, "#fff");
      }
      gradientRef.current = g;
    };

    // << NEW: resolve warna border dari CSS variable --border
    const buildBorder = () => {
      if (!autoBorder) {
        borderStyleRef.current = borderColor;
        return;
      }

      const fallback = isDark ? "0 0% 20%" : "0 0% 95%";
      borderStyleRef.current = `hsl(${fallback})`;
    };

    const resizeCanvas = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      sizeRef.current = { w, h };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildGradient();
      buildBorder();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      for (let x = startX; x < w + squareSize; x += squareSize) {
        for (let y = startY; y < h + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          if (
            hoveredSquareRef.current &&
            Math.floor((x - startX) / squareSize) ===
              hoveredSquareRef.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderStyleRef.current; // << pakai warna hasil resolve
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      if (!gradientRef.current) buildGradient();
      ctx.fillStyle = gradientRef.current!;
      ctx.fillRect(0, 0, w, h);
    };

    const updateAnimation = () => {
      const v = Math.max(speed, 0.1);
      switch (direction) {
        case "right":
          gridOffset.current.x =
            (gridOffset.current.x - v + squareSize) % squareSize;
          break;
        case "left":
          gridOffset.current.x =
            (gridOffset.current.x + v + squareSize) % squareSize;
          break;
        case "up":
          gridOffset.current.y =
            (gridOffset.current.y + v + squareSize) % squareSize;
          break;
        case "down":
          gridOffset.current.y =
            (gridOffset.current.y - v + squareSize) % squareSize;
          break;
        case "diagonal":
          gridOffset.current.x =
            (gridOffset.current.x - v + squareSize) % squareSize;
          gridOffset.current.y =
            (gridOffset.current.y - v + squareSize) % squareSize;
          break;
      }
      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hx = Math.floor(
        (mouseX + gridOffset.current.x - startX) / squareSize,
      );
      const hy = Math.floor(
        (mouseY + gridOffset.current.y - startY) / squareSize,
      );

      if (
        !hoveredSquareRef.current ||
        hoveredSquareRef.current.x !== hx ||
        hoveredSquareRef.current.y !== hy
      ) {
        hoveredSquareRef.current = { x: hx, y: hy };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    requestRef.current = requestAnimationFrame(updateAnimation);

    // rebuild warna saat tema berubah
    buildBorder();
    buildGradient();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    direction,
    speed,
    borderColor,
    autoBorder,
    hoverFillColor,
    squareSize,
    isDark,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute -z-10 h-full w-full border-none"
      aria-hidden="true"
    />
  );
};

export default Squares;
