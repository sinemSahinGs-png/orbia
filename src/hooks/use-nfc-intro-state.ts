"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

export type IntroPhase = "black" | "scan" | "verified" | "glyph" | "reveal" | "done";

const SESSION_KEY = "orbia-signal-intro-seen";

/** Cinematic NFC intro ≤1.8s; skip on touch/scroll; once per session. */
export function useNfcIntroState() {
  const reduced = useReducedMotionSafe();
  const [phase, setPhase] = useState<IntroPhase>("black");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const timersRef = useRef<number[]>([]);
  const stoppedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const markSeenAndDone = useCallback(() => {
    stoppedRef.current = true;
    clearTimers();
    setPhase("done");
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [clearTimers]);

  useEffect(() => {
    stoppedRef.current = false;
    clearTimers();

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }

    queueMicrotask(() => {
      if (!stoppedRef.current) setIsFirstVisit(!seen);
    });

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || seen || reduced) {
      timersRef.current.push(window.setTimeout(() => markSeenAndDone(), 0));
      return () => {
        stoppedRef.current = true;
        clearTimers();
      };
    }

    const steps: Array<[IntroPhase, number]> = [
      ["black", 0],
      ["scan", 250],
      ["verified", 450],
      ["glyph", 850],
      ["reveal", 1250],
      ["done", 1750],
    ];

    steps.forEach(([p, delay]) => {
      timersRef.current.push(
        window.setTimeout(() => {
          if (stoppedRef.current) return;
          if (p === "done") markSeenAndDone();
          else setPhase(p);
        }, delay),
      );
    });

    const onSkipEvent = () => markSeenAndDone();
    window.addEventListener("pointerdown", onSkipEvent, { once: true, passive: true });
    window.addEventListener("wheel", onSkipEvent, { once: true, passive: true });
    window.addEventListener("touchstart", onSkipEvent, { once: true, passive: true });
    window.addEventListener("keydown", onSkipEvent, { once: true });

    return () => {
      stoppedRef.current = true;
      clearTimers();
      window.removeEventListener("pointerdown", onSkipEvent);
      window.removeEventListener("wheel", onSkipEvent);
      window.removeEventListener("touchstart", onSkipEvent);
      window.removeEventListener("keydown", onSkipEvent);
    };
  }, [markSeenAndDone, clearTimers, reduced]);

  return {
    phase,
    ready: true,
    isFirstVisit,
    reduced,
    skip: markSeenAndDone,
    isIntro: phase !== "done",
    showExperience: true,
  };
}
