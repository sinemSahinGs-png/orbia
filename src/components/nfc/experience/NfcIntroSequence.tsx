"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { IntroPhase } from "@/hooks/use-nfc-intro-state";

type Props = {
  phase: IntroPhase;
  onSkip: () => void;
  isFirstVisit: boolean;
  signName: string;
};

export function NfcIntroSequence({ phase, onSkip, isFirstVisit, signName }: Props) {
  if (phase === "done") return null;

  return (
    <div className="ox-intro" role="dialog" aria-label="ORBIA sinyal girişi" onClick={onSkip}>
      {isFirstVisit ? (
        <button
          type="button"
          className="ox-intro__skip"
          onClick={(e) => {
            e.stopPropagation();
            onSkip();
          }}
        >
          Geç
        </button>
      ) : null}

      <AnimatePresence mode="wait">
        {phase === "black" || phase === "scan" ? (
          <motion.div key="star" className="ox-intro__stage" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.span
              className="ox-intro__star"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            />
            {phase === "scan" ? (
              <svg className="ox-intro__lines" viewBox="0 0 120 120" aria-hidden>
                <motion.circle
                  cx="60"
                  cy="60"
                  r="38"
                  fill="none"
                  stroke="rgba(201,182,232,0.45)"
                  strokeWidth="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55 }}
                />
                <motion.path
                  d="M60 22 V98 M22 60 H98"
                  fill="none"
                  stroke="rgba(201,182,232,0.28)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                />
              </svg>
            ) : null}
          </motion.div>
        ) : null}

        {phase === "verified" ? (
          <motion.p
            key="verified"
            className="ox-intro__verified"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            ORBIA SİNYALİ BULUNDU
          </motion.p>
        ) : null}

        {phase === "glyph" || phase === "reveal" ? (
          <motion.div key="glyph" className="ox-intro__glyph" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <svg className="ox-intro__seal" viewBox="0 0 100 100" aria-hidden>
              <motion.circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="rgba(201,182,232,0.5)"
                strokeWidth="0.7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.55 }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="28"
                fill="none"
                stroke="rgba(200,92,140,0.45)"
                strokeWidth="0.55"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            </svg>
            <motion.span
              className="ox-intro__sign"
              initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              animate={
                phase === "reveal"
                  ? { opacity: 1, clipPath: "inset(0 0% 0 0)" }
                  : { opacity: 0.4, clipPath: "inset(0 70% 0 0)" }
              }
              transition={{ duration: 0.45 }}
            >
              {signName}
            </motion.span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
