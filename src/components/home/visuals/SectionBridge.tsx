"use client";

/**
 * Thin cinematic bridge between homepage sections.
 * Purely decorative — does not affect layout flow meaningfully.
 */
export function SectionBridge({ variant = "orbit" }: { variant?: "orbit" | "pulse" | "fade" | "line" }) {
  return (
    <div className={`ak-bridge ak-bridge--${variant}`} aria-hidden>
      <span className="ak-bridge__track" />
      <span className="ak-bridge__point" />
    </div>
  );
}
