"use client";

// Copied from rant-ai-landing-page (home/hero-panorama.tsx) so the hero can
// show the live rantai.dev hero instead of a screenshot.

import { useEffect, useRef, useState } from "react";

// Hero background: a panorama ring of product screens seen from inside a
// cylinder (centre card smallest, edges curving toward you), with the large
// ASCII Earth rising in front of it.

type Shot = {
  src: string;
  /** How the screenshot is scaled/shifted inside its card (claw is cropped). */
  size: number;
  x: number;
  y: number;
};

const agents: Shot = {
  src: "/work/rantai/live/rantai-agents-chat.webp",
  size: 1,
  x: 0,
  y: 0,
};
const claw: Shot = {
  src: "/work/rantai/live/rantai-claw-console.webp",
  size: 1.1035,
  x: -0.0517,
  y: -0.0573,
};
const lake = (name: string): Shot => ({
  src: `/work/rantai/live/lake-${name}.webp`,
  size: 1,
  x: 0,
  y: 0,
});

/** A card shows a screenshot (bent in strips) or a demo video (one panel). */
type Item = { shot: Shot } | { video: string };

// Screenshots only: the demo videos (4 MB) stay on rantai.dev.
const items: Item[] = [
  { shot: agents },
  { shot: lake("dashboard") },
  { shot: claw },
  { shot: lake("home") },
  { shot: agents },
  { shot: lake("login") },
  { shot: claw },
  { shot: lake("dashboard") },
  { shot: agents },
  { shot: lake("home") },
  { shot: claw },
  { shot: lake("login") },
];
const CARDS = items.length;

/** Which product a card belongs to, so neighbours can be kept apart. */
const productOf = (item: Item) => {
  const src = "shot" in item ? item.shot.src : item.video;
  return src.includes("lake")
    ? "lake"
    : src.includes("claw")
      ? "claw"
      : "agents";
};

/**
 * A random order of the cards for the ring's first `used` slots, where no
 * two neighbours (the last and first included, as it is a circle) show the
 * same product. Returns each card's slot; slots from `used` on are hidden.
 */
function arrange(used: number): number[] {
  const all = items.map((_, i) => i);
  for (let attempt = 0; attempt < 200; attempt++) {
    const left = [...all];
    const order: number[] = [];
    while (order.length < CARDS) {
      const prev = order.at(-1);
      const inRing = order.length < used;
      const last = order.length === used - 1;
      const options = left.filter(
        (c) =>
          !inRing ||
          ((prev === undefined ||
            productOf(items[c]) !== productOf(items[prev])) &&
            (!last || productOf(items[c]) !== productOf(items[order[0]]))),
      );
      if (!options.length) break;
      const pick = options[Math.floor(Math.random() * options.length)];
      order.push(pick);
      left.splice(left.indexOf(pick), 1);
    }
    if (order.length === CARDS) {
      const slot: number[] = [];
      order.forEach((card, i) => (slot[card] = i));
      return slot;
    }
  }
  return all; // fallback: the authored order
}
const STRIPS = 14; // vertical slices per card, so each card bends with the ring
const ASPECT = 0.62; // card height / width

/* ----------------------------- ASCII Earth ----------------------------- */

const ramp = " .,:;-=+*#%@";
function hash(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise3(x: number, y: number, z: number) {
  const ix = Math.floor(x),
    iy = Math.floor(y),
    iz = Math.floor(z);
  const fx = x - ix,
    fy = y - iy,
    fz = z - iz;
  const u = (v: number) => v * v * (3 - 2 * v);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) =>
    hash(ix + dx, iy + dy, iz + dz);
  return l(
    l(
      l(c(0, 0, 0), c(1, 0, 0), u(fx)),
      l(c(0, 1, 0), c(1, 1, 0), u(fx)),
      u(fy),
    ),
    l(
      l(c(0, 0, 1), c(1, 0, 1), u(fx)),
      l(c(0, 1, 1), c(1, 1, 1), u(fx)),
      u(fy),
    ),
    u(fz),
  );
}

