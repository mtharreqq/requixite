"use client";

import type { ProjectArt } from "@/types/project";

interface ProjectCoverProps {
  color: string;
  art: ProjectArt;
  w?: number;
  h?: number;
  rounded?: number;
}

function withAlpha(hex: string, alpha: number): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ProjectCover({
  color,
  art,
  w: wIn = 320,
  h: hIn = 200,
  rounded = 10,
}: ProjectCoverProps) {
  const w = Math.max(wIn, 120);
  const h = Math.max(hIn, 80);
  const bg = withAlpha(color, 0.08);
  const fg = color;
  const a = art;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{
        display: "block",
        borderRadius: rounded,
        background: bg,
      }}
    >
      {a === "mosaic" &&
        Array.from({ length: 24 }).map((_, i) => {
          const c = i % 6;
          const r = Math.floor(i / 6);
          const filled = [1, 4, 7, 10, 13, 16, 19, 22].includes(i);
          return (
            <rect
              key={i}
              x={20 + (c * (w - 40)) / 6}
              y={20 + (r * (h - 40)) / 4}
              width={(w - 40) / 6 - 8}
              height={(h - 40) / 4 - 8}
              rx="3"
              fill={filled ? fg : "none"}
              stroke={fg}
              strokeOpacity={filled ? 0 : 0.35}
              strokeWidth="1"
            />
          );
        })}

      {a === "wave" && (
        <>
          <path
            d={`M0,${h * 0.62} Q${w / 4},${h * 0.4} ${w / 2},${h * 0.62} T${w},${h * 0.62} L${w},${h} L0,${h} Z`}
            fill={fg}
            fillOpacity="0.18"
          />
          <path
            d={`M0,${h * 0.7} Q${w / 4},${h * 0.5} ${w / 2},${h * 0.7} T${w},${h * 0.7}`}
            stroke={fg}
            strokeWidth="2"
            fill="none"
          />
          <circle cx={w * 0.7} cy={h * 0.32} r="22" fill={fg} fillOpacity="0.9" />
        </>
      )}

      {a === "rows" && (
        <>
          <rect x="20" y="20" width={w * 0.32} height={h - 40} rx="6" fill={fg} fillOpacity="0.08" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x="32"
              y={36 + i * 22}
              width={w * 0.24}
              height="6"
              rx="3"
              fill={fg}
              fillOpacity={i === 0 ? 0.85 : 0.4}
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={w * 0.4}
              y={20 + (i * (h - 40)) / 4 + 6}
              width={w * 0.55}
              height={(h - 40) / 4 - 12}
              rx="6"
              fill={fg}
              fillOpacity="0.12"
            />
          ))}
        </>
      )}

      {a === "phone" && (
        <>
          <rect
            x={w / 2 - 50}
            y="14"
            width="100"
            height={h - 28}
            rx="14"
            fill="white"
            stroke={fg}
            strokeWidth="2"
          />
          <rect x={w / 2 - 16} y="22" width="32" height="6" rx="3" fill={fg} fillOpacity="0.4" />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={w / 2 - 38}
              y={42 + i * 22}
              width="76"
              height="14"
              rx="4"
              fill={fg}
              fillOpacity={i === 0 ? 0.9 : 0.18}
            />
          ))}
          <circle cx={w / 2 + 22} cy={h - 24} r="10" fill={fg} />
        </>
      )}

      {a === "token" && (
        <>
          <text
            x={w / 2}
            y={h / 2 + 8}
            textAnchor="middle"
            fontFamily="Geist Mono"
            fontSize="38"
            fontWeight="600"
            fill={fg}
          >
            {"<glyph/>"}
          </text>
          <line
            x1="40"
            y1={h * 0.78}
            x2={w - 40}
            y2={h * 0.78}
            stroke={fg}
            strokeOpacity="0.3"
            strokeDasharray="3 4"
          />
        </>
      )}

      {a === "rule" && (
        <>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line
              key={i}
              x1="30"
              y1={32 + i * 20}
              x2={w - 30 - (i % 2) * 60}
              y2={32 + i * 20}
              stroke={fg}
              strokeOpacity={i === 0 ? 0.9 : 0.35}
              strokeWidth={i === 0 ? 3 : 1}
            />
          ))}
          <circle cx={w - 50} cy={h - 40} r="14" fill="none" stroke={fg} strokeWidth="2" />
        </>
      )}

      {a === "cal" &&
        Array.from({ length: 28 }).map((_, i) => {
          const c = i % 7;
          const r = Math.floor(i / 7);
          return (
            <rect
              key={i}
              x={20 + (c * (w - 40)) / 7}
              y={30 + (r * (h - 50)) / 4}
              width={(w - 40) / 7 - 4}
              height={(h - 50) / 4 - 6}
              rx="3"
              fill={[10, 11, 18].includes(i) ? fg : "none"}
              stroke={fg}
              strokeOpacity="0.25"
              strokeWidth="1"
            />
          );
        })}

      {a === "pulse" && (
        <>
          <polyline
            points={`0,${h / 2} ${w * 0.15},${h / 2} ${w * 0.22},${h * 0.2} ${w * 0.3},${h * 0.85} ${w * 0.4},${h * 0.4} ${w * 0.5},${h / 2} ${w * 0.65},${h / 2} ${w * 0.72},${h * 0.3} ${w * 0.78},${h * 0.7} ${w},${h / 2}`}
            stroke={fg}
            strokeWidth="2"
            fill="none"
          />
          <circle cx={w * 0.5} cy={h / 2} r="4" fill={fg} />
        </>
      )}

      {a === "tape" && (
        <>
          <rect
            x="30"
            y={h / 2 - 20}
            width={w - 60}
            height="40"
            fill="white"
            stroke={fg}
            strokeWidth="2"
            strokeDasharray="6 4"
            transform={`rotate(-2 ${w / 2} ${h / 2})`}
          />
        </>
      )}

      {a === "pen" && (
        <>
          <path d={`M30 ${h - 40} L ${w * 0.55} ${h * 0.25}`} stroke={fg} strokeWidth="3" />
          <path d={`M ${w * 0.55} ${h * 0.25} l 30 -10 l 10 30 z`} fill={fg} />
          <path
            d={`M30 ${h - 30} q ${w * 0.4} -20 ${w - 90} 0`}
            stroke={fg}
            strokeWidth="1"
            fill="none"
            strokeOpacity="0.4"
          />
        </>
      )}
    </svg>
  );
}
