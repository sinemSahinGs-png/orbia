"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/animation";

type Props = {
  heading: readonly string[] | string[];
  description: string;
  eyebrow?: string;
  className?: string;
  id?: string;
};

export function SectionHeading({ heading, description, eyebrow, className = "", id }: Props) {
  const reduced = useReducedMotion();
  const lines: string[] = [...heading];

  return (
    <motion.header
      className={`ak-section-heading ${className}`.trim()}
      initial={reduced ? false : { opacity: 0.92, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -6% 0px" }}
      transition={{ duration: reduced ? 0 : 0.55, ease: EASE_OUT }}
    >
      {eyebrow ? <p className="ak-eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="ak-heading">
        {lines.map((line) => (
          <span key={line} className="ak-heading__line">
            {line}
          </span>
        ))}
      </h2>
      <p className="ak-body">{description}</p>
    </motion.header>
  );
}
