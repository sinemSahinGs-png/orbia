import { ScrollScrubHero } from "@/components/ScrollScrubHero";
import { PostHeroAmbientBackground } from "@/components/PostHeroAmbientBackground";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { PremiumHomeFooter } from "@/components/home/PremiumHomeFooter";
import { StoryManifestoSection } from "@/components/home/sections/StoryManifestoSection";
import { NfcJourneySection } from "@/components/home/sections/NfcJourneySection";
import { DailySkyExperienceSection } from "@/components/home/sections/DailySkyExperienceSection";
import { AstronomyLayerSection } from "@/components/home/sections/AstronomyLayerSection";
import { PairingExperienceSection } from "@/components/home/sections/PairingExperienceSection";
import { PersonalizationFlowSection } from "@/components/home/sections/PersonalizationFlowSection";
import { AstrologyNoticeSection } from "@/components/home/sections/AstrologyNoticeSection";
import { ZodiacFaqSection } from "@/components/home/sections/ZodiacFaqSection";
import { FinalCelestialCta } from "@/components/home/sections/FinalCelestialCta";
import { getAstronomyForDate } from "@/lib/astronomy/astronomy-service";
import "@/app/home-premium.css";
import "@/app/home-orbia-sections.css";

/** ORBIA homepage — protected hero + manifesto, then celestial product experience. */
export function AstraKeyHomePage() {
  const primaryHref = "/urunler";
  const orderHref = "/siparis";
  const astronomy = getAstronomyForDate(new Date());

  return (
    <div className="memoora-home-premium">
      <HomeNavbar demoHref={orderHref} />
      <main>
        <ScrollScrubHero demoHref={primaryHref} />

        <div className="post-hero-world">
          <PostHeroAmbientBackground />

          <div className="post-hero-content">
            <StoryManifestoSection />
            <NfcJourneySection />
            <PersonalizationFlowSection />
            <DailySkyExperienceSection astronomy={astronomy} />
            <AstronomyLayerSection astronomy={astronomy} />
            <PairingExperienceSection />
            <AstrologyNoticeSection />
            <ZodiacFaqSection />
            <FinalCelestialCta />
            <PremiumHomeFooter />
          </div>
        </div>
      </main>
    </div>
  );
}
