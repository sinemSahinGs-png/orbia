"use client";

import { useEffect, useState } from "react";

const STAGES = [
  { id: "ox-today", label: "Bugün" },
  { id: "ox-map", label: "İmza" },
  { id: "ox-sky", label: "Ay" },
  { id: "ox-ritual", label: "Ritüel" },
  { id: "ox-pair", label: "Bağ" },
] as const;

type StageId = (typeof STAGES)[number]["id"];

/** Minimal celestial stage marks — not a large floating pill nav. */
export function ExperienceStageMarks() {
  const [active, setActive] = useState<StageId>("ox-today");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const ids = STAGES.map((s) => s.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (top?.target?.id && ids.includes(top.target.id as StageId)) {
          setActive(top.target.id as StageId);
        }
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.15, 0.35] },
    );
    els.forEach((el) => observer.observe(el));

    const footer = document.querySelector(".ox-footer-min, .ox-product");
    let footObs: IntersectionObserver | null = null;
    if (footer) {
      footObs = new IntersectionObserver(
        ([e]) => setHidden(!!e?.isIntersecting && (e.intersectionRatio ?? 0) > 0.18),
        { threshold: [0.15, 0.3] },
      );
      footObs.observe(footer);
    }

    return () => {
      observer.disconnect();
      footObs?.disconnect();
    };
  }, []);

  return (
    <div className={`ox-stages${hidden ? " is-hidden" : ""}`} aria-hidden>
      {STAGES.map((s) => (
        <span
          key={s.id}
          className={`ox-stages__dot${active === s.id ? " is-on" : ""}`}
          title={s.label}
        />
      ))}
    </div>
  );
}
