"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { VideoSectionContent } from "@/lib/video-content";
import { YouTubeShortCard } from "./youtube-short-card";

export function VideoHighlightsSection({ content }: { content: VideoSectionContent }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [canMoveBack, setCanMoveBack] = useState(false);
  const [canMoveForward, setCanMoveForward] = useState(content.videos.length > 4);

  const updateNavigation = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    setCanMoveBack(slider.scrollLeft > 2);
    setCanMoveForward(slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateNavigation();
    window.addEventListener("resize", updateNavigation);
    return () => window.removeEventListener("resize", updateNavigation);
  }, [content.videos.length, updateNavigation]);

  function move(direction: -1 | 1) {
    const slider = sliderRef.current;
    if (!slider) return;
    const firstCard = slider.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    const gap = Number.parseFloat(getComputedStyle(slider).columnGap || "0");
    const step = firstCard.getBoundingClientRect().width + gap;
    const currentIndex = Math.round(slider.scrollLeft / step);
    slider.scrollTo({
      left: Math.max(0, (currentIndex + direction) * step),
      behavior: "smooth",
    });
  }

  return (
    <section
      className="relative isolate overflow-hidden bg-[#320050] bg-[image:url('/img/bg_sec2.webp')] bg-cover bg-center py-16 text-white sm:py-20 lg:py-[88px]"
      id="video-highlights"
      aria-labelledby="video-highlights-title"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <div className="flex items-end justify-between gap-5">
          <div>
            <h2
              className="text-[clamp(26px,3vw,36px)] leading-tight font-bold tracking-[-0.025em] [text-shadow:0_3px_12px_rgba(35,0,58,0.45)]"
              id="video-highlights-title"
            >
              {content.heading}
            </h2>
            <p className="mt-1.5 text-xs text-white/80 sm:text-sm">{content.subtitle}</p>
          </div>

          {content.videos.length ? (
            <div className="flex shrink-0 gap-2">
              <button
                className="grid size-10 cursor-pointer place-items-center rounded-full bg-white text-[#521067] shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                type="button"
                aria-label="Video trước"
                onClick={() => move(-1)}
                disabled={!canMoveBack}
              >
                <ChevronLeft className="size-5" strokeWidth={2.8} aria-hidden="true" />
              </button>
              <button
                className="grid size-10 cursor-pointer place-items-center rounded-full bg-[#ef3bd5] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ff55e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                type="button"
                aria-label="Video tiếp theo"
                onClick={() => move(1)}
                disabled={!canMoveForward}
              >
                <ChevronRight className="size-5" strokeWidth={2.8} aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

        {content.videos.length ? (
          <div
            className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pt-1 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            ref={sliderRef}
            onScroll={updateNavigation}
          >
            {content.videos.map((video) => (
              <YouTubeShortCard
                video={video}
                isActive={activeVideoId === video.id}
                onActivate={setActiveVideoId}
                key={video.id}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid min-h-[280px] place-items-center rounded-[22px] border border-dashed border-white/25 bg-black/10 px-6 text-center backdrop-blur-sm">
            <div>
              <p className="text-lg font-bold">Video highlight đang được cập nhật</p>
              <p className="mt-2 text-sm text-white/70">Thêm URL YouTube Shorts trong trang quản trị để video xuất hiện tại đây.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
