import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Kaptan Leather home"
      className={cn(
        "group flex items-center gap-3.5",
        className
      )}
    >
      {/* Mark */}
      <span
        className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden
          rounded-md border border-ink-line bg-ink-card
          transition-all duration-300 ease-out
          group-hover:border-gold/60"
      >
        <Image
          src="/products/spiked-rebel.jpeg"
          alt="Kaptan Leather"
          fill
          sizes="48px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
        />
      </span>

      {/* Wordmark */}
      <span className="flex flex-col leading-none">
        <span className="flex items-baseline gap-2">
          <span className="font-display text-[26px] uppercase tracking-tight text-bone sm:text-[28px]">
            Kaptan
          </span>
          <span className="h-[3px] w-[3px] rounded-full bg-gold" />
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.32em] text-bone-dim">
          Leather
        </span>
      </span>
    </Link>
  );
}