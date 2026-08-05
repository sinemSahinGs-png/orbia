"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "section";
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Soft rise — no opacity gate (IO miss must not hide content). */
export function Reveal({ children, className = "", delay = 0, as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const reduced = useReducedMotionSafe();
  const Tag = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Tag
      ref={ref as never}
      className={className}
      initial={{ y: 10 }}
      animate={inView ? { y: 0 } : { y: 0 }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

export function RevealStagger({
  children,
  className = "",
  stagger = 0.07,
}: {
  children: ReactNode[];
  className?: string;
  stagger?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * stagger}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
