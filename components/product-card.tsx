"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import { formatGBP } from "@/lib/utils";
import { useCart } from "./cart-context";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  const [hover, setHover] = useState(false);
  const second = product.images[1];
  const defaultSize =
    product.sizes.find((s) => s === "M" || s === "50") ?? product.sizes[0];

  const onSale = product.compareAt && product.compareAt > product.price;
  const discount = onSale
    ? Math.round((1 - product.price / (product.compareAt as number)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col"
    >
      <Link
        href={`/product/${product.slug}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl border border-ink-line bg-ink-card"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-all duration-700 ease-out ${
            hover && second ? "opacity-0 scale-105" : "opacity-100 group-hover:scale-105"
          }`}
        />
        {second && (
          <Image
            src={second}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-opacity duration-700 ${
              hover ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
              {product.badge}
            </span>
          )}
          {onSale && (
            <span className="rounded-full bg-blood px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              −{discount}%
            </span>
          )}
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brass backdrop-blur">
            Low stock
          </span>
        )}

        {/* quick add */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              add(product, defaultSize);
            }}
            className="btn-light w-full !py-2.5 text-xs"
          >
            Quick add — {formatGBP(product.price)}
          </button>
        </div>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-bone-dim">
            {CATEGORY_META[product.category].label}
          </p>
          <Link
            href={`/product/${product.slug}`}
            className="mt-0.5 block text-sm font-semibold leading-tight hover:text-blood-glow"
          >
            {product.name}
          </Link>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{formatGBP(product.price)}</p>
          {onSale && (
            <p className="text-xs text-bone-dim line-through">
              {formatGBP(product.compareAt as number)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
