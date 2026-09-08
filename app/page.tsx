import { HomeMain } from "@/components/home-main";
import { GridPattern } from "@/components/ui/grid-pattern";
import { HomeDock } from "@/components/home-dock";
import { HomeHeader } from "@/components/home-header";
import { cn } from "@/lib/utils";
import { PROJECTS } from "@/data/projects";

export default function Home() {
  const publishedProjects = PROJECTS.filter((p) => p.published);

  return (
    <div className="relative mx-auto grid min-h-screen max-w-7xl grid-rows-[20px_1fr] items-center justify-items-center gap-16 p-8 pb-28 font-mono sm:p-20 sm:pb-28">
      <HomeHeader />
      <HomeMain />
      <GridPattern
        width={55}
        height={55}
        x={-1}
        y={-1}
        className={cn(
          "-z-10 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
        )}
      />
      <HomeDock projects={publishedProjects} />
    </div>
  );
}
