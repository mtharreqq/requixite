"use client";

// React
import { useEffect, useState } from "react";

// Next.js
import Image from "next/image";

// Third-party
import { motion, AnimatePresence } from "framer-motion";
import {
  AppWindow,
  CircleFadingArrowUp,
  Component,
  LayoutDashboard,
  PenTool,
  Play,
  Plus,
  Smartphone,
} from "lucide-react";

// UI components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Local components
import TextType from "@/components/text-type";

// Data & types
import { GREETINGS } from "@/data/greetings";

export function HomeMain() {
  const [greeting, setGreeting] = useState<string>("");
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  }, []);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return (
    <main className="row-start-2 flex w-full flex-col items-start gap-4 md:items-center md:text-2xl">
      <div className="flex flex-wrap items-center justify-start gap-2 text-lg md:justify-start md:text-2xl">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          {greeting},
        </motion.span>
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="inline-flex items-center gap-2"
        >
          {isTouch ? (
            <Popover>
              <PopoverTrigger asChild>
                <p className="cursor-pointer underline decoration-red-300 decoration-wavy hover:decoration-red-500 dark:decoration-red-700 dark:hover:decoration-red-500">
                  I&apos;am
                </p>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                className="bg-background flex w-fit items-center gap-2 py-2 pl-2"
              >
                <Avatar className="size-5 sm:size-8">
                  <AvatarImage src="/avatar.jpg" alt="@mtharreq" />
                  <AvatarFallback className="text-primary">ME</AvatarFallback>
                </Avatar>
                <p className="font-mono sm:text-lg">@mtharreq</p>
              </PopoverContent>
            </Popover>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="cursor-pointer underline decoration-red-300 decoration-wavy hover:decoration-red-500 dark:decoration-red-700 dark:hover:decoration-red-500">
                  I&apos;am
                </p>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-2 pl-2">
                <Avatar className="size-5 sm:size-8">
                  <AvatarImage src="/avatar.jpg" alt="@mtharreq" />
                  <AvatarFallback className="text-primary">ME</AvatarFallback>
                </Avatar>
                <p className="font-mono sm:text-lg">@mtharreq</p>
              </TooltipContent>
            </Tooltip>
          )}
          a{" "}
          <TextType
            text={["Product Engineer.", "UI/UX Designer.", "Full-stack Developer."]}
            typingSpeed={75}
            initialDelay={1200}
            pauseDuration={10_000}
            showCursor={true}
            cursorCharacter="▎"
            className="font-semibold"
            textColors={["hsl(var(--foreground))"]}
            cursorClassName="text-border dark:text-white"
          />
        </motion.span>
      </div>

      <motion.div className="flex flex-col flex-wrap justify-start gap-2 text-lg md:flex-row md:justify-start md:text-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 1, x: "-50%" }}
          animate={{ opacity: 1, scale: 1, x: "0%" }}
          transition={{
            duration: 0.8,
            delay: 3,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="flex items-center gap-2"
        >
          I can
          <CarouselButton items={ACTION_ITEMS} duration={5000} fixedWidth={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: "-20%" }}
          animate={{ opacity: 1, scale: 1, x: "0%" }}
          transition={{
            duration: 0.5,
            delay: 4,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="flex items-center gap-2"
        >
          <span>
            your<span className="invisible md:hidden">_</span>
          </span>
          <CarouselButton items={PROJECT_ITEMS} duration={7000} fixedWidth={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: "-20%" }}
          animate={{ opacity: 1, scale: 1, x: "0%" }}
          transition={{
            duration: 0.5,
            delay: 4.8,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="flex items-center gap-2"
        >
          <span>
            with<span className="invisible md:hidden">_</span>
          </span>
          <CarouselButton items={TOOLS_ITEMS} duration={20000} fixedWidth={false} />
        </motion.div>
      </motion.div>

      {/* Brand Ethos & Studio Descriptor */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 5.4,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="mt-6 flex flex-col items-start gap-1.5 font-mono text-xs md:items-center"
      >
        <div className="flex items-center gap-2 text-foreground/90 font-medium tracking-wide">
          <span>Precise.</span>
          <span className="text-muted-foreground/30">•</span>
          <span>Exquisite.</span>
          <span className="text-muted-foreground/30">•</span>
          <span>Requisite.</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Independent product and web studio by Tharreq
        </p>
      </motion.div>
    </main>
  );
}

function handleUrlClick(url: string) {
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

type CarouselItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }> | string;
  variant?: "black" | "gray" | "purple" | "yellow" | "green" | "blue";
  onClick?: () => void;
};

const ACTION_ITEMS: CarouselItem[] = [
  { label: "Create", icon: Plus },
  { label: "Design", icon: PenTool },
  { label: "Upscale", icon: CircleFadingArrowUp },
  { label: "Prototype", icon: Play },
];

const PROJECT_ITEMS: CarouselItem[] = [
  { label: "UI Components", icon: Component, variant: "purple" },
  { label: "Landing Page", icon: AppWindow, variant: "yellow" },
  { label: "Dashboard View", icon: LayoutDashboard, variant: "green" },
  { label: "Mobile App", icon: Smartphone, variant: "blue" },
];

const TOOLS_ITEMS: CarouselItem[] = [
  {
    label: "Figma",
    icon: "/logomark/figma.png",
    variant: "black",
    onClick: () => handleUrlClick("https://www.figma.com"),
  },
  {
    label: "Next.js",
    icon: "/logomark/next.png",
    variant: "gray",
    onClick: () => handleUrlClick("https://nextjs.org/"),
  },
  {
    label: "Vue.js",
    icon: "/logomark/vue.png",
    variant: "gray",
    onClick: () => handleUrlClick("https://vuejs.org/"),
  },
  {
    label: "React",
    icon: "/logomark/react.png",
    variant: "gray",
    onClick: () => handleUrlClick("https://react.dev/"),
  },
];

type CarouselButtonProps = Readonly<{
  items: CarouselItem[];
  duration?: number;
  fixedWidth?: boolean;
}>;

function CarouselButton({ items, duration = 2000, fixedWidth = true }: CarouselButtonProps) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setI((v) => (v + 1) % items.length);
    }, duration);
    return () => window.clearInterval(id);
  }, [paused, duration, items.length]);

  const active = items[i];
  const Icon = active.icon;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={active.label}
        initial={{ y: "-100%", opacity: 0, scale: 0.9 }}
        animate={{ y: "0%", opacity: 1, scale: 1 }}
        exit={{ y: "100%", opacity: 0, scale: 0.9 }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 40,
          mass: 0.6,
        }}
      >
        <Button
          size="badge"
          variant={active.variant || "gray"}
          onClick={active.onClick}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {typeof active.icon === "string" ? (
            <Image
              src={active.icon}
              alt={`${active.label} logomark`}
              width={22}
              height={22}
            />
          ) : (
            <Icon className="size-4 sm:size-5" />
          )}
          {fixedWidth ? (
            <span className="relative flex items-center">
              <span className="inline-grid">
                <span className="invisible">
                  {items.map((it) => (
                    <span key={it.label} className="block">
                      {it.label}
                    </span>
                  ))}
                </span>
              </span>
              <span className="absolute left-0">{active.label}</span>
            </span>
          ) : (
            <span>{active.label}</span>
          )}
        </Button>
      </motion.span>
    </AnimatePresence>
  );
}
