export const DEMO_TAGS = {
  AX7K29P: "aslan",
  BK3M81Q: "terazi",
  CN9R44T: "kova",
  DP2L65A: "koc",
  EQ4N73B: "boga",
  FR8S20C: "ikizler",
  GT5U91D: "yengec",
  HV6W32E: "basak",
  JX1Y84F: "akrep",
  KZ7A53G: "yay",
  LM3B26H: "oglak",
  NP9C68J: "balik",
} as const;

export type DemoTagCode = keyof typeof DEMO_TAGS;

export const DEFAULT_DEMO_CODE: DemoTagCode = "AX7K29P";

export function getDemoCodeForSign(slug: string): DemoTagCode | undefined {
  const entry = Object.entries(DEMO_TAGS).find(([, sign]) => sign === slug);
  return entry?.[0] as DemoTagCode | undefined;
}
