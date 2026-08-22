"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./pain-points-section.module.css";

const painPoints = [
  {
    title: (
      <>
        Nhàm chán với live nhóm, chạy KPI áp lực, thu nhập không đạt mong muốn
      </>
    ),
    icon: "/img/icon.mess.webp",
    position: "lg:absolute lg:top-0 lg:left-0",
    rotation: "lg:[transform:perspective(900px)_translateZ(0px)_rotateX(-4deg)_rotateY(20deg)]",
    animation: "animate-pain-float",
  },
  {
    title: (
      <>
        Live cả buổi ít mắt xem · Tự bơi một mình · Không lương cứng
      </>
    ),
    icon: "/img/icon-eye.webp",
    position: "lg:absolute lg:top-0 lg:right-0",
    rotation: "lg:[transform:perspective(900px)_translateZ(0px)_rotateX(-4deg)_rotateY(-20deg)]",
    animation: "animate-pain-float-reverse",
  },
  {
    title: (
      <>
        Không được đào tạo, không có công cụ, phần mền chuyên dụng - ekip hỗ trợ
      </>
    ),
    icon: "/img/icon3.webp",
    position: "lg:absolute lg:bottom-0 lg:left-0",
    rotation: "lg:[transform:perspective(900px)_translateZ(0px)_rotateX(2deg)_rotateY(24deg)]",
    animation: "animate-pain-float-reverse",
  },
  {
    title: (
      <>
        Bạn là người có năng khiếu diễn xuất/nhảy, muốn thử sức nhưng chưa biết bắt đầu từ đâu
      </>
    ),
    icon: "/img/icon1.webp",
    position: "lg:absolute lg:right-0 lg:bottom-0",
    rotation: "lg:[transform:perspective(900px)_translateZ(0px)_rotateX(2deg)_rotateY(-24deg)]",
    animation: "animate-pain-float",
  },
] as const;

function PainPointIcon({ src }: { src: (typeof painPoints)[number]["icon"] }) {
  return (
    <Image
      className="size-[66px] object-contain drop-shadow-[0_7px_12px_rgba(70,0,101,0.24)]"
      src={src}
      alt=""
      width={80}
      height={80}
      aria-hidden="true"
    />
  );
}

export function PainPointsSection() {
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
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} relative isolate overflow-hidden py-14 text-white sm:py-16 lg:pt-[66px] lg:pb-8`}
      aria-labelledby="pain-points-title"
    >
      <div className={styles.backgroundGlow} aria-hidden="true" />
      <div className={styles.starField} aria-hidden="true" />

      <div className={`${styles.giftStack} ${styles.giftStackLeft}`} aria-hidden="true">
        <span><i /> Cynthia.Ra... <b>×1</b></span>
        <span><i /> Minh Anh <b>×1</b></span>
        <span><i /> Bella N. <b>×10</b></span>
      </div>
      <div className={`${styles.giftStack} ${styles.giftStackRight}`} aria-hidden="true">
        <span><i /> Cynthia.Ra... <b>×1</b></span>
        <span><i /> Minh Anh <b>×1</b></span>
        <span><i /> Bella N. <b>×10</b></span>
      </div>

      <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-6">
        <div className="relative mx-auto flex w-full max-w-[960px] flex-col lg:min-h-[520px]">
          <div
            className={`relative z-10 mx-auto mb-9 w-full max-w-[420px] text-center transition duration-700 lg:absolute lg:top-1/2 lg:left-1/2 lg:mb-0 lg:w-[350px] lg:-translate-x-1/2 lg:-translate-y-1/2 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className={styles.questionLead}>
              Tự livestream vì sao mãi
            </p>
            <h2
              className={styles.questionTitle}
              id="pain-points-title"
            >
              <span>KHÔNG BỨT</span>
              <span className="-translate-y-[8px]">LÊN ĐƯỢC ?</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:block">
            {painPoints.map((painPoint, index) => (
              <div
                className={`w-full transition duration-700 lg:w-[320px] ${painPoint.position} ${
                  isVisible
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-10 scale-90 opacity-0"
                }`}
                style={{ transitionDelay: `${120 + index * 130}ms` }}
                key={painPoint.icon}
              >
                <div className={`${painPoint.animation} motion-reduce:animate-none`}>
                  <article
                    className={`${styles.painCard} relative grid min-h-[172px] place-content-center overflow-hidden px-3 py-3 text-center ${painPoint.rotation}`}
                  >
                    <div className={styles.cardShine} />
                    <div className="relative mx-auto">
                      <PainPointIcon src={painPoint.icon} />
                    </div>
                    <h3 className="relative mt-1 text-[clamp(16px,3vw,22px)] leading-[27px] font-bold tracking-[-0.035em] text-white [text-shadow:0_2px_5px_rgba(94,0,111,0.26)] lg:h-[114px] lg:text-[22px]">
                      {painPoint.title}
                    </h3>
                  </article>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`mx-auto mt-10 max-w-[780px] rounded-[17px] border border-white/[0.04] bg-[#510281]/78 px-6 py-4 text-center text-[13px] leading-[1.42] shadow-[0_18px_40px_rgba(46,0,72,0.22)] backdrop-blur-sm transition duration-700 sm:text-[14px] lg:mt-[58px] lg:flex lg:min-h-[72px] lg:items-center lg:justify-center ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "680ms" }}
        >
          <p className="m-0">
            <span className="font-semibold text-[#ff63e8]">
              NPC Live tại TOPMUS sinh ra để xử đúng những nỗi đau này:
            </span>{" "}
            nhân vật và kịch bản có sẵn, mentor đọc số liệu thay bạn, thiết bị 5.000 USD, lương
            cứng làm nền thu nhập.
          </p>
        </div>

        <a
          className="mx-auto mt-5 grid size-[58px] animate-bounce place-items-center rounded-full border-2 border-white text-white transition hover:bg-white hover:text-[#691096] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:animate-none"
          href="#ban-nhan-duoc-gi"
          aria-label="Xem nội dung tiếp theo"
        >
          <ArrowDown className="size-8" strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
