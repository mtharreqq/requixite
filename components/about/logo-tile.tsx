"use client";

import Image from "next/image";
import { m } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const LOGOS = {
  figma: ["Figma", "https://www.figma.com", "/logomark/figma.png"],
  next: ["Next.js", "https://nextjs.org", "/logomark/next.png"],
  react: ["React", "https://react.dev", "/logomark/react.png"],
  vue: ["Vue", "https://vuejs.org", "/logomark/vue.png"],
  telkomsigma: [
    "Telkomsigma",
    "https://www.telkomsigma.co.id",
    "/logos/telkomsigma.png",
  ],
  telkomuniversity: [
    "Telkom University",
    "https://telkomuniversity.ac.id",
    "/logos/telkomuniversity.png",
  ],
  rantai: ["RantAI", "https://rantai.dev", "/logos/rantai.png"],
  claude: ["Claude", "https://claude.ai", "/ai-logos/claude.svg"],
  cursor: ["Cursor", "https://cursor.com", "/ai-logos/cursor.svg"],
} as const;

// RantAI home-solution: the tile pops in tilted, a spring for the one-off.
const spring = { type: "spring", stiffness: 380, damping: 20 } as const;

/** A logo after its word, tilted like the home story's tiles. It links to
 * the thing it names; hover tells you where first. */
export function LogoTile({ logo, i }: { logo: string; i: number }) {
  const hit = LOGOS[logo as keyof typeof LOGOS];
  if (!hit) return null;
  const [name, href, src] = hit;
  const host = new URL(href).hostname.replace(/^www\./, "");
  const rotate = i % 2 ? 6 : -6;
  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <m.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name}, ${host}`}
          data-reveal
          className="tap-area mx-[0.2em] inline-flex size-[1.2em] items-center justify-center rounded-[0.28em] bg-white align-[-0.25em] shadow-[0_0.08em_0.2em_rgba(0,0,0,0.18)] ring-[0.04em] ring-white print:shadow-none"
          initial={{ opacity: 0, scale: 0, rotate: rotate - 30 }}
          whileInView={{
            opacity: 1,
            scale: 1,
            rotate,
            transition: { ...spring, delay: (i % 4) * 0.06 },
          }}
          whileHover={{ scale: 1.18, rotate: 0, y: "-0.1em" }}
          whileFocus={{ scale: 1.18, rotate: 0, y: "-0.1em" }}
          whileTap={{ scale: 0.95 }}
          viewport={{ once: true, amount: 1 }}
          transition={spring}
        >
          <Image
            src={src}
            alt=""
            width={48}
            height={48}
            className="size-[0.72em] object-contain"
          />
        </m.a>
      </TooltipTrigger>
      <TooltipContent sideOffset={6} className="flex items-center gap-1.5">
        <span className="font-medium">{name}</span>
        <span className="opacity-60">{host} ↗</span>
      </TooltipContent>
    </Tooltip>
  );
}