const SCRAMBLE = "@#%*+=-:;.01xX/<>";

/**
 * Everything about the planet that doesn't change frame to frame, worked
 * out once per canvas size: each cell's place on the sphere, its light and
 * rim, and a table of the land noise around every row. The spin only turns
 * the sphere about its vertical axis, so a frame just looks up the land at
 * (longitude + spin), instead of two noise samples per character.
 */
type EarthCache = {
  w: number;
  h: number;
  dpr: number;
  cx: number;
  cy: number;
  xs: Float32Array;
  ys: Float32Array;
  rows: Uint16Array;
  lon: Float32Array;
  shade: Float32Array; // 0.25 + light
  rim: Float32Array; // rim * 0.9
  land: Float32Array[]; // per row, LON samples around the sphere
};
const CELL = 12;
const CW = CELL * 0.62;
const LON = 1024;
const FONT = `500 ${CELL - 1}px ui-monospace, SFMono-Regular, Menlo, monospace`;
const caches = new WeakMap<CanvasRenderingContext2D, EarthCache>();

function earthCache(w: number, h: number, dpr: number): EarthCache {
  const radius = Math.max(w, h) * 0.75;
  const cx = w / 2;
  // Phones: the panorama is a band above the text, so the planet's top
  // sits just under the cards (64% down), whatever the band's height.
  const cy = w < 640 ? h * 0.64 + radius : h + radius * 0.58;
  const xs: number[] = [];
  const ys: number[] = [];
  const rows: number[] = [];
  const lon: number[] = [];
  const shade: number[] = [];
  const rim: number[] = [];
  const rowNy: number[] = [];
  for (let y = 0, row = 0; y < h; y += CELL, row++) {
    const ny = (y - cy) / radius;
    rowNy.push(ny);
    for (let x = 0; x < w; x += CW) {
      const nx = (x - cx) / radius;
      const d2 = nx * nx + ny * ny;
      if (d2 > 1) continue;
      const nz = Math.sqrt(1 - d2);
      xs.push(x);
      ys.push(y);
      rows.push(row);
      lon.push(Math.atan2(nx, nz));
      shade.push(0.25 + Math.max(0, nx * -0.35 + ny * -0.75 + nz * 0.55));
      rim.push(Math.pow(1 - nz, 3) * 0.9);
    }
  }
  // Land noise around each row that has cells (rx, rz on a circle of
  // radius sqrt(1 - ny²)), sampled at LON longitudes.
  const used = new Set(rows);
  const land = rowNy.map((ny, row) => {
    const t = new Float32Array(used.has(row) ? LON : 0);
    const r = Math.sqrt(Math.max(0, 1 - ny * ny));
    for (let i = 0; i < t.length; i++) {
      const a = (i / LON) * Math.PI * 2;
      const rx = r * Math.sin(a);
      const rz = r * Math.cos(a);
      t[i] =
        noise3(rx * 3 + 10, ny * 3, rz * 3) * 0.65 +
        noise3(rx * 7, ny * 7, rz * 7) * 0.35;
    }
    return t;
  });
  return {
    w,
    h,
    dpr,
    cx,
    cy,
    xs: Float32Array.from(xs),
    ys: Float32Array.from(ys),
    rows: Uint16Array.from(rows),
    lon: Float32Array.from(lon),
    shade: Float32Array.from(shade),
    rim: Float32Array.from(rim),
    land,
  };
}

