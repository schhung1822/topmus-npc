"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SevenDayTrainingContent } from "@/lib/seven-day-training-content";

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
              className="relative w-[200px] sm:w-[360px] font-bold whitespace-nowrap bg-[linear-gradient(270deg,#ffffff_4%,#ffe9ff_24%,#fb91ef_58%,#dc54df_100%)] bg-clip-text text-[clamp(49px,8vw,92px)] leading-[1.3] font-extrabold tracking-[-0.075em] text-transparent italic [filter:drop-shadow(0_5px_0_rgba(108,7,143,0.72))_drop-shadow(0_0_14px_rgba(255,105,237,0.55))]"
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

        <div className="relative z-20 mx-auto mt-10 max-w-[1220px] lg:mt-12">
          <ol className="grid list-none grid-cols-1 gap-4 p-0 sm:gap-5 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-5 lg:gap-x-8 lg:gap-y-5">
            {content.steps.map((step, index) => (
              <li
                className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${260 + index * 80}ms` }}
                key={step.id}
              >
                <article className="group relative grid min-h-[90px] grid-cols-[78px_70px_minmax(0,1fr)] items-center overflow-hidden rounded-[18px] border border-[#f75be9]/80 bg-[linear-gradient(100deg,#a442bf_0%,#922daf_44%,#7b2098_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_0_18px_rgba(255,67,226,0.34),0_14px_28px_rgba(38,0,61,0.3)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:min-h-[116px] sm:grid-cols-[108px_104px_minmax(0,1fr)] sm:rounded-[22px]">
                  <div className="relative z-10 grid h-full place-content-center rounded-[17px] border border-[#ff83ee]/85 bg-[linear-gradient(145deg,#bd4fd3_0%,#8b38ac_54%,#6d268f_100%)] text-center shadow-[inset_0_0_20px_rgba(255,255,255,0.15),4px_0_16px_rgba(44,0,66,0.2)] sm:rounded-[21px]">
                    <span className="text-[15px] leading-none font-medium text-white sm:text-[20px]">Ngày</span>
                    <strong className="mt-1 bg-[linear-gradient(180deg,#ff74ef,#ff39e1)] bg-clip-text text-[34px] leading-none font-bold text-transparent [filter:drop-shadow(0_2px_0_rgba(111,18,133,0.45))_drop-shadow(0_0_8px_rgba(255,89,232,0.45))] sm:text-[50px]">
                      {step.day}
                    </strong>
                  </div>

                  <div className="relative z-10 grid h-full place-items-center px-2 sm:px-4">
                    <Image
                      className="h-auto w-[62px] object-contain drop-shadow-[0_0_10px_rgba(110,224,255,0.55)] transition-transform duration-500 group-hover:scale-105 sm:w-[94px]"
                      src={step.image}
                      alt=""
                      width={160}
                      height={160}
                      sizes="(max-width: 639px) 62px, 94px"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="relative z-10 py-4 pr-4 pl-1 text-[15px] leading-[1.3] font-medium text-white sm:py-5 sm:pr-6 sm:text-[clamp(17px,1.65vw,22px)]">
                    {step.title}
                  </h3>

                  <span className="pointer-events-none absolute inset-x-[18%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.72),transparent)]" aria-hidden="true" />
                  <span className="pointer-events-none absolute -right-10 -bottom-12 size-28 rounded-full bg-[#f15de0]/18 blur-2xl" aria-hidden="true" />
                </article>
              </li>
            ))}
          </ol>

          <div
            className={`relative z-20 mt-12 text-center transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
            }`}
            style={{ transitionDelay: "1080ms" }}
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
