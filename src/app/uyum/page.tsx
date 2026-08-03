"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { PAIR_STORAGE_KEY, isPairSessionValid, type PairSession } from "@/lib/nfc/pair-session";
import { getDemoCodeForSign } from "@/lib/nfc/demo-tags";
import { allSigns } from "@/lib/zodiac/signs";

type Compat = {
  signA: string;
  signB: string;
  generalRhythm: number;
  communication: number;
  emotionalFlow: number;
  movementEnergy: number;
  complementArea: number;
  jointAdvice: string;
};

export default function UyumPage() {
  const [session, setSession] = useState<PairSession | null>(null);
  const [manualB, setManualB] = useState("terazi");
  const [result, setResult] = useState<Compat | null>(null);
  const [error, setError] = useState("");
  const signs = useMemo(() => allSigns(), []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PAIR_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PairSession;
        if (isPairSessionValid(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSession(parsed);
        }
      }
    } catch {
      /* ignore corrupt session */
    }

    const params = new URLSearchParams(window.location.search);
    const second = params.get("second");
    const first = params.get("first") || undefined;
    if (second && (first || session?.firstCode)) {
      void complete(first || session!.firstCode, second);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function complete(firstCode: string, secondCode: string) {
    setError("");
    const res = await fetch("/api/pair/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstCode, secondCode }),
    });
    const data = await res.json();
    if (!data.ok) {
      setError(data.error || data.message || "Eşleşme tamamlanamadı.");
      return;
    }

    setResult({
      signA: data.signA,
      signB: data.signB,
      ...data.result,
    });
  }

  async function manualPair() {
    if (!session) {
      setError("Önce bir ORBIA okutun.");
      return;
    }

    const secondCode = getDemoCodeForSign(manualB) ?? "BK3M81Q";
    await complete(session.firstCode, secondCode);
  }

  return (
    <MarketingChrome>
      <p className="cine-eyebrow">UYUM</p>
      <h1 className="cine-heading">İki enerji. Tek gökyüzü.</h1>
      {!result && (
        <>
          <p className="cine-body">
            {session
              ? "İkinci enerjiyi yaklaştır. Diğer ORBIA anahtarlığını telefonunun NFC alanına dokundur."
              : "Eşleşme için önce bir anahtarlık okutun (/k/[code])."}
          </p>
          <div style={{ marginTop: 24, display: "grid", gap: 12, maxWidth: 420 }}>
            <label className="cine-body">
              Burcunu Elle Seç (fallback)
              <select
                value={manualB}
                onChange={(e) => setManualB(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: 8,
                  padding: 12,
                  background: "#0C0F16",
                  color: "#F2F0EA",
                  border: "1px solid rgba(215,217,223,0.2)",
                }}
              >
                {signs.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.nameTr}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="cine-btn" onClick={manualPair}>
              Uyumu Keşfet
            </button>
          </div>
        </>
      )}
      {error ? <p className="cine-body" style={{ color: "#A45151" }}>{error}</p> : null}
      {result && (
        <div style={{ marginTop: 28 }}>
          <h2 className="cine-heading" style={{ fontSize: "2.4rem" }}>
            {result.signA} × {result.signB}
          </h2>
          <p className="cine-body">Bugünün Ortak Ritmi {result.generalRhythm}</p>
          <p className="cine-body">İletişim {result.communication}</p>
          <p className="cine-body">Duygusal Akış {result.emotionalFlow}</p>
          <p className="cine-body">Hareket Enerjisi {result.movementEnergy}</p>
          <p className="cine-body">Tamamlama {result.complementArea}</p>
          <p className="cine-body" style={{ marginTop: 16 }}>
            {result.jointAdvice}
          </p>
          <p className="cine-body" style={{ fontSize: "0.85rem", marginTop: 16 }}>
            Arkadaşlık, ilişki, aile veya iş için farkındalık amaçlıdır; kesin uyum iddiası değildir.
          </p>
          <Link href="/" className="cine-btn" style={{ marginTop: 20, display: "inline-flex" }}>
            Ana Sayfa
          </Link>
        </div>
      )}
    </MarketingChrome>
  );
}
