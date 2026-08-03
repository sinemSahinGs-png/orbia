"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import { SectionHeading } from "@/components/home/visuals/SectionHeading";
import { ZodiacGlyph } from "@/components/home/visuals/ZodiacGlyph";
import { ConstellationSvg } from "@/components/home/visuals/ConstellationSvg";
import { zodiacCollectionContent } from "@/content/home";
import { ELEMENT_LABELS, ZODIAC_COLLECTION } from "@/content/zodiac";
import { usePointerParallax } from "@/hooks/use-pointer-parallax";
import { EASE_OUT } from "@/lib/animation";

function ZodiacCard({
  nameTr,
  dateRange,
  element,
  accentColor,
  identity,
  productRoute,
  constellation,
  glyphPathHint,
  index,
  active,
}: (typeof ZODIAC_COLLECTION)[number] & { index: number; active: boolean }) {
  const reduced = useReducedMotion();
  const { ref, offset, onPointerMove, onPointerLeave } = usePointerParallax(10);

  return (
    <motion.article
      ref={ref as React.RefObject<HTMLElement>}
      className={`ak-zodiac-card${active ? " is-active" : ""}`}
      data-index={index}
      style={
        {
          "--sign-accent": accentColor,
          transform: reduced
            ? undefined
            : `perspective(900px) rotateX(${-offset.y * 0.4}deg) rotateY(${offset.x * 0.4}deg)`,
        } as React.CSSProperties
      }
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      initial={reduced ? false : { opacity: 0.85, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: "40px 0px" }}
      transition={{ duration: 0.55, ease: EASE_OUT, delay: reduced ? 0 : (index % 3) * 0.03 }}
    >
      <div className="ak-zodiac-card__ring" aria-hidden style={{ borderColor: `${accentColor}55` }} />
      <div className="ak-zodiac-card__grain" aria-hidden />
      <div className="ak-zodiac-card__constellation" aria-hidden>
        <ConstellationSvg data={constellation} color={`${accentColor}aa`} />
      </div>
      <div className="ak-zodiac-card__sweep" aria-hidden />
      <div className="ak-zodiac-card__glyph">
        <ZodiacGlyph sign={{ nameTr, glyphPathHint, accentColor }} size={72} />
      </div>
      <h3 className="ak-zodiac-card__name">{nameTr}</h3>
      <p className="ak-zodiac-card__meta">
        <span>{dateRange}</span>
        <span aria-hidden>·</span>
        <span>{ELEMENT_LABELS[element]}</span>
      </p>
      <p className="ak-zodiac-card__identity">{identity}</p>
      <Link
        href={productRoute}
        className="ak-zodiac-card__cta"
        aria-label={`${nameTr} anahtarlığını incele`}
      >
        Anahtarlığı İncele
      </Link>
    </motion.article>
  );
}

export function ZodiacCollectionSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = ZODIAC_COLLECTION.length;

  const onScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = rail.querySelectorAll<HTMLElement>(".ak-zodiac-card");
    if (!cards.length) return;
    const mid = rail.scrollLeft + rail.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActiveIndex(best);
  }, []);

  return (
    <section
      id="zodiac-collection"
      className="ak-section ak-zodiac"
      aria-labelledby="zodiac-collection-heading"
    >
      <div className="ak-container">
        <SectionHeading
          id="zodiac-collection-heading"
          heading={zodiacCollectionContent.heading}
          description={zodiacCollectionContent.description}
        />
        <p className="ak-zodiac__counter" aria-live="polite">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span aria-hidden>/</span>
          <span>{String(total).padStart(2, "0")}</span>
          <span className="ak-zodiac__counter-name">
            {ZODIAC_COLLECTION[activeIndex]?.nameTr}
          </span>
        </p>
      </div>

      <div
        ref={railRef}
        className="ak-zodiac__rail"
        onScroll={onScroll}
      >
        {ZODIAC_COLLECTION.map((sign, index) => (
          <ZodiacCard
            key={sign.slug}
            {...sign}
            index={index}
            active={index === activeIndex || !!reduced}
          />
        ))}
      </div>

      <div className="ak-zodiac__dots" role="tablist" aria-label="Burç koleksiyonu">
        {ZODIAC_COLLECTION.map((sign, i) => (
          <button
            key={sign.slug}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={sign.nameTr}
            className={i === activeIndex ? "is-active" : ""}
            onClick={() => {
              const rail = railRef.current;
              const card = rail?.querySelectorAll<HTMLElement>(".ak-zodiac-card")[i];
              card?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", inline: "center", block: "nearest" });
              setActiveIndex(i);
            }}
          />
        ))}
      </div>
    </section>
  );
}
