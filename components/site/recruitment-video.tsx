"use client";

import { useEffect, useRef } from "react";
import {
  allowsAutomaticInlinePlayback,
  prepareInlineVideo,
} from "@/lib/inline-video-playback";

export function RecruitmentVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    prepareInlineVideo(video);

    if (!allowsAutomaticInlinePlayback()) {
      video.autoplay = false;
      video.pause();
      return;
    }

    let isInView = false;

    const syncPlayback = () => {
      if (isInView && !document.hidden) {
        void video.play().catch(() => undefined);
        return;
      }

      video.pause();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        syncPlayback();
      },
      { threshold: [0, 0.25] },
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
    <video
      ref={videoRef}
      aria-label="Video giới thiệu TOPMUS Entertainment"
      className="aspect-[9/16] max-h-[680px] w-full max-w-[382px] rounded-[24px] border border-white/25 bg-black object-contain shadow-[0_24px_70px_rgba(17,0,28,0.38),0_0_34px_rgba(241,0,220,0.2)]"
      controls
      muted
      playsInline
      preload="metadata"
    >
      <source src="/video/gioithieu.mp4" type="video/mp4" />
      Trình duyệt của bạn không hỗ trợ phát video.
    </video>
  );
}
