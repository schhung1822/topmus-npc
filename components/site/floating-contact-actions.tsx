"use client";

import Image from "next/image";
import { ChevronUp, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./floating-contact-actions.module.css";

function ActionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className={styles.actionLabel}>
      {children}
    </span>
  );
}

export function FloatingContactActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShowScrollTop(window.scrollY > 480);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <aside
      className={styles.actions}
      aria-label="Liên hệ nhanh"
    >
      <a
        className={`${styles.action} ${styles.phoneAction}`}
        href="tel:0396800005"
        aria-label="Gọi TOPMUS theo số 0396 800 005"
      >
        <span className={styles.phonePulse} aria-hidden="true" />
        <Phone className={styles.phoneIcon} strokeWidth={2.35} aria-hidden="true" />
        <ActionLabel>Gọi 0396.800.005</ActionLabel>
      </a>

      <a
        className={`${styles.action} ${styles.zaloAction}`}
        href="https://zalo.me/4225834416089737789"
        target="_blank"
        rel="noreferrer"
        aria-label="Nhắn tin với TOPMUS qua Zalo"
      >
        <Image
          alt=""
          aria-hidden="true"
          className={styles.zaloIcon}
          height={30}
          src="/icon/zalo.svg"
          width={30}
        />
        <ActionLabel>Nhắn Zalo</ActionLabel>
      </a>

      <button
        className={`${styles.action} ${styles.topAction}`}
        data-visible={showScrollTop}
        type="button"
        aria-label="Cuộn lên đầu trang"
        aria-hidden={!showScrollTop}
        tabIndex={showScrollTop ? 0 : -1}
        onClick={scrollToTop}
      >
        <ChevronUp className={styles.topIcon} strokeWidth={2.5} aria-hidden="true" />
        <ActionLabel>Lên đầu trang</ActionLabel>
      </button>
    </aside>
  );
}