function drawEarth(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  spin: number,
  /** Cursor in canvas pixels, with 0–1 strength (fades in and out). */
  lamp: { x: number; y: number; k: number },
  dpr: number,
) {
  let c = caches.get(ctx);
  if (!c || c.w !== w || c.h !== h || c.dpr !== dpr) {
    c = earthCache(w, h, dpr);
    caches.set(ctx, c);
  }
  ctx.clearRect(0, 0, w, h);
  const radius = Math.max(w, h) * 0.75;
  const { cx, cy } = c;
  // Dark body behind the characters, so the ring is hidden by the planet.
  // It fades out past the rim, letting the cards sink softly behind it
  // instead of being cut by a hard edge.
  const outer = radius * 1.1;
  const body = ctx.createRadialGradient(cx, cy, 0, cx, cy, outer);
  body.addColorStop(0, "rgba(0,0,0,1)");
  body.addColorStop(0.8 / 1.1, "rgba(0,0,0,1)");
  body.addColorStop(0.95 / 1.1, "rgba(0,0,0,0.8)");
  body.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, w, h);

  const buckets: number[][] = ramp.split("").map(() => []);
  // Characters under the cursor: brighter, and some flicker to random glyphs.
  const lit: { x: number; y: number; a: number; c: string }[] = [];
  const reach = 150;
  const turn = (spin / (Math.PI * 2)) * LON;
  for (let k = 0; k < c.xs.length; k++) {
    // Longitude after the spin, as a fractional index into the row's table.
    let f = (c.lon[k] / (Math.PI * 2)) * LON + turn;
    f = ((f % LON) + LON) % LON;
    const i0 = f | 0;
    const t = c.land[c.rows[k]];
    const landV = t[i0] + (t[(i0 + 1) % LON] - t[i0]) * (f - i0);
    const v = Math.min(
      0.999,
      (landV > 0.52 ? 0.55 + landV * 0.5 : 0.12 + landV * 0.15) * c.shade[k] +
        c.rim[k],
    );
    const i = Math.floor(v * ramp.length);
    const x = c.xs[k];
    const y = c.ys[k];
    if (lamp.k > 0) {
      const d = Math.hypot(x - lamp.x, y - lamp.y);
      if (d < reach) {
        const fk = (1 - d / reach) ** 2 * lamp.k;
        const ch =
          Math.random() < fk * 0.35
            ? SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
            : ramp[Math.max(i, 2)];
        lit.push({ x, y, a: Math.min(1, 0.1 + i * 0.06 + fk * 0.8), c: ch });
        continue;
      }
    }
    if (i > 0) buckets[i].push(x, y);
  }
  ctx.font = FONT;
  ctx.textBaseline = "top";
  buckets.forEach((cells, i) => {
    if (!cells.length) return;
    ctx.fillStyle = `rgba(255,255,255,${0.08 + i * 0.06})`;
    for (let k = 0; k < cells.length; k += 2)
      ctx.fillText(ramp[i], cells[k], cells[k + 1]);
  });
  if (lit.length) {
    for (const l of lit) {
      ctx.fillStyle = `rgba(255,255,255,${l.a})`;
      ctx.fillText(l.c, l.x, l.y);
    }
  }
}

/* ------------------------------ Panorama ------------------------------ */

