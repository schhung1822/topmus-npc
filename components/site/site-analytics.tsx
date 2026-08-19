"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const scrollMilestones = [25, 50, 75, 90] as const;

function describeElement(element: HTMLElement) {
  const label = (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
  const section = element.closest("section")?.id ?? "";
  return { link_text: label || "(không có nhãn)", section_id: section || "(không xác định)" };
}

/**
 * Gửi các chỉ số quan trọng của landing page về Google Analytics: độ sâu cuộn trang,
 * lượt bấm CTA và lượt bấm liên hệ nhanh. Không làm gì nếu chưa kết nối Analytics.
 */
export function SiteAnalytics() {
  useEffect(() => {
    const reachedMilestones = new Set<number>();

    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const percent = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const milestone of scrollMilestones) {
        if (percent < milestone || reachedMilestones.has(milestone)) continue;
        reachedMilestones.add(milestone);
        trackEvent("scroll_depth", { percent_scrolled: milestone });
      }
    }

    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      if (!(target instanceof HTMLAnchorElement)) return;

      const href = target.getAttribute("href") ?? "";
      const details = describeElement(target);

      if (href.startsWith("tel:")) {
        trackEvent("contact_click", { ...details, contact_method: "phone", link_url: href });
      } else if (href.includes("zalo.me")) {
        trackEvent("contact_click", { ...details, contact_method: "zalo", link_url: href });
      } else if (href.includes("#lien-he")) {
        trackEvent("cta_click", details);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick);

    const formSection = document.getElementById("lien-he");
    const observer = formSection
      ? new IntersectionObserver(
          (entries, self) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            trackEvent("view_form", { section_id: "lien-he" });
            self.disconnect();
          },
          { threshold: 0.35 },
        )
      : null;
    if (formSection && observer) observer.observe(formSection);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
      observer?.disconnect();
    };
  }, []);

  return null;
}
