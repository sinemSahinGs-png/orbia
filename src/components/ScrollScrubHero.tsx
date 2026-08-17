"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { productMedia } from "@/content/product";

const LEGACY_SCRUB_VIDEO = "/mc-hero-scrub.mp4";
const LEGACY_SCRUB_POSTER = "/mc-hero-poster.jpg";
/** Soft catch-up — scroll leads, frames ease behind. */
const LERP_FACTOR = 0.22;
const SEEK_THRESHOLD = 1 / 48; // ~half frame at 24fps
/**
 * Scrub travel for short cosmic clips (~6s).
 * Mobile stays cinematic without multi-screen black void.
 */
const MOBILE_HEIGHT = "140svh";
const DESKTOP_HEIGHT = "300vh";

const HERO_POSTER = productMedia.heroPoster ?? LEGACY_SCRUB_POSTER;

function resolveHeroVideoSrc(isMobile: boolean): string {
  const preferred = isMobile
    ? productMedia.heroMobileVideo
    : productMedia.heroDesktopVideo;
  return (
    preferred ??
    productMedia.heroDesktopVideo ??
    productMedia.heroMobileVideo ??
    productMedia.heroFallbackMp4 ??
    LEGACY_SCRUB_VIDEO
  );
}

interface ScrollScrubHeroProps {
  demoHref?: string;
}

