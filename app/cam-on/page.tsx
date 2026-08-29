import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, MessageCircle } from "lucide-react";
import FoldText from "@/components/react-bits/fold-text";
import Lightfall from "@/components/react-bits/lightfall";

export const metadata: Metadata = {
  title: "Cảm ơn",
  description: "TOPMUS đã nhận được hồ sơ ứng tuyển NPC Live của bạn.",
  robots: {
    follow: false,
    index: false,
  },
};

export default function ThankYouPage() {
  return (
    <main className="relative isolate flex min-h-svh overflow-hidden bg-[#160022] px-5 py-8 text-white sm:px-8 sm:py-12">
      <div className="absolute inset-0 -z-30" aria-hidden="true">
        <Lightfall
          backgroundColor="#5f057b"
          backgroundGlow={0.85}
          colors={["#ff9ee9", "#f02ad7", "#a86cff", "#ffffff"]}
          density={0.58}
          dpr={1.1}
          glow={1.15}
          mobileStreakCount={1}
          mouseInteraction
          mouseRadius={0.8}
          mouseStrength={0.75}
          opacity={0.92}
          speed={0.72}
          streakCount={3}
          streakLength={1.35}
          streakWidth={1.05}
          twinkle={0.82}
          zoom={2.5}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_42%,rgba(154,44,178,0.1),rgba(19,0,35,0.62)_72%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(11,0,22,0.72))]"
        aria-hidden="true"
      />

      <section className="relative mx-auto flex w-full max-w-[760px] flex-col items-center justify-center text-center">
        <Link
          className="mb-8 inline-flex w-[148px] transition duration-200 hover:scale-[1.03] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff7be7] sm:mb-10 sm:w-[172px]"
          href="/"
          aria-label="TOPMUS - Về trang chủ"
        >
          <Image
            alt="TOPMUS Entertainment"
            className="h-auto w-full object-contain [filter:brightness(0)_invert(1)]"
            height={220}
            priority
            src="/img/logo_topmus.webp"
            width={500}
          />
        </Link>

        <div className="grid size-[78px] place-items-center rounded-full border border-white/45 bg-white/14 shadow-[0_0_0_10px_rgba(255,255,255,0.04),0_0_44px_rgba(245,63,220,0.55)] backdrop-blur-md sm:size-[88px]">
          <Check className="size-10 text-white sm:size-12" strokeWidth={2.5} aria-hidden="true" />
        </div>

        <h1 className="mt-7 min-h-[1em]">
          <FoldText
            color="#ffffff"
            creaseShading={0.62}
            duration={0.72}
            ease="power3.out"
            fontSize="clamp(2rem, 7vw, 4.9rem)"
            fontWeight={700}
            hinge="top"
            perspective={760}
            splitBy="char"
            stagger={0.075}
            text="Đăng ký thành công"
            trigger="mount"
          />
        </h1>

        <p className="mt-7 text-[clamp(18px,3vw,25px)] leading-tight font-bold tracking-[-0.025em] text-[#fff2ff]">
          Hồ sơ của bạn đã được gửi thành công!
        </p>
        <p className="mt-4 max-w-[590px] text-[14px] leading-[1.75] text-white/72 sm:text-[16px]">
          TOPMUS đã nhận được thông tin ứng tuyển. Đội ngũ của chúng tôi sẽ xem xét
          hồ sơ và liên hệ với bạn trong vòng 24–48 giờ.
        </p>

        <div className="mt-9 flex w-full max-w-[540px] flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 text-[14px] font-bold text-white no-underline backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:bg-white/18 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            href="/"
          >
            <ArrowLeft className="size-[18px]" strokeWidth={2.3} aria-hidden="true" />
            Về trang chủ
          </Link>
          <a
            className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-xl border border-[#ffb8f2]/55 bg-[linear-gradient(100deg,#a721b7,#ee2bd2)] px-5 text-[14px] font-bold text-white no-underline shadow-[0_14px_34px_rgba(197,33,191,0.35)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff9dec]"
            href="https://zalo.me/g/aceotd514"
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="size-[18px]" fill="currentColor" strokeWidth={2} aria-hidden="true" />
            Tham gia cộng đồng
          </a>
        </div>

        <p className="mt-7 text-[11px] leading-relaxed font-medium tracking-[0.02em] text-white/48 sm:text-xs">
          Hãy để ý điện thoại và Zalo để không bỏ lỡ liên hệ từ TOPMUS nhé.
        </p>
      </section>
    </main>
  );
}
