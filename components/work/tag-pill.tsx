"use client";

interface TagPillProps {
  name: string;
  color: string;
  size?: "sm" | "md";
}

function withAlpha(hex: string, alpha: number): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function TagPill({ name, color, size = "md" }: TagPillProps) {
  const fontSize = size === "sm" ? 11 : 12;
  const padding = size === "sm" ? "2px 7px 2px 5px" : "3px 9px 3px 7px";
  const dotSize = size === "sm" ? 6 : 7;
  const bg = withAlpha(color, 0.12);
  const border = withAlpha(color, 0.4);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding,
        borderRadius: 999,
        fontSize,
        fontWeight: 500,
        background: bg,
        color,
        border: `1px solid ${border}`,
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: 999,
          background: color,
          flexShrink: 0,
        }}
      />
      {name}
    </span>
  );
}
