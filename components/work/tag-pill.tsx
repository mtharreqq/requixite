interface TagPillProps {
  name: string;
  color: string;
  size?: "sm" | "md";
}

export function TagPill({ name, color, size = "md" }: TagPillProps) {
  const fontSize = size === "sm" ? 11 : 12;
  const padding = size === "sm" ? "2px 7px 2px 5px" : "3px 9px 3px 7px";
  const dotSize = size === "sm" ? 6 : 7;
  // color-mix accepts any CSS colour (3/6-digit hex, named, oklch).
  const bg = `color-mix(in srgb, ${color} 12%, transparent)`;
  const border = `color-mix(in srgb, ${color} 40%, transparent)`;

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
