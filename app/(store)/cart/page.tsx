"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/components/cart-context";
import { formatGBP } from "@/lib/utils";

export default function CartPage() {
  const { lines, subtotal, shipping, total, setQty, remove } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (lines.length === 0) {
    return (
      <div className="container-kl grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <h1 className="display text-6xl text-bone-dim">Your bag is empty</h1>
          <p className="mt-4 text-bone-dim">
            Time to find something worth fighting in.
          </p>
          <Link href="/shop" className="btn-primary mt-8">
            Shop all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-kl py-12 sm:py-16">
      <h1 className="display mb-10 text-5xl sm:text-6xl">Your bag</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-ink-line border-y border-ink-line">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.li
                key={l.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: 40 }}
                className="flex gap-4 py-5"
              >
                <Link
                  href={`/product/${l.slug}`}
                  className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg border border-ink-line"
                >
                  <Image src={l.image} alt={l.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <Link
                      href={`/product/${l.slug}`}
                      className="font-semibold hover:text-blood-glow"
                    >
                      {l.name}
                    </Link>
                    <span className="font-semibold">{formatGBP(l.price * l.qty)}</span>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-wider text-bone-dim">
                    Size {l.size} · {formatGBP(l.price)} each
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-ink-line">
                      <button onClick={() => setQty(l.id, l.qty - 1)} className="grid h-9 w-9 place-items-center text-bone-dim hover:text-bone">−</button>
                      <span className="w-7 text-center text-sm">{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.qty + 1)} className="grid h-9 w-9 place-items-center text-bone-dim hover:text-bone">+</button>
                    </div>
                    <button
                      onClick={() => remove(l.id)}
                      className="text-xs uppercase tracking-wider text-bone-dim hover:text-blood"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card-surface p-6">
            <h2 className="font-display text-2xl uppercase tracking-tight">Summary</h2>
            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-bone-dim">Subtotal</dt>
                <dd>{formatGBP(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-bone-dim">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatGBP(shipping)}</dd>
              </div>
              {remaining > 0 && (
                <p className="text-xs text-bone-dim">
                  Spend {formatGBP(remaining)} more for free UK delivery.
                </p>
              )}
              <div className="flex justify-between border-t border-ink-line pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatGBP(total)}</dd>
              </div>
            </dl>
            <Link href="/checkout" className="btn-primary mt-6 w-full">
              Proceed to checkout
            </Link>
            <Link
              href="/shop"
              className="mt-2 block py-2 text-center text-xs uppercase tracking-wider text-bone-dim hover:text-bone"
            >
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
