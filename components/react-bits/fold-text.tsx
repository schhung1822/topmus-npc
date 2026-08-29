"use client";

import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";

type SplitBy = "char" | "word" | "line";
type Hinge = "top" | "bottom" | "left" | "right";
type Trigger = "mount" | "hover" | "scroll" | "loop";

export interface FoldTextProps {
  text?: string;
  splitBy?: SplitBy;
  hinge?: Hinge;
  duration?: number;
  stagger?: number;
  ease?: string;
  perspective?: number;
  creaseShading?: number;
  trigger?: Trigger;
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

type HingeConfig = {
  origin: string;
  rotateX: number;
  rotateY: number;
};

const HINGE_CONFIG: Record<Hinge, HingeConfig> = {
  top: { origin: "50% 0%", rotateX: -92, rotateY: 0 },
  bottom: { origin: "50% 100%", rotateX: 92, rotateY: 0 },
  left: { origin: "0% 50%", rotateX: 0, rotateY: 92 },
  right: { origin: "100% 50%", rotateX: 0, rotateY: -92 },
};

const FOLD_TEXT_STYLES = `.fold-text {
  display: inline-block;
  color: var(--fold-text-color, currentColor);
  font-size: var(--fold-text-font-size, inherit);
  font-weight: var(--fold-text-font-weight, inherit);
  line-height: 0.95;
  letter-spacing: -0.04em;
  white-space: pre-wrap;
  user-select: text;
}

.fold-text-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.fold-text-visual {
  display: inline;
}

.fold-text-line {
  display: block;
}

.fold-text-whitespace {
  display: inline;
}

.fold-text-segment {
  display: inline-block;
  line-height: inherit;
  perspective: var(--fold-perspective, 700px);
  transform-style: preserve-3d;
  vertical-align: baseline;
}

.fold-text-segment[data-fold-split='line'] {
  display: block;
}

.fold-text-piece {
  position: relative;
  display: inline-block;
  color: inherit;
  line-height: inherit;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity;
}

.fold-text-piece::after {
  content: '';
  position: absolute;
  inset: -0.08em -0.02em;
  pointer-events: none;
  opacity: var(--fold-crease, 0);
  mix-blend-mode: multiply;
  border-radius: 0.08em;
}

.fold-text-piece[data-fold-hinge='top']::after {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
}

.fold-text-piece[data-fold-hinge='bottom']::after {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
}

.fold-text-piece[data-fold-hinge='left']::after {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
}

.fold-text-piece[data-fold-hinge='right']::after {
  background: linear-gradient(270deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
}

@media (prefers-reduced-motion: reduce) {
  .fold-text-piece {
    transform: none !important;
  }

  .fold-text-piece::after {
    opacity: 0 !important;
  }
}
`;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function renderWhitespace(value: string, key: string): ReactNode[] {
  return value.split(/(\n)/).map((part, index) => {
    if (part === "\n") return <br key={`${key}-br-${index}`} />;
    if (!part) return null;

    return (
      <span className="fold-text-whitespace" key={`${key}-space-${index}`}>
        {part.replace(/ /g, "\u00A0")}
      </span>
    );
  });
}

export default function FoldText({
  text = "Design unfolds",
  splitBy = "char",
  hinge = "top",
  duration = 0.65,
  stagger = 0.045,
  ease = "power3.out",
  perspective = 700,
  creaseShading = 0.55,
  trigger = "mount",
  fontSize = 80,
  fontWeight = 800,
  color = "#f7f2e8",
  className = "",
  style = {},
}: FoldTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hingeConfig = HINGE_CONFIG[hinge] ?? HINGE_CONFIG.top;
  const safeCrease = clamp(creaseShading, 0, 1);
  const safePerspective = Math.max(120, perspective);

  const segments = useMemo(() => {
    let segmentIndex = 0;

    const renderSegment = (content: string, key: string, split: SplitBy = splitBy): ReactNode => {
      segmentIndex += 1;
      return (
        <span
          className="fold-text-segment"
          data-fold-split={split}
          key={key}
          style={{ "--fold-perspective": `${safePerspective}px` } as CSSProperties}
        >
          <span
            className="fold-text-piece"
            data-fold-hinge={hinge}
            style={
              {
                "--fold-crease": 0,
                transformOrigin: hingeConfig.origin,
              } as CSSProperties
            }
          >
            {content || "\u00A0"}
          </span>
        </span>
      );
    };

    if (splitBy === "line") {
      return text.split("\n").map((line, index) => (
        <span className="fold-text-line" key={`line-${index}`}>
          {renderSegment(line || "\u00A0", `segment-line-${index}`, "line")}
        </span>
      ));
    }

    if (splitBy === "word") {
      return text.split(/(\s+)/).flatMap((part, index) => {
        if (!part) return [];
        if (/^\s+$/.test(part)) return renderWhitespace(part, `ws-${index}`);
        return renderSegment(part, `segment-word-${segmentIndex}`);
      });
    }

    return Array.from(text).map((character, index) => {
      if (character === "\n") return <br key={`br-${index}`} />;
      return renderSegment(
        character === " " ? "\u00A0" : character,
        `segment-char-${index}`,
      );
    });
  }, [hinge, hingeConfig.origin, safePerspective, splitBy, text]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const pieces = Array.from(root.querySelectorAll<HTMLElement>(".fold-text-piece"));
    if (!pieces.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(pieces, {
        "--fold-crease": 0,
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        transformOrigin: hingeConfig.origin,
      });
      return () => {
        gsap.killTweensOf(pieces);
      };
    }

    const fromVars = {
      "--fold-crease": safeCrease,
      force3D: true,
      opacity: 0,
      rotateX: hingeConfig.rotateX,
      rotateY: hingeConfig.rotateY,
      transformOrigin: hingeConfig.origin,
    };
    const toVars = {
      "--fold-crease": 0,
      clearProps: "willChange",
      duration,
      ease,
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      stagger,
    };

    const killTimeline = () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      gsap.killTweensOf(pieces);
    };

    const play = (repeat: boolean) => {
      killTimeline();
      timelineRef.current = gsap.timeline({
        repeat: repeat ? -1 : 0,
        repeatDelay: repeat ? 0.75 : 0,
      });
      timelineRef.current.fromTo(pieces, fromVars, toVars);
      return timelineRef.current;
    };

    let disposed = false;
    let scrollTrigger: { kill: () => void } | undefined;
    let hoverHandler: (() => void) | undefined;

    if (trigger === "hover") {
      gsap.set(pieces, {
        "--fold-crease": 0,
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        transformOrigin: hingeConfig.origin,
      });
      hoverHandler = () => {
        play(false);
      };
      root.addEventListener("mouseenter", hoverHandler);
    } else if (trigger === "scroll") {
      gsap.set(pieces, fromVars);
      void import("gsap/ScrollTrigger")
        .then(({ ScrollTrigger }) => {
          if (disposed) return;
          gsap.registerPlugin(ScrollTrigger);
          scrollTrigger = ScrollTrigger.create({
            onEnter: () => {
              play(false);
            },
            once: true,
            start: "top 82%",
            trigger: root,
          });
        })
        .catch(() => {
          if (!disposed) play(false);
        });
    } else {
      play(trigger === "loop");
    }

    return () => {
      disposed = true;
      if (hoverHandler) root.removeEventListener("mouseenter", hoverHandler);
      scrollTrigger?.kill();
      killTimeline();
    };
  }, [
    duration,
    ease,
    hinge,
    hingeConfig.origin,
    hingeConfig.rotateX,
    hingeConfig.rotateY,
    perspective,
    safeCrease,
    splitBy,
    stagger,
    text,
    trigger,
  ]);

  const rootStyle = {
    "--fold-text-color": color,
    "--fold-text-font-size": typeof fontSize === "number" ? `${fontSize}px` : fontSize,
    "--fold-text-font-weight": fontWeight,
    ...style,
  } as CSSProperties;

  return (
    <>
      <style>{FOLD_TEXT_STYLES}</style>
      <span
        className={`fold-text ${className}`.trim()}
        ref={rootRef}
        style={rootStyle}
      >
        <span className="fold-text-sr-only">{text}</span>
        <span aria-hidden="true" className="fold-text-visual">
          {segments}
        </span>
      </span>
    </>
  );
}
