import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Kaptan Leather home"
      className={cn("group flex items-center gap-3.5", className)}
    >
      {/* Image block — sharp brutalist edges, hard offset shadow */}
      <span
        className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden
          border-2 border-bone bg-ink-card
          shadow-[5px_5px_0_0_theme(colors.blood.DEFAULT)]
          transition-all duration-200 ease-out
          group-hover:-translate-x-0.5 group-hover:-translate-y-0.5
          group-hover:shadow-[8px_8px_0_0_theme(colors.blood.glow)]
          group-hover:-rotate-2"
      >
        <Image
          src="/products/spiked-rebel.jpeg"
          alt="Kaptan Leather"
          fill
          sizes="64px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* scanline sweep on hover */}
        <span className="logo-scan pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-blood-glow/0 via-blood-glow/40 to-blood-glow/0" />
      </span>

      <span className="flex flex-col items-stretch leading-[0.85]">
        <span
          data-text="KAPTAN"
          className="logo-glitch font-display text-xl uppercase tracking-tight text-bone
            [-webkit-text-stroke:1px_theme(colors.ink.DEFAULT)]
            sm:text-4xl"
        >
          KAPTAN
        </span>
        <span
          className="mt-2 inline-block w-full border border-blood-glow/70 bg-blood/90
            px-2.5 py-0.5 text-center text-[10px] font-bold uppercase tracking-ultra text-white
            transition-colors duration-200 group-hover:bg-blood-glow"
        >
          Leather
        </span>
      </span>
    </Link>
  );
}