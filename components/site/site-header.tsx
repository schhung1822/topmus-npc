"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./site-header.module.css";

const navigation = [
  { label: "Giới thiệu", href: "#gioi-thieu" },
  { label: "NPC", href: "#npc" },
  { label: "Chương trình", href: "#chuong-trinh" },
  { label: "Quyền lợi", href: "#ban-nhan-duoc-gi" },
  { label: "Lộ trình", href: "#lo-trinh-7-ngay" },
];

const desktopNavigationClasses =
  "lg:static lg:flex lg:flex-1 lg:flex-row lg:items-center lg:justify-end lg:gap-5 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none xl:gap-8";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(navigation[0].href);

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  useEffect(() => {
    const updateActiveItem = () => {
      const readingLine = window.scrollY + Math.min(window.innerHeight * 0.3, 220);
      let currentHref = navigation[0].href;

      navigation.forEach((item) => {
        const section = document.querySelector<HTMLElement>(item.href);
        if (section && section.offsetTop <= readingLine) currentHref = item.href;
      });

      setActiveHref(currentHref);
    };

    updateActiveItem();
    window.addEventListener("scroll", updateActiveItem, { passive: true });
    window.addEventListener("hashchange", updateActiveItem);

    return () => {
      window.removeEventListener("scroll", updateActiveItem);
      window.removeEventListener("hashchange", updateActiveItem);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 flex min-h-[72px] items-center bg-[linear-gradient(90.01deg,#260048_0.01%,#A128AA_51.6%,#591067_101.24%)] text-white shadow-[0_8px_32px_rgba(38,0,72,0.18)] lg:min-h-[82px]">
      <div className="relative mx-auto flex min-h-[72px] w-full max-w-[1280px] items-center justify-between gap-9 px-4 sm:px-6 lg:min-h-[82px]">
        <a
          className="inline-flex w-[138px] shrink-0 lg:w-[154px]"
          href="#trang-chu"
          aria-label="TOPMUS - Trang chủ"
        >
          <Image
            className="h-auto w-full object-contain [filter:brightness(0)_invert(1)]"
            src="/img/logo_topmus.webp"
            alt="TOPMUS Entertainment"
            width={500}
            height={220}
            priority
          />
        </a>

        <button
          className="grid size-11 cursor-pointer place-items-center rounded-xl border border-white/40 bg-white/10 text-[22px] text-white lg:hidden"
          type="button"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          aria-controls="landing-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
        </button>

        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } absolute top-[calc(100%+10px)] right-4 left-4 flex-col items-stretch gap-3 rounded-[18px] border border-white/15 bg-[#260048]/98 p-[15px] shadow-[0_22px_50px_rgba(24,0,31,0.3)] sm:right-6 sm:left-6 ${desktopNavigationClasses}`}
          id="landing-navigation"
        >
          <nav
            className="flex flex-1 flex-col items-stretch gap-0.5 lg:flex-row lg:items-center lg:gap-[clamp(21px,2.5vw,38px)]"
            aria-label="Điều hướng chính"
          >
            {navigation.map((item) => {
              const isActive = activeHref === item.href;

              return (
                <a
                  className={`rounded-[9px] px-[13px] py-3.5 text-[13px] font-semibold transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:outline-none lg:relative lg:rounded-none lg:px-0 lg:py-[31px] lg:after:absolute lg:after:right-0 lg:after:bottom-5 lg:after:left-0 lg:after:h-0.5 lg:after:origin-center lg:after:rounded-full lg:after:bg-white lg:after:transition-transform lg:hover:bg-transparent lg:hover:after:scale-x-100 lg:focus-visible:bg-transparent lg:focus-visible:after:scale-x-100 ${
                    isActive
                      ? "bg-white/12 text-white lg:bg-transparent lg:after:scale-x-100"
                      : "text-white/85 lg:after:scale-x-0"
                  }`}
                  href={item.href}
                  key={item.href}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => {
                    setActiveHref(item.href);
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <a
            className={`${styles.registrationButton} group flex min-h-12 w-full items-center justify-center gap-3 self-center whitespace-nowrap rounded-full px-5 text-[15px] font-black text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(255,26,226,0.4)] focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/70 lg:w-auto lg:min-w-[180px] xl:min-w-[200px]`}
            href="#lien-he"
            onClick={() => setMenuOpen(false)}
          >
            <span className="relative z-10">Đăng ký ngay</span>
            <span
              className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-white text-[#df18d1] shadow-[0_3px_10px_rgba(101,0,111,0.2)] transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <ArrowRight className="size-[17px]" strokeWidth={3} />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
