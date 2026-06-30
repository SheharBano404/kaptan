"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./cart-context";
import { Logo } from "./logo";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-ink-line bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-kl flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <ul className="hidden items-center gap-7 lg:flex">
            {CATEGORY_ORDER.map((c) => (
              <li key={c}>
                <Link
                  href={`/shop/${c}`}
                  className="link-underline text-sm font-medium text-bone/90 hover:text-bone"
                >
                  {CATEGORY_META[c].label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/shop"
                className="link-underline text-sm font-medium text-bone/90 hover:text-bone"
              >
                All
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/admin"
            className="hidden rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wider text-bone-dim transition hover:text-bone sm:block"
          >
            Admin
          </Link>
          <button
            onClick={open}
            className="group relative inline-flex items-center gap-2 rounded-full border border-ink-line px-4 py-2 text-sm font-semibold transition hover:border-bone hover:bg-white/5"
            aria-label="Open cart"
          >
            <CartIcon />
            <span className="hidden sm:inline">Cart</span>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-blood px-1 text-[11px] font-bold text-white"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            className="ml-1 grid h-10 w-10 place-items-center rounded-full border border-ink-line lg:hidden"
            aria-label="Open menu"
          >
            <BurgerIcon />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-kl flex h-16 items-center justify-between">
              <Logo />
              <button
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-ink-line"
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>
            <ul className="container-kl mt-6 flex flex-col gap-1">
              {[...CATEGORY_ORDER].map((c, i) => (
                <motion.li
                  key={c}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={`/shop/${c}`}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-ink-line py-4 font-display text-3xl uppercase tracking-tight"
                  >
                    {CATEGORY_META[c].label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Link
                  href="/shop"
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-ink-line py-4 font-display text-3xl uppercase tracking-tight text-blood"
                >
                  Shop All
                </Link>
              </motion.li>
              <li>
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 text-sm uppercase tracking-ultra text-bone-dim"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 7h12l-1 13H7L6 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 7a3 3 0 0 1 6 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BurgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
