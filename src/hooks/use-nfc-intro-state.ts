"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

export type IntroPhase = "black" | "scan" | "verified" | "glyph" | "reveal" | "done";

const SESSION_KEY = "orbia-signal-intro-seen";

/** Intro overlay skipped — experience is visible on first paint. */
export function useNfcIntroState() {
  const reduced = useReducedMotionSafe();
  const [phase] = useState<IntroPhase>("done");
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const markedRef = useRef(false);

  const skip = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (markedRef.current) return;
    markedRef.current = true;
    skip();
    setIsFirstVisit(false);
  }, [skip]);

  return {
    phase,
    ready: true,
    isFirstVisit,
    reduced,
    skip,
    isIntro: false,
    showExperience: true,
  };
}
