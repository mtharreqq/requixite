"use client";

import { useId, useState } from "react";

/**
 * Native range input drives a clip-path. Captions stay empty until a real
 * before/after pair is confirmed. Not mounted while `showProofSlider` is false.
 */
export function ProofSlider({
  beforeSrc,
  afterSrc,
  beforeCaption = "",
  afterCaption = "",
  label = "Before and after",
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeCaption?: string;
  afterCaption?: string;
  label?: string;
}) {
  const [value, setValue] = useState(50);
  const inputId = useId();

  return (
    <figure className="w-full">
      <div className="border-border relative aspect-video overflow-hidden rounded-xl border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterSrc}
          alt={afterCaption}
          className="absolute inset-0 size-full object-cover"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeSrc}
          alt={beforeCaption}
          aria-hidden={beforeCaption ? undefined : true}
          className="absolute inset-0 size-full object-cover"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
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
      <figcaption className="text-muted-foreground mt-2 flex justify-between text-xs">
        <span>{beforeCaption}</span>
        <span>{afterCaption}</span>
      </figcaption>
    </figure>
  );
}
