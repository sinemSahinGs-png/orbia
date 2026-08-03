"use client";

import { useEffect, useState } from "react";

/**
 * Hydration-safe reduced motion preference.
 * Starts false to match SSR, then syncs after mount.
 */
export function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