export function ScrollScrubHero({ demoHref = "#demo" }: ScrollScrubHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const targetProgressRef = useRef(0);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const isVideoReadyRef = useRef(false);
  const seekingRef = useRef(false);

  const [videoReady, setVideoReady] = useState(false);
  const [allowVideo, setAllowVideo] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  /**
   * Critical: never default to desktop height on mobile SSR/first paint.
   * Height is primarily driven by CSS media queries; state only syncs scrub math.
   */
  const [sectionHeight, setSectionHeight] = useState<string | undefined>(undefined);
  const [heroVideoSrc, setHeroVideoSrc] = useState<string | null>(null);
  const [usedFallbackSrc, setUsedFallbackSrc] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    let enabled = false;
    const enable = () => {
      if (enabled) return;
      enabled = true;
      setAllowVideo(true);
    };
    window.addEventListener("scroll", enable, { once: true, passive: true });
    window.addEventListener("pointerdown", enable, { once: true });
    window.addEventListener("touchstart", enable, { once: true, passive: true });
    const idle = window.requestIdleCallback?.(enable, { timeout: 2500 });
    const fallback = window.setTimeout(enable, 2500);
    return () => {
      window.removeEventListener("scroll", enable);
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("touchstart", enable);
      if (idle != null) window.cancelIdleCallback?.(idle);
      window.clearTimeout(fallback);
    };
  }, [reduceMotion]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const updateSectionHeight = () => {
      setSectionHeight(mediaQuery.matches ? MOBILE_HEIGHT : DESKTOP_HEIGHT);
    };

    const updateVideoSrc = () => {
      setHeroVideoSrc(resolveHeroVideoSrc(mediaQuery.matches));
      setUsedFallbackSrc(false);
    };

    updateSectionHeight();
    updateVideoSrc();
    mediaQuery.addEventListener("change", updateSectionHeight);
    mediaQuery.addEventListener("change", updateVideoSrc);
    window.addEventListener("resize", updateSectionHeight);

    return () => {
      mediaQuery.removeEventListener("change", updateSectionHeight);
      mediaQuery.removeEventListener("change", updateVideoSrc);
      window.removeEventListener("resize", updateSectionHeight);
    };
  }, []);

  /* Typography entrance only — video/scrub unchanged */
  useLayoutEffect(() => {
    if (reduceMotion) return;

    const heading = headingRef.current;
    const body = bodyRef.current;
    const hint = hintRef.current;
    const note = noteRef.current;
    const actions = actionsRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    if (!heading || !body || !hint || !line1 || !line2) return;

    const words1 = gsap.utils.toArray<HTMLElement>(line1.querySelectorAll(".hero-word"));
    const words2 = gsap.utils.toArray<HTMLElement>(line2.querySelectorAll(".hero-word"));
    const ctaItems = actions
      ? gsap.utils.toArray<HTMLElement>(actions.children)
      : [];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(
        words1,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.08,
        },
        0.15,
      );

      tl.to(
        words2,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.08,
        },
        "-=0.72",
      );

      tl.to(
        body,
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75 },
        "-=0.35",
      );

      if (note) {
        tl.to(
          note,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 },
          "-=0.25",
        );
      }

      if (ctaItems.length) {
        tl.to(
          ctaItems,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.75,
            stagger: 0.1,
          },
          "-=0.15",
        );
      }

      tl.to(
        hint,
        { opacity: 0.48, y: 0, filter: "blur(0px)", duration: 0.65 },
        "-=0.2",
      );

      tl.set([...words1, ...words2, body, note, ...ctaItems].filter(Boolean), {
        clearProps: "filter",
        opacity: 1,
        y: 0,
        rotateX: 0,
      });

      gsap.to(hint, {
        y: 6,
        opacity: 0.62,
        duration: 1.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: tl.duration() * 0.02,
      });
    }, heading);

    return () => ctx.revert();
  }, [reduceMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !heroVideoSrc) return;

    let cancelled = false;
    let scrollTrigger: ScrollTrigger | null = null;
    let scrubTick: (() => void) | null = null;
    isVideoReadyRef.current = false;
    setVideoReady(false);
    targetProgressRef.current = 0;
    currentTimeRef.current = 0;
    seekingRef.current = false;

    const markReady = () => {
      if (cancelled || isVideoReadyRef.current) return;
      isVideoReadyRef.current = true;
      video.pause();
      currentTimeRef.current = 0;
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
      try {
        video.currentTime = 0;
      } catch {
        /* ignore seek errors before enough data */
      }
      setVideoReady(true);
    };

    const onLoadedMetadata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      durationRef.current = video.duration;
      if (video.readyState >= 2) markReady();
    };

    const onLoadedData = () => {
      markReady();
    };

    const onCanPlay = () => {
      markReady();
    };

    const onCanPlayThrough = () => {
      markReady();
    };

    const onSeeked = () => {
      seekingRef.current = false;
    };

    const onError = () => {
      const fallback = productMedia.heroFallbackMp4;
      if (!usedFallbackSrc && fallback && heroVideoSrc !== fallback) {
        setUsedFallbackSrc(true);
        setHeroVideoSrc(fallback);
        return;
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("canplaythrough", onCanPlayThrough);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);

    const readyTimeout = window.setTimeout(() => {
      /* do not force ready without a frame */
    }, 1200);

    try {
      video.preload = "metadata";
    } catch {
      /* ignore */
    }

    if (video.readyState >= 2) {
      durationRef.current = video.duration;
      markReady();
    } else if (video.readyState >= 1) {
      onLoadedMetadata();
    }

    if (!reduceMotion) {
      const sticky = stickyRef.current;
      if (sticky) {
        gsap.registerPlugin(ScrollTrigger);

        scrollTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          pin: sticky,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            targetProgressRef.current = self.progress;
          },
        });

        scrubTick = () => {
          if (!isVideoReadyRef.current) return;

          const duration = durationRef.current;
          if (!duration) return;

          const progress = targetProgressRef.current;
          const target = Math.min(duration, Math.max(0, progress * duration));
          /* Catch up faster when far behind so scrub never feels stuck. */
          const gap = Math.abs(target - currentTimeRef.current);
          const lerpFactor =
            gap > 0.35 ? 0.55 : progress > 0.94 ? 0.4 : LERP_FACTOR;

          currentTimeRef.current += (target - currentTimeRef.current) * lerpFactor;

          if (progress >= 0.995) {
            currentTimeRef.current = duration;
          }

          if (!video.paused) video.pause();

          const delta = Math.abs(video.currentTime - currentTimeRef.current);
          if (delta > SEEK_THRESHOLD && !seekingRef.current) {
            seekingRef.current = true;
            try {
              video.currentTime = currentTimeRef.current;
            } catch {
              seekingRef.current = false;
            }
            window.setTimeout(() => {
              seekingRef.current = false;
            }, 90);
          }

          if (hintRef.current) {
            hintRef.current.style.opacity = String(Math.max(0, 0.55 - progress * 1.6));
          }

          if (copyRef.current) {
            const copyOpacity =
              progress > 0.9 ? Math.max(0, 1 - (progress - 0.9) / 0.1) : 1;
            const lift = progress > 0.9 ? (progress - 0.9) * -5 : 0;
            copyRef.current.style.opacity = String(copyOpacity);
            copyRef.current.style.transform = `translate3d(0, ${lift}vh, 0)`;
          }
        };

        gsap.ticker.add(scrubTick);

        const onResize = () => {
          ScrollTrigger.refresh();
        };

        window.addEventListener("resize", onResize);
        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          cancelled = true;
          window.clearTimeout(readyTimeout);
          window.removeEventListener("resize", onResize);
          if (scrubTick) gsap.ticker.remove(scrubTick);
          scrollTrigger?.kill();
          video.removeEventListener("loadedmetadata", onLoadedMetadata);
          video.removeEventListener("loadeddata", onLoadedData);
          video.removeEventListener("canplay", onCanPlay);
          video.removeEventListener("canplaythrough", onCanPlayThrough);
          video.removeEventListener("seeked", onSeeked);
          video.removeEventListener("error", onError);
          video.pause();
        };
      }
    }

    const showStaticFrame = () => {
      if (cancelled) return;
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
      markReady();
    };

    if (video.readyState >= 2) {
      showStaticFrame();
    } else {
      video.addEventListener("loadeddata", showStaticFrame, { once: true });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimeout);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("loadeddata", showStaticFrame);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      video.pause();
    };
  }, [reduceMotion, heroVideoSrc, usedFallbackSrc, allowVideo]);

  useEffect(() => {
    if (reduceMotion) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();
  }, [sectionHeight, reduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`hero-scrub${reduceMotion ? " hero-scrub--static" : ""}`}
      style={
        reduceMotion
          ? { height: "100svh" }
          : sectionHeight
            ? { height: sectionHeight }
            : undefined
      }
      aria-label="ORBIA cinematic hero"
    >
      <div ref={stickyRef} className="hero-scrub__sticky">
        <div
          className="hero-scrub__poster"
          style={{ backgroundImage: `url(${HERO_POSTER})` }}
          aria-hidden
        />
        {!reduceMotion && allowVideo && heroVideoSrc ? (
          <video
            key={heroVideoSrc}
            ref={videoRef}
            className={`hero-scrub__video${videoReady ? " hero-scrub__video--ready" : ""}`}
            src={heroVideoSrc}
            poster={HERO_POSTER}
            muted
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : null}

        <div className="hero-scrub__wash" aria-hidden />
        <div className="hero-scrub__veil" aria-hidden />

        <div ref={copyRef} className="hero-scrub__copy">
          <div className="hero-scrub__copy-inner">
            <h1 ref={headingRef} className="hero-title">
              <span ref={line1Ref} className="hero-title-line">
                <span className="hero-word">Gökyüzünü</span>
                <span className="hero-word">yanında</span>
              </span>
              <span
                ref={line2Ref}
                className="hero-title-line hero-title-line--accent">
                <span className="hero-word">taşı.</span>
              </span>
            </h1>

            <p ref={bodyRef} className="hero-scrub__supporting">
              Burcuna özel NFC anahtarlığını dokundur. Günlük enerjini, Ay ritmini ve sana özel gökyüzü deneyimini keşfet.
            </p>

            <p ref={noteRef} className="hero-scrub__micro">
              <span className="hero-scrub__micro-dot" aria-hidden />
              Dokundur. Hisset. Keşfet.
            </p>

            <div ref={actionsRef} className="hero-scrub__actions">
              <a href={demoHref} className="hero-cta hero-cta--primary">
                Burcunu Seç
              </a>
              <a href="/nasil-calisir" className="hero-cta hero-cta--secondary">
                <span className="hero-cta__play" aria-hidden />
                Deneyimi Keşfet
              </a>
            </div>
          </div>
        </div>

        <p ref={hintRef} className="hero-scrub__hint">
          KEŞFETMEK İÇİN KAYDIR
        </p>
      </div>
    </section>
  );
}
