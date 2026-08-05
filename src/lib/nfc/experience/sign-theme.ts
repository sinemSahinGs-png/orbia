export type SignExperienceTheme = {
  primary: string;
  secondary: string;
  glow: string;
};

/** Soft atlas accents — violet family, no electric neon. */
const THEMES: Record<string, SignExperienceTheme> = {
  koc: { primary: "#C97B6A", secondary: "#A787DD", glow: "rgba(201,123,106,0.28)" },
  boga: { primary: "#8FA88A", secondary: "#C9B6E8", glow: "rgba(143,168,138,0.26)" },
  ikizler: { primary: "#9A8DC4", secondary: "#C9B6E8", glow: "rgba(154,141,196,0.28)" },
  yengec: { primary: "#8E9BC0", secondary: "#A787DD", glow: "rgba(142,155,192,0.26)" },
  aslan: { primary: "#C9A06A", secondary: "#A787DD", glow: "rgba(201,160,106,0.28)" },
  basak: { primary: "#9AA88A", secondary: "#C9B6E8", glow: "rgba(154,168,138,0.26)" },
  terazi: { primary: "#B8A4D4", secondary: "#C9B6E8", glow: "rgba(184,164,212,0.28)" },
  akrep: { primary: "#C85C8C", secondary: "#A787DD", glow: "rgba(190,96,157,0.32)" },
  yay: { primary: "#A787DD", secondary: "#C9B6E8", glow: "rgba(167,135,221,0.28)" },
  oglak: { primary: "#8A90A8", secondary: "#A787DD", glow: "rgba(138,144,168,0.26)" },
  kova: { primary: "#9A8DC4", secondary: "#C9B6E8", glow: "rgba(154,141,196,0.28)" },
  balik: { primary: "#8E8BC0", secondary: "#A787DD", glow: "rgba(142,139,192,0.28)" },
};

export function getSignExperienceTheme(slug: string): SignExperienceTheme {
  return THEMES[slug] ?? THEMES.akrep;
}

export function signThemeCssVars(slug: string): Record<string, string> {
  const t = getSignExperienceTheme(slug);
  return {
    "--sign-primary": t.primary,
    "--sign-secondary": t.secondary,
    "--sign-glow": t.glow,
  };
}
