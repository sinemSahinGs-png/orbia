import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { allSigns } from "@/lib/zodiac/signs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.domain.replace(/\/$/, "");
  const staticRoutes = [
    "",
    "/urunler",
    "/nasil-calisir",
    "/uyum",
    "/siparis",
    "/sss",
    "/iletisim",
    "/gizlilik",
    "/cerez",
    "/astroloji-bildirimi",
  ];

  const signRoutes = allSigns().flatMap((s) => [
    `/${s.slug}`,
    `/urunler/${s.slug}`,
    `/burc/${s.slug}`,
  ]);

  return [...staticRoutes, ...signRoutes].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
