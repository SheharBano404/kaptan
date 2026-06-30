"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Category, Product } from "@/lib/types";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/types";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "A–Z" },
];

export function ShopGrid({
  products,
  activeCategory,
}: {
  products: Product[];
  activeCategory?: Category;
}) {
  const [sort, setSort] = useState<Sort>("featured");

  const list = useMemo(() => {
    const arr = [...products];
    switch (sort) {
      case "price-asc":
        arr.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        arr.sort((a, b) => b.price - a.price);
        break;
      case "name":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        arr.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return arr;
  }, [products, sort]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterChip href="/shop" active={!activeCategory}>
            All
          </FilterChip>
          {CATEGORY_ORDER.map((c) => (
            <FilterChip
              key={c}
              href={`/shop/${c}`}
              active={activeCategory === c}
            >
              {CATEGORY_META[c].label}
            </FilterChip>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-bone-dim">{list.length} items</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="appearance-none rounded-full border border-ink-line bg-ink-soft py-2 pl-4 pr-9 text-sm outline-none focus:border-blood"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-bone-dim">
              ▾
            </span>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="py-20 text-center text-bone-dim">No products found.</p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
        >
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition",
        active
          ? "border-blood bg-blood text-white"
          : "border-ink-line text-bone-dim hover:border-bone hover:text-bone"
      )}
    >
      {children}
    </Link>
  );
}
