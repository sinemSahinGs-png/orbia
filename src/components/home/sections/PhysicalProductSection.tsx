"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { SectionHeading } from "@/components/home/visuals/SectionHeading";
import { KeychainPlaceholder } from "@/components/home/visuals/KeychainPlaceholder";
import { physicalProductContent } from "@/content/home";
import { productAnnotationLabels, productSpecPlaceholders } from "@/content/product";
import { getZodiacCollectionItem } from "@/content/zodiac";
import { EASE_OUT } from "@/lib/animation";

export function PhysicalProductSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0.2, 0.8], [-4, 4]);
  const aslan = getZodiacCollectionItem("aslan")!;

  const specs = [
    { label: "Boyut", value: productSpecPlaceholders.dimensions },
    { label: "Ana malzeme", value: productSpecPlaceholders.primaryMaterial },
    { label: "Kaplama", value: productSpecPlaceholders.coating },
    { label: "NFC çip", value: productSpecPlaceholders.nfcChipModel },
    { label: "Su dayanımı", value: productSpecPlaceholders.waterResistance },
    { label: "Fiyat", value: productSpecPlaceholders.price },
    { label: "Teslimat", value: productSpecPlaceholders.deliveryTime },
  ];

  return (
    <section
      ref={sectionRef}
      id="physical-product"
      className="ak-section ak-product"
      aria-labelledby="physical-product-heading"
    >
      <div className="ak-container ak-product__layout">
        <div>
          <SectionHeading
            id="physical-product-heading"
            heading={physicalProductContent.heading}
            description={physicalProductContent.description}
          />

          <ul className="ak-product__features">
            {physicalProductContent.features.map((f, i) => (
              <motion.li
                key={f}
                initial={reduced ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduced ? 0 : i * 0.05, duration: 0.45, ease: EASE_OUT }}
              >
                {f}
              </motion.li>
            ))}
          </ul>

          <dl className="ak-product__specs">
            {specs.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="ak-product__visual">
          <motion.div
            className="ak-product__stage"
            style={reduced ? undefined : { rotate }}
          >
            {productAnnotationLabels.map((ann, i) => (
              <motion.div
                key={ann.id}
                className={`ak-product__ann ak-product__ann--${ann.side}`}
                initial={reduced ? false : { opacity: 0, x: ann.side === "left" ? -12 : 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduced ? 0 : 0.2 + i * 0.12, duration: 0.6 }}
              >
                <span className="ak-product__ann-line" />
                <span className="ak-product__ann-label">{ann.label}</span>
              </motion.div>
            ))}
            <KeychainPlaceholder sign={aslan} size="xl" />
            <div className="ak-product__reflect" aria-hidden />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
