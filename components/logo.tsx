import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Kaptan Leather home"
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-md bg-blood text-white shadow-[0_0_20px_-6px_theme(colors.blood.glow)] transition-transform duration-300 group-hover:rotate-[-8deg]">
        <span className="font-display text-xl leading-none">K</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg tracking-tight">KAPTAN</span>
        <span className="text-[10px] font-semibold uppercase tracking-ultra text-bone-dim">
          Leather
        </span>
      </span>
    </Link>
  );
}
