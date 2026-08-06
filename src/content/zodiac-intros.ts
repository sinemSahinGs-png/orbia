export type ZodiacSlug =
  | "koc"
  | "boga"
  | "ikizler"
  | "yengec"
  | "aslan"
  | "basak"
  | "terazi"
  | "akrep"
  | "yay"
  | "oglak"
  | "kova"
  | "balik";

export type ZodiacIntroSources = {
  webm: string;
  mp4: string;
};

const INTRO_DIR = "/videos/zodiac-intros";

function introPair(slug: ZodiacSlug): ZodiacIntroSources {
  return {
    webm: `${INTRO_DIR}/${slug}-intro.webm`,
    mp4: `${INTRO_DIR}/${slug}-intro.mp4`,
  };
}

export const ZODIAC_SLUGS = [
  "koc",
  "boga",
  "ikizler",
  "yengec",
  "aslan",
  "basak",
  "terazi",
  "akrep",
  "yay",
  "oglak",
  "kova",
  "balik",
] as const satisfies readonly ZodiacSlug[];

export const zodiacIntroVideos: Record<ZodiacSlug, ZodiacIntroSources> = {
  koc: introPair("koc"),
  boga: introPair("boga"),
  ikizler: introPair("ikizler"),
  yengec: introPair("yengec"),
  aslan: introPair("aslan"),
  basak: introPair("basak"),
  terazi: introPair("terazi"),
  akrep: introPair("akrep"),
  yay: introPair("yay"),
  oglak: introPair("oglak"),
  kova: introPair("kova"),
  balik: introPair("balik"),
};

export function isZodiacSlug(value: string): value is ZodiacSlug {
  return (ZODIAC_SLUGS as readonly string[]).includes(value);
}

export function getZodiacIntroVideos(slug: ZodiacSlug): ZodiacIntroSources {
  return zodiacIntroVideos[slug];
}
