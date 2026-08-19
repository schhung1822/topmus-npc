"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./achievement-stats-section.module.css";

const statistics = [
  {
    value: 2000,
    suffix: "+",
    label: (
      <>
        Nhà sáng tạo
        <br />
        trên cả nước
      </>
    ),
    accessibleLabel: "Hơn 2.000 nhà sáng tạo trên cả nước",
  },
  {
    value: 90,
    suffix: "%",
    label: (
      <>
        Cải thiện thu nhập
        <br />
        sau khi gia nhập
      </>
    ),
    accessibleLabel: "90% nhà sáng tạo cải thiện thu nhập sau khi gia nhập",
  },
  {
    value: 13,
    suffix: "+",
    label: (
      <>
        Giải thưởng lớn
        <br />
        trong nước
      </>
    ),
    accessibleLabel: "Hơn 13 giải thưởng lớn trong nước",
  },
  {
    value: 70,
    suffix: "%",
    label: (
      <>
        Hoa hồng
        <br />
        chia sẻ tối đa
      </>
    ),
    accessibleLabel: "Hoa hồng chia sẻ tối đa 70%",
  },
];

const numberFormatter = new Intl.NumberFormat("vi-VN");

export function AchievementStatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);
  const [values, setValues] = useState(() => statistics.map(() => 0));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        observer.disconnect();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setValues(statistics.map((statistic) => statistic.value));
          return;
        }

        const startedAt = performance.now();
        const duration = 1_600;

        const updateValues = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          setValues(
            statistics.map((statistic) => Math.round(statistic.value * easedProgress)),
          );

          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(updateValues);
          }
        };

        animationFrameRef.current = requestAnimationFrame(updateValues);
      },
      { threshold: 0.3 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[520px] w-full overflow-hidden bg-[#450063] bg-[image:url('/img/bg_sec.webp')] bg-cover bg-[position:27%_center] text-white sm:min-h-[440px] lg:aspect-[1920/540] lg:min-h-0 lg:bg-center"
      aria-label="Thành tựu nổi bật của TOPMUS Entertainment"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[#350052]/35 lg:bg-transparent"
      />
      <div className="mx-auto flex min-h-[520px] w-full max-w-[1280px] items-end px-4 py-10 sm:min-h-[440px] sm:items-center sm:px-6 lg:min-h-full lg:max-w-none lg:p-0">
        <div className={`${styles.statsGrid} w-full grid-cols-2 gap-3 sm:gap-4 lg:w-auto`}>
          {statistics.map((statistic, index) => (
            <article
              className={`${styles.statCard} grid min-h-[128px] place-content-center rounded-[18px] border border-white/25 bg-[linear-gradient(180deg,rgba(241,72,229,0.96),rgba(214,35,207,0.96))] px-2 py-4 text-center shadow-[inset_0_1px_rgba(255,255,255,0.4),0_12px_30px_rgba(63,0,93,0.28)] backdrop-blur-sm sm:min-h-[138px] lg:px-[clamp(4px,0.55vw,11px)] lg:py-[clamp(7px,0.65vw,13px)]`}
              key={statistic.accessibleLabel}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent"
              />
              <span
                aria-hidden="true"
                className="relative text-[clamp(30px,5vw,42px)] leading-none font-black tracking-[-0.04em] text-white tabular-nums font-bold [text-shadow:0_2px_10px_rgba(111,0,126,0.24)] lg:text-[clamp(26px,2.25vw,43px)]"
              >
                {numberFormatter.format(values[index])}
                {statistic.suffix}
              </span>
              <p
                aria-hidden="true"
                className="relative mt-2 text-[12px] leading-[1.25] font-medium text-white sm:text-sm lg:mt-[clamp(4px,0.45vw,9px)] lg:text-[clamp(10px,0.9vw,17px)] lg:leading-[1.18] lg:tracking-[-0.02em]"
              >
                {statistic.label}
              </p>
              <span className="sr-only">{statistic.accessibleLabel}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
