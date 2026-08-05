"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Props = {
  signSlug: string;
  onPair: () => void;
};

const PRODUCT_SRC = "/images/products/orbia-keychain.webp";

export function MinimalExperienceFooter({ signSlug, onPair }: Props) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const floatY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [2, -2]);
  const sealY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-1, 2]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const stage = stageRef.current;
    if (!stage) return;
    const onMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      stage.style.setProperty("--ox-prod-x", `${Math.max(-5, Math.min(5, x))}px`);
      stage.style.setProperty("--ox-prod-y", `${Math.max(-5, Math.min(5, y))}px`);
    };
    const onLeave = () => {
      stage.style.setProperty("--ox-prod-x", "0px");
      stage.style.setProperty("--ox-prod-y", "0px");
    };
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  return (
    <>
      <section ref={ref} className="ox-scene ox-product ox-scene--nebula-d" aria-labelledby="ox-product-heading">
        <div
          ref={stageRef}
          className="ox-product__stage"
          data-empty={failed ? "true" : undefined}
        >
          <motion.span className="ox-product__seal" style={{ y: sealY }} aria-hidden />
          {!failed ? (
            <div className="ox-product__parallax">
              <motion.img
                className="ox-product__img"
                style={{ y: floatY }}
                src={PRODUCT_SRC}
                alt="ORBIA anahtarlık"
                width={640}
                height={640}
                decoding="async"
                onError={() => setFailed(true)}
              />
            </div>
          ) : null}
        </div>
        <p className="ox-kicker">Ürün</p>
        <h2 id="ox-product-heading" className="ox-heading">
          Gökyüzünü yanında taşı.
        </h2>
        <p className="ox-body">
          Burcuna özel ORBIA’yı edin. Her dokunuşta günün gökyüzü açılsın.
        </p>
        <ul className="ox-product__benefits">
          <li>Burcuna özel gravür mühür</li>
          <li>Her dokunuşta günlük gökyüzü</li>
          <li>İkinci ORBIA ile ortak ritim</li>
        </ul>
        <div className="ox-actions">
          <Link href="/urunler" className="ox-btn ox-btn--primary">
            ORBIA’nı seç
          </Link>
          <Link href={`/urunler/${signSlug}`} className="ox-btn ox-btn--ghost">
            Bu burcun ürünü
          </Link>
        </div>
      </section>

      <footer className="ox-footer-min">
        <p className="ox-footer-min__brand">ORBIA</p>
        <p className="ox-footer-min__manifesto">Antik gökyüzü. Yaşayan mühür.</p>
        <div className="ox-footer-min__links">
          <button type="button" className="ox-btn ox-btn--ghost" onClick={onPair}>
            İkinci ORBIA’yı okut
          </button>
        </div>
        <nav aria-label="Yasal">
          <Link href="/">Ana sayfa</Link>
          <Link href="/gizlilik">Gizlilik</Link>
          <Link href="/astroloji-bildirimi">Astroloji</Link>
          <Link href="/iletisim">İletişim</Link>
        </nav>
      </footer>
    </>
  );
}
