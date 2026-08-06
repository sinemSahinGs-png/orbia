"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useScroll, useTransform } from "framer-motion";
import { ZODIAC_SIGNS } from "@/lib/zodiac/signs";
import { PAIR_STORAGE_KEY, createPairSession, type PairSession } from "@/lib/nfc/pair-session";
import { getDemoCodeForSign } from "@/lib/nfc/demo-tags";
import { parseOrbiaCodeFromNfcPayload } from "@/lib/nfc/parse-orbia-nfc";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { LivingCore } from "@/components/nfc/experience/LivingCore";
import { OxReveal } from "@/components/nfc/experience/Reveal";

type Props = {
  code: string;
  signSlug: string;
};

type OverlayPhase = "wait" | "scanning" | "merging" | "error";

function persistClientSession(session: PairSession) {
  localStorage.setItem(PAIR_STORAGE_KEY, JSON.stringify(session));
  // Client fallback cookie (server also sets httpOnly signed cookie via /api/pair/start)
  document.cookie = `${PAIR_STORAGE_KEY}=${encodeURIComponent(JSON.stringify(session))};max-age=600;path=/;samesite=lax`;
}

async function startPairSession(code: string, signSlug: string) {
  const session = createPairSession(code, signSlug);
  persistClientSession(session);
  try {
    await fetch("/api/pair/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
  } catch {
    /* client session still valid as fallback */
  }
  return session;
}

async function completePair(firstCode: string, secondCode: string) {
  const res = await fetch("/api/pair/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstCode, secondCode }),
  });
  return res.json() as Promise<{
    ok: boolean;
    error?: string;
    pairToken?: string;
  }>;
}

