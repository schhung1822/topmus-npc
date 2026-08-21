"use client";

import Image from "next/image";
import { Maximize2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { HighlightVideo } from "@/lib/video-content";

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<void>((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

type YouTubeShortCardProps = {
  video: HighlightVideo;
  isActive: boolean;
  onActivate: (videoId: string) => void;
};

export function YouTubeShortCard({
  video,
  isActive,
  onActivate,
}: YouTubeShortCardProps) {
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const cardRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [thumbnail, setThumbnail] = useState(
    video.thumbnail || `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`,
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      playerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isActive && playerRef.current) {
      playerRef.current.pauseVideo();
    }
  }, [isActive]);

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    timerRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      setCurrentTime(player.getCurrentTime() || 0);
      setDuration(player.getDuration() || 0);
    }, 300);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [playing]);

  // Popup xem lớn: khóa cuộn nền và cho phép đóng bằng phím Esc.
  useEffect(() => {
    if (!expanded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setExpanded(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [expanded]);

  async function initializePlayer() {
    onActivate(video.id);
    if (playerRef.current) {
      playerRef.current.playVideo();
      return;
    }

    setStarted(true);
    await loadYouTubeApi();
    if (!playerHostRef.current || !window.YT?.Player) return;

    playerRef.current = new window.YT.Player(playerHostRef.current, {
      width: "100%",
      height: "100%",
      videoId: video.youtubeId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        playsinline: 1,
        rel: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: (event) => {
          setReady(true);
          setDuration(event.target.getDuration() || 0);
          event.target.playVideo();
        },
        onStateChange: (event) => {
          const states = window.YT?.PlayerState;
          if (!states) return;
          setPlaying(event.data === states.PLAYING);
          if (event.data === states.PLAYING) onActivate(video.id);
          if (event.data === states.ENDED) setCurrentTime(0);
        },
      },
    });
  }

  function togglePlayback() {
    const player = playerRef.current;
    if (!player) {
      void initializePlayer();
      return;
    }
    if (playing) player.pauseVideo();
    else {
      onActivate(video.id);
      player.playVideo();
    }
  }

  function toggleMute() {
    const player = playerRef.current;
    if (!player) return;

    if (muted) {
      if (typeof player.unMute !== "function") return;
      player.unMute();
      setMuted(false);
    } else {
      if (typeof player.mute !== "function") return;
      player.mute();
      setMuted(true);
    }
  }

  function seek(value: number) {
    playerRef.current?.seekTo(value, true);
    setCurrentTime(value);
  }

  /** Mở popup xem lớn và tạm dừng bản phát trong thẻ để không chồng tiếng. */
  function openExpanded() {
    playerRef.current?.pauseVideo();
    setExpanded(true);
  }

  const expandedSource = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1&start=${Math.floor(currentTime)}`;

  return (
    <article
      className="group relative aspect-[9/16] w-auto shrink-0 basis-[calc((100%_-_1.25rem)/2)] snap-start overflow-hidden rounded-2xl bg-[#170020] transition duration-500 hover:-translate-y-1 hover:shadow-[0_0_26px_rgba(255,57,223,0.45),0_22px_40px_rgba(22,0,38,0.42)] sm:basis-[calc((100%_-_2.5rem)/3)] lg:basis-[calc((100%_-_3.75rem)/4)]"
      ref={cardRef}
    >
      <div className={`absolute inset-0 ${started ? "z-10" : "z-0"}`} ref={playerHostRef} />

      {!started ? (
        <>
          <Image
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            src={thumbnail}
            alt={`Thumbnail ${video.title}`}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 300px"
            onError={() => setThumbnail(`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`)}
          />

          {/* Khung TOPMUS phủ lên thumbnail, ẩn đi ngay khi video bắt đầu phát.
              Dùng ảnh gốc (unoptimized) để chắc chắn giữ nền trong suốt của khung. */}
          <Image
            className="pointer-events-none z-20 object-cover"
            src="/img/khung.webp"
            alt=""
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 300px"
            unoptimized
            aria-hidden="true"
          />
          <h3 className="absolute bottom-[3.2%] left-[12%] z-30 line-clamp-2 max-w-[30%] text-[clamp(13px,1vw,18px)] leading-[1.12] font-extrabold tracking-[-0.01em] text-white uppercase [text-shadow:0_2px_6px_rgba(52,0,74,0.65)]">
            {video.title}
          </h3>

          <button
            className="absolute top-1/2 left-1/2 z-30 grid size-[54px] -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-white bg-white/10 text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm transition duration-300 group-hover:scale-105 group-hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white sm:size-[70px]"
            type="button"
            aria-label={`Phát video ${video.title}`}
            onClick={() => void initializePlayer()}
          >
            <Play className="ml-0.5 size-5 fill-current sm:size-7" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-[#47005d] via-[#47005d]/80 to-transparent" />

          <div className="absolute right-0 bottom-0 left-0 z-30 p-2.5 text-white transition-opacity sm:p-3.5 duration-200 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
            <input
              className="h-1 w-full cursor-pointer accent-[#ff43dc]"
              type="range"
              min={0}
              max={duration || 1}
              step="0.1"
              value={Math.min(currentTime, duration || 1)}
              aria-label="Tiến trình video"
              onChange={(event) => seek(Number(event.target.value))}
              disabled={!ready}
            />
            <div className="mt-1.5 flex items-center gap-2 text-[10px] font-semibold text-white/80 sm:gap-2.5">
              <button className="grid size-6 cursor-pointer place-items-center rounded-full border-0 bg-white/15 p-0 text-white transition hover:bg-white/30" type="button" aria-label={playing ? "Tạm dừng" : "Phát"} onClick={togglePlayback}>
                {playing ? <Pause className="size-3 fill-current" aria-hidden="true" /> : <Play className="ml-px size-3 fill-current" aria-hidden="true" />}
              </button>
              <button className="grid size-6 cursor-pointer place-items-center rounded-full border-0 bg-white/15 p-0 text-white transition hover:bg-white/30" type="button" aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"} onClick={toggleMute}>
                {muted ? <VolumeX className="size-3.5" aria-hidden="true" /> : <Volume2 className="size-3.5" aria-hidden="true" />}
              </button>
              <span className="tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>
              <button className="ml-auto grid size-6 cursor-pointer place-items-center rounded-full border-0 bg-white/15 p-0 text-white transition hover:bg-white/30" type="button" aria-label={`Xem lớn video ${video.title}`} onClick={openExpanded}>
                <Maximize2 className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </>
      )}

      {expanded && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[120] grid place-items-center bg-[#12001d]/88 p-4 backdrop-blur-md sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label={`Video ${video.title}`}
              onClick={() => setExpanded(false)}
            >
              {/* Cao 90vh, tự thu lại khi màn hình hẹp để khung luôn giữ đúng tỉ lệ 9:16. */}
              <div
                className="relative aspect-[9/16] h-[min(90vh,calc(92vw*16/9))] overflow-hidden rounded-[22px] border-2 border-[#ff59e7]/70 bg-black shadow-[0_0_28px_rgba(255,57,223,0.5),0_30px_60px_rgba(10,0,20,0.6)]"
                onClick={(event) => event.stopPropagation()}
              >
                <iframe
                  className="size-full"
                  src={expandedSource}
                  title={video.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
              <button
                className="absolute top-4 right-4 grid size-11 cursor-pointer place-items-center rounded-full border border-white/30 bg-white/12 text-white backdrop-blur-sm transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:top-6 sm:right-6"
                type="button"
                aria-label="Đóng video"
                onClick={() => setExpanded(false)}
                autoFocus
              >
                <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
              </button>
            </div>,
            document.body,
          )
        : null}
    </article>
  );
}
