"use client";
import { Button } from "@/components/ui/button";
import {
  Component,
  Plus,
  CircleFadingArrowUp,
  Play,
  PenTool,
  AppWindow,
  LayoutDashboard,
  Smartphone,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import TextType from "@/components/text-type";
import dayjs from "dayjs";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Release } from "@/types/release";

const GREETINGS = [
  "안녕",
  "Bro",
  "Ciao",
  "Hallo",
  "Halo",
  "Hej",
  "Hello",
  "Hi",
  "Hey",
  "Hola",
  "Nah",
  "Nǐ hǎo",
  "Oi",
  "Olá",
  "So",
  "Sup",
  "สวัสดี",
  "こんにちは",
  "你好",
  "السلام عليكم",
];

function getRandomIndex(max: number) {
  return Math.floor(Math.random() * max);
}

export default function Home() {
  const [greeting, setGreeting] = useState<string>("");
  const [versions, setVersions] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // simple heuristic: if device supports touch events, prefer Popover
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/home", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setVersions(data);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    setGreeting(GREETINGS[getRandomIndex(GREETINGS.length)]);
    run();
  }, []);

  return (
    <div className="relative mx-auto grid min-h-screen max-w-7xl grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-mono sm:p-20">
      <header className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <HoverCard>
            <HoverCardTrigger className="-ml-4" asChild>
              <Button
                variant={"ghost"}
                className="text-xl font-semibold sm:text-2xl"
              >
                requixite
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="font-mono leading-none font-medium">req·ui·xite</p>
              <p className="text-muted-foreground font-mono text-xs leading-none font-medium">
                /ˈrek.wə.zɪt/
              </p>
              <p className="mt-2 font-mono text-xs">
                something that is necessary, essential, or mandatory.
              </p>
            </HoverCardContent>
          </HoverCard>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-2">
                {loading && (
                  <Badge variant="outline" className="text-muted-foreground">
                    Loading...
                  </Badge>
                )}

                {!loading && error && (
                  <Badge variant="destructive" className="text-white">
                    Error{typeof error === "string" ? `: ${error}` : ""}
                  </Badge>
                )}

                {!loading && !error && versions?.[0]?.tag && (
                  <Badge variant="outline" className="text-muted-foreground">
                    {versions[0].tag}
                  </Badge>
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="py-1 pr-1 pl-4">
              <ScrollArea className="flex max-h-64 flex-col pr-3">
                {versions.map((v) => (
                  <div
                    key={v.tag}
                    className="flex items-center justify-between border-b py-2 last:border-0"
                  >
                    <p className="font-mono text-xs font-medium">{v.tag}</p>
                    <p className="text-muted-foreground font-mono text-xs">
                      {dayjs(v.released_at).format("DD MMM YYYY")}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </HoverCardContent>
          </HoverCard>
        </div>
        <AnimatedThemeToggler />
      </header>
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
              text={["UI Designer.", "Front-end Developer."]}
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

        {/* I CAN CREATE */}
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
            <CarouselButton
              items={ACTION_ITEMS}
              duration={5000}
              fixedWidth={false}
            />
          </motion.div>

          {/* YOUR UI COMPONENTS */}
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
            <CarouselButton
              items={PROJECT_ITEMS}
              duration={7000}
              fixedWidth={false}
            />
          </motion.div>

          {/* WITH FIGMA */}
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
            <CarouselButton
              items={TOOLS_ITEMS}
              duration={20000}
              fixedWidth={false}
            />
          </motion.div>
        </motion.div>
      </main>
      <footer className="text-muted-foreground row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
        <Button
          variant={"link"}
          size={"sm"}
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          rel="noopener noreferrer"
          asChild
        >
          <Link href="https://github.com/mtharreqq" target="_blank">
            github
          </Link>
        </Button>
        <Button
          variant={"link"}
          size={"sm"}
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          rel="noopener noreferrer"
          asChild
        >
          <Link href="https://x.com/tooreeq" target="_blank">
            x
          </Link>
        </Button>
        <Button
          variant={"link"}
          size={"sm"}
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          rel="noopener noreferrer"
          asChild
        >
          <Link href="https://www.linkedin.com/in/mtharreq/" target="_blank">
            linkedin
          </Link>
        </Button>
      </footer>
      <GridPattern
        width={55}
        height={55}
        x={-1}
        y={-1}
        className={cn(
          "-z-10 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
        )}
      />
    </div>
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

function CarouselButton({
  items,
  duration = 2000,
  fixedWidth = true,
}: CarouselButtonProps) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = useRef<ReturnType<typeof setInterval> | null>(null);

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
          onMouseEnter={() => {
            setPaused(true);
            if (t.current) {
              clearInterval(t.current);
              t.current = null;
            }
          }}
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
