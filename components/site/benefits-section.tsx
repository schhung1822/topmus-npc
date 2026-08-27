"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./benefits-section.module.css";

const benefitCards = [
  {
    id: "luong-cung",
    src: "/img/img2.webp",
    alt: "Poster tuyển dụng NPC Live với lương cứng từ 10 đến 40 triệu mỗi tháng",
    title: (
      <>
        LỘ TRÌNH
        <br />
        ĐÀO TẠO
      </>
    ),
    imageClass: "object-cover object-[20%_center]",
    featured: false,
  },
  {
    id: "hoa-hong",
    src: "/img/img4.webp",
    alt: "Poster hoa hồng lên tới 70% dành cho NPC Live Creator",
    title: (
      <>
         LƯƠNG CỨNG
        <br />
        HOA HỒNG 60%
      </>
    ),
    imageClass: "object-cover object-center",
    featured: true,
  },
  {
    id: "thuong-bxh",
    src: "/img/img1.webp",
    alt: "Poster bảng xếp hạng NST Live tháng 5",
    title: (
      <>
        GIỜ LÀM
        <br />
        LINH HOẠT
      </>
    ),
    imageClass: "object-cover object-[82%_center]",
    featured: false,
  },
] as const;

const incomeTiers = [
  { label: "THÁNG ĐẦU", amount: "10 – 20 TRIỆU", note: "Giai đoạn ươm mầm không KPI" },
  { label: "THÁNG 2 - 4", amount: "12 – 50 TRIỆU", note: "Giai đoạn ổn định" },
  { label: "SAU 5 THÁNG", amount: "50 TRIỆU +", note: "Nhóm bứt phá, thu nhập vô hạn" },
] as const;

export function BenefitsSection() {
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
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative isolate overflow-hidden py-14 text-white sm:py-16 lg:pt-10 lg:pb-14`}
      id="ban-nhan-duoc-gi"
      aria-labelledby="benefits-title"
    >
      <div className={styles.backgroundLight} aria-hidden="true" />
      <Image
        alt=""
        aria-hidden="true"
        className={`${styles.floatingDecoration} ${styles.coinLeft}`}
        height={240}
        src="/img/icon1.webp"
        width={240}
      />
      <Image
        alt=""
        aria-hidden="true"
        className={`${styles.floatingDecoration} ${styles.coinRight}`}
        height={130}
        src="/img/icon1.webp"
        width={130}
      />
      <Image
        alt=""
        aria-hidden="true"
        className={`${styles.floatingDecoration} ${styles.tiktokLeft}`}
        height={120}
        src="/img/tiktok_item.webp"
        width={90}
      />
      <Image
        alt=""
        aria-hidden="true"
        className={`${styles.floatingDecoration} ${styles.tiktokRight}`}
        height={150}
        src="/img/tiktok_item.webp"
        width={110}
      />

      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-6">
        <header
          className={`mx-auto max-w-[760px] text-center transition duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
          }`}
        >
          <p className={styles.titleEyebrow}>
            Trở thành NPC Live Creator
          </p>
          <div className={styles.titleBlock}>
            <h2 className={styles.titleMain} id="benefits-title">
              Bạn nhận được gì?
            </h2>
            <Image
              alt=""
              aria-hidden="true"
              className={`${styles.titleStar} animate-benefit-glow motion-reduce:animate-none`}
              height={36}
              src="/img/icon-start.webp"
              width={36}
            />
          </div>
        </header>

        <ul className={styles.benefitGrid}>
          {benefitCards.map((card, index) => (
            <li
              className={`${styles.benefitItem} ${card.featured ? styles.featuredItem : ""} transition duration-700 ease-out ${
                isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-12 scale-95 opacity-0"
              }`}
              style={{ transitionDelay: `${140 + index * 150}ms` }}
              key={card.id}
            >
              <div
                className={`${styles.cardFloat} mx-auto w-full motion-reduce:animate-none ${
                  card.featured
                    ? "animate-benefit-float [filter:drop-shadow(0_0_16px_rgba(255,76,233,0.8))_drop-shadow(0_18px_30px_rgba(38,0,64,0.45))]"
                    : "[filter:drop-shadow(0_0_11px_rgba(241,63,223,0.6))_drop-shadow(0_14px_24px_rgba(38,0,64,0.4))]"
                }`}
              >
                <article
                  className={`${styles.benefitCard} ${card.featured ? styles.featuredCard : ""} group relative flex w-full flex-col overflow-hidden transition duration-500 hover:-translate-y-2`}
                >
                  <div className={styles.posterMedia}>
                    <Image
                      className={`${card.imageClass} transition-transform duration-700 group-hover:scale-105`}
                      src={card.src}
                      alt={card.alt}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                    />
                    <span
                      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-benefit-shine bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)] motion-reduce:hidden"
                      aria-hidden="true"
                    />
                  </div>

                  <h3
                    className={`${styles.benefitCardTitle} ${card.featured ? styles.featuredCardTitle : ""}`}
                  >
                    {card.title}
                  </h3>

                  <span
                    className={styles.cardTopLight}
                    aria-hidden="true"
                  />
                </article>
              </div>
            </li>
          ))}
        </ul>

        <div
          className={`${styles.incomePanel} relative mx-auto mt-14 w-full max-w-[1280px] overflow-hidden px-5 py-9 transition duration-700 sm:px-10 lg:mt-[52px] lg:px-14 lg:pt-10 lg:pb-7 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "560ms" }}
        >
          <span className={`${styles.cornerRibbon} ${styles.cornerRibbonLeft}`} aria-hidden="true" />
          <span className={`${styles.cornerRibbon} ${styles.cornerRibbonRight}`} aria-hidden="true" />

          <h3 className={styles.incomeTitle}>
            THU NHẬP KHÔNG GIỚI HẠN
          </h3>

          <ul className={styles.incomeList}>
            {incomeTiers.map((tier, index) => (
              <li
                className={`${styles.incomeTier} transition duration-700 ease-out ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: `${700 + index * 160}ms` }}
                key={tier.label}
              >
                <span className={styles.tierLabel}>
                  {tier.label}
                </span>

                <div
                  className={`${styles.tierBar} ${
                    index === 0
                      ? styles.tierBarOne
                      : index === 1
                        ? styles.tierBarTwo
                        : styles.tierBarThree
                  }`}
                >
                  <p
                    className={`${styles.tierAmount} ${index === 0 ? styles.tierAmountGradient : ""}`}
                  >
                    {tier.amount}
                  </p>
                  <p className={styles.tierNote}>
                    {tier.note}
                  </p>
                  {index === 0 ? <span className={styles.tierLight} aria-hidden="true" /> : null}
                </div>
              </li>
            ))}
          </ul>

          <div
            className={`${styles.incomeCta} relative text-center transition duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "1180ms" }}
          >
            <a
              className={styles.registerButton}
              href="#lien-he"
            >
              <span>Đăng ký ngay</span>
              <span className={styles.registerIcon}>
                <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden="true" />
              </span>
            </a>
            <p className={styles.registerNote}>
              Không thu phí ứng tuyển – thông tin được bảo mật
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
