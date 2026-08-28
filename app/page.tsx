import { ApplicationSection } from "@/components/site/application-section";
import { BenefitsSection } from "@/components/site/benefits-section";
import { AchievementStatsSection } from "@/components/site/achievement-stats-section";
import { HeroBanner } from "@/components/site/hero-banner";
import { SiteFooter } from "@/components/site/site-footer";
import { SoftwareToolsSection } from "@/components/site/software-tools-section";
import { SevenDayTrainingSection } from "@/components/site/seven-day-training-section";
import { CandidateFitSection } from "@/components/site/candidate-fit-section";
import { SiteHeader } from "@/components/site/site-header";
import { NpcShowcase } from "@/components/site/npc-showcase";
import { NpcIntroSection } from "@/components/site/npc-intro-section";
import { NpcModelSection } from "@/components/site/npc-model-section";
import { RecruitmentHero } from "@/components/site/recruitment-hero";
import { WhyTopmusSection } from "@/components/site/why-topmus-section";
import { PainPointsSection } from "@/components/site/pain-points-section";
import { FloatingContactActions } from "@/components/site/floating-contact-actions";
import { GoogleAnalytics } from "@/components/site/google-analytics";
import { SiteAnalytics } from "@/components/site/site-analytics";
import { getNpcSectionContent } from "@/lib/npc-content";
import { getNpcIntroContent } from "@/lib/npc-intro-content";
import { getNpcModelContent } from "@/lib/npc-model-content";
import { getHeroBannerContent } from "@/lib/hero-banner-content";
import { getTickerContent } from "@/lib/ticker-content";
import { getSevenDayTrainingContent } from "@/lib/seven-day-training-content";
import { getSeoSettings } from "@/lib/seo-settings";
import { getWhyTopmusContent } from "@/lib/why-topmus-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    heroBannerContent,
    npcContent,
    npcIntroContent,
    npcModelContent,
    tickerContent,
    trainingContent,
    whyTopmusContent,
    seo,
  ] = await Promise.all([
    getHeroBannerContent(),
    getNpcSectionContent(),
    getNpcIntroContent(),
    getNpcModelContent(),
    getTickerContent(),
    getSevenDayTrainingContent(),
    getWhyTopmusContent(),
    getSeoSettings(),
  ]);

  return (
    <div className="min-h-screen bg-white text-[#1d1025]">
      <SiteHeader />
      <main id="noi-dung-chinh">
        <HeroBanner content={heroBannerContent} />
        <RecruitmentHero tickerItems={tickerContent.items} />
        <AchievementStatsSection />
        <NpcShowcase content={npcContent} />
        <NpcIntroSection content={npcIntroContent} />
        <WhyTopmusSection
          tickerItems={tickerContent.items}
          creatorSlides={whyTopmusContent.creatorSlides}
          trainingSlides={whyTopmusContent.trainingSlides}
        />
         <PainPointsSection />
        <BenefitsSection />
        <NpcModelSection content={npcModelContent} tickerItems={tickerContent.items} />
        <SoftwareToolsSection tickerItems={tickerContent.items} />
        <SevenDayTrainingSection content={trainingContent} />
        <CandidateFitSection />
        <ApplicationSection />
      </main>

      <SiteFooter />
      <FloatingContactActions />

      {/* Chỉ gắn Google Analytics cho landing page, không theo dõi khu vực /admin. */}
      <GoogleAnalytics analyticsId={seo.googleAnalyticsId} />
      {seo.googleAnalyticsId ? <SiteAnalytics /> : null}
    </div>
  );
}
