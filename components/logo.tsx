import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Kaptan Leather home"
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-md bg-blood text-white shadow-[0_0_20px_-6px_theme(colors.blood.glow)] transition-transform duration-300 group-hover:rotate-[-8deg]">
        <Image
          src="/products/spiked-rebel.jpeg"
          alt="Kaptan Leather"
          fill
          sizes="48px"
          className="object-cover"
        />
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