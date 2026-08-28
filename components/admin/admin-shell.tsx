"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";

const navigation = [
  { href: "/admin", label: "Tổng quan", icon: "◈" },
  { href: "/admin/seo", label: "SEO & Favicon", icon: "◎" },
  { href: "/admin/hero-banner", label: "Banner đầu trang", icon: "▣" },
  { href: "/admin/ticker", label: "Chữ chạy", icon: "↔" },
  { href: "/admin/npc", label: "Creator NPC", icon: "✦" },
  { href: "/admin/npc-intro", label: "NPC là gì?", icon: "?" },
  { href: "/admin/why-topmus", label: "Vì sao chọn TOPMUS", icon: "◇" },
  { href: "/admin/npc-model", label: "Mô hình NPC", icon: "◱" },
  { href: "/admin/seven-day-training", label: "Lộ trình 10 ngày", icon: "◷" },
  { href: "/admin/media", label: "Thư viện ảnh", icon: "◨" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f8f4fa] text-[#24152a] lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
      <aside className="sticky top-0 z-50 flex min-h-[116px] flex-col bg-[linear-gradient(165deg,#260048_0%,#591067_56%,#8f219c_100%)] px-4 py-4 text-white shadow-[0_14px_45px_rgba(38,0,72,0.2)] lg:h-screen lg:min-h-0 lg:px-5 lg:py-7">
        <div className="flex items-center justify-between gap-4 px-2">
          <Link className="inline-flex w-[142px]" href="/admin" aria-label="TOPMUS Admin">
            <Image
              className="h-auto w-full object-contain [filter:brightness(0)_invert(1)]"
              src="/img/logo_topmus.webp"
              alt="TOPMUS Entertainment"
              width={500}
              height={220}
              priority
            />
          </Link>
          <form className="lg:hidden" action={logoutAction}>
            <button className="grid size-10 cursor-pointer place-items-center rounded-xl border border-white/15 bg-white/10 text-sm text-white" type="submit" aria-label="Đăng xuất">↗</button>
          </form>
        </div>

        <p className="mt-10 hidden px-3 text-[10px] font-extrabold tracking-[0.16em] text-white/40 uppercase lg:block">Quản lý nội dung</p>
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:gap-1.5 lg:overflow-visible" aria-label="Điều hướng quản trị">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3.5 text-xs font-bold no-underline transition lg:min-h-12 lg:text-[13px] ${
                  active
                    ? "bg-white text-[#5d1476] shadow-[0_10px_25px_rgba(29,0,43,0.2)]"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
                href={item.href}
                aria-current={active ? "page" : undefined}
                key={item.href}
              >
                <span className={`grid size-7 place-items-center rounded-lg text-sm ${active ? "bg-[#f5e8f8] text-[#b51eb7]" : "bg-white/8"}`} aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <span className="flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3.5 text-xs font-bold text-white/30 lg:min-h-12 lg:text-[13px]" aria-disabled="true">
            <span className="grid size-7 place-items-center rounded-lg bg-white/5 text-sm" aria-hidden="true">◎</span>
            <span>Khách hàng tiềm năng</span>
          </span>
        </nav>

        <div className="mt-auto hidden border-t border-white/10 pt-5 lg:block">
          <div className="flex items-center gap-3 px-2 pb-4">
            <span className="grid size-10 place-items-center rounded-xl bg-[linear-gradient(135deg,#ff52dc,#a22aae)] text-xs font-black text-white shadow-lg" aria-hidden="true">T</span>
            <div>
              <strong className="block text-sm">topmus</strong>
              <span className="mt-0.5 block text-[10px] text-white/45">Quản trị viên</span>
            </div>
          </div>
          <form action={logoutAction}>
            <button className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-xl border-0 bg-transparent px-3 text-left text-xs font-bold text-white/55 transition hover:bg-white/10 hover:text-white" type="submit">↗ <span>Đăng xuất</span></button>
          </form>
        </div>
      </aside>

      <main className="min-w-0">
        <header className="sticky top-0 z-40 hidden min-h-[72px] items-center justify-between border-b border-[#eadfee] bg-white/85 px-6 backdrop-blur-xl lg:flex lg:px-[54px]">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.12em] text-[#9a7fa2] uppercase">TOPMUS Entertainment</p>
            <p className="mt-1 text-sm font-bold text-[#3d2844]">Hệ thống quản trị LadiPage</p>
          </div>
          <div className="flex items-center gap-3">
            <a className="inline-flex h-9 items-center rounded-xl border border-[#e4d8e7] bg-white px-3.5 text-[11px] font-bold text-[#674d6e] no-underline transition hover:border-[#cda9d5] hover:text-[#7b148c]" href="/" target="_blank">Xem website ↗</a>
            <span className="inline-flex h-9 items-center gap-2 rounded-full bg-[#f3eaf6] px-3.5 text-[10px] font-extrabold text-[#6c277b]"><span className="size-2 rounded-full bg-[#ec3bd3] shadow-[0_0_0_4px_rgba(236,59,211,0.12)]" />Đang hoạt động</span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
