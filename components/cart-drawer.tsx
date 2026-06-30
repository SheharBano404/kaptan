"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart, FREE_SHIPPING_THRESHOLD } from "./cart-context";
import { formatGBP } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, close, lines, subtotal, shipping, total, setQty, remove } =
    useCart();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-ink-line bg-ink-soft"
          >
            <div className="flex items-center justify-between border-b border-ink-line px-5 py-4">
              <h2 className="font-display text-2xl uppercase tracking-tight">
                Your Bag
              </h2>
              <button
                onClick={close}
                className="grid h-9 w-9 place-items-center rounded-full border border-ink-line hover:border-bone"
                aria-label="Close cart"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {lines.length > 0 && (
              <div className="border-b border-ink-line px-5 py-3">
                <p className="mb-2 text-xs text-bone-dim">
                  {remaining > 0 ? (
                    <>
                      Add <strong className="text-bone">{formatGBP(remaining)}</strong>{" "}
                      for free UK delivery
                    </>
                  ) : (
                    <span className="text-blood-glow">
                      ✓ You’ve unlocked free UK delivery
                    </span>
                  )}
                </p>
                <div className="h-1.5 overflow-hidden rounded-full bg-ink-line">
                  <motion.div
                    className="h-full bg-blood"
                    initial={false}
                    animate={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <p className="font-display text-3xl text-bone-dim">Empty</p>
                    <p className="mt-2 text-sm text-bone-dim">
                      Nothing in your bag yet.
                    </p>
                    <button onClick={close} className="btn-primary mt-6">
                      Start shopping
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-3"
                      >
                        <Link
                          href={`/product/${l.slug}`}
                          onClick={close}
                          className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-ink-line bg-ink"
                        >
                          <Image
                            src={l.image}
                            alt={l.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <Link
                              href={`/product/${l.slug}`}
                              onClick={close}
                              className="text-sm font-semibold leading-tight hover:text-blood-glow"
                            >
                              {l.name}
                            </Link>
                            <button
                              onClick={() => remove(l.id)}
                              className="text-bone-dim hover:text-blood"
                              aria-label="Remove"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                                <path
                                  d="M6 6l12 12M18 6L6 18"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                          <p className="mt-0.5 text-xs uppercase tracking-wider text-bone-dim">
                            Size {l.size}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border border-ink-line">
                              <button
                                onClick={() => setQty(l.id, l.qty - 1)}
                                className="grid h-8 w-8 place-items-center text-bone-dim hover:text-bone"
                                aria-label="Decrease"
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-sm">{l.qty}</span>
                              <button
                                onClick={() => setQty(l.id, l.qty + 1)}
                                className="grid h-8 w-8 place-items-center text-bone-dim hover:text-bone"
                                aria-label="Increase"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-sm font-semibold">
                              {formatGBP(l.price * l.qty)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-ink-line px-5 py-4">
                <div className="mb-1 flex justify-between text-sm text-bone-dim">
                  <span>Subtotal</span>
                  <span className="text-bone">{formatGBP(subtotal)}</span>
                </div>
                <div className="mb-3 flex justify-between text-sm text-bone-dim">
                  <span>Shipping</span>
                  <span className="text-bone">
                    {shipping === 0 ? "Free" : formatGBP(shipping)}
                  </span>
                </div>
                <div className="mb-4 flex justify-between border-t border-ink-line pt-3 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatGBP(total)}</span>
                </div>
                <Link href="/checkout" onClick={close} className="btn-primary w-full">
                  Checkout
                </Link>
                <button
                  onClick={close}
                  className="mt-2 w-full py-2 text-center text-xs uppercase tracking-wider text-bone-dim hover:text-bone"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
