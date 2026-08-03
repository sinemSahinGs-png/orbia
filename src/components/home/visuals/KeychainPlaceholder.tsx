"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ZodiacGlyph } from "@/components/home/visuals/ZodiacGlyph";
import type { ZodiacSign } from "@/lib/zodiac/signs";

type Props = {
  sign: Pick<ZodiacSign, "nameTr" | "glyphPathHint" | "accentColor">;
  surface?: string;
  metal?: string;
  engraving?: string;
  className?: string;
};

export function KeychainPlaceholder({
  sign,
          surface = "#1A1F2C",
  metal = "#E4D7B0",
  engraving = "",
  className = "",
  size = "md",
}: Props & { size?: "md" | "lg" | "xl" }) {
  const reduced = useReducedMotion();
  const glyphSize = size === "xl" ? 78 : size === "lg" ? 68 : 56;

  return (
    <div className={`ak-keychain ak-keychain--${size} ${className}`.trim()} aria-hidden>
      <motion.div
        className="ak-keychain__ring"
        style={{ borderColor: metal }}
        animate={reduced ? undefined : { rotate: [0, 2, 0, -2, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="ak-keychain__body"
        style={{
          background: `linear-gradient(155deg, ${surface} 0%, #050609 55%, ${surface} 100%)`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), 0 28px 56px rgba(0,0,0,0.58), 0 0 0 1px ${metal}40`,
        }}
      >
        <div className="ak-keychain__grain" />
        <div className="ak-keychain__shine" />
        <div className="ak-keychain__glyph">
          <ZodiacGlyph sign={sign} size={glyphSize} />
        </div>
        {engraving ? <p className="ak-keychain__engrave">{engraving}</p> : null}
        <span className="ak-keychain__edge" style={{ background: metal }} />
      </div>
      <div className="ak-keychain__shadow" />
    </div>
  );
}
