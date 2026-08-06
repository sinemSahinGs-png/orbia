"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#FF4EC8";
const ACCENT_SOFT = "rgba(255, 110, 199, 0.95)";
const IVORY = "rgba(245, 241, 232, 0.96)";
const HIGHLIGHT = new Set(["dokunduğun", "enerjisi", "açılır"]);

export function StoryManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGsapContext(
    () => {
      const section = sectionRef.current;
      const text = textRef.current;
      if (!section || !text) return;

      if (reduced) {
        gsap.set([text, fogRef.current, glowRef.current].filter(Boolean), {
          opacity: 1,
          clearProps: "filter,transform",
        });
        text.querySelectorAll(".word, span").forEach((node) => {
          const el = node as HTMLElement;
          const clean =
            el.textContent
              ?.normalize("NFC")
              .replace(/[.,!?]/g, "")
              .toLocaleLowerCase("tr-TR")
              .trim() ?? "";
          el.style.opacity = "1";
          el.style.color = HIGHLIGHT.has(clean) ? ACCENT : IVORY;
          el.style.filter = "none";
          el.style.transform = "none";
        });
        return;
      }

      const split = new SplitType(text, { types: "words", tagName: "span" });
      const words = (split.words ?? []) as HTMLElement[];

      words.forEach((word) => {
        const clean =
          word.textContent
            ?.normalize("NFC")
            .replace(/[.,!?]/g, "")
            .toLocaleLowerCase("tr-TR")
            .trim() ?? "";
        if (HIGHLIGHT.has(clean)) word.classList.add("is-gold");
        word.classList.add("cine-manifesto__word");
      });

      gsap.set(words, {
        opacity: 0,
        y: 42,
        rotateX: -18,
        filter: "blur(14px)",
        transformOrigin: "50% 100%",
        color: (_i, el) =>
          (el as HTMLElement).classList.contains("is-gold")
            ? ACCENT_SOFT
            : "rgba(245, 241, 232, 0.55)",
      });

      if (fogRef.current) {
        gsap.set(fogRef.current, { opacity: 0.35, scale: 0.92 });
      }
      if (glowRef.current) {
        gsap.set(glowRef.current, { opacity: 0, scale: 0.7 });
      }

      const revealWord = (word: HTMLElement) => {
        const isAccent = word.classList.contains("is-gold");
        return {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          color: isAccent ? ACCENT : IVORY,
          duration: 0.55,
          ease: "power3.out",
          onComplete: () => {
            if (isAccent) word.classList.add("is-lit");
          },
        };
      };

      const buildTimeline = (scrub: number | boolean, pin: boolean, end: string) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: pin ? "top top" : "top 78%",
            end,
            scrub: scrub === false ? false : scrub,
            pin: pin || undefined,
            pinSpacing: pin,
            anticipatePin: pin ? 1 : 0,
            once: scrub === false,
            toggleActions: scrub === false ? "play none none none" : undefined,
          },
        });

        if (glowRef.current) {
          tl.to(
            glowRef.current,
            { opacity: 0.85, scale: 1, duration: 0.8, ease: "power2.out" },
            0.05,
          );
        }

        if (fogRef.current) {
          tl.to(
            fogRef.current,
            { opacity: 0.62, scale: 1.05, duration: 1, ease: "none" },
            0,
          );
        }

        words.forEach((word, i) => {
          tl.fromTo(
            word,
            {
              opacity: 0,
              y: 42,
              rotateX: -18,
              filter: "blur(14px)",
            },
            revealWord(word),
            0.18 + i * 0.14,
          );
        });

        return tl;
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        buildTimeline(0.65, true, "+=90%");
      });

      mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
        buildTimeline(0.55, true, "+=70%");
      });

      mm.add("(max-width: 767px)", () => {
        buildTimeline(false, false, "+=40%");
      });

      return () => {
        split.revert();
        mm.revert();
      };
    },
    [reduced],
    sectionRef,
  );

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="cine-manifesto"
      aria-label="ORBIA manifesto"
    >
      <div ref={pinRef} className="cine-manifesto__pin">
        <div ref={fogRef} className="cine-manifesto__fog" aria-hidden />
        <div ref={glowRef} className="cine-manifesto__glow" aria-hidden />
        <div ref={textRef} className="cine-manifesto__text">
          <span className="cine-manifesto__block">
            <span className="is-gold">Dokunduğun</span> anda burcun
            <br />
            bugünkü <span className="is-gold">enerjisi</span> ve
            <br />
            gökyüzü yorumu <span className="is-gold">açılır</span>.
          </span>
        </div>
      </div>
    </section>
  );
}
