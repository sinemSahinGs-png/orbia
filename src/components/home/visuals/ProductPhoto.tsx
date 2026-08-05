"use client";

import { useState, type CSSProperties } from "react";
import type { ZodiacSign } from "@/lib/zodiac/signs";
import { productMedia } from "@/content/product";
import { KeychainPlaceholder } from "@/components/home/visuals/KeychainPlaceholder";

type Size = "lg" | "xl";

type Props = {
  sign?: Pick<ZodiacSign, "nameTr" | "glyphPathHint" | "accentColor">;
  src?: string | null;
  alt?: string;
  size?: Size;
  className?: string;
  priority?: boolean;
  surface?: string;
  metal?: string;
  engraving?: string;
};

const SIZE_CLASS: Record<Size, string> = {
  lg: "ak-product-photo--lg",
  xl: "ak-product-photo--xl",
};

/**
 * Real product photo with KeychainPlaceholder fallback on error / missing src.
 */
export function ProductPhoto({
  sign,
  src = productMedia.keychainMain,
  alt = "ORBIA anahtarlık",
  size = "xl",
  className = "",
  priority = false,
  surface,
  metal,
  engraving,
}: Props) {
  const [failed, setFailed] = useState(false);
  const resolved = src && !failed ? src : null;

  if (!resolved) {
    if (!sign) {
      return (
        <div className={`ak-product-photo ak-product-photo--empty ${SIZE_CLASS[size]} ${className}`.trim()} />
      );
    }
    return (
      <KeychainPlaceholder
        sign={sign}
        size={size}
        surface={surface}
        metal={metal}
        engraving={engraving}
        className={className}
      />
    );
  }

  return (
    <div
      className={`ak-product-photo ${SIZE_CLASS[size]} ${className}`.trim()}
      style={
        {
          "--ak-photo-w": productMedia.keychainMainWidth,
          "--ak-photo-h": productMedia.keychainMainHeight,
        } as CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local static asset with explicit fallback */}
      <img
        className="ak-product-photo__img"
        src={resolved}
        alt={alt}
        width={productMedia.keychainMainWidth}
        height={productMedia.keychainMainHeight}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