export function PairingScanOverlay({
  open,
  onClose,
  code,
  signSlug,
  initialManual = false,
}: {
  open: boolean;
  onClose: () => void;
  code: string;
  signSlug: string;
  initialManual?: boolean;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotionSafe();
  const [manual, setManual] = useState(initialManual);
  const [codeInput, setCodeInput] = useState("");
  const [phase, setPhase] = useState<OverlayPhase>("wait");
  const [message, setMessage] = useState(
    "İkinci ORBIA’yı telefonuna yaklaştır. Android Chrome’da Web NFC açıksa tarama başlar.",
  );
  const [error, setError] = useState("");
  const abortRef = useRef<{ stop?: () => void } | null>(null);

  const goUyum = useCallback((pairToken: string) => {
    window.location.href = `/uyum?t=${encodeURIComponent(pairToken)}`;
  }, []);

  const finishWithCodeB = useCallback(
    async (codeB: string) => {
      setError("");
      setPhase("merging");
      const data = await completePair(code, codeB);
      if (!data.ok || !data.pairToken) {
        setPhase("error");
        setError(data.error || "Eşleşme tamamlanamadı.");
        return;
      }
      window.setTimeout(
        () => goUyum(data.pairToken!),
        reduced ? 120 : 780,
      );
    },
    [code, goUyum, reduced],
  );

  const startWebNfc = useCallback(async () => {
    if (!("NDEFReader" in window)) {
      setMessage(
        "Bu tarayıcı Web NFC desteklemiyor. İkinci ORBIA’yı telefonunun standart NFC alanına dokundur — sayfa açıldığında eşleşme tamamlanır. Ya da kodu gir / burçla dene.",
      );
      setPhase("wait");
      return;
    }

    try {
      navigator.vibrate?.(10);
      type NDEFReadingEvent = Event & { message?: { records?: Array<{ recordType: string; data?: DataView }> } };
      const NDEFReaderCtor = (
        window as unknown as { NDEFReader: new () => {
          scan: () => Promise<void>;
          addEventListener: (type: string, fn: (e: NDEFReadingEvent) => void) => void;
          removeEventListener: (type: string, fn: (e: NDEFReadingEvent) => void) => void;
        } }
      ).NDEFReader;
      const reader = new NDEFReaderCtor();
      const onReading = (event: NDEFReadingEvent) => {
        const records = event.message?.records ?? [];
        for (const record of records) {
          if (!record.data) continue;
          const bytes = new Uint8Array(record.data.buffer, record.data.byteOffset, record.data.byteLength);
          const text = new TextDecoder().decode(bytes);
          const parsed = parseOrbiaCodeFromNfcPayload(text);
          if (parsed) {
            void finishWithCodeB(parsed);
            return;
          }
        }
        setError("Etikette ORBIA adresi okunamadı. Kodu elle girebilirsin.");
      };
      reader.addEventListener("reading", onReading);
      abortRef.current = {
        stop: () => reader.removeEventListener("reading", onReading),
      };
      await reader.scan();
      setPhase("scanning");
      setMessage("Tarama açık. İkinci ORBIA’yı yaklaştır.");
    } catch {
      setPhase("wait");
      setMessage(
        "NFC izni verilmedi. Anahtarlığı telefonuna yaklaştırarak sayfa açılışında eşleşmeyi tamamlayabilirsin.",
      );
    }
  }, [finishWithCodeB]);

  useEffect(() => {
    if (!open) return;
    void startPairSession(code, signSlug).then(() => {
      if (!initialManual) void startWebNfc();
    });
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      abortRef.current?.stop?.();
    };
  }, [open, onClose, code, signSlug, initialManual, startWebNfc]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="ox-overlay" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button ref={closeRef} type="button" className="ox-overlay__close" onClick={onClose}>
        Kapat
      </button>
      <div className="ox-overlay__panel">
        <p className="ox-eyebrow">Mühürleri birleştir</p>
        <h2 id={titleId} className="scene-title" style={{ fontSize: "clamp(1.9rem, 8vw, 2.75rem)" }}>
          {phase === "merging" ? "Mühürler iç içe geçiyor" : "İkinci mühür bekleniyor"}
        </h2>

        <div
          className={`ox-overlay__orbits${phase === "merging" ? " is-merged" : ""}`}
          aria-hidden
        >
          <LivingCore mode={phase === "merging" ? "merge" : "split"} />
        </div>

        <p className="scene-body" style={{ marginInline: "auto", maxWidth: "32ch" }}>
          {message}
        </p>
        {error ? (
          <p className="scene-body" style={{ color: "#c97878", marginTop: "0.75rem" }} role="alert">
            {error}
          </p>
        ) : null}

        <div className="ox-actions ox-overlay__actions">
          <button type="button" className="ox-btn ox-btn--primary" onClick={() => void startWebNfc()}>
            Web NFC ile Tara
          </button>
          <button
            type="button"
            className="ox-btn ox-btn--ghost"
            onClick={() => {
              setManual((v) => !v);
              setError("");
            }}
          >
            {manual ? "Alternatifleri gizle" : "ORBIA kodunu gir"}
          </button>
          {!manual ? (
            <button
              type="button"
              className="ox-btn ox-btn--ghost"
              onClick={() => {
                setManual(true);
                setError("");
              }}
            >
              Burçla dene
            </button>
          ) : null}
        </div>

        {manual ? (
          <>
            <div className="ox-manual-field">
              <label className="data-label" htmlFor="ox-pair-code">
                1 · ORBIA kodunu gir
              </label>
              <input
                id="ox-pair-code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="örn. BK3M81Q"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="ox-btn ox-btn--primary"
                onClick={() => {
                  const parsed = parseOrbiaCodeFromNfcPayload(codeInput);
                  if (!parsed) {
                    setError("Geçerli bir ORBIA kodu gir.");
                    return;
                  }
                  void finishWithCodeB(parsed);
                }}
              >
                Eşleştir
              </button>
            </div>
            <p className="ox-eyebrow ox-overlay__alt-label">2 · Burçla dene</p>
            <div className="ox-sign-grid" role="list">
              {ZODIAC_SIGNS.map((s) => {
                const demo = getDemoCodeForSign(s.slug);
                const disabled = !demo || demo === code || s.slug === signSlug;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    role="listitem"
                    disabled={disabled}
                    style={disabled ? { opacity: 0.35 } : undefined}
                    onClick={() => {
                      if (!demo || disabled) return;
                      void finishWithCodeB(demo);
                    }}
                  >
                    {s.nameTr}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export function SecondKeyPairingScene({ code, signSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [manualFirst, setManualFirst] = useState(false);
  const reduced = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const gap = useTransform(scrollYProgress, [0, 1], reduced ? ["1.2rem", "1.2rem"] : ["2.8rem", "0.65rem"]);

  const openPair = (manual: boolean) => {
    setManualFirst(manual);
    setOpen(true);
    try {
      navigator.vibrate?.(14);
    } catch {
      /* ignore */
    }
  };

  return (
    <section
      ref={sectionRef}
      id="ox-pair"
      className="ox-scene ox-pair ox-scene--nebula-d"
      aria-labelledby="ox-pair-heading"
    >
      <div className="ox-pair__field" aria-hidden>
        <LivingCore mode="split" className="ox-pair__cores" style={{ gap }} />
        <span className="ox-pair__resonance" />
      </div>
      <OxReveal delay={0.08}>
        <p className="ox-kicker">ORBIA eşleşmesi</p>
      </OxReveal>
      <OxReveal delay={0.14} blur>
        <h2 id="ox-pair-heading" className="ox-heading ox-pair__title">
          İki ORBIA arasında ne var?
        </h2>
      </OxReveal>
      <OxReveal delay={0.22}>
        <p className="ox-body ox-pair__body">
          İkinci anahtarlığı okut. Bugünkü ortak ritminiz ortaya çıksın.
        </p>
      </OxReveal>
      <OxReveal delay={0.32}>
        <div className="ox-actions ox-pair__actions">
          <button type="button" className="ox-btn ox-btn--primary" onClick={() => openPair(false)}>
            İkinci ORBIA’yı okut
          </button>
          <button type="button" className="ox-btn ox-btn--ghost" onClick={() => openPair(true)}>
            Kod veya burçla dene
          </button>
        </div>
      </OxReveal>
      <PairingScanOverlay
        key={open ? `pair-${manualFirst ? "manual" : "scan"}` : "pair-closed"}
        open={open}
        onClose={() => setOpen(false)}
        code={code}
        signSlug={signSlug}
        initialManual={manualFirst}
      />
    </section>
  );
}
