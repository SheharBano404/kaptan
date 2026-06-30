"use client";

import { motion } from "framer-motion";

const COLORS = ["#c1121f", "#e63946", "#c8a04a", "#f4f1ea"];
const PIECES = Array.from({ length: 36 }, (_, i) => i);

export function SuccessConfetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {PIECES.map((i) => {
        const left = (i * 53) % 100;
        const delay = (i % 9) * 0.08;
        const color = COLORS[i % COLORS.length];
        const rotate = (i % 2 ? 1 : -1) * (180 + (i % 5) * 60);
        return (
          <motion.span
            key={i}
            className="absolute top-0 block h-3 w-1.5 rounded-sm"
            style={{ left: `${left}%`, background: color }}
            initial={{ y: -40, opacity: 0, rotate: 0 }}
            animate={{ y: "85vh", opacity: [0, 1, 1, 0], rotate }}
            transition={{ duration: 2.4 + (i % 5) * 0.3, delay, ease: "easeIn" }}
          />
        );
      })}
    </div>
  );
}
