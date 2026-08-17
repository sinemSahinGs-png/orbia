"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { MotionConfig } from "framer-motion";
import { CosmicBackdrop } from "@/components/nfc/experience/CosmicBackdrop";
import { NfcIntroSequence } from "@/components/nfc/experience/NfcIntroSequence";
import { DailyPulseScene } from "@/components/nfc/experience/DailyPulseScene";
import { AstralStatusSeal } from "@/components/nfc/experience/AstralStatusSeal";
import { DailyMessageScene } from "@/components/nfc/experience/DailyMessageScene";
import { CelestialSignature } from "@/components/nfc/experience/CelestialSignature";
import { SkyTimeScene } from "@/components/nfc/experience/SkyTimeScene";
import { MicroRitualScene } from "@/components/nfc/experience/MicroRitualScene";
import {
  PairingScanOverlay,
  SecondKeyPairingScene,
} from "@/components/nfc/experience/SecondKeyPairingScene";
import { DailyShareCard } from "@/components/nfc/experience/DailyShareCard";
import { MinimalExperienceFooter } from "@/components/nfc/experience/MinimalExperienceFooter";
import { OrbitalProgress } from "@/components/nfc/experience/OrbitalProgress";
import { ExperienceStageMarks } from "@/components/nfc/experience/ExperienceStageMarks";
import { OrbiaMark } from "@/components/brand/OrbiaMark";
import { useNfcIntroState } from "@/hooks/use-nfc-intro-state";
import { usePendingPairCompletion } from "@/hooks/use-pending-pair-completion";
import { getZodiacCollectionItem } from "@/content/zodiac";
import { signThemeCssVars } from "@/lib/nfc/experience/sign-theme";
import type { ZodiacSign } from "@/lib/zodiac/signs";
import type { DailyReading } from "@/lib/astrology/daily-reading-engine";
import type { AstronomySnapshot } from "@/lib/astronomy/astronomy-service";
import "@/app/nfc-experience.css";

type Props = {
  code: string;
  sign: ZodiacSign;
  reading: DailyReading;
  astronomy: AstronomySnapshot;
};

function dailyKeyword(advice: string, energy: number) {
  const trimmed = advice.replace(/[.;].*$/, "").trim();
  if (trimmed.length <= 28) return trimmed;
  if (energy >= 80) return "Yoğun bir açıklık";
  if (energy >= 60) return "Ölçülü bir netlik";
  return "Sakin bir yön";
}

export function NfcExperienceShell({ code, sign, reading, astronomy }: Props) {
  const intro = useNfcIntroState();
  usePendingPairCompletion(code, sign.slug);
  const [navSolid, setNavSolid] = useState(false);
  const [pairOpen, setPairOpen] = useState(false);
  const item = getZodiacCollectionItem(sign.slug);
  const constellation = item?.constellation ?? {
    points: [
      { x: 30, y: 40 },
      { x: 50, y: 25 },
      { x: 70, y: 40 },
      { x: 50, y: 70 },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ] as [number, number][],
  };

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const theme = signThemeCssVars(sign.slug);

  return (
    <MotionConfig reducedMotion={intro.reduced ? "always" : "user"}>
      <div className="ox" style={theme as CSSProperties}>
        <CosmicBackdrop />

        {!intro.isIntro ? <OrbitalProgress /> : null}

        <NfcIntroSequence
          phase={intro.phase}
          onSkip={intro.skip}
          isFirstVisit={intro.isFirstVisit}
          signName={sign.nameTr}
        />

        <div className="ox__stage">
          <header className={`ox-nav${navSolid ? " is-solid" : ""}`}>
            <Link href="/" className="ox-nav__brand" aria-label="ORBIA ana sayfa">
              <OrbiaMark size={18} className="ox-nav__mark" />
              ORBIA
            </Link>
            <Link href={`/urunler/${sign.slug}`} className="ox-nav__btn">
              Ürün
            </Link>
          </header>

          <DailyPulseScene
            sign={sign}
            moonPhase={astronomy.moonPhaseName}
            headline={reading.headline}
            energy={reading.energyScore}
          />
          <AstralStatusSeal
            energy={reading.energyScore}
            emotional={reading.emotionalScore}
            focus={reading.focusScore}
            social={reading.socialScore}
            keyword={dailyKeyword(reading.advice, reading.energyScore)}
            summary={reading.summary}
          />
          <DailyMessageScene
            sign={sign}
            headline={reading.headline}
            summary={reading.summary}
            advice={reading.advice}
            avoidText={reading.avoidText}
          />
          <CelestialSignature sign={sign} dateKey={astronomy.dateKey} constellation={constellation} />
          <SkyTimeScene astronomy={astronomy} reading={reading} signSlug={sign.slug} />
          <MicroRitualScene ritual={reading.ritual} dateKey={astronomy.dateKey} signSlug={sign.slug} />
          <SecondKeyPairingScene code={code} signSlug={sign.slug} />
          <DailyShareCard
            sign={sign}
            headline={reading.headline}
            energy={reading.energyScore}
            moonPhase={astronomy.moonPhaseName}
            dateKey={astronomy.dateKey}
          />
          <MinimalExperienceFooter signSlug={sign.slug} onPair={() => setPairOpen(true)} />
          <PairingScanOverlay
            key={pairOpen ? "footer-pair-open" : "footer-pair-closed"}
            open={pairOpen}
            onClose={() => setPairOpen(false)}
            code={code}
            signSlug={sign.slug}
          />
        </div>

        {!intro.isIntro ? <ExperienceStageMarks /> : null}
      </div>
    </MotionConfig>
  );
}
