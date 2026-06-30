"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import { formatGBP } from "@/lib/utils";
import { useCart } from "./cart-context";

export function ProductView({ product }: { product: Product }) {
  const { add } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("details");

  const onSale = product.compareAt && product.compareAt > product.price;

  function handleAdd() {
    if (!size) {
      setErr(true);
      return;
    }
    add(product, size, qty);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Gallery */}
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        {product.images.length > 1 && (
          <div className="flex gap-3 sm:flex-col">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImg(i)}
                className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border transition ${
                  activeImg === i ? "border-blood" : "border-ink-line opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl border border-ink-line bg-ink-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImg}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Info */}
      <div className="lg:py-4">
        <p className="eyebrow text-blood-glow">
          {CATEGORY_META[product.category].label}
        </p>
        <h1 className="display mt-2 text-4xl sm:text-5xl">{product.name}</h1>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-semibold">{formatGBP(product.price)}</span>
          {onSale && (
            <>
              <span className="text-lg text-bone-dim line-through">
                {formatGBP(product.compareAt as number)}
              </span>
              <span className="rounded-full bg-blood px-2.5 py-1 text-xs font-bold uppercase text-white">
                Sale
              </span>
            </>
          )}
        </div>

        <p className="mt-5 text-bone-dim">{product.description}</p>

        {product.colors && product.colors.length > 0 && (
          <p className="mt-5 text-sm">
            <span className="text-bone-dim">Colour: </span>
            <span className="font-medium">{product.colors[0]}</span>
          </p>
        )}

        {/* Sizes */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="label mb-0">Select size</span>
            <button className="text-xs text-bone-dim underline-offset-2 hover:underline">
              Size guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSize(s);
                  setErr(false);
                }}
                className={`min-w-12 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  size === s
                    ? "border-blood bg-blood text-white"
                    : "border-ink-line hover:border-bone"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {err && (
            <p className="mt-2 text-xs text-blood-glow">
              Please select a size first.
            </p>
          )}
        </div>

        {/* Qty + add */}
        <div className="mt-6 flex gap-3">
          <div className="flex items-center rounded-full border border-ink-line">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-12 w-12 place-items-center text-lg text-bone-dim hover:text-bone"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="grid h-12 w-12 place-items-center text-lg text-bone-dim hover:text-bone"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="btn-primary flex-1 !py-3.5"
          >
            {product.stock === 0 ? "Sold out" : `Add to bag · ${formatGBP(product.price * qty)}`}
          </button>
        </div>

        <p className="mt-3 text-xs text-bone-dim">
          {product.stock > 0
            ? product.stock <= 5
              ? `Only ${product.stock} left — order soon`
              : "In stock · ships within 2 business days"
            : "Currently sold out"}
        </p>

        {/* Accordions */}
        <div className="mt-8 divide-y divide-ink-line border-y border-ink-line">
          <Accordion
            title="Details & materials"
            id="details"
            open={openSection === "details"}
            onToggle={setOpenSection}
          >
            <ul className="space-y-1.5 text-sm text-bone-dim">
              {product.details.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-blood">›</span>
                  {d}
                </li>
              ))}
            </ul>
          </Accordion>
          <Accordion
            title="Shipping & returns"
            id="shipping"
            open={openSection === "shipping"}
            onToggle={setOpenSection}
          >
            <p className="text-sm text-bone-dim">
              Free UK delivery on orders over £150. Standard delivery £6.99,
              2–4 working days. 30-day easy returns on unworn items with tags.
            </p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function Accordion({
  title,
  id,
  open,
  onToggle,
  children,
}: {
  title: string;
  id: string;
  open: boolean;
  onToggle: (id: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="py-4">
      <button
        onClick={() => onToggle(open ? null : id)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-semibold uppercase tracking-wider">{title}</span>
        <span className={`transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
