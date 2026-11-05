"use client";

import { useId, useState } from "react";

type Shot = {
  avif: string;
  webp: string;
};

/**
 * Native range input drives a clip-path. Captions stay empty until written.
 */
export function ProofSlider({
  before,
  after,
  width,
  height,
  beforeCaption = "",
  afterCaption = "",
  beforeSource,
  label = "Before and after",
}: {
  before: Shot;
  after: Shot;
  width: number;
  height: number;
  beforeCaption?: string;
  afterCaption?: string;
  beforeSource: string;
  label?: string;
}) {
  const [value, setValue] = useState(50);
  const inputId = useId();

  return (
    <figure className="w-full">
      <div
        className="border-border relative overflow-hidden rounded-xl border"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <ShotImage
          shot={after}
          width={width}
          height={height}
          alt={afterCaption}
        />
        <ShotImage
          shot={before}
          width={width}
          height={height}
          alt={beforeCaption}
          clipPath={`inset(0 ${100 - value}% 0 0)`}
        />
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <input
          id={inputId}
          type="range"
          min={0}
          max={100}
          value={value}
          aria-valuetext={`${value}%`}
          onChange={(event) => setValue(Number(event.target.value))}
          className="absolute inset-x-4 bottom-3 w-[calc(100%-2rem)]"
        />
      </div>
      {beforeCaption || afterCaption ? (
        <figcaption className="text-muted-foreground mt-2 flex justify-between text-xs">
          <span>{beforeCaption}</span>
          <span>{afterCaption}</span>
        </figcaption>
      ) : null}
      <p className="text-muted-foreground mt-2 text-xs">{beforeSource}</p>
    </figure>
  );
}

function ShotImage({
  shot,
  width,
  height,
  alt,
  clipPath,
}: {
  shot: Shot;
  width: number;
  height: number;
  alt: string;
  clipPath?: string;
}) {
  return (
    <picture
      className="absolute inset-0"
      style={clipPath ? { clipPath } : undefined}
    >
      <source srcSet={shot.avif} type="image/avif" />
      <source srcSet={shot.webp} type="image/webp" />
      {/* Static AVIF/WebP pair. next/image would re-encode these. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shot.webp}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
      />
    </picture>
  );
}
