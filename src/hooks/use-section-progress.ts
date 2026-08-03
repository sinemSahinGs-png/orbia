"use client";

import { useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

export type SectionProgress = {
  ref: React.RefObject<HTMLElement | null>;
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
};

/**
 * Shared scroll progress for a section — avoids per-card scroll listeners.
 */
export function useSectionProgress(offset?: ["start end", "end start"]): SectionProgress {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset ?? ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.35, 1, 1, 0.45]);

  return { ref, progress: scrollYProgress, opacity };
}
