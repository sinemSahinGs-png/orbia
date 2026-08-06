"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

export const OX_EASE = [0.22, 1, 0.36, 1] as const;

export const OX_DUR = {
  tap: 0.12,
  label: 0.4,
  body: 0.55,
  heading: 0.7,
  section: 0.65,
  chart: 0.95,
  count: 0.85,
  ring: 1.0,
  hero: 2.2,
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  blur?: boolean;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "section" | "span" | "nav";
  amount?: number;
};

/** Soft fade + rise. Content always settles visible. */
export function OxReveal({
  children,
  className = "",
  delay = 0,
  duration = OX_DUR.section,
  y = 16,
  blur = false,
  as = "div",
  amount = 0.2,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount });
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
      initial={{ opacity: 0.02, y, filter: blur ? "blur(6px)" : "blur(0px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0.02, y, filter: blur ? "blur(6px)" : "blur(0px)" }
      }
      transition={{ duration, delay, ease: OX_EASE }}
    >
      {children}
    </Tag>
  );
}

/** Masked vertical reveal for major headings. */
export function MaskedHeadingReveal({
  children,
  className = "",
  delay = 0,
  as = "h1",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
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
      initial={{ opacity: 0, y: 28, clipPath: "inset(0 0 100% 0)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }
          : { opacity: 0, y: 28, clipPath: "inset(0 0 100% 0)" }
      }
      transition={{ duration: OX_DUR.heading, delay, ease: OX_EASE }}
    >
      {children}
    </Tag>
  );
}

/** Line / phrase stagger for poetic or body blocks. */
export function LineStaggerReveal({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.1,
  as = "p",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "p" | "div";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotionSafe();
  const Tag = motion[as];

  if (reduced) {
    const Static = as;
    return (
      <Static className={className}>
        {lines.map((line, i) => (
          <span key={i} className={lineClassName} style={{ display: "block" }}>
            {line}
          </span>
        ))}
      </Static>
    );
  }

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className={lineClassName}
          style={{ display: "block" }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, delay: delay + i * stagger, ease: OX_EASE }}
        >
          {line}
        </motion.span>
      ))}
    </Tag>
  );
}

export function SceneLabelReveal({
  children,
  className = "ox-kicker",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <OxReveal className={className} delay={delay} duration={OX_DUR.label} y={8} as="p">
      {children}
    </OxReveal>
  );
}

export function FadeBodyReveal({
  children,
  className = "ox-body",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <OxReveal className={className} delay={delay} duration={OX_DUR.body} y={10} as="p">
      {children}
    </OxReveal>
  );
}

/** Back-compat aliases */
export function OxTextReveal({
  text,
  className = "",
  delay = 0,
  as = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  return (
    <MaskedHeadingReveal className={className} delay={delay} as={as}>
      {text}
    </MaskedHeadingReveal>
  );
}

export function Reveal(props: RevealProps) {
  return <OxReveal {...props} />;
}

export function RevealStagger({
  children,
  className = "",
}: {
  children: ReactNode[];
  className?: string;
  stagger?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <OxReveal key={i} delay={i * 0.08}>
          {child}
        </OxReveal>
      ))}
    </div>
  );
}

export function OxStagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "nav" | "ul";
}) {
  return <div className={className}>{children}</div>;
}
