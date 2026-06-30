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
        <span className="font-display text-2xl tracking-tight text-bone [text-shadow:0_0_12px_theme(colors.blood.glow),0_0_24px_theme(colors.blood.DEFAULT)] transition-[text-shadow] duration-300 group-hover:[text-shadow:0_0_18px_theme(colors.blood.glow),0_0_36px_theme(colors.blood.glow),0_0_54px_theme(colors.blood.DEFAULT)]">
          KAPTAN
        </span>
        <span className="text-xs font-semibold uppercase tracking-ultra text-blood-glow">
          Leather
        </span>
      </span>
    </Link>
  );
}