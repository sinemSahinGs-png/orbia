"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Parallax = { x: number; y: number };

/**
 * Pointer parallax for desktop only. Disabled on touch and reduced motion.
 */
export function usePointerParallax(strength = 12) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState<Parallax>({ x: 0, y: 0 });
  const reduced = useReducedMotionSafe();
  const frame = useRef(0);
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current =
      !reduced &&
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;
  }, [reduced]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled.current) return;
      const el = ref.current;
      if (!el) return;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        setOffset({ x: nx * strength, y: ny * strength });
      });
    },
    [strength],
  );

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return { ref, offset, onPointerMove, onPointerLeave };
}
