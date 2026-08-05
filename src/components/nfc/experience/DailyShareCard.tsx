"use client";

import { useState } from "react";
import type { ZodiacSign } from "@/lib/zodiac/signs";
import { formatIstanbulDate } from "@/lib/zodiac";

type Props = {
  sign: ZodiacSign;
  headline: string;
  energy: number;
  moonPhase: string;
  dateKey: string;
};

const saveKey = (dateKey: string, slug: string) => `orbia-saved-${dateKey}-${slug}`;

/** Compact save / share — logic unchanged. */
export function DailyShareCard({ sign, headline, energy, moonPhase, dateKey }: Props) {
  const [toast, setToast] = useState("");
  const [saved, setSaved] = useState(false);

  const shareText = ["ORBIA", `${sign.nameTr} · ${formatIstanbulDate()}`, headline, `Yoğunluk ${energy} · ${moonPhase}`].join(
    "\n",
  );

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "ORBIA", text: shareText });
        setToast("Paylaşım açıldı.");
        return;
      }
    } catch {
      /* cancel */
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setToast("Panoya kopyalandı.");
    } catch {
      setToast("Paylaşım kullanılamıyor.");
    }
  };

  const save = () => {
    try {
      localStorage.setItem(
        saveKey(dateKey, sign.slug),
        JSON.stringify({ date: dateKey, sign: sign.slug, energy, headline }),
      );
      setSaved(true);
      setToast("Bugünün yorumu bu cihaza kaydedildi.");
    } catch {
      setToast("Kayıt yapılamadı.");
    }
  };

  return (
    <section id="ox-share" className="ox-scene ox-actions-bar" aria-labelledby="ox-share-heading">
      <p className="ox-kicker">Yanında tut</p>
      <h2 id="ox-share-heading" className="ox-heading">
        Bugünü yanında tut.
      </h2>
      <p className="ox-body">Günlük yorumunu kaydet veya tek dokunuşla paylaş.</p>
      <div className="ox-actions-bar__row">
        <button type="button" className="ox-btn ox-btn--secondary" onClick={save} disabled={saved}>
          {saved ? "Kaydedildi" : "Kaydet"}
        </button>
        <button type="button" className="ox-btn ox-btn--ghost" onClick={() => void share()}>
          Paylaş
        </button>
      </div>
      {toast ? (
        <p className="ox-toast" role="status">
          {toast}
        </p>
      ) : null}
    </section>
  );
}
