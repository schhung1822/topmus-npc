"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SharedTicker } from "./shared-ticker";

const softwareTools = [
  {
    id: "npc-dashboard",
    title: ["Production", "Team"],
    description: "Ekip sản xuất hiệu ứng riêng, quay clip, chụp ảnh định kì, kỹ thuật trực full ca live",
  },
  {
    id: "visual-upgrade",
    title: ["Visual", "Upgrade"],
    description: "Hỗ trợ không gian LIVE, nhân sự make-up, tóc và thiết kế hiệu ứng chuyên nghiệp.",
  },
  {
    id: "training-system",
    title: ["Training", "System"],
    description: "Danh sách kỹ năng cần đạt, giờ tập có trainer đào tạo, biểu cảm thoại mẫu và lịch duyệt.",
  },
  {
    id: "hp-action",
    title: ["NPC", "ACTION"],
    description: "Bộ công cụ phần mền chạy hiệu ứng, app làm đẹp, app âm thanh, đảm bảo mọi thứ chỉnh chu",
  },
] as const;

export function SoftwareToolsSection({ tickerItems }: { tickerItems: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneVideoRef = useRef<HTMLVideoElement>(null);
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
      { threshold: 0.16 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = phoneVideoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    let isVideoInView = false;

    const syncPlayback = () => {
      if (isVideoInView && !document.hidden) {
        void video.play().catch(() => undefined);
        return;
      }

      video.pause();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVideoInView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        syncPlayback();
      },
      { threshold: [0, 0.35] },
    );

    observer.observe(video);
    video.addEventListener("canplay", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    document.addEventListener("pointerdown", syncPlayback, { passive: true });
    window.addEventListener("pageshow", syncPlayback);

    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      document.removeEventListener("pointerdown", syncPlayback);
      window.removeEventListener("pageshow", syncPlayback);
      video.pause();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#51008c] text-white"
      id="cong-cu-phan-mem"
      aria-labelledby="software-tools-title"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-30 bg-[image:url('/img/bg-tool.webp')] bg-cover bg-[center_-80px] opacity-80"
        aria-hidden="true"
      />

      <div className="mx-auto min-h-[700px] w-full max-w-[1220px] px-4 pt-[72px] pb-[62px] sm:px-6 sm:pt-[82px] lg:min-h-[750px] lg:px-8">
        <header
          className={`relative mx-auto w-fit max-w-[88vw] transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
            isVisible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-5 scale-95 opacity-0"
          }`}
        >
          <Image
            className="pointer-events-none absolute top-[53%] -left-[15%] z-10 size-11 animate-benefit-glow object-contain drop-shadow-[0_0_16px_rgba(255,255,255,0.95)] motion-reduce:animate-none sm:size-14"
            src="/img/icon-start.webp"
            alt=""
            width={56}
            height={56}
            aria-hidden="true"
          />

          <h2
            className="relative z-10 px-8 text-center text-[clamp(25px,3vw,39px)] leading-[1.04] font-bold tracking-[0.01em] text-white uppercase [text-shadow:0_0_15px_rgba(255,112,235,0.95),0_4px_5px_rgba(36,0,64,0.72)] sm:px-12"
            id="software-tools-title"
          >
            Ekip - công cụ hỗ trợ
          </h2>
        </header>

        <div className="relative mx-auto mt-[58px] max-w-[1280px] lg:h-[500px]">
          <div
            className={`relative z-20 mx-auto mb-12 w-[225px] transition-[opacity,transform] duration-1000 ease-out motion-reduce:transform-none motion-reduce:transition-none sm:w-[250px] lg:absolute lg:top-[-26px] lg:right-[68px] lg:mb-0 lg:w-[274px] ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
            }`}
            style={{ transitionDelay: "380ms" }}
          >
            <div className="animate-benefit-float motion-reduce:animate-none">
              <div className="relative origin-center [transform:perspective(1100px)_rotateY(-9deg)_rotateZ(5deg)]">
                <span
                  className="pointer-events-none absolute -inset-7 -z-20 rounded-[64px] bg-[#ff31dc]/35 blur-[50px]"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute top-2 -right-3 bottom-2 -left-1 -z-10 rounded-[42px] bg-[linear-gradient(105deg,#6d5085_0%,#d9c3e8_44%,#5c376f_72%,#2c153b_100%)] shadow-[16px_24px_26px_rgba(30,0,50,0.48)]"
                  aria-hidden="true"
                />

                <div className="relative aspect-[1/2] overflow-hidden rounded-[38px] border-[7px] border-[#21102f] bg-[#170525] shadow-[0_0_0_2px_rgba(234,205,255,0.54),0_28px_48px_rgba(24,0,40,0.56)]">
                  <video
                    ref={phoneVideoRef}
                    className="software-phone-video pointer-events-none absolute inset-0 size-full object-contain object-center"
                    aria-label="Video giới thiệu TOPMUS trong màn hình điện thoại"
                    poster="/img/phone-bg.webp"
                    autoPlay
                    controls={false}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    disablePictureInPicture
                    disableRemotePlayback
                  >
                    <source src="/video/npcloop.mp4" type="video/mp4" />
                  </video>
                  <div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(31,0,58,0.28)_0%,rgba(75,0,118,0.08)_28%,transparent_62%,rgba(26,0,49,0.42)_100%)]"
                    aria-hidden="true"
                  />

                  <span
                    className="pointer-events-none absolute top-1.5 left-1/2 z-20 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-[#21102f] shadow-[0_1px_0_rgba(255,255,255,0.18)]"
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-[38%] animate-software-video-shine bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.24),transparent)] motion-reduce:hidden"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>

          <ul className="relative z-10 grid list-none gap-2.5 p-0 lg:absolute lg:top-[30px] lg:left-[150px] lg:w-[720px]">
            {softwareTools.map((tool, index) => (
              <li
                className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-14 opacity-0"
                }`}
                style={{ transitionDelay: `${120 + index * 110}ms` }}
                key={tool.id}
              >
                <article className="group relative grid min-h-[88px] grid-cols-[90px_1px_minmax(0,1fr)] items-center gap-3 overflow-hidden rounded-[12px] border-2 border-white/85 bg-[linear-gradient(96deg,#ff80ef_0%,#f04ce1_22%,#e629d7_60%,#d91ccc_100%)] py-3 pr-4 pl-[50px] shadow-[0_0_13px_rgba(255,255,255,0.62),0_0_30px_rgba(255,45,220,0.55),0_14px_25px_rgba(35,0,58,0.34)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:min-h-[94px] sm:grid-cols-[126px_1px_minmax(0,1fr)] sm:gap-5 sm:pr-7 sm:pl-[55px] lg:pr-[78px]">
                  
                  <img 
                    className="pointer-events-none absolute top-1/2 left-[-48px] h-[100%] w-[auto] -translate-y-1/2"
                    aria-hidden="true" 
                    src="/img/icon-start.webp" alt="start" 
                  />
                  <span
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.58),transparent)] transition-transform duration-700 group-hover:translate-x-[560%]"
                    aria-hidden="true"
                  />

                  <h3 className="text-[16px] leading-[1.03] font-bold tracking-[-0.02em] text-white sm:text-[22px]">
                    {tool.title[0]}
                    <br />
                    {tool.title[1]}
                  </h3>

                  <span className="h-12 w-px bg-white/85 shadow-[0_0_5px_rgba(255,255,255,0.55)]" aria-hidden="true" />

                  <p className="text-[11px] leading-[1.36] font-medium text-white [text-shadow:0_1px_3px_rgba(69,0,82,0.35)] sm:text-[13.5px]">
                    {tool.description}
                  </p>
                </article>
              </li>
            ))}
          </ul>

          <div
            className={`pointer-events-none absolute top-[126px] -left-8 -z-0 hidden w-[138px] transition-[opacity,transform] duration-1000 ease-out motion-reduce:transform-none motion-reduce:transition-none lg:block ${
              isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
            style={{ transitionDelay: "520ms" }}
            aria-hidden="true"
          >
            <div className="animate-benefit-float motion-reduce:animate-none">
              <Image
                className="h-auto w-full -rotate-24 object-contain drop-shadow-[0_0_17px_rgba(255,255,255,0.8)] drop-shadow-[0_0_35px_rgba(91,195,255,0.65)]"
                src="/img/tiktok_item.webp"
                alt=""
                width={138}
                height={207}
              />
            </div>
          </div>
          <div
            className={`pointer-events-none absolute top-[54px] left-[48px] -z-16 hidden w-[80px] transition-[opacity,transform] duration-1000 ease-out motion-reduce:transform-none motion-reduce:transition-none lg:block ${
              isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
            style={{ transitionDelay: "520ms" }}
            aria-hidden="true"
          >
            <div className="animate-benefit-float motion-reduce:animate-none">
              <Image
                className="h-auto w-full -rotate-6 object-contain rotate-[20deg] drop-shadow-[0_0_17px_rgba(255,255,255,0.8)] drop-shadow-[0_0_35px_rgba(91,195,255,0.65)]"
                src="/img/tiktok_item.webp"
                alt=""
                width={138}
                height={207}
              />
            </div>
          </div>
        </div>
      </div>
      <SharedTicker
        items={tickerItems}
        variant="pink"
        ariaLabel="Thông tin nổi bật về công cụ hỗ trợ NPC Live"
      />
    </section>
  );
}
