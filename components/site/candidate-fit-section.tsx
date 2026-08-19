"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const candidateRequirements = [
  "Nữ từ 18 tuổi, yêu thích livestream và nội dung giải trí trên TikTok.",
  "Ngoại hình ưa nhìn, sáng camera khi lên hình.",
  "Tự tin trước camera, chịu khó luyện tập và tiếp nhận feedback.",
  "Cam kết khung giờ live đều đặn theo lộ trình đã thống nhất.",
  "Giọng nói, năng khiếu ca hát hoặc nhảy là lợi thế – không bắt buộc.",
  "Không cần kinh nghiệm – bạn sẽ được đào tạo bài bản từ đầu.",
] as const;

const applicationSteps = [
  {
    number: "01",
    title: "Gửi hồ sơ qua form",
    description: "Điền 4 thông tin cơ bản ngay trên trang này – chỉ mất 30 giây.",
  },
  {
    number: "02",
    title: "Team tuyển dụng liên hệ",
    description: "Trong 24–48 giờ làm việc, TOPMUS gọi hoặc nhắn Zalo để trao đổi và hẹn phỏng vấn.",
  },
  {
    number: "03",
    title: "Bắt đầu lộ trình 45 ngày",
    description: "Trúng tuyển – bạn được xếp mentor, chọn nhân vật và bước vào giai đoạn ươm mầm.",
  },
] as const;

