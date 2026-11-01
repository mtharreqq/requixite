"use client";

// Dev-only "Demo / Worst case / One / Empty" switch for break-ui testing.
// Reads ?data= from the URL so a reload keeps the selection. Renders nothing
// and always returns "demo" in production builds.
import { useEffect, useState } from "react";

export type Dataset = "demo" | "worst" | "one" | "empty";
const OPTIONS: { value: Dataset; label: string }[] = [
  { value: "demo", label: "Demo data" },
  { value: "worst", label: "Worst case" },
  { value: "one", label: "One" },
  { value: "empty", label: "Empty" },
];
const IS_DEV = process.env.NODE_ENV !== "production";

export function useDevDataset(): Dataset {
  const [dataset, setDataset] = useState<Dataset>("demo");
  useEffect(() => {
    if (!IS_DEV) return;
    const value = new URLSearchParams(window.location.search).get("data");
    if (OPTIONS.some((o) => o.value === value)) setDataset(value as Dataset);
  }, []);
  return dataset;
}

export function DevDataToggle({ current }: { current: Dataset }) {
  if (!IS_DEV) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: 0,
        right: 0,
        margin: "0 auto",
        width: "fit-content",
        animation: "none",
        zIndex: 9999,
        display: "flex",
        gap: 2,
        padding: 3,
        borderRadius: 999,
        background: "#e5e5e5",
        font: "12px system-ui, sans-serif",
        boxShadow: "0 1px 4px rgb(0 0 0 / 0.15)",
      }}
    >
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.set("data", o.value);
            window.location.href = url.toString();
          }}
          style={{
            padding: "4px 10px",
            borderRadius: 999,
            border: 0,
            cursor: "pointer",
            background: o.value === current ? "#fff" : "transparent",
            color: "#111",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
