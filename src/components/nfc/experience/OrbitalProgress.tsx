"use client";

import { useEffect, useState } from "react";

/** Minimal orbital page-progress indicator (scroll %). */
export function OrbitalProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const r = 14;
  const c = 2 * Math.PI * r;
  const dash = (p * c).toFixed(2);

  return (
    <div className="ox-progress" aria-hidden>
      <svg viewBox="0 0 36 36" width="36" height="36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(146,150,159,0.25)" strokeWidth="1.2" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke="rgba(200,155,74,0.85)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 18 18)"
        />
        <circle cx="18" cy="18" r="2.2" fill="rgba(240,232,218,0.7)" />
      </svg>
    </div>
  );
}
