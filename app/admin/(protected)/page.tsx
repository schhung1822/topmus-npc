import type { Metadata } from "next";
import Link from "next/link";
import { getNpcSectionContent } from "@/lib/npc-content";
import { getNpcIntroContent } from "@/lib/npc-intro-content";
import { getNpcModelContent } from "@/lib/npc-model-content";
import { getVideoSectionContent } from "@/lib/video-content";
import { getHeroBannerContent } from "@/lib/hero-banner-content";
import { getSevenDayTrainingContent } from "@/lib/seven-day-training-content";
import { listMediaImages } from "@/lib/media-library";

export const metadata: Metadata = {
  title: "Tổng quan",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [heroBannerContent, npcContent, introContent, modelContent, videoContent, trainingContent, mediaImages] =
    await Promise.all([
      getHeroBannerContent(),
      getNpcSectionContent(),
      getNpcIntroContent(),
      getNpcModelContent(),
      getVideoSectionContent(),
      getSevenDayTrainingContent(),
      listMediaImages(),
    ]);

  const metrics = [
    { label: "Banner đầu trang", value: "1", help: "Ảnh đang hiển thị", accent: "from-[#5b1686] to-[#a92fc0]" },
    { label: "Creator NPC", value: String(npcContent.npcs.length), help: "Hồ sơ đang hiển thị", accent: "from-[#7b20a0] to-[#c331bd]" },
    { label: "Nội dung giới thiệu", value: String(introContent.features.length), help: "Ô nội dung đang hoạt động", accent: "from-[#a326a8] to-[#f044cf]" },
    { label: "Mô hình NPC", value: String(modelContent.cards.length), help: "Thẻ lật đang hiển thị", accent: "from-[#8b1fb0] to-[#e23ad6]" },
    { label: "Video highlight", value: String(videoContent.videos.length), help: "YouTube Shorts trong slider", accent: "from-[#5c1986] to-[#9839c3]" },
    { label: "Lộ trình 7 ngày", value: String(trainingContent.steps.length), help: "Bước đào tạo đang hiển thị", accent: "from-[#a3239b] to-[#f0479f]" },
    { label: "Thư viện ảnh", value: String(mediaImages.length), help: "Ảnh đã tải lên", accent: "from-[#6a1b9a] to-[#b44ae0]" },
  ];

  const sections = [
    { href: "/admin/seo", title: "SEO & Favicon", description: "Quản lý nội dung Google, ảnh chia sẻ và biểu tượng website.", icon: "◎" },
    { href: "/admin/hero-banner", title: "Banner đầu trang", description: `Thay ảnh banner hiện tại: ${heroBannerContent.alt}`, icon: "▣" },
    { href: "/admin/npc", title: "Creator NPC", description: "Quản lý banner, danh mục và hồ sơ creator.", icon: "✦" },
    { href: "/admin/npc-intro", title: "NPC là gì?", description: "Cập nhật banner giới thiệu và các điểm nổi bật.", icon: "?" },
    { href: "/admin/npc-model", title: "Mô hình NPC", description: "Quản lý các thẻ lật: ảnh mặt trước và nội dung mặt sau.", icon: "◱" },
    { href: "/admin/videos", title: "Video highlight", description: "Quản lý slider YouTube Shorts và thứ tự hiển thị.", icon: "▶" },
    { href: "/admin/seven-day-training", title: "Lộ trình 7 ngày", description: "Cập nhật tiêu đề, ảnh nền và các bước đào tạo.", icon: "◷" },
    { href: "/admin/media", title: "Thư viện ảnh", description: "Xem, dùng lại và xóa ảnh đã tải lên trước đó.", icon: "◨" },
  ];

  return (
    <section className="px-5 py-9 sm:px-6 lg:px-[54px] lg:py-12" aria-labelledby="dashboard-title">
      <div className="relative overflow-hidden rounded-[26px] bg-[linear-gradient(105deg,#310052_0%,#7f168e_58%,#ad2aad_100%)] px-6 py-8 text-white shadow-[0_22px_60px_rgba(76,11,92,0.2)] sm:px-9 lg:px-11 lg:py-10">
        <div className="absolute -top-24 -right-20 size-72 rounded-full border-[48px] border-white/5" />
        <div className="absolute right-[22%] -bottom-20 size-44 rounded-full bg-[#ff45d8]/10 blur-2xl" />
        <div className="relative max-w-[680px]">
          <p className="text-[10px] font-extrabold tracking-[0.15em] text-[#f1a8ef] uppercase">Bảng điều khiển</p>
          <h1 className="mt-3 text-[clamp(30px,4vw,46px)] leading-tight font-extrabold tracking-[-0.045em]" id="dashboard-title">Xin chào, topmus.</h1>
          <p className="mt-3 text-sm leading-6 text-white/68">Quản lý toàn bộ nội dung LadiPage TOPMUS tại một nơi. Các thay đổi được đồng bộ trực tiếp ra trang chủ.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {metrics.map((metric) => (
          <article className="relative overflow-hidden rounded-[20px] border border-[#eadfee] bg-white p-5 shadow-[0_10px_30px_rgba(68,27,77,0.06)]" key={metric.label}>
            <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${metric.accent}`} />
            <p className="text-xs font-bold text-[#7d6883]">{metric.label}</p>
            <div className="mt-5 flex items-end justify-between gap-3">
              <strong className="text-4xl tracking-[-0.05em] text-[#37143f]">{metric.value}</strong>
              <span className="rounded-full bg-[#f6edf8] px-2.5 py-1 text-[9px] font-extrabold text-[#8b318f] uppercase">Nội dung</span>
            </div>
            <p className="mt-2 text-[11px] text-[#a092a4]">{metric.help}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.12em] text-[#a187a7] uppercase">Truy cập nhanh</p>
          <h2 className="mt-1.5 text-2xl font-bold tracking-[-0.03em] text-[#321a38]">Nội dung LadiPage</h2>
        </div>
        <span className="hidden rounded-full bg-[#f0e5f3] px-3 py-1.5 text-[10px] font-extrabold text-[#7d2988] sm:inline-flex">{sections.length} section đang hoạt động</span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {sections.map((section) => (
          <Link className="group flex min-h-[154px] flex-col rounded-[20px] border border-[#eadfee] bg-white p-5 no-underline shadow-[0_8px_26px_rgba(68,27,77,0.05)] transition hover:-translate-y-1 hover:border-[#dab9df] hover:shadow-[0_16px_36px_rgba(78,21,91,0.1)]" href={section.href} key={section.href}>
            <span className="grid size-10 place-items-center rounded-xl bg-[linear-gradient(135deg,#f3e4f7,#fce9f8)] text-sm font-black text-[#8c258f]">{section.icon}</span>
            <h3 className="mt-4 text-base font-extrabold text-[#36203c]">{section.title}</h3>
            <p className="mt-1 text-xs leading-5 text-[#8c7c90]">{section.description}</p>
            <span className="mt-auto pt-4 text-[11px] font-extrabold text-[#a025aa] transition group-hover:translate-x-1">Mở trình quản lý →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