export function CandidateFitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.14 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#280035] text-white"
      id="ung-vien-phu-hop"
      aria-labelledby="candidate-fit-title"
    >
      <div className="pointer-events-none absolute inset-0 -z-30" aria-hidden="true">
        <Image
          className="object-cover object-[68%_center] opacity-[0.3] saturate-[0.78]"
          src="/img/bga.webp"
          alt=""
          fill
          sizes="100vw"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(34,0,47,0.88)_0%,rgba(48,0,66,0.82)_54%,rgba(135,16,156,0.74)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36%] opacity-[0.11] [background-image:linear-gradient(rgba(255,172,246,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,172,246,0.55)_1px,transparent_1px)] [background-size:25px_25px] [mask-image:linear-gradient(180deg,#000,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 h-[420px] w-[110%] -translate-x-1/2 rounded-[50%] bg-[#d948d7]/28 blur-[70px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-[9%] left-1/2 -z-10 h-60 w-[min(780px,90vw)] -translate-x-1/2 rounded-full bg-[#ab2ac7]/13 blur-[90px]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute top-[28%] left-[8%] -z-10 hidden -rotate-12 text-[44px] font-black text-[#d178e4]/13 lg:block"
        aria-hidden="true"
      >
        ♪
      </span>
      <span
        className="pointer-events-none absolute top-[38%] right-[7%] -z-10 hidden rotate-12 text-[38px] font-black text-[#e394ed]/12 lg:block"
        aria-hidden="true"
      >
        ♫
      </span>
      <span
        className="pointer-events-none absolute top-[19%] right-[16%] -z-10 hidden text-[56px] text-[#f4b8f3]/8 lg:block"
        aria-hidden="true"
      >
        ✦
      </span>

      <div className="mx-auto w-full max-w-[1280px] px-4 pt-8 pb-8 sm:px-6 sm:pt-10 lg:min-h-[750px] lg:px-8 lg:pt-12">
        <header
          className={`relative mx-auto max-w-[760px] text-center transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
            isVisible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-6 scale-95 opacity-0"
          }`}
        >
          <p className="text-[clamp(22px,2.7vw,30px)] leading-none font-semibold tracking-[-0.03em] text-white">
            Bạn có phải
          </p>
          <div className="relative mx-auto mt-2 w-fit max-w-full px-4 sm:px-8">
            <h2
              className="bg-[linear-gradient(180deg,#ffffff_0%,#ffd8fb_30%,#f17ce9_68%,#d842d3_100%)] bg-clip-text text-[clamp(31px,4.5vw,47px)] leading-[0.98] font-black tracking-[-0.045em] text-transparent italic uppercase [filter:drop-shadow(0_4px_0_rgba(100,5,129,0.7))_drop-shadow(0_0_12px_rgba(255,101,233,0.48))]"
              id="candidate-fit-title"
            >
              <span className="block w-full leading-[1.3] max-w-[500px] sm:w-[500px]">Mảnh ghép TOPMUS</span>
              <span className="mt-1 block">đang tìm?</span>
            </h2>
            <Image
              className="pointer-events-none absolute right-[7%] -bottom-2 size-7 animate-benefit-glow object-contain drop-shadow-[0_0_13px_rgba(255,255,255,0.9)] motion-reduce:animate-none sm:size-9"
              src="/img/icon-start.webp"
              alt=""
              width={36}
              height={36}
              aria-hidden="true"
            />
          </div>

          <p className="mx-auto mt-8 max-w-[620px] text-[13px] leading-[1.45] font-medium text-white/90 sm:text-[15px] lg:mt-4">
            TOPMUS luôn tìm kiếm những mảnh ghép phù hợp để cùng đồng hành trên hành trình sáng tạo và chinh
            phục những đỉnh cao mới. Đợt tuyển NPC Live này dành cho ứng viên nữ.
          </p>
        </header>

        <div className="relative z-10 mx-auto mt-8 sm:mt-10 grid items-stretch gap-6 sm:gap-8 lg:grid-cols-2">
          <article
            className={`relative overflow-hidden rounded-[12px] border border-[#c879df]/45 bg-[linear-gradient(155deg,rgba(31,0,46,0.82),rgba(57,3,79,0.66))] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_22px_45px_rgba(16,0,26,0.3)] backdrop-blur-sm transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none sm:px-8 sm:py-10 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
            style={{ transitionDelay: "160ms" }}
            aria-labelledby="candidate-requirements-title"
          >
            <span
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,172,245,0.62),transparent)]"
              aria-hidden="true"
            />
            <h3
              className="text-[clamp(22px,2.2vw,26px)] leading-tight font-bold tracking-[-0.025em] text-white"
              id="candidate-requirements-title"
            >
              Yêu cầu <span className="text-[#f231d9]">ứng viên NPC Live</span>
            </h3>

            <ul className="mt-6 sm:mt-8 grid list-none gap-[18px] p-0">
              {candidateRequirements.map((requirement, index) => (
                <li
                  className={`flex items-center gap-4 transition-[opacity,transform] duration-500 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${300 + index * 80}ms` }}
                  key={requirement}
                >
                  <Image
                    className="mt-0.5 size-[20px] shrink-0 brightness-0 invert drop-shadow-[0_0_7px_rgba(255,255,255,0.65)]"
                    src="/img/icon-start.webp"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden="true"
                  />
                  <p className="text-[14px] leading-[1.38] font-medium text-white sm:text-[16px]">
                    {requirement}
                  </p>
                </li>
              ))}
            </ul>
          </article>

          <article
            className={`relative overflow-hidden rounded-[12px] border border-[#f079ee]/45 bg-[linear-gradient(145deg,rgba(113,20,137,0.78),rgba(163,38,174,0.62))] px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_22px_45px_rgba(28,0,46,0.28)] backdrop-blur-sm transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none sm:px-8 sm:py-10 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
            }`}
            style={{ transitionDelay: "240ms" }}
            aria-labelledby="application-process-title"
          >
            <span
              className="pointer-events-none absolute -top-16 -right-12 size-52 rounded-full bg-[#ef4be0]/22 blur-[45px]"
              aria-hidden="true"
            />
            <h3
              className="relative text-[clamp(22px,2.2vw,26px)] leading-tight font-bold tracking-[-0.025em] text-white"
              id="application-process-title"
            >
              Quy trình <span className="text-[#ff36dc]">ứng tuyển 3 bước</span>
            </h3>

            <div className="relative mt-8 sm:mt-10">
              <span
                className={`pointer-events-none absolute top-6 bottom-7 left-[25px] w-px origin-top bg-[linear-gradient(180deg,#ff7aee,#ffc3f7_52%,#ff65e8)] shadow-[0_0_9px_rgba(255,96,229,0.7)] transition-transform duration-1000 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                  isVisible ? "scale-y-100" : "scale-y-0"
                }`}
                style={{ transitionDelay: "420ms" }}
                aria-hidden="true"
              />

              <ol className="relative grid list-none gap-8 p-0">
                {applicationSteps.map((step, index) => (
                  <li
                    className={`relative flex items-start gap-6 transition-[opacity,transform] duration-600 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                      isVisible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                    }`}
                    style={{ transitionDelay: `${460 + index * 160}ms` }}
                    key={step.number}
                  >
                    <div className="relative z-10 shrink-0">
                      <div className="relative grid size-[60px] place-items-center rounded-full border border-[#ffbaf5]/70 bg-[linear-gradient(145deg,#f340dc,#ff5ee6)] text-[22px] font-medium text-white shadow-[0_0_18px_rgba(255,64,220,0.52),inset_0_1px_0_rgba(255,255,255,0.4)]">
                        <span
                          className="pointer-events-none absolute -inset-3 -z-10 animate-benefit-glow rounded-full bg-[#ff55e1]/30 blur-md motion-reduce:animate-none"
                          style={{ animationDelay: `${index * -0.7}s` }}
                          aria-hidden="true"
                        />
                        {step.number}
                      </div>
                    </div>

                    <div className="pt-0.5">
                      <h4 className="text-[18px] leading-tight font-bold tracking-[-0.02em] text-white sm:text-[20px]">
                        {step.title}
                      </h4>
                      <p className="mt-1.5 text-[14px] leading-[1.35] font-medium text-white sm:text-[16px] w-full sm:w-[88%]">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        </div>

        <div
          className={`relative z-20 mt-9 flex justify-center transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "940ms" }}
        >
          <a
            className="grid size-16 animate-pain-float place-items-center rounded-full border-2 border-white/90 text-white no-underline shadow-[0_0_20px_rgba(255,129,237,0.25),inset_0_0_16px_rgba(255,255,255,0.04)] transition hover:border-[#ff7de9] hover:bg-white/10 hover:text-[#ff9deb] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:animate-none"
            href="#lien-he"
            aria-label="Đi tới form ứng tuyển"
          >
            <ArrowDown className="size-7" strokeWidth={1.6} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
