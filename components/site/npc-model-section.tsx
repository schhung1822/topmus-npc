"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, TouchEvent } from "react";
import type { NpcModelContent } from "@/lib/npc-model-content";
import styles from "./npc-intro-section.module.css";
import { SharedTicker } from "./shared-ticker";

const AUTOPLAY_MS = 5000;

const floatingTikTokItems = [
  { left: "3%", top: "8%", width: "clamp(42px, 5vw, 72px)", duration: 11, delay: 1, opacity: 0.42 },
  { left: "90%", top: "12%", width: "clamp(40px, 4.5vw, 66px)", duration: 14, delay: 5, opacity: 0.38 },
  { left: "6%", top: "68%", width: "clamp(44px, 6vw, 80px)", duration: 12, delay: 8, opacity: 0.4 },
  { left: "88%", top: "72%", width: "clamp(46px, 7vw, 86px)", duration: 15, delay: 3, opacity: 0.44 },
] as const;

const stageSparkles = [
  { key: "s1", className: "left-[20%] top-[24%] size-4 sm:size-5", delay: "0s" },
  { key: "s2", className: "left-[33%] top-[13%] size-5 sm:size-7", delay: "-0.9s" },
  { key: "s3", className: "left-[16%] top-[52%] size-3 sm:size-4", delay: "-1.8s" },
  { key: "s4", className: "right-[22%] top-[21%] size-4 sm:size-5", delay: "-1.2s" },
  { key: "s5", className: "right-[34%] top-[46%] size-5 sm:size-7", delay: "-2.4s" },
  { key: "s6", className: "right-[17%] top-[58%] size-3 sm:size-4", delay: "-0.4s" },
] as const;

/**
 * Số chỗ trên vòng tròn 3D. Khi có ít thẻ, mỗi thẻ được lặp lại vài lần để
 * góc giữa hai chỗ liền nhau xấp xỉ 45° — đủ nghiêng để thấy chiều sâu mà
 * vẫn không bị úp nghiêng. Bản sao luôn cách nhau tối thiểu 90° nên không
 * bao giờ lộ hai bản của cùng một thẻ trong khung nhìn.
 */
function ringSlotCount(total: number) {
  if (total < 2) return total;
  return total >= 6 ? total : total * Math.ceil(8 / total);
}

/** Đưa góc về khoảng (-180, 180] để biết thẻ đang lệch bao nhiêu so với mặt trước. */
function normalizeAngle(angle: number) {
  const wrapped = ((angle % 360) + 360) % 360;
  return wrapped > 180 ? wrapped - 360 : wrapped;
}

