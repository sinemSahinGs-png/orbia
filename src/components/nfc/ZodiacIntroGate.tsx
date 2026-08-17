"use client";

import type { ReactNode } from "react";
import type { ZodiacSlug } from "@/content/zodiac-intros";

export type ZodiacIntroGateProps = {
  zodiac: ZodiacSlug;
  children: ReactNode;
};

/** Content opens immediately — intro overlay removed so first paint is never a black wait. */
export function ZodiacIntroGate({ children }: ZodiacIntroGateProps) {
  return <>{children}</>;
}