export function RantaiPanorama() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<HTMLCanvasElement>(null);
  // Screenshots wait for the page load, so they don't race the LCP image.
  const [shots, setShots] = useState(false);
  useEffect(() => {
    const show = () => setShots(true);
    if (document.readyState === "complete") show();
    else window.addEventListener("load", show, { once: true });
    return () => window.removeEventListener("load", show);
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const ring = ringRef.current;
    const canvas = earthRef.current;
    const ctx = canvas?.getContext("2d");
    if (!scene || !ring || !canvas || !ctx) return;
    // Phones get one still frame: the scene is drawn at desktop size and
    // scaled down, too costly to animate there.
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce), (max-width: 767px)",
    ).matches;
    // Every piece on the ring: screenshot strips and video panels.
    const strips = [...ring.querySelectorAll<HTMLElement>("[data-card]")];
    let seeded = false;
    let slots: number[] = [];
    let slotsFor = -1;
    let angles: number[] = [];
    let centres: number[] = []; // each strip's card centre angle
    let R = 1000;
    let dim = 1;
    let frame = 0;
    let lastNow = 0;
    let lastScroll = window.scrollY;
    let boost = 0;
    let rot = 0;
    let earthSpin = 0;
    let dragging = false;
    let dragX = 0;
    let dragVel = 0;
    let tiltX = 0;
    let tiltY = 0;
    let lampK = 0;
    const pointer = { x: -999, y: -999, tx: 0, ty: 0, inside: false };
    let lastEarth = 0;
    let visible = false;
    // Until the page has loaded and the browser is idle, the panorama is one
    // still frame: the spin, the planet and the videos wait, so they don't
    // compete with the first paint and hydration.
    let waiting = !reduce;
    // Last values written per strip, so styles are only touched on change.
    const shownWas: (boolean | null)[] = strips.map(() => null);
    const filterWas: string[] = strips.map(() => "");
    let originWas = "";
    let canvasWas = "";

    const layout = () => {
      const w = scene.clientWidth;
      const h = scene.clientHeight;
      // Camera sits at the ring's centre: perspective equals the radius.
      // Size by height: the front card runs from near the top down to the
      // buttons (about 68% of the hero).
      // Phones: a shorter card so the headline keeps a calm background.
      const narrow = w < 640;
      const cardH = h * (narrow ? 0.44 : 0.68);
      const cardW = cardH / ASPECT;
      R = Math.max(cardW * 1.4, w * 0.75);
      const gap = cardW * 0.07;
      // Fit a whole (even) number of cards around the ring so the last card
      // never lands on top of the first; extra cards are hidden.
      const fit = Math.max(
        2,
        Math.floor((Math.PI * 2 * R) / (cardW + gap) / 2) * 2,
      );
      const used = Math.min(CARDS, fit);
      const step = (Math.PI * 2) / used;
      const sliceW = cardW / STRIPS;
      const sliceA = sliceW / R;
      scene.style.perspective = `${R}px`;
      ring.style.top = `${h * (narrow ? 0.34 : 0.43)}px`;
      dim = narrow ? 0.55 : 1;
      angles = [];
      centres = [];
      // Start on a random card, so a returning visitor sees a different
      // product first.
      // A fresh random order per visit (and if the number of cards that fit
      // changes on resize).
      if (slotsFor !== used) {
        slots = arrange(used);
        slotsFor = used;
      }
      if (!seeded) {
        rot = Math.floor(Math.random() * used) * step;
        seeded = true;
      }
      strips.forEach((el) => {
        const card = Number(el.dataset.card);
        const slot = slots[card];
        el.dataset.off = slot >= used ? "1" : "";
        const item = items[card];
        if (!("shot" in item)) {
          // A video panel: one flat card at the card's angle.
          angles.push(slot * step);
          centres.push(slot * step);
          el.style.width = `${cardW}px`;
          el.style.height = `${cardH}px`;
          el.style.marginLeft = `${-cardW / 2}px`;
          el.style.marginTop = `${-cardH / 2}px`;
          el.style.borderRadius = "14px";
          return;
        }
        const shot = item.shot;
        const i = Number(el.dataset.strip);
        const a = slot * step + (i - STRIPS / 2 + 0.5) * sliceA;
        angles.push(a);
        centres.push(slot * step);
        el.style.width = `${sliceW + 2}px`;
        el.style.height = `${cardH}px`;
        el.style.marginLeft = `${-sliceW / 2}px`;
        el.style.marginTop = `${-cardH / 2}px`;
        el.style.backgroundSize = `${cardW * shot.size}px auto`;
        el.style.backgroundPosition = `${cardW * shot.x - i * sliceW}px ${cardH * shot.y}px`;
        el.style.borderRadius =
          i === 0 ? "14px 0 0 14px" : i === STRIPS - 1 ? "0 14px 14px 0" : "0";
      });
      // Each strip's place on the ring only changes with the layout.
      strips.forEach((el, k) => {
        el.style.transform = `rotateY(${-angles[k]}rad) translateZ(${-R}px)`;
      });
      shownWas.fill(null);
      filterWas.fill("");
      originWas = "";
      canvasWas = "";
      lastEarth = 0;
    };

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - (lastNow || now)) / 1000);
      lastNow = now;
      // Scroll speed briefly speeds up the spin, then it settles.
      const y = window.scrollY;
      const speed = Math.abs(y - lastScroll) / Math.max(dt, 0.016);
      lastScroll = y;
      boost += (Math.min(1.2, speed / 900) - boost) * 0.08;
      if (!reduce) {
        if (!dragging) {
          // Let go of a drag: glide on, then return to the idle drift.
          dragVel *= 0.94;
          rot += dragVel;
        }
        rot -= dt * (0.035 + boost * 0.25);
        earthSpin += dt * (0.06 + boost * 0.5);
      }
      // Read layout before writing any style, so the browser never has to
      // recalculate layout mid-frame.
      const away = Math.max(0, -scene.getBoundingClientRect().top);
      const earthRect = canvas.getBoundingClientRect();
      // Ease the cursor tilt and the lamp toward their targets.
      tiltX += (pointer.tx - tiltX) * 0.06;
      tiltY += (pointer.ty - tiltY) * 0.06;
      lampK += ((pointer.inside ? 1 : 0) - lampK) * 0.1;
      // Rounded, and only written on change: once the cursor settles these
      // stay the same, and an unchanged write still costs a style pass.
      const origin = `${(50 + tiltX * 10).toFixed(1)}% ${(50 + tiltY * 8).toFixed(1)}%`;
      if (origin !== originWas) {
        scene.style.perspectiveOrigin = origin;
        originWas = origin;
      }
      // Parallax as the hero scrolls away. It lives inside the 3D transform:
      // opacity or a separate translate here would flatten the ring.
      ring.style.transform = `translateY(${away * 0.12}px) translateZ(${R}px) rotateY(${rot}rad)`;
      const shift = `translate(${(-tiltX * 10).toFixed(1)}px, ${(away * 0.3 - tiltY * 6).toFixed(1)}px)`;
      if (shift !== canvasWas) {
        canvas.style.transform = shift;
        canvasWas = shift;
      }
      // Every strip of a card gets the same filter: work it out once per card.
      const cardFilter = new Map<number, string>();
      strips.forEach((el, k) => {
        const a = angles[k];
        // Angle from straight ahead, wrapped to [-π, π].
        // The strip ends up turned by (ring rotation - its own angle).
        let rel = (rot - a) % (Math.PI * 2);
        if (rel > Math.PI) rel -= Math.PI * 2;
        if (rel < -Math.PI) rel += Math.PI * 2;
        const shown = Math.abs(rel) < 1.2 && !el.dataset.off;
        if (shownWas[k] !== shown) {
          el.style.visibility = shown ? "visible" : "hidden";
          shownWas[k] = shown;
        }
        // Videos only play while their card is in view.
        const video = el.firstElementChild;
        if (video instanceof HTMLVideoElement) {
          const play = shown && !reduce && !waiting;
          if (play && video.paused) video.play().catch(() => {});
          else if (!play && !video.paused) video.pause();
        }
        if (!shown) return;
        // Dim toward the sides so the centre stays calm. Measured from the
        // card's centre, so every strip of a card gets the same filter and
        // no seams show between them.
        let filter = cardFilter.get(centres[k]);
        if (filter === undefined) {
          let cardRel = (rot - centres[k]) % (Math.PI * 2);
          if (cardRel > Math.PI) cardRel -= Math.PI * 2;
          if (cardRel < -Math.PI) cardRel += Math.PI * 2;
          // Rounded to 0.01: changing a filter repaints the strip, so only
          // write it when the change is visible.
          filter = `grayscale(1) brightness(${((0.75 - Math.min(0.35, Math.abs(cardRel) * 0.5)) * dim).toFixed(2)})`;
          cardFilter.set(centres[k], filter);
        }
        if (filterWas[k] !== filter) {
          el.style.filter = filter;
          filterWas[k] = filter;
        }
      });
      // The planet turns slowly: ~15 fps is enough on its own, ~30 while the
      // cursor lamp is on it so the glow follows the pointer closely.
      if (now - lastEarth > (lampK > 0.01 ? 33 : 66)) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (
          canvas.width !== Math.round(w * dpr) ||
          canvas.height !== Math.round(h * dpr)
        ) {
          canvas.width = Math.round(w * dpr);
          canvas.height = Math.round(h * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawEarth(
          ctx,
          w,
          h,
          earthSpin,
          {
            // The scene is scaled down: screen px back to canvas px.
            x: (pointer.x - earthRect.left) * (w / earthRect.width),
            y: (pointer.y - earthRect.top) * (h / earthRect.height),
            k: reduce ? 0 : lampK,
          },
          dpr,
        );
        lastEarth = now;
      }
      frame =
        visible && !reduce && !waiting ? requestAnimationFrame(render) : 0;
    };

    // Pointer: tilt and lamp follow the cursor; drag spins the panorama.
    // The dark hero card (the scene sits in a pointer-events-none wrapper).
    const card = scene.closest<HTMLElement>(".dark") ?? scene;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = card.getBoundingClientRect();
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      pointer.inside = true;
      if (dragging) {
        const dx = e.clientX - dragX;
        dragX = e.clientX;
        const step = (dx / Math.max(1, R)) * 1.2;
        rot += step;
        dragVel = step;
      }
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.tx = 0;
      pointer.ty = 0;
      dragging = false;
      card.style.cursor = "";
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if ((e.target as HTMLElement).closest("a,button,input,textarea")) return;
      dragging = true;
      dragX = e.clientX;
      dragVel = 0;
      card.style.cursor = "grabbing";
      card.style.userSelect = "none";
    };
    const onUp = () => {
      dragging = false;
      card.style.cursor = "";
      card.style.userSelect = "";
    };
    if (!reduce) {
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      card.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
    }

    layout();
    const ro = new ResizeObserver(() => {
      layout();
      if (!frame) frame = requestAnimationFrame(render);
    });
    ro.observe(scene);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(render);
    });
    io.observe(scene);
    frame = requestAnimationFrame(render);
    let idle = 0;
    const wake = () => {
      waiting = false;
      if (!frame) frame = requestAnimationFrame(render);
    };
    const afterLoad = () => {
      // Safari has no requestIdleCallback: a short timeout instead.
      idle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(wake, { timeout: 1500 })
          : (setTimeout(wake, 300) as unknown as number);
    };
    if (waiting) {
      if (document.readyState === "complete") afterLoad();
      else window.addEventListener("load", afterLoad, { once: true });
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", afterLoad);
      if (typeof window.cancelIdleCallback === "function")
        window.cancelIdleCallback(idle);
      clearTimeout(idle);
      ro.disconnect();
      io.disconnect();
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      aria-hidden="true"
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        ref={ringRef}
        className="absolute left-1/2 [transform-style:preserve-3d]"
      >
        {items.map((item, card) =>
          "shot" in item ? (
            Array.from({ length: STRIPS }, (_, i) => (
              <div
                key={`${card}-${i}`}
                data-card={card}
                data-strip={i}
                className="absolute top-0 left-0 bg-neutral-900 bg-no-repeat [backface-visibility:hidden]"
                style={
                  shots
                    ? { backgroundImage: `url(${item.shot.src})` }
                    : undefined
                }
              />
            ))
          ) : (
            <div
              key={card}
              data-card={card}
              className="absolute top-0 left-0 overflow-hidden bg-neutral-900 [backface-visibility:hidden]"
            >
              <video
                src={item.video}
                muted
                loop
                playsInline
                preload="metadata"
                className="size-full object-cover object-top-left"
              />
            </div>
          ),
        )}
      </div>
      <canvas ref={earthRef} className="absolute inset-0 size-full" />
      {/* Shade behind the headline and copy (on phones the text sits below
          the panorama, so it needs none) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_44%_30%_at_50%_58%,rgb(0_0_0/0.85),transparent)] max-sm:hidden" />
      <div className="absolute inset-x-0 top-0 h-[12%] bg-gradient-to-b from-black to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[12%] bg-gradient-to-t from-black/80 to-transparent" />
      {/* Quiet patch behind the partner logos */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_42%_14%_at_50%_90%,rgb(0_0_0/0.95)_40%,transparent)] max-sm:hidden" />
    </div>
  );
}