function Sparkle({ className, style }: { className: string; style?: CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 0c.7 6.3 5 10.6 12 12-7 1.4-11.3 5.7-12 12-.7-6.3-5-10.6-12-12C7 10.6 11.3 6.3 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function NpcModelSection({
  content,
  tickerItems,
}: {
  content: NpcModelContent;
  tickerItems: string[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [step, setStep] = useState(0);

  const total = content.cards.length;
  const slotCount = ringSlotCount(total);
  const angleStep = slotCount ? 360 / slotCount : 0;
  const ringRadiusScale = angleStep
    ? Math.max(1, Math.sin(Math.PI / 4) / Math.sin((angleStep * Math.PI) / 180))
    : 1;
  const activeSlot = slotCount ? ((step % slotCount) + slotCount) % slotCount : 0;
  const activeIndex = total ? activeSlot % total : 0;

  /** Xoay tới thẻ chỉ định theo đường ngắn nhất trên vòng tròn. */
  const goToCard = useCallback(
    (cardIndex: number) => {
      if (!total || !slotCount) return;

      setStep((current) => {
        const currentSlot = ((current % slotCount) + slotCount) % slotCount;
        let bestDelta: number | null = null;

        for (let slot = cardIndex; slot < slotCount; slot += total) {
          let delta = (((slot - currentSlot) % slotCount) + slotCount) % slotCount;
          if (delta > slotCount / 2) delta -= slotCount;
          if (bestDelta === null || Math.abs(delta) < Math.abs(bestDelta)) bestDelta = delta;
        }

        return current + (bestDelta ?? 0);
      });
    },
    [slotCount, total],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || isPaused || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => setStep((current) => current + 1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, isVisible, total]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setStep((current) => current - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setStep((current) => current + 1);
    }
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;

    const distance = event.changedTouches[0].clientX - start;
    if (Math.abs(distance) < 45) return;
    setStep((current) => current + (distance < 0 ? 1 : -1));
  }

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.92),transparent_31%),radial-gradient(circle_at_84%_72%,rgba(207,135,255,0.48),transparent_36%),linear-gradient(135deg,#fff3ff_0%,#f5d9ff_42%,#e8c7fb_72%,#f9e9ff_100%)] pt-14 sm:pt-20 lg:pt-[88px]"
      id="mo-hinh-npc"
      aria-labelledby="npc-model-title"
    >
      <div aria-hidden="true" className={styles.gradientAtmosphere}>
        <span className={styles.glowOrbLeft} />
        <span className={styles.glowOrbRight} />
        <span className={styles.lightSweep} />
      </div>

      <div aria-hidden="true" className={styles.floatingLayer}>
        {floatingTikTokItems.map((item, index) => (
          <Image
            alt=""
            className={styles.floatingItem}
            height={192}
            key={index}
            src="/img/tiktok_item.webp"
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
        <div
          className={`relative overflow-hidden rounded-[24px] bg-[#220033] px-4 py-10 shadow-[0_30px_80px_rgba(60,0,96,0.35)] transition duration-700 sm:px-8 sm:py-12 lg:px-12 lg:py-14 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Image
            className="pointer-events-none object-cover object-center"
            src="/img/bg-model.webp"
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1232px"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-20 left-[12%] size-64 animate-benefit-glow rounded-full bg-[#8f6bff]/30 blur-[70px] motion-reduce:animate-none"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-24 right-[8%] size-72 animate-benefit-glow rounded-full bg-[#ff5ae8]/25 blur-[85px] motion-reduce:animate-none"
            style={{ animationDelay: "-1.4s" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] origin-bottom opacity-35 [background-image:repeating-linear-gradient(90deg,rgba(196,140,255,0.55)_0_1px,transparent_1px_54px),repeating-linear-gradient(0deg,rgba(196,140,255,0.5)_0_1px,transparent_1px_44px)] [mask-image:linear-gradient(180deg,transparent,#000_45%)] [transform:perspective(420px)_rotateX(62deg)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(255,90,232,0.3),transparent_70%)]"
            aria-hidden="true"
          />

          <header className="relative mx-auto flex w-fit max-w-full justify-center px-[clamp(24px,6vw,76px)] text-center">
            <h2
              className="flex flex-col items-center text-[clamp(32px,7vw,54px)] leading-[1.2] font-bold tracking-[-0.055em]"
              id="npc-model-title"
            >
              <span className="relative block w-fit whitespace-nowrap bg-[linear-gradient(270deg,#ffffff_0%,#fff7ff_31%,#ffc5f8_55%,#ed68e5_100%)] bg-clip-text text-transparent [-webkit-text-stroke:1px_rgba(255,225,255,0.88)] [filter:drop-shadow(0_4px_0_#92258f)_drop-shadow(0_8px_10px_rgba(47,0,67,0.52))_drop-shadow(0_0_11px_rgba(255,96,235,0.6))]">
                {content.eyebrow} {content.heading}
                <Sparkle className="absolute top-[44%] left-[calc(100%+0.08em)] rotate-[20deg] size-[0.7em] -translate-y-1/2 animate-benefit-glow text-[#8df8ff] [filter:drop-shadow(0_0_6px_#33dcff)_drop-shadow(0_0_16px_rgba(85,224,255,0.9))] motion-reduce:animate-none" />
              </span>
              <span className="-mt-2 block whitespace-nowrap bg-[linear-gradient(270deg,#ffffff_0%,#fff7ff_31%,#ffc5f8_55%,#ed68e5_100%)] bg-clip-text text-transparent [-webkit-text-stroke:1px_rgba(255,225,255,0.88)] [filter:drop-shadow(0_4px_0_#92258f)_drop-shadow(0_8px_10px_rgba(47,0,67,0.52))_drop-shadow(0_0_11px_rgba(255,96,235,0.6))]">
                {content.badge}
              </span>
            </h2>
          </header>

          {total ? (
            <div
              className="relative mt-9 lg:mt-11"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocusCapture={() => setIsPaused(true)}
              onBlurCapture={() => setIsPaused(false)}
            >
              {stageSparkles.map((sparkle) => (
                <Sparkle
                  className={`pointer-events-none absolute z-30 animate-benefit-glow text-white motion-reduce:animate-none ${sparkle.className}`}
                  style={{ animationDelay: sparkle.delay }}
                  key={sparkle.key}
                />
              ))}

              <div
                className="relative mx-auto h-[calc(88vw+120px)] max-w-[1000px] [--card-w:min(56vw,240px)] [perspective:1600px] [perspective-origin:50%_42%] sm:h-[clamp(432px,66vw,506px)] sm:[--card-w:clamp(160px,22vw,240px)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
                style={
                  {
                    "--ring-r": `clamp(${220 * ringRadiusScale}px, ${31 * ringRadiusScale}vw, ${404 * ringRadiusScale}px)`,
                  } as CSSProperties
                }
                role="group"
                tabIndex={0}
                aria-roledescription="carousel"
                aria-label="Các mô hình NPC của TOPMUS"
                onKeyDown={handleKeyDown}
                onTouchStart={(event) => {
                  touchStartX.current = event.touches[0].clientX;
                }}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [transform-style:preserve-3d] motion-reduce:transition-none"
                  style={{
                    transform: `translateZ(calc(var(--ring-r) * -1)) rotateY(${-step * angleStep}deg)`,
                  }}
                >
                  {Array.from({ length: slotCount }, (_, slot) => {
                    const card = content.cards[slot % total];
                    const delta = normalizeAngle((slot - step) * angleStep);
                    const isFront = Math.round(delta) === 0;
                    const isNear = Math.abs(delta) <= angleStep + 1;

                    return (
                      <div
                        className={`absolute -top-10 left-1/2 transition-opacity duration-500 ${
                          isVisible && isFront
                            ? "opacity-100"
                            : isVisible && isNear
                              ? // Trên điện thoại chỉ hiện thẻ giữa; hai thẻ bên vẫn xoay
                                // cùng vòng nên chuyển động khi đổi thẻ không thay đổi.
                                "pointer-events-none opacity-0 sm:pointer-events-auto sm:opacity-100"
                              : "pointer-events-none opacity-0"
                        }`}
                        style={{
                          width: "calc(var(--card-w) * 1.28 + 80px)",
                          marginLeft: "calc(var(--card-w) * -0.64 - 40px)",
                          transform: `rotateY(${slot * angleStep}deg) translateZ(var(--ring-r))`,
                        }}
                        aria-hidden={isNear ? undefined : true}
                        key={`${card.id}-${slot}`}
                      >
                        <button
                          className={`block w-full overflow-visible border-0 bg-transparent p-10 text-left transition duration-700 ${
                            isFront
                              ? "cursor-default"
                              : "cursor-pointer [filter:brightness(0.62)_saturate(0.85)]"
                          }`}
                          type="button"
                          tabIndex={isNear && !isFront ? 0 : -1}
                          aria-label={`Xem mô hình ${card.name}`}
                          onClick={() => goToCard(slot % total)}
                        >
                          <div
                            className={`relative mx-auto aspect-[0.66] w-[var(--card-w)] overflow-hidden rounded-[26px] border-[3px] bg-[#e7befe] transition-colors duration-700 ${
                              isFront
                                ? "animate-npc-frame-glow border-[#ff5ae8] motion-reduce:animate-none"
                                : "border-[#e14bd8]/80 shadow-[0_0_16px_rgba(225,75,216,0.4)]"
                            }`}
                          >
                            <Image
                              className="object-contain"
                              src={card.image}
                              alt={card.name}
                              fill
                              sizes="(max-width: 640px) 45vw, 220px"
                            />
                            <div
                              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(18,0,30,0.7))]"
                              aria-hidden="true"
                            />
                            {isFront ? (
                              <span
                                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-benefit-shine bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] motion-reduce:hidden"
                                aria-hidden="true"
                              />
                            ) : null}
                          </div>

                          <div
                            className={`relative z-10 mx-auto -mt-9 flex min-h-[152px] w-[calc(var(--card-w)*1.28)] flex-col justify-center rounded-[18px] border-2 py-4 pr-5 pl-7 transition-colors duration-700 ${
                              isFront
                                ? "border-[#ffb3f6] bg-[linear-gradient(160deg,#f957ef,#e02ad4_55%,#c11cb2)] shadow-[0_0_30px_rgba(255,76,233,0.55),inset_0_1px_0_rgba(255,255,255,0.4)]"
                                : "border-[#ff9df0]/75 bg-[linear-gradient(160deg,#e93fe0,#c81fbc_60%,#a4159a)]"
                            }`}
                          >
                            <Image
                              className={`pointer-events-none absolute top-1/2 -left-7 z-20 w-[54px] -translate-y-1/2 object-contain drop-shadow-[0_6px_14px_rgba(40,0,60,0.45)] transition-opacity duration-500 sm:-left-8 sm:w-[64px] ${
                                isFront ? "opacity-100" : "opacity-0"
                              }`}
                              src="/img/tiktok_item.webp"
                              alt=""
                              width={128}
                              height={192}
                              aria-hidden="true"
                            />

                            <div
                              className={`relative z-10 transition-opacity duration-500 ${
                                isFront ? "opacity-100 delay-200" : "opacity-0"
                              }`}
                              aria-hidden={isFront ? undefined : true}
                            >
                              <h3
                                className={`text-center text-[clamp(18px,1.6vw,18px)] leading-tight font-black tracking-[0.02em] text-white [text-shadow:0_2px_6px_rgba(70,0,90,0.45)] motion-reduce:animate-none ${
                                  isFront ? "animate-npc-text-in" : ""
                                }`}
                                style={{ animationDelay: "180ms" }}
                              >
                                {card.name}
                              </h3>
                              <p
                                className={`mt-2.5 text-center text-[11px] leading-[1.55] font-medium text-white/95 motion-reduce:animate-none sm:text-[12.5px] ${
                                  isFront ? "animate-npc-text-in" : ""
                                }`}
                                style={{ animationDelay: "380ms" }}
                              >
                                {card.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {total > 1 ? (
                <>
                  <button
                    className="absolute top-[40%] left-0 z-40 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/25 bg-[#2a0040]/85 text-white backdrop-blur-sm transition hover:bg-[#4d0b70] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-11 lg:left-[7%] hover:border-[#ffb3f6]/60 hover:bg-[linear-gradient(135deg,#ff4ce9,#c11cb2)]"
                    type="button"
                    aria-label="Xem mô hình trước"
                    onClick={() => setStep((current) => current - 1)}
                  >
                    <ArrowRight className="size-5 rotate-180" strokeWidth={2.2} aria-hidden="true" />
                  </button>
                  <button
                    className="absolute top-[40%] right-0 z-40 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/25 bg-[#2a0040]/85 text-white backdrop-blur-sm transition hover:bg-[#4d0b70] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-11 lg:right-[7%] hover:border-[#ffb3f6]/60 hover:bg-[linear-gradient(135deg,#ff4ce9,#c11cb2)]"
                    type="button"
                    aria-label="Xem mô hình tiếp theo"
                    onClick={() => setStep((current) => current + 1)}
                  >
                    <ArrowRight className="size-5" strokeWidth={2.2} aria-hidden="true" />
                  </button>

                  <div className="relative mt-7 flex items-center justify-center gap-2">
                    {content.cards.map((card, index) => {
                      const active = index === activeIndex;
                      return (
                        <button
                          className={`h-2 cursor-pointer overflow-hidden rounded-full border-0 p-0 transition-all duration-500 ${
                            active ? "w-8 bg-white/25" : "w-2 bg-white/30 hover:bg-white/55"
                          }`}
                          type="button"
                          aria-label={`Chuyển tới ${card.name}`}
                          aria-current={active ? "true" : undefined}
                          key={card.id}
                          onClick={() => goToCard(index)}
                        >
                          {active ? (
                            <span
                              className={`block h-full w-full origin-left animate-npc-dot rounded-full bg-[#ff5ae8] shadow-[0_0_12px_rgba(255,90,232,0.85)] motion-reduce:animate-none ${
                                isPaused ? "[animation-play-state:paused]" : ""
                              }`}
                              key={step}
                              aria-hidden="true"
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          <div
            className={`relative mt-8 text-center transition duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "820ms" }}
          >
            <a
              className="group inline-flex min-h-[52px] items-center gap-4 rounded-full bg-[linear-gradient(100deg,#4fc3ff,#69d7ff_55%,#9be6ff)] px-7 text-[17px] font-bold text-white no-underline shadow-[0_0_28px_rgba(105,215,255,0.55),inset_0_1px_0_rgba(255,255,255,0.6)] transition [text-shadow:0_2px_6px_rgba(20,70,120,0.45)] hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-[19px]"
              href={content.ctaHref}
            >
              <span>{content.ctaLabel}</span>
              <span className="grid size-8 place-items-center rounded-full bg-[#1f78c9] text-white transition-transform group-hover:translate-x-1">
                <ArrowRight className="size-5" strokeWidth={2.4} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-14 sm:mt-20 lg:mt-[88px]">
        <SharedTicker
          items={tickerItems}
          variant="dark"
          ariaLabel="Thông tin nổi bật của chương trình NPC Live"
        />
      </div>
    </section>
  );
}
