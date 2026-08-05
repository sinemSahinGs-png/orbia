"use client";

import Link from "next/link";
import "@/app/nfc-experience.css";

type Props = {
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function InvalidKeyState({
  title,
  body,
  primaryHref = "/urunler",
  primaryLabel = "ORBIA’yı Keşfet",
}: Props) {
  return (
    <div className="ox ox-state">
      <div className="ox-state__orbit" aria-hidden />
      <p className="data-label" style={{ marginBottom: "1.25rem", position: "relative" }}>
        ORBIA
      </p>
      <h1>{title}</h1>
      <p>{body}</p>
      <div className="ox-state__actions">
        <Link href={primaryHref} className="ox-btn ox-btn--primary">
          {primaryLabel}
        </Link>
        <Link href="/iletisim" className="ox-btn">
          Destek Al
        </Link>
        <button type="button" className="ox-btn" onClick={() => window.location.reload()}>
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}

export function NfcLoadingState() {
  return (
    <div className="ox ox-state" role="status" aria-live="polite">
      <div className="ox-state__orbit" aria-hidden />
      <p className="data-label" style={{ position: "relative" }}>
        ORBIA
      </p>
      <h1 style={{ fontSize: "clamp(1.5rem, 7vw, 2rem)", marginTop: "1rem" }}>
        Gökyüzün hazırlanıyor.
      </h1>
    </div>
  );
}
