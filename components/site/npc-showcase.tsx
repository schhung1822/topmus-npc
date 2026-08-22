"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { NpcSectionContent } from "@/lib/npc-content";

type NpcShowcaseProps = {
  content: NpcSectionContent;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  startScrollLeft: number;
  lastX: number;
  lastTime: number;
  velocityX: number;
  axis: "pending" | "horizontal" | "vertical";
};

const AUTO_PLAY_DELAY_MS = 5_000;

export function NpcShowcase({ content }: NpcShowcaseProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const canMoveSlider = canScrollBack || canScrollForward;
  const isAutoPlayPaused = isDragging || isHovered || hasFocusWithin;

  const updateSliderControls = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    setCanScrollBack(slider.scrollLeft > 4);
    setCanScrollForward(slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 4);
    const cards = Array.from(slider.children) as HTMLElement[];
    if (cards.length) {
      const firstOffset = cards[0].offsetLeft;
      const closestIndex = cards.reduce((closest, card, index) => {
        const currentDistance = Math.abs(cards[closest].offsetLeft - firstOffset - slider.scrollLeft);
        const nextDistance = Math.abs(card.offsetLeft - firstOffset - slider.scrollLeft);
        return nextDistance < currentDistance ? index : closest;
      }, 0);
      setActiveIndex(closestIndex);
    }
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    updateSliderControls();
    const observer = new ResizeObserver(updateSliderControls);
    observer.observe(slider);

    return () => {
      observer.disconnect();
      if (scrollAnimationRef.current !== null) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
      slider.style.scrollSnapType = "";
    };
  }, [content.npcs.length, updateSliderControls]);

  const animateSliderTo = useCallback((targetLeft: number) => {
    const slider = sliderRef.current;
    if (!slider) return;

    if (scrollAnimationRef.current !== null) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }

    slider.style.scrollSnapType = "none";

    const maxScroll = Math.max(slider.scrollWidth - slider.clientWidth, 0);
    const startLeft = slider.scrollLeft;
    const destination = Math.min(Math.max(targetLeft, 0), maxScroll);
    const distance = destination - startLeft;

    if (
      Math.abs(distance) < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      slider.scrollLeft = destination;
      slider.style.scrollSnapType = "";
      updateSliderControls();
      return;
    }

    const startedAt = performance.now();
    const duration = Math.min(620, Math.max(430, Math.abs(distance) * 1.15));

    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      slider.scrollLeft = startLeft + distance * easedProgress;

      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(animate);
      } else {
        scrollAnimationRef.current = null;
        slider.style.scrollSnapType = "";
        updateSliderControls();
      }
    };

    scrollAnimationRef.current = requestAnimationFrame(animate);
  }, [updateSliderControls]);

  const goToNpc = useCallback((index: number) => {
    const slider = sliderRef.current;
    const card = slider?.children[index] as HTMLElement | undefined;
    if (!slider || !card) return;

    const firstCard = slider.firstElementChild as HTMLElement | null;
    const targetLeft = card.offsetLeft - (firstCard?.offsetLeft ?? 0);
    animateSliderTo(targetLeft);
  }, [animateSliderTo]);

  const moveSlider = useCallback((direction: -1 | 1) => {
    if (!canMoveSlider || content.npcs.length <= 1) return;

    const targetIndex =
      direction === 1
        ? canScrollForward
          ? activeIndex + 1
          : 0
        : canScrollBack
          ? activeIndex - 1
          : content.npcs.length - 1;

    goToNpc(targetIndex);
  }, [activeIndex, canMoveSlider, canScrollBack, canScrollForward, content.npcs.length, goToNpc]);

  useEffect(() => {
    if (!canMoveSlider || content.npcs.length <= 1 || isAutoPlayPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalId = window.setInterval(() => {
      if (dragStateRef.current || scrollAnimationRef.current !== null) return;
      moveSlider(1);
    }, AUTO_PLAY_DELAY_MS);

    return () => window.clearInterval(intervalId);
  }, [canMoveSlider, content.npcs.length, isAutoPlayPaused, moveSlider]);

  function stopSliderAnimation() {
    if (scrollAnimationRef.current === null) return;
    cancelAnimationFrame(scrollAnimationRef.current);
    scrollAnimationRef.current = null;
    if (sliderRef.current) sliderRef.current.style.scrollSnapType = "";
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const slider = sliderRef.current;
    if (!slider) return;

    stopSliderAnimation();
    slider.style.scrollSnapType = "none";
    slider.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: slider.scrollLeft,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocityX: 0,
      axis: "pending",
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const slider = sliderRef.current;
    const drag = dragStateRef.current;
    if (!slider || !drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (drag.axis === "pending") {
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;
      drag.axis = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";

      if (drag.axis === "vertical") {
        dragStateRef.current = null;
        slider.style.scrollSnapType = "";
        if (slider.hasPointerCapture(event.pointerId)) slider.releasePointerCapture(event.pointerId);
        return;
      }

      setIsDragging(true);
    }

    if (drag.axis !== "horizontal") return;
    event.preventDefault();

    const now = performance.now();
    const elapsed = Math.max(now - drag.lastTime, 1);
    drag.velocityX = (event.clientX - drag.lastX) / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = now;
    slider.scrollLeft = drag.startScrollLeft - deltaX;
  }

  function finishDrag(event: ReactPointerEvent<HTMLDivElement>, cancelled = false) {
    const slider = sliderRef.current;
    const drag = dragStateRef.current;
    if (!slider || !drag || drag.pointerId !== event.pointerId) return;

    dragStateRef.current = null;
    setIsDragging(false);
    if (slider.hasPointerCapture(event.pointerId)) slider.releasePointerCapture(event.pointerId);

    if (cancelled || drag.axis !== "horizontal") {
      slider.style.scrollSnapType = "";
      updateSliderControls();
      return;
    }

    const projectedLeft = slider.scrollLeft - drag.velocityX * 180;
    const cards = Array.from(slider.children) as HTMLElement[];
    const firstOffset = cards[0]?.offsetLeft ?? 0;

    const closestCard = cards.reduce<HTMLElement | null>((closest, card) => {
      if (!closest) return card;
      const cardTarget = card.offsetLeft - firstOffset;
      const closestTarget = closest.offsetLeft - firstOffset;
      return Math.abs(cardTarget - projectedLeft) < Math.abs(closestTarget - projectedLeft)
        ? card
        : closest;
    }, null);

    if (!closestCard) {
      slider.style.scrollSnapType = "";
      return;
    }

    const targetLeft = closestCard.offsetLeft - firstOffset;
    animateSliderTo(targetLeft);
  }

  const subtitle =
    content.categories[0]?.subtitle ?? "Topmus Live Creator Network on TikTok";

  return (
    <section
      className="relative isolate overflow-hidden bg-[#3c096d] bg-[image:url('/img/bg_sec2.webp')] bg-cover bg-center py-16 text-white sm:py-20 lg:py-[104px]"
      id="npc"
      aria-labelledby="npc-showcase-title"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(39,0,75,0.08),rgba(118,38,161,0.02),rgba(244,201,255,0.08))]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 left-[18%] -z-10 size-[380px] rounded-full bg-[#c44cef]/18 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[4%] bottom-[-180px] -z-10 size-[420px] rounded-full bg-[#f3b6ff]/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <p className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] text-[#f2bdff] uppercase sm:text-[11px]">
          <span className="h-px w-7 bg-[linear-gradient(90deg,#ff76eb,transparent)]" aria-hidden="true" />
          Topmus Creator Network
        </p>
        <h2
          className="text-[clamp(25px,3vw,31px)] leading-tight font-bold tracking-[-0.035em]"
          id="npc-showcase-title"
        >
          {content.title}
        </h2>

        <div className="mt-5 overflow-hidden rounded-[20px] border border-white/35 bg-[#fff3ff] text-[#27102f] shadow-[0_30px_85px_rgba(30,0,62,0.38),0_0_0_1px_rgba(255,255,255,0.08)] lg:grid lg:min-h-[455px] lg:grid-cols-[38%_62%]">
          <div className="relative min-h-[390px] overflow-hidden border-b border-white/30 sm:min-h-[520px] lg:min-h-[455px] lg:border-r lg:border-b-0">
            <Image
              className="object-cover object-center"
              src={content.bannerImage}
              alt={`Banner ${content.title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              priority
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_38%,rgba(37,0,53,0.22))]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-px"
              aria-hidden="true"
            />
          </div>

          <div
            className="relative min-w-0 bg-[#FFF0FF] p-5 sm:p-7 lg:px-7 lg:pt-11 lg:pb-7"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocusCapture={() => setHasFocusWithin(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setHasFocusWithin(false);
              }
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-[18px] leading-tight font-bold text-[#2f1139] sm:text-[20px]">
                  Creator Live NPC
                </h3>
                <p className="mt-1 text-[12px] text-[#949494] sm:text-[14px]">{subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#FFE4FF] px-3 py-1.5 text-[14px] font-medium text-[#9C1C9B]">
                  
                  {content.npcs.length} Creator
                </span>
                <button
                  className="grid size-9 cursor-pointer place-items-center rounded-full border border-[#d9cbdc] bg-[#e6dfe8] text-[#896d90] shadow-[0_5px_14px_rgba(67,30,76,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[#c86fd5] hover:bg-[#eed0f2] hover:text-[#711185] hover:shadow-[0_8px_19px_rgba(143,33,158,0.22)] disabled:cursor-default disabled:border-transparent disabled:bg-[#d4d4d4] disabled:text-white disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  type="button"
                  aria-label="Xem NPC trước"
                  disabled={!canMoveSlider}
                  onClick={() => moveSlider(-1)}
                >
                  <ChevronLeft className="size-4" strokeWidth={2.5} aria-hidden="true" />
                </button>
                <button
                  className="grid size-9 cursor-pointer place-items-center rounded-full border border-[#721592] bg-[#510281] text-white shadow-[0_7px_17px_rgba(105,16,145,0.28)] transition duration-200 hover:-translate-y-0.5 hover:border-[#ff8bec] hover:bg-[#d634c4] hover:shadow-[0_9px_23px_rgba(214,52,196,0.38)] disabled:cursor-default disabled:border-transparent disabled:bg-[#d4d4d4] disabled:shadow-none disabled:opacity-45 disabled:hover:translate-y-0"
                  type="button"
                  aria-label="Xem NPC tiếp theo"
                  disabled={!canMoveSlider}
                  onClick={() => moveSlider(1)}
                >
                  <ChevronRight className="size-4" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
            </div>

            {content.npcs.length ? (
              <div className="relative mt-5 sm:mt-6">
                <div
                  className={`flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-1 pt-1 pb-4 overscroll-x-contain touch-pan-y select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                  }`}
                  ref={sliderRef}
                  onScroll={updateSliderControls}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={(event) => finishDrag(event)}
                  onPointerCancel={(event) => finishDrag(event, true)}
                  onWheel={stopSliderAnimation}
                  onDragStart={(event) => event.preventDefault()}
                  aria-label="Toàn bộ Creator NPC của TOPMUS"
                >
                  {content.npcs.map((npc) => (
                    <article
                      className="group w-full shrink-0 snap-start overflow-hidden rounded-[12px] border border-[#eed9ee] bg-white shadow-[0_4px_8px_rgba(82,20,100,0.1)] transition duration-300 hover:-translate-y-1 hover:border-[#e7b9e2] hover:shadow-[0_16px_34px_rgba(82,20,100,0.17)] sm:w-[calc((100%_-_0.875rem)/2)] lg:w-[calc((100%_-_1.75rem)/3)]"
                      key={npc.id}
                    >
                      <div className="relative aspect-[0.75] overflow-hidden bg-[linear-gradient(160deg,#1a002d,#5f0b81_66%,#ff50da)]">
                        <Image
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                          src={npc.image}
                          alt={npc.name}
                          fill
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 205px"
                        />
                      </div>

                      <div className="bg-[linear-gradient(180deg,#ffffff,#fffaff)] p-2.5">
                        <div className="flex items-center justify-between gap-2 text-[11px] text-[#4d3c52] sm:text-[12px]">
                          <span className="font-medium text-[#000000]">Giờ live</span>
                          <span className="rounded-full bg-[#FFE4FF] px-3 py-0.5 text-[11px] font-[700] text-[#9C1C9B]">
                            {npc.liveTime}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <span className="rounded-full bg-[#FFE4FF] px-2 py-1.5 text-center text-[12px] font-medium text-[#000000]">
                            {npc.platform}
                          </span>
                          <span className="rounded-full bg-[#510281] px-2 py-1.5 text-center text-[12px] font-medium text-white shadow-[0_4px_10px_rgba(102,16,139,0.16)]">
                            {npc.contentType}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {canScrollBack ? (
                  <div
                    className="pointer-events-none absolute inset-y-1 left-0 z-10 w-8 bg-gradient-to-r from-[#fff7ff] to-transparent"
                    aria-hidden="true"
                  />
                ) : null}
                {canScrollForward ? (
                  <div
                    className="pointer-events-none absolute inset-y-1 right-0 z-10 w-10 bg-gradient-to-l from-[#fff2fe] to-transparent"
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            ) : (
              <div className="mt-6 grid min-h-[300px] place-items-center rounded-xl border border-dashed border-[#dcc9e0] bg-white/60 p-8 text-center text-sm text-[#806b85]">
                Chưa có NPC trong danh sách.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
