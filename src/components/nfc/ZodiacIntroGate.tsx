"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getZodiacIntroVideos,
  type ZodiacSlug,
} from "@/content/zodiac-intros";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import styles from "./ZodiacIntroGate.module.css";

export type ZodiacIntroGateProps = {
  zodiac: ZodiacSlug;
  children: ReactNode;
};

const INTRO_FADE_OUT_MS = 520;
const SAFETY_TIMEOUT_MS = 10000;
const REDUCED_MOTION_DELAY_MS = 120;

export function ZodiacIntroGate({ zodiac, children }: ZodiacIntroGateProps) {
  const reduced = useReducedMotionSafe();
  const sources = getZodiacIntroVideos(zodiac);

  const hasCompletedRef = useRef(false);
  const mountedRef = useRef(true);
  const fadeTimerRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<number | null>(null);
  const reducedTimerRef = useRef<number | null>(null);
  const previousOverflowRef = useRef<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const usedFallbackRef = useRef(false);

  // MP4 first — missing WebM must never block playback.
  const [activeSrc, setActiveSrc] = useState(sources.mp4);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const clearTimer = (ref: { current: number | null }) => {
    if (ref.current != null) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
  };

  const completeIntro = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    clearTimer(safetyTimerRef);
    clearTimer(reducedTimerRef);

    if (!mountedRef.current) return;

    setIsExiting(true);

    clearTimer(fadeTimerRef);
    fadeTimerRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setIsVisible(false);
      fadeTimerRef.current = null;
    }, INTRO_FADE_OUT_MS);
  }, []);

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || hasCompletedRef.current || reduced) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const attempt = video.play();
    if (attempt !== undefined) {
      attempt.catch(() => {
        /* retry via later canplay / loadeddata */
      });
    }
  }, [reduced]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimer(fadeTimerRef);
      clearTimer(safetyTimerRef);
      clearTimer(reducedTimerRef);
    };
  }, []);

  // Upgrade to WebM only when the file exists.
  useEffect(() => {
    let cancelled = false;

    void fetch(sources.webm, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) {
          setActiveSrc(sources.webm);
        }
      })
      .catch(() => {
        /* keep MP4 */
      });

    return () => {
      cancelled = true;
    };
  }, [sources.webm, sources.mp4]);

  useEffect(() => {
    if (!isVisible || hasCompletedRef.current || !reduced) return;

    clearTimer(reducedTimerRef);
    reducedTimerRef.current = window.setTimeout(() => {
      completeIntro();
    }, REDUCED_MOTION_DELAY_MS);

    return () => clearTimer(reducedTimerRef);
  }, [reduced, isVisible, completeIntro]);

  useEffect(() => {
    if (!isVisible || hasCompletedRef.current || reduced) return;

    clearTimer(safetyTimerRef);
    safetyTimerRef.current = window.setTimeout(() => {
      completeIntro();
    }, SAFETY_TIMEOUT_MS);

    tryPlay();

    return () => clearTimer(safetyTimerRef);
  }, [isVisible, reduced, completeIntro, activeSrc, tryPlay]);

  useEffect(() => {
    if (!isVisible) {
      if (previousOverflowRef.current !== null) {
        document.body.style.overflow = previousOverflowRef.current;
        previousOverflowRef.current = null;
      }
      return;
    }

    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      if (previousOverflowRef.current !== null) {
        document.body.style.overflow = previousOverflowRef.current;
        previousOverflowRef.current = null;
      } else {
        document.body.style.overflow = "";
      }
    };
  }, [isVisible]);

  const onVideoError = () => {
    if (hasCompletedRef.current) return;

    if (!usedFallbackRef.current && activeSrc === sources.webm) {
      usedFallbackRef.current = true;
      setActiveSrc(sources.mp4);
      return;
    }

    completeIntro();
  };

  return (
    <>
      <div
        className={styles.content}
        data-zodiac-intro-active={isVisible ? "true" : "false"}
        aria-hidden={isVisible ? true : undefined}
        inert={isVisible ? true : undefined}
        style={{
          opacity: isVisible ? 0 : 1,
          transition: isVisible
            ? undefined
            : `opacity ${INTRO_FADE_OUT_MS}ms ease`,
          pointerEvents: isVisible ? "none" : undefined,
        }}
      >
        {children}
      </div>

      {isVisible ? (
        <div
          className={`${styles.overlay}${isExiting ? ` ${styles.overlayExiting}` : ""}`}
          role="presentation"
          aria-hidden="true"
        >
          <video
            key={activeSrc}
            ref={videoRef}
            className={styles.video}
            src={activeSrc}
            autoPlay
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            onLoadedData={tryPlay}
            onCanPlay={tryPlay}
            onEnded={completeIntro}
            onError={onVideoError}
          />
        </div>
      ) : null}
    </>
  );
}
