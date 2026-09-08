import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { BrandHoverCard } from "@/components/brand-hover-card";
import { VersionBadge } from "@/components/version-badge";
import { RELEASES } from "@/data/releases";

export function HomeHeader() {
  return (
    <header className="flex w-full items-center justify-between">
      <div className="flex items-center">
        <BrandHoverCard />
        <VersionBadge versions={RELEASES} />
      </div>
      <AnimatedThemeToggler />
    </header>
  );
}
