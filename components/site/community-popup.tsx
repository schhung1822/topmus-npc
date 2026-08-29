"use client";

import Image from "next/image";
import { Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./community-popup.module.css";

const POPUP_DELAY_MS = 2 * 60 * 1000;
const COMMUNITY_URL = "https://zalo.me/g/aceotd514";

export function CommunityPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(true), POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={() => setIsOpen(false)}>
      <section
        aria-labelledby="community-popup-title"
        aria-modal="true"
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <h2 className="sr-only" id="community-popup-title">
          Tham gia cộng đồng nhà sáng tạo TOPMUS
        </h2>

        <button
          aria-label="Đóng thông báo cộng đồng"
          className={styles.closeButton}
          onClick={() => setIsOpen(false)}
          ref={closeButtonRef}
          type="button"
        >
          <X aria-hidden="true" strokeWidth={2.5} />
        </button>

        <Image
          alt="Mã QR tham gia cộng đồng hơn 2.000 nhà sáng tạo TOPMUS trên Zalo"
          className={styles.banner}
          height={1250}
          sizes="(max-width: 640px) 92vw, 540px"
          src="/img/banner_qr.webp"
          width={1250}
        />

        <div className={styles.footer}>
          <a
            className={styles.cta}
            href={COMMUNITY_URL}
            rel="noreferrer"
            target="_blank"
          >
            <Users aria-hidden="true" className={styles.ctaIcon} strokeWidth={2.4} />
            <span>Tham gia cộng đồng</span>
          </a>
        </div>
      </section>
    </div>
  );
}
