"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/home/visuals/SectionHeading";
import { ProductPhoto } from "@/components/home/visuals/ProductPhoto";
import { ZodiacGlyph } from "@/components/home/visuals/ZodiacGlyph";
import { personalizationContent } from "@/content/home";
import { productMedia } from "@/content/product";
import { ZODIAC_COLLECTION } from "@/content/zodiac";
import { EASE_OUT } from "@/lib/animation";

const STEP_COUNT = personalizationContent.steps.length;

export function PersonalizationFlowSection() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [signSlug, setSignSlug] = useState("aslan");
  const [surfaceId, setSurfaceId] = useState<string>(personalizationContent.surfaces[0].id);
  const [metalId, setMetalId] = useState<string>(personalizationContent.metals[0].id);
  const [message, setMessage] = useState("");

  const sign = useMemo(
    () => ZODIAC_COLLECTION.find((s) => s.slug === signSlug) ?? ZODIAC_COLLECTION[4],
    [signSlug],
  );
  const surface =
    personalizationContent.surfaces.find((s) => s.id === surfaceId) ??
    personalizationContent.surfaces[0];
  const metal =
    personalizationContent.metals.find((m) => m.id === metalId) ??
    personalizationContent.metals[0];

  const maxLen = personalizationContent.maxPersonalizationLength;
  const progress = (step + 1) / STEP_COUNT;

  const goNext = () => setStep((s) => Math.min(STEP_COUNT - 1, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <section
      id="personalization"
      className="ak-section ak-config"
      aria-labelledby="personalization-heading"
    >
      <div className="ak-container ak-config__layout">
        <div className="ak-config__copy">
          <SectionHeading
            id="personalization-heading"
            heading={personalizationContent.heading}
            description={personalizationContent.description}
          />

          <div className="ak-config__progress" aria-hidden>
            <svg viewBox="0 0 100 100" className="ak-config__orbit">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(215,217,223,0.12)" strokeWidth="1" />
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(183,161,106,0.85)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray={289}
                animate={{ strokeDashoffset: 289 * (1 - progress) }}
                transition={{ duration: reduced ? 0 : 0.55, ease: EASE_OUT }}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <span>
              {String(step + 1).padStart(2, "0")} / {String(STEP_COUNT).padStart(2, "0")}
            </span>
          </div>

          <ol className="ak-config__steps" aria-label="Kişiselleştirme adımları">
            {personalizationContent.steps.map((label, i) => (
              <li key={label}>
                <button
                  type="button"
                  className={i === step ? "is-active" : ""}
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => setStep(i)}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="ak-config__panel">
          <div className="ak-config__preview">
            <div className="ak-config__preview-light" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${sign.slug}-${surface.id}-${metal.id}`}
                initial={reduced ? false : { opacity: 0.4, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                <ProductPhoto
                  sign={sign}
                  src={productMedia.keychainMain}
                  alt={`${sign.nameTr} ORBIA anahtarlık önizlemesi`}
                  surface={surface.tone}
                  metal={metal.tone}
                  engraving={message}
                  size="lg"
                />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={sign.slug}
                className="ak-config__glyph-morph"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ZodiacGlyph sign={sign} size={28} draw={!reduced} />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="ak-config__controls"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              {step === 0 ? (
                <fieldset>
                  <legend>Burcunu seç</legend>
                  <div className="ak-config__sign-grid" role="radiogroup" aria-label="Burç seçimi">
                    {ZODIAC_COLLECTION.map((s) => (
                      <button
                        key={s.slug}
                        type="button"
                        role="radio"
                        aria-checked={signSlug === s.slug}
                        className={signSlug === s.slug ? "is-active" : ""}
                        onClick={() => setSignSlug(s.slug)}
                        style={{ ["--sign-accent" as string]: s.accentColor }}
                      >
                        {s.nameTr}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {step === 1 ? (
                <fieldset>
                  <legend>Yüzey seçeneğini belirle</legend>
                  <div className="ak-config__swatches" role="radiogroup" aria-label="Yüzey">
                    {personalizationContent.surfaces.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        role="radio"
                        aria-checked={surfaceId === s.id}
                        className={surfaceId === s.id ? "is-active" : ""}
                        onClick={() => setSurfaceId(s.id)}
                      >
                        <span style={{ background: s.tone }} aria-hidden />
                        {s.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {step === 2 ? (
                <fieldset>
                  <legend>Metal rengini seç</legend>
                  <div className="ak-config__swatches" role="radiogroup" aria-label="Metal">
                    {personalizationContent.metals.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        role="radio"
                        aria-checked={metalId === m.id}
                        className={metalId === m.id ? "is-active" : ""}
                        onClick={() => setMetalId(m.id)}
                      >
                        <span style={{ background: m.tone }} aria-hidden />
                        {m.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {step === 3 ? (
                <div>
                  <label htmlFor="ak-personal-msg">İsim veya kısa mesaj</label>
                  <input
                    id="ak-personal-msg"
                    type="text"
                    value={message}
                    maxLength={maxLen}
                    onChange={(e) => setMessage(e.target.value.slice(0, maxLen))}
                    placeholder="Örn. ATA"
                    autoComplete="off"
                  />
                  <p className="ak-config__count" aria-live="polite">
                    {message.length} / {maxLen}
                  </p>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="ak-config__summary">
                  <p>
                    <strong>{sign.nameTr}</strong> · {surface.label} · {metal.label}
                  </p>
                  {message ? <p>“{message}”</p> : <p>Kişiselleştirme metni eklenmedi.</p>}
                  <p className="ak-muted">Önizleme canlı olarak solda güncellenir.</p>
                </div>
              ) : null}

              {step === 5 ? (
                <div className="ak-config__order">
                  <p>
                    Sipariş talebi oluşturmak için sipariş sayfasına geçebilirsiniz.
                    Ödeme bu aşamada tamamlanmaz.
                  </p>
                  {/* TODO: Wire configurator payload to orders API when checkout backend is ready. */}
                  <Link
                    href={`${personalizationContent.orderHref}?sign=${sign.slug}`}
                    className="cine-btn ak-cta-primary"
                  >
                    Sipariş Talebi Oluştur
                  </Link>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div className="ak-config__nav">
            <button type="button" onClick={goPrev} disabled={step === 0}>
              Geri
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={step === STEP_COUNT - 1}
              className="is-primary"
            >
              İleri
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
