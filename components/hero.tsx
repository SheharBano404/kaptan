"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[92vh] min-h-[600px] w-full overflow-hidden"
    >
      <motion.div style={{ y: yImg, scale: scaleImg }} className="absolute inset-0">
        <Image
          src="/products/spiked-rebel.jpeg"
          alt="Kaptan Leather hero jacket"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: yText, opacity }}
        className="container-kl relative flex h-full flex-col justify-end pb-20"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="eyebrow mb-4 text-blood-glow"
        >
          Birmingham · Est. 2025
        </motion.p>

        <h1 className="display max-w-4xl text-6xl sm:text-7xl lg:text-8xl">
          {["Worn by", "the bold."].map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }}
                className="block"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="mt-5 max-w-md text-base text-bone-dim"
        >
          Hand-finished leather jackets, track-grade racing suits and sublimated
          combat sportswear. Built in Britain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link href="/shop/leather-jackets" className="btn-primary">
            Shop leather
          </Link>
          <Link href="/shop" className="btn-ghost">
            Explore all
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-bone-dim sm:flex"
      >
        <span className="text-[10px] uppercase tracking-ultra">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="block h-8 w-px bg-bone-dim/50"
        />
      </motion.div>
    </section>
  );
}
