export type EncodeMode =
  | "music"
  | "instagram"
  | "whatsapp"
  | "website"
  | "tel"
  | "text"
  | "custom";

export function formatPayload(mode: EncodeMode, value: string, extra = ""): string {
  const raw = value.trim();
  if (!raw) return "";

  switch (mode) {
    case "music":
    case "website":
    case "custom": {
      if (/^https?:\/\//i.test(raw)) return raw;
      return `https://${raw.replace(/^\/+/, "")}`;
    }
    case "instagram": {
      if (/^https?:\/\//i.test(raw)) return raw;
      const handle = raw.replace(/^@/, "");
      return `https://instagram.com/${handle}`;
    }
    case "whatsapp": {
      const digits = raw.replace(/[^\d]/g, "");
      const msg = extra.trim();
      if (msg) {
        return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
      }
      return `https://wa.me/${digits}`;
    }
    case "tel": {
      const digits = raw.replace(/[^\d+]/g, "");
      return `tel:${digits}`;
    }
    case "text":
      return raw;
    default:
      return raw;
  }
}

export function isProbablyIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function hasWebNfc(): boolean {
  return typeof window !== "undefined" && typeof window.NDEFReader === "function";
}
