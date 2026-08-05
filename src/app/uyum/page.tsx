"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PAIR_STORAGE_KEY, isPairSessionValid, type PairSession } from "@/lib/nfc/pair-session";
import { getDemoCodeForSign } from "@/lib/nfc/demo-tags";
import { allSigns } from "@/lib/zodiac/signs";
import { formatIstanbulDate } from "@/lib/zodiac";
import "@/app/nfc-experience.css";

type Compat = {
  signA: string;
  signB: string;
  dateKey?: string;
  generalRhythm: number;
  communication: number;
  emotionalFlow: number;
  movementEnergy: number;
  complementArea: number;
  strengthToday: string;
  sensitivePoint: string;
  jointAdvice: string;
};

export default function UyumPage() {
  const [session, setSession] = useState<PairSession | null>(null);
  const [manualB, setManualB] = useState("terazi");
  const [result, setResult] = useState<Compat | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signs = useMemo(() => allSigns(), []);

  const applyResult = useCallback((data: {
    signA: string;
    signB: string;
    dateKey?: string;
    result: Omit<Compat, "signA" | "signB" | "dateKey">;
  }) => {
    setResult({
      signA: data.signA,
      signB: data.signB,
      dateKey: data.dateKey,
      ...data.result,
    });
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
      setError(data.error || "Eşleşme tamamlanamadı.");
      return;
    }
    if (data.pairToken) {
      const url = new URL(window.location.href);
      url.search = `t=${encodeURIComponent(data.pairToken)}`;
      window.history.replaceState({}, "", url.toString());
    }
    applyResult(data);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const raw = localStorage.getItem(PAIR_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PairSession;
          if (isPairSessionValid(parsed) && !cancelled) setSession(parsed);
        }
      } catch {
        /* ignore */
      }

      const params = new URLSearchParams(window.location.search);
      const token = params.get("t");
      const second = params.get("second");
      const first = params.get("first");

      if (token) {
        const res = await fetch(`/api/pair/result?t=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (!cancelled) {
          if (data.ok) applyResult(data);
          else setError(data.error || "Sonuç yüklenemedi.");
          setLoading(false);
        }
        return;
      }

      if (second) {
        let firstCode = first;
        if (!firstCode) {
          try {
            const raw = localStorage.getItem(PAIR_STORAGE_KEY);
            if (raw) {
              const parsed = JSON.parse(raw) as PairSession;
              if (isPairSessionValid(parsed)) firstCode = parsed.firstCode;
            }
          } catch {
            /* ignore */
          }
        }
        if (firstCode) {
          await complete(firstCode, second);
        } else if (!cancelled) {
          setError("Bekleyen ilk ORBIA bulunamadı. Önce bir anahtarlık okut.");
        }
      }
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function manualPair() {
    if (!session) {
      setError("Önce bir ORBIA okut.");
      return;
    }
    const secondCode = getDemoCodeForSign(manualB);
    if (!secondCode) {
      setError("Bu burç için demo kod yok.");
      return;
    }
    setLoading(true);
    await complete(session.firstCode, secondCode);
    setLoading(false);
  }

  const drawShareCard = useCallback(() => {
    if (!result || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const g = ctx.createLinearGradient(0, 0, 0, 1920);
    g.addColorStop(0, "#080B10");
    g.addColorStop(0.45, "#030507");
    g.addColorStop(1, "#05070c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.fillStyle = "rgba(200,155,74,0.12)";
    ctx.beginPath();
    ctx.arc(540, 420, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(200,155,74,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(540, 720, 160, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(540, 720, 210, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#F0E8DA";
    ctx.font = "500 42px 'Bodoni Moda', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("ORBIA", 540, 160);

    ctx.fillStyle = "#92969F";
    ctx.font = "400 28px Manrope, sans-serif";
    ctx.fillText(formatIstanbulDate(result.dateKey), 540, 220);

    ctx.fillStyle = "#F0E8DA";
    ctx.font = "500 64px 'Bodoni Moda', Georgia, serif";
    ctx.fillText(`${result.signA} × ${result.signB}`, 540, 340);

    ctx.fillStyle = "#C89B4A";
    ctx.font = "500 160px ui-monospace, monospace";
    ctx.fillText(`${result.generalRhythm}`, 540, 780);
    ctx.font = "400 28px Manrope, sans-serif";
    ctx.fillStyle = "#92969F";
    ctx.fillText("Genel uyum", 540, 840);

    const rows: [string, string][] = [
      ["İletişim", String(result.communication)],
      ["Duygusal ritim", String(result.emotionalFlow)],
      ["Çekim", String(result.movementEnergy)],
      ["Güçlü taraf", result.strengthToday],
      ["Hassas nokta", result.sensitivePoint],
    ];
    let y = 980;
    rows.forEach(([label, value]) => {
      ctx.fillStyle = "#92969F";
      ctx.font = "400 26px Manrope, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(label, 140, y);
      ctx.fillStyle = "#F0E8DA";
      ctx.textAlign = "right";
      ctx.font = "500 28px ui-monospace, Manrope, sans-serif";
      ctx.fillText(value, 940, y);
      y += 70;
    });

    ctx.textAlign = "center";
    ctx.fillStyle = "#C89B4A";
    ctx.font = "500 32px 'Bodoni Moda', Georgia, serif";
    wrapText(ctx, result.jointAdvice, 540, 1420, 780, 42);

    ctx.fillStyle = "rgba(146,150,159,0.75)";
    ctx.font = "400 22px Manrope, sans-serif";
    ctx.fillText("Eğlence ve kişisel farkındalık deneyimi · orbia.com.tr", 540, 1780);

    return canvas;
  }, [result]);

  const shareCard = async () => {
    const canvas = drawShareCard();
    if (!canvas) {
      setToast("Kart oluşturulamadı.");
      return;
    }
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png"),
    );
    if (!blob) {
      setToast("Görsel hazırlanamadı.");
      return;
    }
    const file = new File([blob], "orbia-uyum.png", { type: "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "ORBIA Uyum",
          text: `${result!.signA} × ${result!.signB} · bugünkü uyum`,
        });
        setToast("Paylaşım açıldı.");
        return;
      }
    } catch {
      /* fall through */
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orbia-uyum.png";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Görsel indirildi.");
  };

  return (
    <div className="ux ox-fonts">
      <div className="ux__stage">
        <p className="ox-eyebrow" style={{ color: "#C89B4A" }}>
          Uyum
        </p>

        {loading ? <p className="scene-body">Yükleniyor…</p> : null}

        {!loading && !result ? (
          <>
            <h1>İki ORBIA. Tek yörünge.</h1>
            <p className="scene-body" style={{ color: "#92969F", maxWidth: "34ch" }}>
              {session
                ? "İkinci anahtarlığı okut veya burcunu seç — bugünkü ortak ritminizi görelim."
                : "Eşleşme için önce bir ORBIA okut (/aslan, /terazi…)."}
            </p>
            <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
              <label className="scene-body" style={{ color: "#92969F" }}>
                Burçla dene
                <select
                  value={manualB}
                  onChange={(e) => setManualB(e.target.value)}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                    minHeight: 48,
                    padding: "0 12px",
                    background: "#080B10",
                    color: "#F0E8DA",
                    border: "1px solid rgba(146,150,159,0.2)",
                  }}
                >
                  {signs.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.nameTr}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="ox-btn ox-btn--primary" onClick={() => void manualPair()}>
                Uyumu göster
              </button>
            </div>
          </>
        ) : null}

        {error ? (
          <p className="scene-body" style={{ color: "#c97878", marginTop: 16 }} role="alert">
            {error}
          </p>
        ) : null}

        {result ? (
          <>
            <h1>
              {result.signA} × {result.signB}
            </h1>
            <p className="scene-body" style={{ color: "#92969F" }}>
              {formatIstanbulDate(result.dateKey)} · Europe/Istanbul
            </p>
            <p className="ux__score" aria-label={`Genel uyum ${result.generalRhythm}`}>
              {result.generalRhythm}
              <span style={{ fontSize: "0.35em", display: "block", color: "#92969F", marginTop: 8 }}>
                Genel uyum
              </span>
            </p>

            <div className="ux__grid" role="list">
              <div className="ux__row" role="listitem">
                <span>İletişim</span>
                <strong>{result.communication}</strong>
              </div>
              <div className="ux__row" role="listitem">
                <span>Duygusal ritim</span>
                <strong>{result.emotionalFlow}</strong>
              </div>
              <div className="ux__row" role="listitem">
                <span>Çekim</span>
                <strong>{result.movementEnergy}</strong>
              </div>
              <div className="ux__row" role="listitem">
                <span>Bugünkü güçlü taraf</span>
                <strong style={{ textAlign: "right", maxWidth: "16ch" }}>{result.strengthToday}</strong>
              </div>
              <div className="ux__row" role="listitem">
                <span>Bugünkü hassas nokta</span>
                <strong style={{ textAlign: "right", maxWidth: "16ch" }}>{result.sensitivePoint}</strong>
              </div>
            </div>

            <p
              style={{
                marginTop: "1.75rem",
                fontFamily: "var(--font-display), Bodoni Moda, Georgia, serif",
                fontSize: "clamp(1.25rem, 5vw, 1.55rem)",
                lineHeight: 1.35,
                letterSpacing: "-0.02em",
                color: "#C89B4A",
                maxWidth: "22ch",
              }}
            >
              {result.jointAdvice}
            </p>

            <p className="ux__note">
              Bu bir eğlence ve kişisel farkındalık deneyimidir; kesin uyum veya ilişki tavsiyesi değildir.
              Aynı iki ORBIA, aynı günde aynı sonucu verir.
            </p>

            <div className="ox-actions" style={{ marginTop: "1.5rem" }}>
              <button type="button" className="ox-btn ox-btn--primary" onClick={() => void shareCard()}>
                Paylaşım kartı (1080×1920)
              </button>
              <Link href="/" className="ox-btn ox-btn--ghost">
                ORBIA ana sayfa
              </Link>
            </div>
            {toast ? (
              <p className="ox-toast" role="status">
                {toast}
              </p>
            ) : null}
            <canvas
              ref={canvasRef}
              aria-hidden
              width={1080}
              height={1920}
              style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, cy);
      line = words[i] + " ";
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, cy);
}
