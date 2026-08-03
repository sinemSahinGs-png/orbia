"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/home/visuals/SectionHeading";
import { homeFaqItems } from "@/content/faq";
import { EASE_OUT } from "@/lib/animation";

export function ZodiacFaqSection() {
  const baseId = useId();
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(homeFaqItems[0]?.id ?? null);

  return (
    <section
      id="faq"
      className="ak-section ak-faq"
      aria-labelledby="faq-heading"
    >
      <div className="ak-container ak-faq__layout">
        <SectionHeading
          id="faq-heading"
          heading={["MERAK ETTİKLERİN."]}
          description="ORBIA deneyimi, NFC ve gökyüzü katmanı hakkında sık sorulanlar."
        />

        <ul className="ak-faq__list">
          {homeFaqItems.map((item, index) => {
            const expanded = openId === item.id;
            const panelId = `${baseId}-panel-${item.id}`;
            const buttonId = `${baseId}-btn-${item.id}`;

            return (
              <motion.li
                key={item.id}
                className={`ak-faq__item${expanded ? " is-open" : ""}`}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduced ? 0 : Math.min(index, 6) * 0.04, duration: 0.45, ease: EASE_OUT }}
              >
                <button
                  id={buttonId}
                  type="button"
                  className="ak-faq__trigger"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpenId(expanded ? null : item.id)}
                >
                  <span>{item.question}</span>
                  <motion.span
                    className="ak-faq__icon"
                    aria-hidden
                    animate={{ rotate: expanded ? 45 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.3 }}
                  >
                    +
                  </motion.span>
                  <span className={`ak-faq__line${expanded ? " is-active" : ""}`} aria-hidden />
                </button>

                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="ak-faq__panel"
                      initial={
                        reduced
                          ? { height: "auto", opacity: 1 }
                          : { height: 0, opacity: 0, y: -6 }
                      }
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={
                        reduced
                          ? { height: 0, opacity: 0 }
                          : { height: 0, opacity: 0, y: -4 }
                      }
                      transition={{ duration: reduced ? 0.15 : 0.35, ease: EASE_OUT }}
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
