"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SCRUB_VIDEO_SRC = "/mc-hero-scrub.mp4";
const SCRUB_POSTER_SRC = "/mc-hero-poster.jpg";
const LERP_FACTOR = 0.12;
const SEEK_THRESHOLD = 0.015;
/** Mobile scrub distance — kept short so users never scroll empty black space. */
const MOBILE_HEIGHT = "135svh";
const DESKTOP_HEIGHT = "280vh";

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

  const [videoReady, setVideoReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  /**
   * Critical: never default to desktop 280/380vh on mobile SSR/first paint.
   * Height is primarily driven by CSS media queries; state only syncs scrub math.
   */
  const [sectionHeight, setSectionHeight] = useState<string | undefined>(undefined);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const updateSectionHeight = () => {
      setSectionHeight(mediaQuery.matches ? MOBILE_HEIGHT : DESKTOP_HEIGHT);
    };

    updateSectionHeight();
    mediaQuery.addEventListener("change", updateSectionHeight);
    window.addEventListener("resize", updateSectionHeight);

    return () => {
      mediaQuery.removeEventListener("change", updateSectionHeight);
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
      gsap.set([body, note, hint, ...ctaItems].filter(Boolean), {
        opacity: 0,
        y: 16,
        filter: "blur(6px)",
      });
      gsap.set([...words1, ...words2], {
        opacity: 0,
        y: 36,
        rotateX: -8,
        filter: "blur(8px)",
        transformOrigin: "50% 100%",
      });

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

      /* Persist final states — no leftover clip/opacity */
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
    if (!section || !video) return;

    let cancelled = false;
    let scrollTrigger: ScrollTrigger | null = null;
    let scrubTick: (() => void) | null = null;

    const markReady = () => {
      if (cancelled || isVideoReadyRef.current) return;
      isVideoReadyRef.current = true;
      video.pause();
      currentTimeRef.current = 0;
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
      try {
        if (Math.abs(video.currentTime) > SEEK_THRESHOLD) {
          video.currentTime = 0;
        }
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

    const onError = () => {
      /* leave ambient hero background visible */
    };

    if (video.readyState >= 2) {
      durationRef.current = video.duration;
      markReady();
    } else if (video.readyState >= 1) {
      onLoadedMetadata();
    }

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);

    /* Soft timeout only hides the small pulse; never blocks copy */
    const readyTimeout = window.setTimeout(() => {
      /* keep spinner subtle; do not force videoReady without a frame */
    }, 1200);

    try {
      video.load();
    } catch {
      /* ignore */
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
          const target = progress * duration;
          const lerpFactor = progress > 0.9 ? 0.28 : LERP_FACTOR;

          currentTimeRef.current += (target - currentTimeRef.current) * lerpFactor;

          if (progress >= 0.995) {
            currentTimeRef.current = target;
          }

          if (!video.paused) video.pause();

          if (Math.abs(video.currentTime - currentTimeRef.current) > SEEK_THRESHOLD) {
            video.currentTime = currentTimeRef.current;
          }

          if (hintRef.current) {
            hintRef.current.style.opacity = String(Math.max(0, 0.55 - progress * 2.2));
          }

          if (copyRef.current) {
            const copyOpacity =
              progress > 0.88 ? Math.max(0, 1 - (progress - 0.88) / 0.12) : 1;
            const lift = progress > 0.88 ? (progress - 0.88) * -5 : 0;
            copyRef.current.style.opacity = String(copyOpacity);
            copyRef.current.style.transform = `translate3d(0, ${lift}vh, 0)`;
          }
        };

        gsap.ticker.add(scrubTick);

        const onResize = () => {
          ScrollTrigger.refresh();
        };

        window.addEventListener("resize", onResize);
        ScrollTrigger.refresh();

        return () => {
          cancelled = true;
          window.clearTimeout(readyTimeout);
          window.removeEventListener("resize", onResize);
          if (scrubTick) gsap.ticker.remove(scrubTick);
          scrollTrigger?.kill();
          video.removeEventListener("loadedmetadata", onLoadedMetadata);
          video.removeEventListener("loadeddata", onLoadedData);
          video.removeEventListener("canplay", onCanPlay);
          video.removeEventListener("error", onError);
        };
      }
    } else {
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
        video.removeEventListener("error", onError);
      };
    }

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimeout);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
    };
  }, [reduceMotion]);

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
        {/* Always-visible forest scene — prevents empty black first paint while video buffers */}
        <div
          className="hero-scrub__poster"
          style={{ backgroundImage: `url(${SCRUB_POSTER_SRC})` }}
          aria-hidden
        />
        <video
          ref={videoRef}
          className={`hero-scrub__video${videoReady ? " hero-scrub__video--ready" : ""}`}
          src={SCRUB_VIDEO_SRC}
          poster={SCRUB_POSTER_SRC}
          muted
          playsInline
          preload="auto"
          aria-hidden
        />

        <div className="hero-scrub__wash" aria-hidden />
        <div className="hero-scrub__veil" aria-hidden />

        <div className="hero-scrub__particles" aria-hidden>
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="hero-scrub__particle"
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}
        </div>

        <div
          className={`hero-scrub__loading${videoReady ? " hero-scrub__loading--hidden" : ""}`}
          aria-live="polite"
          aria-busy={!videoReady}
        >
          <span className="hero-scrub__loading-pulse" />
        </div>

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
