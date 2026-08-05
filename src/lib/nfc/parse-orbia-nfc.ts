import { DEMO_TAGS, getDemoCodeForSign } from "@/lib/nfc/demo-tags";
import { allSigns } from "@/lib/zodiac/signs";
import { normalizeSignSlug } from "@/lib/zodiac/normalize-sign-slug";

const CODE_RE = /\b([A-Z0-9]{7})\b/i;
const PATH_CODE_RE = /\/k\/([A-Za-z0-9]+)/i;
const PATH_SIGN_RE = /(?:orbia\.com\.tr|localhost(?::\d+)?)\/([a-zçğıöşü]+)(?:\/|\?|#|$)/i;

const SIGN_SLUGS = new Set(allSigns().map((s) => s.slug));

/** Extract an ORBIA tag code from NFC NDEF URL / text. Returns uppercase demo code or null. */
export function parseOrbiaCodeFromNfcPayload(raw: string): string | null {
  const text = raw.trim();
  if (!text) return null;

  const pathCode = text.match(PATH_CODE_RE);
  if (pathCode?.[1]) {
    const code = pathCode[1].toUpperCase();
    if (code in DEMO_TAGS) return code;
  }

  const signMatch = text.match(PATH_SIGN_RE);
  if (signMatch?.[1]) {
    const slug = normalizeSignSlug(signMatch[1]);
    if (SIGN_SLUGS.has(slug)) {
      return getDemoCodeForSign(slug) ?? null;
    }
  }

  // Bare path like /aslan
  try {
    const url = new URL(text, "https://www.orbia.com.tr");
    const seg = url.pathname.replace(/^\//, "").split("/")[0];
    if (seg) {
      if (seg.toLowerCase() === "k") {
        const code = url.pathname.split("/")[2]?.toUpperCase();
        if (code && code in DEMO_TAGS) return code;
      }
      const slug = normalizeSignSlug(seg);
      if (SIGN_SLUGS.has(slug)) return getDemoCodeForSign(slug) ?? null;
    }
  } catch {
    /* not a URL */
  }

  const bare = text.match(CODE_RE);
  if (bare?.[1]) {
    const code = bare[1].toUpperCase();
    if (code in DEMO_TAGS) return code;
  }

  const asSlug = normalizeSignSlug(text);
  if (SIGN_SLUGS.has(asSlug)) return getDemoCodeForSign(asSlug) ?? null;

  return null;
}
