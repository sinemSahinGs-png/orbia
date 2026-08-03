"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ZodiacSign } from "@/lib/zodiac/signs";

type Props = {
  sign: Pick<ZodiacSign, "nameTr" | "glyphPathHint" | "accentColor">;
  size?: number;
  draw?: boolean;
  className?: string;
};

export function ZodiacGlyph({ sign, size = 48, draw = true, className = "" }: Props) {
  const reduced = useReducedMotion();
  const shouldDraw = draw && !reduced;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      focusable="false"
    >
      <motion.path
        d={sign.glyphPathHint}
        stroke={sign.accentColor}
        strokeWidth={1.35}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={shouldDraw ? { pathLength: 0.15, opacity: 0.85 } : { pathLength: 1, opacity: 1 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: shouldDraw ? 0.9 : 0, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
