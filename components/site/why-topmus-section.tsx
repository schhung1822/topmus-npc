"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./why-topmus-section.module.css";

type WhyTopmusSlide = {
  src: string;
  alt: string;
};

type WhyTopmusSectionProps = {
  tickerItems: string[];
  creatorSlides: WhyTopmusSlide[];
  trainingSlides: WhyTopmusSlide[];
};

const fallbackSlides = [
  {
    src: "/img/tm1.webp",
    alt: "Nhà sáng tạo TOPMUS được vinh danh trên SkyLED lớn nhất Đông Nam Á tại TCN Season 3",
    width: 2000,
    height: 2000,
  },
  {
    src: "/img/tm2.webp",
    alt: "Các nhà sáng tạo TOPMUS được vinh danh tại TikTok LIVE Clash Season 3",
    width: 2048,
    height: 2048,
  },
] as const;

const SLIDE_INTERVAL_MS = 3_000;

function AutoFadeSlider({ slides }: { slides: readonly WhyTopmusSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleIndex = activeIndex % Math.max(slides.length, 1);

  useEffect(() => {
    if (slides.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  return (
    <figure className={styles.achievementCard}>
      {slides.map((image, index) => {
        const isActive = index === visibleIndex;

        return (
          <Image
            className={`${styles.achievementImage} ${styles.achievementSlide} ${
              isActive ? styles.achievementSlideActive : ""
            }`}
            src={image.src}
            alt={isActive ? image.alt : ""}
            fill
            sizes="(min-width: 1024px) 27vw, (min-width: 640px) 43vw, 92vw"
            aria-hidden={!isActive}
            key={`${image.src}-${index}`}
          />
        );
      })}
    </figure>
  );
}

function TickerGroup({ items }: { items: string[] }) {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <div
          className="flex shrink-0 items-center gap-4 pl-5 text-[17px] leading-none font-extrabold whitespace-nowrap text-white sm:gap-6 sm:pl-7 sm:text-[21px]"
          key={`${index}-${item}`}
        >
          <span>{item}</span>
          <Image
            className="size-6 object-contain sm:size-8"
            src="/img/icon-start.webp"
            alt=""
            width={36}
            height={36}
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
}

export function WhyTopmusSection({
  tickerItems,
  creatorSlides,
  trainingSlides,
}: WhyTopmusSectionProps) {
  const resolvedCreatorSlides = creatorSlides.length ? creatorSlides : [fallbackSlides[0]];
  const resolvedTrainingSlides = trainingSlides.length ? trainingSlides : [fallbackSlides[1]];

  return (
    <section
      className="relative isolate overflow-hidden bg-[#5b087e] bg-[image:url('/img/bga.webp')] bg-cover bg-center text-white"
      id="quyen-loi"
      aria-labelledby="why-topmus-title"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(31,0,48,0.64),rgba(56,0,78,0.72))]"
        aria-hidden="true"
      />

      <div className="mx-auto min-h-[720px] w-full max-w-[1280px] px-4 pt-12 pb-10 sm:px-6 sm:pt-14 lg:pt-16">
        <div className={styles.titleBlock}>
          <p className={styles.titleEyebrow}>
            Vì sao nên bắt đầu nghề
          </p>
          <h2
            className={styles.titleMain}
            data-title="NPC LIVE TẠI TOPMUS?"
            id="why-topmus-title"
          >
            NPC LIVE TẠI TOPMUS?
          </h2>
        </div>

        <div className="mt-20 grid items-center gap-10 lg:mt-16 lg:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.22fr)] lg:gap-12">
          <div className="mx-auto w-full max-w-[450px] lg:mx-0 lg:pl-6">
            <p className="text-[14px] leading-[1.5] font-medium text-white/95 sm:text-[16px]">
              TOPMUS thành lập năm 2021, chuyên tuyển dụng – đào tạo – quản lý nhà sáng tạo trên
              TikTok. TOPMUS Entertainment hiện giữ Top 1 khu vực Đông Nam Á & Trung Á tại SEA &
              CCA 2026, sở hữu bảng xếp hạng vinh danh hằng tháng và đưa nhà sáng tạo xuất hiện
              trên SkyLED lớn nhất Đông Nam Á.
            </p>

            <a
              className="group mt-8 inline-flex min-h-[58px] min-w-[310px] items-center justify-between gap-7 rounded-full border-2 border-white px-7 text-[18px] font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:bg-white hover:text-[#6e0a91] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-[21px]"
              href="https://topmus.vn/"
              target="_blank"
              rel="noreferrer"
            >
              <span>Xem thêm về TOPMUS</span>
              <ArrowRight
                className="size-7 transition-transform group-hover:translate-x-1"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </a>
          </div>

          <div className={styles.achievementGallery}>
            <AutoFadeSlider slides={resolvedCreatorSlides} />
            <AutoFadeSlider slides={resolvedTrainingSlides} />
          </div>
        </div>
      </div>

      <div
        className="relative min-h-[62px] w-full overflow-hidden bg-[#310045] shadow-[inset_0_1px_rgba(255,255,255,0.09)] sm:min-h-[76px]"
        role="region"
        aria-label="Quyền lợi nổi bật của NPC Live tại TOPMUS"
      >
        <div
          className="flex min-h-[62px] w-max animate-ticker items-center will-change-transform motion-reduce:animate-none sm:min-h-[76px]"
          aria-hidden="true"
        >
          <TickerGroup items={tickerItems} />
          <TickerGroup items={tickerItems} />
        </div>
      </div>
    </section>
  );
}
