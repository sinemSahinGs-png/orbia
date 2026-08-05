"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Props = {
  ritual: string;
  dateKey: string;
  signSlug: string;
};

const HOLD_MS = 20_000;

function readDone(key: string) {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/** Hold-to-complete 20s breath ring; day-scoped localStorage. Soft retreat on release. */
export function MicroRitualScene({ ritual, dateKey, signSlug }: Props) {
  const reduced = useReducedMotionSafe();
  const key = `orbia-ritual-${dateKey}-${signSlug}`;
  const [done, setDone] = useState(() => (typeof window === "undefined" ? false : readDone(key)));
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bloom, setBloom] = useState(false);
  const startRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const cancelRaf = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const softRetreat = () => {
    cancelRaf();
    const from = progressRef.current;
    if (from <= 0.01) {
      progressRef.current = 0;
      setProgress(0);
      return;
    }
    const t0 = performance.now();
    const dur = 480 + from * 420;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - t, 2.4);
      const p = from * (1 - eased);
      progressRef.current = p;
      setProgress(p);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else {
        progressRef.current = 0;
        setProgress(0);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const stopHold = (completed: boolean) => {
    setHolding(false);
    startRef.current = null;
    if (!completed) softRetreat();
    else cancelRaf();
  };

  const tick = (now: number) => {
    if (startRef.current == null) return;
    const p = Math.min(1, (now - startRef.current) / HOLD_MS);
    progressRef.current = p;
    setProgress(p);
    if (p >= 1) {
      setDone(true);
      setBloom(true);
      stopHold(true);
      try {
        localStorage.setItem(key, "1");
        navigator.vibrate?.(18);
      } catch {
        /* ignore */
      }
      window.setTimeout(() => setBloom(false), 900);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const startHold = () => {
    if (done || reduced) return;
    cancelRaf();
    setHolding(true);
    const already = progressRef.current;
    startRef.current = performance.now() - already * HOLD_MS;
    rafRef.current = requestAnimationFrame(tick);
  };

  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (progress * c).toFixed(2);
  const trailDeg = -90 + progress * 360;
  const trailRad = (trailDeg * Math.PI) / 180;
  const trailX = 50 + Math.cos(trailRad) * r;
  const trailY = 50 + Math.sin(trailRad) * r;

  return (
    <section className="ox-scene ox-ritual" aria-labelledby="ox-ritual-heading">
      <p className="ox-kicker">Mikro ritüel</p>
      <h2 id="ox-ritual-heading" className="ox-heading">
        Bir dakikalığına dur.
      </h2>
      <p className="ox-body ox-ritual__text">{ritual}</p>

      {done ? (
        <div className={`ox-ritual__done-wrap${bloom ? " is-bloom" : ""}`}>
          <p className="ox-ritual__done" role="status">
            Bugünkü durak tamam.
          </p>
        </div>
      ) : reduced ? (
        <p className="ox-body">Kısaca nefes al ve niyetini tut — animasyon kapalı.</p>
      ) : (
        <button
          type="button"
          className={`ox-breath${holding ? " is-holding" : ""}`}
          onPointerDown={startHold}
          onPointerUp={() => stopHold(false)}
          onPointerLeave={() => stopHold(false)}
          onPointerCancel={() => stopHold(false)}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              startHold();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "Enter") stopHold(false);
          }}
          aria-label="Basılı tutarak 20 saniyelik nefes halkasını tamamla"
        >
          <svg viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(215,202,235,0.22)" strokeWidth="1.4" />
            <circle
              cx="50"
              cy="50"
              r="28"
              fill="none"
              stroke="rgba(201,182,232,0.2)"
              strokeWidth="0.6"
              strokeDasharray="1 4"
              opacity={Math.min(1, progress * 1.4)}
            />
            {[0, 72, 144, 216, 288].map((deg) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              const x = 50 + Math.cos(rad) * 28;
              const y = 50 + Math.sin(rad) * 28;
              return (
                <circle
                  key={deg}
                  cx={x}
                  cy={y}
                  r="0.9"
                  fill="var(--astral-lilac)"
                  opacity={progress > deg / 360 ? 0.75 : 0.12}
                />
              );
            })}
            <motion.circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="var(--astral-lilac)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`}
              transform="rotate(-90 50 50)"
            />
            {progress > 0.02 ? (
              <circle cx={trailX} cy={trailY} r="1.6" fill="var(--astral-lilac)" opacity="0.9" />
            ) : null}
          </svg>
          <span>{holding ? "Tut…" : "Basılı tut"}</span>
        </button>
      )}
    </section>
  );
}
