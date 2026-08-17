"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

const VIDEO_MP4 = "/videos/orbia-zodiac-backdrop.mp4";
const POSTER = "/videos/orbia-cosmic-poster.webp";

/** Living violet galaxy — present but subordinate to content. */
export function CosmicBackdrop() {
  const reduced = useReducedMotionSafe();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOk, setVideoOk] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const idle = window.requestIdleCallback?.(() => setLoadVideo(true), { timeout: 1600 });
    const fallback = window.setTimeout(() => setLoadVideo(true), 1600);
    return () => {
      if (idle != null) window.cancelIdleCallback?.(idle);
      window.clearTimeout(fallback);
    };
  }, [reduced]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced || !loadVideo) return;

    let cancelled = false;
    const activate = () => {
      if (cancelled) return;
      void v
        .play()
        .then(() => {
          if (!cancelled) setVideoOk(true);
        })
        .catch(() => {
          if (!cancelled) setVideoOk(false);
        });
    };
    const onErr = () => {
      if (!cancelled) setVideoOk(false);
    };

    v.addEventListener("loadeddata", activate);
    v.addEventListener("canplay", activate);
    v.addEventListener("playing", activate);
    v.addEventListener("error", onErr);
    if (v.readyState >= 2) activate();

    return () => {
      cancelled = true;
      v.removeEventListener("loadeddata", activate);
      v.removeEventListener("canplay", activate);
      v.removeEventListener("playing", activate);
      v.removeEventListener("error", onErr);
    };
  }, [reduced, loadVideo]);

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    const el = rootRef.current;
    if (!el) return;

    let raf = 0;
    const syncVideoDepth = () => {
      const y = window.scrollY;
      const h = Math.max(1, window.innerHeight);
      const t = Math.min(1, y / (h * 1.15));
      // Hero ~0.155 → content ~0.11 (≈30% quieter than prior 0.22 peak)
      el.style.setProperty("--ox-video-op", String(0.32 - t * 0.08));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncVideoDepth);
    };
    syncVideoDepth();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = rootRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      el.style.setProperty("--ox-parx", `${Math.max(-4, Math.min(4, x))}px`);
      el.style.setProperty("--ox-pary", `${Math.max(-4, Math.min(4, y))}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  return (
    <div ref={rootRef} className="ox-cosmos" aria-hidden>
      <div className="ox-cosmos__void" />
      <div className={`ox-cosmos__nebula ox-cosmos__nebula--a${reduced ? " is-static" : ""}`} />
      <div className={`ox-cosmos__nebula ox-cosmos__nebula--b${reduced ? " is-static" : ""}`} />
      <div className="ox-cosmos__mist" />
      <div className={`ox-cosmos__stars${reduced ? " is-static" : ""}`} />
      <div className="ox-cosmos__grain" />
      <div className="ox-cosmos__vignette" />
      <div className="ox-cosmos__poster" style={{ backgroundImage: `url(${POSTER})` }} />
      {!reduced && loadVideo ? (
        <video
          ref={videoRef}
          className="ox-cosmos__video"
          style={videoOk ? undefined : { opacity: 0 }}
          muted
          playsInline
          loop
          autoPlay
          preload="none"
          poster={POSTER}
          aria-hidden
        >
          <source src={VIDEO_MP4} type="video/mp4" />
        </video>
      ) : null}
      <div className="ox-cosmos__read-veil" />
    </div>
  );
}
