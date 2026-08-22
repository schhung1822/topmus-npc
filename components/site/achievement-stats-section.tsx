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
    value: 60,
    suffix: "%",
    label: (
      <>
        Hoa hồng
        <br />
        chia sẻ tối đa
      </>
    ),
    accessibleLabel: "Hoa hồng chia sẻ tối đa 60%",
  },
  {
    value: "TOP 1",
    suffix: "",
    label: <>SEA & CCA</>,
    accessibleLabel: "TOP 1 SEA & CCA",
  },
];

const numberFormatter = new Intl.NumberFormat("vi-VN");

export function AchievementStatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);
  const [values, setValues] = useState<(number | string)[]>(() =>
    statistics.map((statistic) =>
      typeof statistic.value === "number" ? 0 : statistic.value,
    ),
  );

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
            statistics.map((statistic) =>
              typeof statistic.value === "number"
                ? Math.round(statistic.value * easedProgress)
                : statistic.value,
            ),
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
      className={styles.section}
      aria-label="Thành tựu nổi bật của TOPMUS Entertainment"
    >
      <div aria-hidden="true" className={styles.veil} />

      <div className={styles.designStage}>
        <ul className={styles.statsGrid}>
          {statistics.map((statistic, index) => {
            const displayedValue = values[index];

            return (
              <li className={styles.statCard} key={statistic.accessibleLabel}>
                <div aria-hidden="true" className={styles.cardSheen} />
                <span aria-hidden="true" className={styles.statValue}>
                  {typeof displayedValue === "number"
                    ? numberFormatter.format(displayedValue)
                    : displayedValue}
                  {statistic.suffix}
                </span>
                <p aria-hidden="true" className={styles.statLabel}>
                  {statistic.label}
                </p>
                <span className={styles.srOnly}>{statistic.accessibleLabel}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
