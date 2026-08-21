"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { SevenDayTrainingContent } from "@/lib/seven-day-training-content";

/** Chiều cao vùng lộ trình trên desktop, giãn thêm theo mỗi bước được thêm vào. */
const roadmapBaseHeight = 600;
const roadmapStepOffset = 40;

export function SevenDayTrainingSection({ content }: { content: SevenDayTrainingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const steps = content.steps;
  const lastIndex = Math.max(steps.length - 1, 1);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#59008d] text-white"
      id="lo-trinh-7-ngay"
      aria-labelledby="seven-day-title"
    >
      <div className="pointer-events-none absolute inset-0 -z-30" aria-hidden="true">
        <Image
          className="object-cover object-[center_top] opacity-65"
          src={content.backgroundImage}
          alt=""
          fill
          sizes="100vw"
        />
      </div>


      <div className="mx-auto w-full max-w-[1280px] px-4 pt-16 pb-16 sm:px-6 sm:pt-[72px] lg:min-h-[1030px] lg:px-8 lg:pt-[78px] lg:pb-20">
        <header
          className={`relative z-20 mx-auto text-center transition-[opacity,transform] duration-800 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
            isVisible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-7 scale-95 opacity-0"
          }`}
        >
          <div className="relative mx-auto flex w-fit max-w-full items-center justify-center gap-2 sm:gap-4">
            <Image
              className="pointer-events-none absolute -top-5 left-[58%] size-8 animate-benefit-glow object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.92)] motion-reduce:animate-none sm:-top-8 sm:size-11"
              src="/img/icon-start.webp"
              alt=""
              width={44}
              height={44}
              aria-hidden="true"
            />
            <h2
              className="relative w-[168px] sm:w-[360px] whitespace-nowrap bg-[linear-gradient(180deg,#ffffff_4%,#ffe9ff_24%,#fb91ef_58%,#dc54df_100%)] bg-clip-text text-[clamp(49px,8vw,92px)] leading-[1.3] font-extrabold tracking-[-0.075em] text-transparent italic [filter:drop-shadow(0_5px_0_rgba(108,7,143,0.72))_drop-shadow(0_0_14px_rgba(255,105,237,0.55))]"
              id="seven-day-title"
            >
              {content.headingHighlight}
            </h2>

            <div className="mb-0.5 grid shrink-0 justify-items-start gap-1.5 sm:mb-1 sm:gap-2">
              <span className="whitespace-nowrap text-[clamp(16px,2.4vw,30px)] leading-none font-black tracking-[-0.025em] text-white italic [text-shadow:0_3px_7px_rgba(44,0,70,0.62)]">
                {content.headingSuffix}
              </span>
              <span className="min-w-[112px] rounded-full border border-[#ffc8fb]/70 bg-[linear-gradient(100deg,#e743df,#ff67eb)] px-4 py-1 text-center text-[clamp(14px,2vw,24px)] leading-none font-black text-white italic shadow-[0_0_20px_rgba(255,89,229,0.72),inset_0_1px_0_rgba(255,255,255,0.62)] sm:min-w-[190px] sm:py-1.5">
                {content.headingBadge}
              </span>
            </div>

          </div>
        </header>

        <div
          className={`relative z-20 mx-auto mt-4 flex max-w-[1080px] items-center gap-4 transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none sm:mt-2 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <Image
            className="mt-1 h-auto w-8 shrink-0 -rotate-12 object-contain drop-shadow-[0_0_13px_rgba(115,214,255,0.74)] sm:w-16"
            src="/img/tiktok_item.webp"
            alt=""
            width={60}
            height={60}
            aria-hidden="true"
          />
          <p className="text-[13px] leading-[1.52] font-medium text-white/95 sm:text-[15px] lg:text-[16px]">
            {content.intro}
          </p>
        </div>

        <div className="relative z-20 mx-auto mt-10 max-w-[1280px] lg:mt-3">

          <ol
            className="relative z-10 grid list-none grid-cols-2 gap-x-3 gap-y-8 p-0 sm:gap-x-8 sm:gap-y-11 lg:block lg:h-[var(--roadmap-height)]"
            style={
              {
                "--roadmap-height": `${roadmapBaseHeight + lastIndex * roadmapStepOffset}px`,
              } as CSSProperties
            }
          >
            {steps.map((step, index) => (
              <li
                className={`mx-auto w-full max-w-[320px] max-sm:max-w-none transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none lg:absolute lg:m-0 lg:w-[240px] lg:max-w-none ${
                  isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-14 scale-90 opacity-0"
                }`}
                style={{
                  transitionDelay: `${300 + index * 150}ms`,
                  left: `calc((100% - 240px) * ${index} / ${lastIndex})`,
                  top: `${(lastIndex - index) * roadmapStepOffset}px`,
                }}
                key={step.id}
              >
                <div
                  className="animate-benefit-float motion-reduce:animate-none"
                  style={{ animationDelay: `${index * -0.72}s` }}
                >
                  <article className="group relative overflow-hidden rounded-[11px] border-2 border-[#ff59e7] bg-[linear-gradient(180deg,#ed44de_0%,#b516be_48%,#710b9e_100%)] shadow-[0_0_9px_rgba(255,255,255,0.72),0_0_25px_rgba(255,57,223,0.72),0_17px_28px_rgba(34,0,57,0.38)]">
                    <div className="relative aspect-[1/1] overflow-hidden border-b-2 border-[#ff74ed] bg-[#3b075a]">
                      <Image
                        className="scale-[1.45] object-cover transition-transform duration-700 group-hover:scale-[1.58]"
                        src={step.image}
                        alt={`Buổi đào tạo ${step.title.toLocaleLowerCase("vi")}`}
                        fill
                        sizes="(max-width: 640px) 46vw, (max-width: 1024px) 45vw, 164px"
                      />
                      <span
                        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-benefit-shine bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.42),transparent)] motion-reduce:hidden"
                        aria-hidden="true"
                      />
                      <span
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-[linear-gradient(180deg,transparent,rgba(70,0,95,0.48))]"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="relative min-h-[142px] px-3 py-3.5 sm:min-h-[184px] sm:px-4 sm:py-4 lg:min-h-[160px]">
                      <h3 className="relative text-[14px] leading-[1.15] font-bold text-white uppercase sm:text-[17px] lg:text-[20px]">
                        {step.title}
                      </h3>
                      <p className="relative mt-2.5 text-[11.5px] leading-[1.32] font-medium text-white sm:mt-4 sm:text-[15px]">
                        {step.description}
                      </p>
                    </div>
                  </article>

                  <div
                    className="relative mx-auto mt-4 grid size-[86px] animate-roadmap-marker place-items-center rounded-full border-2 border-white/90 bg-[radial-gradient(circle_at_35%_28%,#ffffff_0%,#ffe5ff_21%,#ff9af1_48%,#d733d5_76%,#8e0caf_100%)] shadow-[inset_0_0_16px_rgba(255,255,255,0.7),0_0_18px_rgba(255,255,255,0.82),0_0_35px_rgba(255,74,225,0.8)] motion-reduce:animate-none sm:mt-6 sm:size-[108px] lg:size-[112px]"
                    style={{ animationDelay: `${index * -0.55}s` }}
                    aria-label={`Ngày ${step.day}`}
                  >
                    <span className="relative z-10 text-center text-[14px] leading-[0.92] font-black tracking-[-0.04em] text-[#d015c2] uppercase [text-shadow:0_2px_0_#fff,0_0_8px_rgba(255,255,255,0.9)] sm:text-[18px] lg:text-[20px]">
                      <span className="block font-bold">Ngày {step.day}</span>
                    </span>
                    <span
                      className="pointer-events-none absolute -inset-4 -z-10 animate-benefit-glow rounded-full bg-[#ff68e7]/18 blur-xl motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div
            className={`relative z-20 mt-14 text-center transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none lg:absolute lg:right-[17%] lg:bottom-[10px] lg:mt-0 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
            }`}
            style={{ transitionDelay: "980ms" }}
          >
            <a
              className="group inline-flex min-h-[52px] items-center gap-4 rounded-full border border-[#ffc7f8]/70 bg-[linear-gradient(100deg,#e724d5,#ff38dc_62%,#ff5ee5)] px-7 text-[17px] font-bold text-white no-underline shadow-[0_0_26px_rgba(255,53,220,0.72),inset_0_1px_0_rgba(255,255,255,0.58)] transition hover:-translate-y-1 hover:brightness-110 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-8 sm:text-[19px]"
              href={content.ctaHref}
            >
              <span>{content.ctaLabel}</span>
              <span className="grid size-8 place-items-center rounded-full bg-white text-[#d71dca] transition-transform group-hover:translate-x-1">
                <ArrowRight className="size-5" strokeWidth={2.5} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
