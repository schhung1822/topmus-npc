import Image from "next/image";
import type { Metadata } from "next";
import { getNpcSectionContent } from "@/lib/npc-content";
import { ImagePicker } from "@/components/admin/image-picker";
import { listMediaImages } from "@/lib/media-library";
import {
  addNpcAction,
  deleteNpcAction,
  updateNpcAction,
  updateNpcSectionAction,
} from "../../npc-actions";

export const metadata: Metadata = {
  title: "Quản lý Creator NPC",
  robots: { index: false, follow: false },
};

const inputClasses =
  "mt-2 h-11 w-full rounded-xl border border-[#dfe3dc] bg-white px-3 text-sm text-[#1b2922] outline-none transition focus:border-[#5e1779] focus:ring-4 focus:ring-[#5e1779]/10";
const labelClasses = "text-xs font-bold text-[#526057]";

export default async function AdminNpcPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [content, query, library] = await Promise.all([
    getNpcSectionContent(),
    searchParams,
    listMediaImages(),
  ]);

  return (
    <section className="px-6 py-10 lg:px-[54px] lg:py-12" aria-labelledby="npc-admin-title">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#748079] uppercase">
            Nội dung LadiPage
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#16231d] lg:text-[42px]" id="npc-admin-title">
            Creator NPC
          </h1>
          <p className="mt-3 max-w-[650px] text-sm leading-6 text-[#6f7772]">
            Cập nhật banner và danh sách NPC hiển thị tại section thứ hai của trang chủ.
          </p>
        </div>
        <a
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-xs font-bold text-[#260048] no-underline shadow-[0_8px_20px_rgba(104,20,130,0.18)] transition hover:-translate-y-0.5"
          href="/#gioi-thieu"
          target="_blank"
        >
          Xem ngoài trang chủ ↗
        </a>
      </div>

      {query.saved ? (
        <div className="mt-6 rounded-xl border border-[#cfe5c5] bg-[#eff8eb] px-4 py-3 text-sm font-semibold text-[#47733a]" role="status">
          Nội dung đã được lưu thành công.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(420px,1.18fr)]">
        <div className="space-y-6">
          <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Thiết lập section</p>
              <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">Tiêu đề và banner</h2>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#efe7f3]">
              <Image className="object-cover" src={content.bannerImage} alt="Banner Creator NPC hiện tại" fill sizes="500px" />
            </div>

            <form className="mt-5 grid gap-4" action={updateNpcSectionAction}>
              <label className={labelClasses}>
                Tiêu đề section
                <input className={inputClasses} type="text" name="title" defaultValue={content.title} required />
              </label>
              <ImagePicker name="banner" label="Thay banner" library={library} />
              <p className="text-[11px] leading-5 text-[#8a918d]">Hỗ trợ JPG, PNG, WEBP; tối đa 8MB. Để trống nếu giữ ảnh hiện tại.</p>
              <button className="h-11 cursor-pointer rounded-xl border-0 bg-[#5d1476] px-5 text-sm font-bold text-white transition hover:bg-[#741b91]" type="submit">
                Lưu thiết lập section
              </button>
            </form>
          </article>

          <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Thêm nội dung</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">Thêm NPC mới</h2>

            <form className="mt-5 grid gap-4 sm:grid-cols-2" action={addNpcAction}>
              <label className={labelClasses}>
                Tên NPC
                <input className={inputClasses} name="name" placeholder="Ví dụ: Huyenchi0105" required />
              </label>
              <label className={labelClasses}>
                Danh mục
                <select className={inputClasses} name="categoryId" required>
                  {content.categories.map((category) => <option value={category.id} key={category.id}>{category.label}</option>)}
                </select>
              </label>
              <label className={labelClasses}>
                Vai trò / nhãn
                <input className={inputClasses} name="tag" placeholder="Ví dụ: Thư ký" required />
              </label>
              <label className={labelClasses}>
                Giờ live
                <input className={inputClasses} name="liveTime" placeholder="19:00 - 23:00" required />
              </label>
              <label className={labelClasses}>
                Nền tảng
                <input className={inputClasses} name="platform" defaultValue="TikTok" required />
              </label>
              <label className={labelClasses}>
                Loại nội dung
                <input className={inputClasses} name="contentType" defaultValue="Video" required />
              </label>
              <label className={labelClasses}>
                Link kênh TikTok
                <input className={inputClasses} type="url" inputMode="url" name="tiktokUrl" placeholder="https://www.tiktok.com/@tenkenh" />
              </label>
              <label className={labelClasses}>
                Link video TikTok
                <input className={inputClasses} type="url" inputMode="url" name="videoUrl" placeholder="https://www.tiktok.com/@tenkenh/video/..." />
              </label>
              <ImagePicker className="sm:col-span-2" name="image" label="Ảnh NPC" library={library} />
              <button className="h-11 cursor-pointer rounded-xl border-0 bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(104,20,130,0.16)] transition hover:-translate-y-0.5 sm:col-span-2" type="submit">
                + Thêm NPC
              </button>
            </form>
          </article>
        </div>

        <article className="h-fit rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Danh sách</p>
              <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">{content.npcs.length} NPC hiện có</h2>
            </div>
            <span className="rounded-full bg-[#f3eaf6] px-3 py-1.5 text-[10px] font-extrabold text-[#66108b]">NoSQL document</span>
          </div>

          <div className="mt-5 grid gap-3">
            {content.npcs.map((npc) => (
              <details className="group overflow-hidden rounded-2xl border border-[#e7e4e8] bg-white" key={npc.id}>
                <summary className="flex cursor-pointer list-none items-center gap-3 p-3 marker:hidden">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#eee4f1]">
                    <Image className="object-cover" src={npc.image} alt="" fill sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm text-[#23192a]">{npc.name}</strong>
                    <span className="mt-1 block text-[10px] text-[#8a788e]">
                      {content.categories.find((category) => category.id === npc.categoryId)?.label} · {npc.liveTime}
                    </span>
                  </div>
                  <span className="text-lg text-[#8d7594] transition group-open:rotate-180">⌄</span>
                </summary>

                <div className="border-t border-[#eeeaf0] bg-[#fcfafc] p-4">
                  <form className="grid gap-3 sm:grid-cols-2" action={updateNpcAction}>
                    <input type="hidden" name="id" value={npc.id} />
                    <label className={labelClasses}>Tên NPC<input className={inputClasses} name="name" defaultValue={npc.name} required /></label>
                    <label className={labelClasses}>Danh mục<select className={inputClasses} name="categoryId" defaultValue={npc.categoryId}>{content.categories.map((category) => <option value={category.id} key={category.id}>{category.label}</option>)}</select></label>
                    <label className={labelClasses}>Vai trò<input className={inputClasses} name="tag" defaultValue={npc.tag} required /></label>
                    <label className={labelClasses}>Giờ live<input className={inputClasses} name="liveTime" defaultValue={npc.liveTime} required /></label>
                    <label className={labelClasses}>Nền tảng<input className={inputClasses} name="platform" defaultValue={npc.platform} required /></label>
                    <label className={labelClasses}>Loại nội dung<input className={inputClasses} name="contentType" defaultValue={npc.contentType} required /></label>
                    <label className={labelClasses}>Link kênh TikTok<input className={inputClasses} type="url" inputMode="url" name="tiktokUrl" defaultValue={npc.tiktokUrl} placeholder="https://www.tiktok.com/@tenkenh" /></label>
                    <label className={labelClasses}>Link video TikTok<input className={inputClasses} type="url" inputMode="url" name="videoUrl" defaultValue={npc.videoUrl} placeholder="https://www.tiktok.com/@tenkenh/video/..." /></label>
                    <ImagePicker className="sm:col-span-2" name="image" label="Thay ảnh" library={library} />
                    <button className="h-10 cursor-pointer rounded-xl border-0 bg-[#5d1476] text-xs font-bold text-white hover:bg-[#741b91] sm:col-span-2" type="submit">Lưu thay đổi NPC</button>
                  </form>
                  <form className="mt-2" action={deleteNpcAction}>
                    <input type="hidden" name="id" value={npc.id} />
                    <button className="h-9 w-full cursor-pointer rounded-xl border border-[#f0cfc9] bg-[#fff3f0] text-xs font-bold text-[#a43a2c] hover:bg-[#ffe8e2]" type="submit">Xóa NPC</button>
                  </form>
                </div>
              </details>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
