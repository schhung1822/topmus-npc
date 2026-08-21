import Image from "next/image";
import type { NpcIntroContent } from "@/lib/npc-intro-content";
import styles from "./npc-intro-section.module.css";

const floatingDecorations = [
  { type: "tiktok", left: "1%", top: "78%", width: "clamp(42px, 8vw, 200px)", duration: 12, delay: 2, opacity: 0.38 },
  { type: "star", left: "6%", top: "8%", width: "clamp(24px, 6vw, 120px)", duration: 9, delay: 5, opacity: 0.58 },
  { type: "star", left: "84%", top: "22%", width: "clamp(28px, 4vw, 52px)", duration: 11, delay: 3, opacity: 0.52 },
  { type: "tiktok", left: "50%", top: "0%", width: "clamp(46px, 7vw, 88px)", duration: 15, delay: 7, opacity: 0.34 },
  { type: "star", left: "86%", top: "76%", width: "clamp(22px, 6vw, 120px)", duration: 13, delay: 8, opacity: 0.46 },
  { type: "tiktok", left: "90%", top: "0%", width: "clamp(20px, 8vw, 180px", duration: 14, delay: 4, opacity: 0.24 },
  { type: "star", left: "70%", top: "10%", width: "clamp(20px, 8vw, 180px)", duration: 10, delay: 1, opacity: 0.42 },
] as const;

export function NpcIntroSection({ content }: { content: NpcIntroContent }) {
  const normalizedHeading = content.heading.trim();
  const hasQuestionMark = normalizedHeading.endsWith("?");
  const headingWithoutMark = hasQuestionMark
    ? normalizedHeading.slice(0, -1).trimEnd()
    : normalizedHeading;
  const [headingLead = "", ...headingTailParts] = headingWithoutMark.split(/\s+/);
  const headingTail = headingTailParts.join(" ");

  return (
    <section
      className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.92),transparent_31%),radial-gradient(circle_at_84%_72%,rgba(207,135,255,0.48),transparent_36%),linear-gradient(135deg,#fff3ff_0%,#f5d9ff_42%,#e8c7fb_72%,#f9e9ff_100%)] py-14 sm:py-20 lg:py-[88px]"
      id="chuong-trinh"
    >
      <div aria-hidden="true" className={styles.gradientAtmosphere}>
        <span className={styles.glowOrbLeft} />
        <span className={styles.glowOrbRight} />
        <span className={styles.lightSweep} />
      </div>

      <div aria-hidden="true" className={styles.floatingLayer}>
        {floatingDecorations.map((item, index) => (
          <Image
            alt=""
            className={`${styles.floatingItem} ${
              item.type === "star" ? styles.starItem : styles.tiktokItem
            }`}
            height={192}
            key={`${item.type}-${index}`}
            src={item.type === "star" ? "/img/icon-start.webp" : "/img/tiktok_item.webp"}
            style={{
              animationDelay: `-${item.delay}s`,
              animationDuration: `${item.duration}s`,
              left: item.left,
              opacity: item.opacity,
              top: item.top,
              width: item.width,
            }}
            width={128}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <article className="relative min-h-[430px] overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#3d0069,rgba(255,255,255,0))] shadow-[0_24px_60px_rgba(115,28,145,0.2)] sm:min-h-[470px] lg:min-h-[430px]">
          <Image
            className="object-cover object-center lg:object-right"
            src={content.bannerImage}
            alt="Giới thiệu LIVE NPC"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(58,0,93,0.96)_0%,rgba(75,0,112,0.82)_38%,rgba(75,0,112,0.12)_70%,transparent_100%)] max-lg:bg-[linear-gradient(90deg,rgba(58,0,93,0.94),rgba(64,0,96,0.66))]" />

          <div className="relative z-10 flex min-h-[430px] max-w-[570px] flex-col justify-center px-6 py-10 text-white sm:min-h-[470px] sm:px-10 lg:min-h-[430px] lg:w-[54%] lg:px-11">
            <h2 aria-label={content.heading} className={styles.npcHeading}>
              <span aria-hidden="true" className={styles.headingLead} data-text={headingLead}>
                {headingLead}
              </span>
              {headingTail ? (
                <span aria-hidden="true" className={styles.headingTail}>
                  {headingTail}
                </span>
              ) : null}
              {hasQuestionMark ? (
                <span aria-hidden="true" className={styles.headingQuestion}>
                  ?
                </span>
              ) : null}
            </h2>
            <div className="mt-6 space-y-4 text-[13px] leading-[1.62] text-white/92 sm:text-sm">
              {content.paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 18)}`}>
                  {index === 0 ? <strong>NPC (Non-Player Character) </strong> : null}
                  {index === 0 ? paragraph.replace(/^NPC \(Non-Player Character\)\s*/, "") : paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.features.map((feature) => (
            <article
              className="min-h-[126px] rounded-2xl border border-white/80 bg-white/90 px-6 py-5 shadow-[inset_-12px_-12px_24px_rgba(232,199,241,0.2),0_8px_24px_rgba(118,48,135,0.07)] backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(118,48,135,0.12)]"
              key={feature.id}
            >
              <h3 className="text-[16px] font-bold leading-5 text-[#5a0877] sm:text-base">
                {feature.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.55] w-full font-normal sm:w-[88%] text-[#6b6b6b] sm:text-[14px]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
