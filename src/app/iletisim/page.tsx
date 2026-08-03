import type { Metadata } from "next";
import Link from "next/link";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "İletişim" };

export default function ContactPage() {
  return (
    <MarketingChrome>
      <p className="cine-eyebrow">İletişim</p>
      <h1 className="cine-heading">Bize yazın.</h1>
      <p className="cine-body">
        Sipariş, kişiselleştirme veya teknik destek için {site.brand} ekibiyle iletişime geçin.
      </p>
      <ul className="cine-body" style={{ lineHeight: 1.9, marginTop: 24 }}>
        <li>Adres: {site.address}</li>
        <li>E-posta: {site.email}</li>
        <li>Telefon: {site.phoneDisplay}</li>
        <li>Çalışma saatleri: {site.hours}</li>
      </ul>
      <p className="cine-body" style={{ marginTop: 24 }}>
        Demo NFC deneyimi:{" "}
        <Link href="/k/AX7K29P">/k/AX7K29P</Link> (Aslan)
      </p>
      <Link href="/siparis" className="cine-btn" style={{ marginTop: 28, display: "inline-flex" }}>
        Sipariş talebi
      </Link>
    </MarketingChrome>
  );
}
