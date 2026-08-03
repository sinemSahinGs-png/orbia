"use client";

import { useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { allSigns } from "@/lib/zodiac/signs";

export default function SiparisPage() {
  const signs = allSigns();
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMsg("");
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      sign: String(fd.get("sign") || ""),
      variant: String(fd.get("variant") || ""),
      personalization: String(fd.get("personalization") || ""),
      quantity: Number(fd.get("quantity") || 1),
      note: String(fd.get("note") || ""),
      consent: fd.get("consent") === "on",
    };
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, consent: true }),
    });
    const data = await res.json();
    setMsg(data.message || "Form backend bağlantısı bekliyor");
    setPending(false);
  }

  return (
    <MarketingChrome>
      <p className="cine-eyebrow">SİPARİŞ</p>
      <h1 className="cine-heading">ORBIA’nı Oluştur</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 14, maxWidth: 520, marginTop: 28 }}>
        <input name="name" required placeholder="Ad soyad" style={field} />
        <input name="phone" required placeholder="Telefon" style={field} />
        <input name="email" type="email" required placeholder="E-posta" style={field} />
        <select name="sign" required defaultValue="aslan" style={field}>
          {signs.map((s) => <option key={s.slug} value={s.slug}>{s.nameTr}</option>)}
        </select>
        <select name="variant" style={field}>
          <option value="obsidian">Obsidyen Siyah [placeholder]</option>
          <option value="lunar">Lunar Silver [placeholder]</option>
          <option value="midnight">Midnight Blue [placeholder]</option>
        </select>
        <input name="personalization" placeholder="Opsiyonel kısa metin" style={field} />
        <input name="quantity" type="number" min={1} max={20} defaultValue={1} style={field} />
        <textarea name="note" placeholder="Not" rows={3} style={field} />
        <label style={{ color: "#8D929D", fontSize: "0.9rem" }}>
          <input name="consent" type="checkbox" required /> Gizlilik metnini okudum.
        </label>
        <button className="cine-btn" disabled={pending} type="submit">Talep Gönder</button>
      </form>
      {msg ? <p className="cine-body" style={{ marginTop: 16 }}>{msg}</p> : null}
    </MarketingChrome>
  );
}

const field: React.CSSProperties = {
  padding: 12,
  background: "#0C0F16",
  border: "1px solid rgba(215,217,223,0.2)",
  color: "#F2F0EA",
};
