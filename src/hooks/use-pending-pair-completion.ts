"use client";

import { useEffect, useRef } from "react";
import { PAIR_STORAGE_KEY, isPairSessionValid, type PairSession } from "@/lib/nfc/pair-session";

/**
 * When a second ORBIA URL opens while a pair session is pending,
 * complete pairing and redirect to /uyum?t=token (no raw codes in URL).
 */
export function usePendingPairCompletion(currentCode: string, currentSign: string) {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    let session: PairSession | null = null;
    try {
      const raw = localStorage.getItem(PAIR_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PairSession;
        if (isPairSessionValid(parsed)) session = parsed;
      }
    } catch {
      session = null;
    }

    if (!session) return;
    if (session.firstCode === currentCode || session.firstSign === currentSign) return;

    void (async () => {
      try {
        const res = await fetch("/api/pair/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstCode: session!.firstCode,
            secondCode: currentCode,
          }),
        });
        const data = (await res.json()) as { ok?: boolean; pairToken?: string };
        if (data.ok && data.pairToken) {
          try {
            localStorage.removeItem(PAIR_STORAGE_KEY);
          } catch {
            /* ignore */
          }
          window.location.replace(`/uyum?t=${encodeURIComponent(data.pairToken)}`);
        }
      } catch {
        /* stay on experience */
      }
    })();
  }, [currentCode, currentSign]);
}
