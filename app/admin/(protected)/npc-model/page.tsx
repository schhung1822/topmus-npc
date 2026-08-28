import Image from "next/image";
import type { Metadata } from "next";
import { getNpcModelContent } from "@/lib/npc-model-content";
import { ImagePicker } from "@/components/admin/image-picker";
import { listMediaImages } from "@/lib/media-library";
import {
  addNpcModelCardAction,
  deleteNpcModelCardAction,
  updateNpcModelCardAction,
  updateNpcModelHeaderAction,
} from "../../npc-model-actions";

export const metadata: Metadata = {
  title: "Quản lý mô hình NPC",
  robots: { index: false, follow: false },
};

const inputClasses =
  "mt-2 h-11 w-full rounded-xl border border-[#dfe3dc] bg-white px-3 text-sm text-[#1b2922] outline-none transition focus:border-[#5e1779] focus:ring-4 focus:ring-[#5e1779]/10";
const textareaClasses = `${inputClasses} h-auto min-h-28 resize-y py-3 leading-6`;
const labelClasses = "text-xs font-bold text-[#526057]";

export default async function AdminNpcModelPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [content, query, library] = await Promise.all([
    getNpcModelContent(),
    searchParams,
    listMediaImages(),
  ]);

  return (
    <section className="px-6 py-10 lg:px-[54px] lg:py-12" aria-labelledby="npc-model-admin-title">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#748079] uppercase">Nội dung LadiPage</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#16231d] lg:text-[42px]" id="npc-model-admin-title">Section “Mô hình NPC”</h1>
          <p className="mt-3 max-w-[650px] text-sm leading-6 text-[#6f7772]">Quản lý tiêu đề, nút đăng ký và các thẻ lật. Mỗi thẻ có mặt trước là ảnh, mặt sau là nội dung mô tả.</p>
        </div>
        <a className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-xs font-bold text-white no-underline shadow-[0_8px_20px_rgba(104,20,130,0.18)] transition hover:-translate-y-0.5" href="/#mo-hinh-npc" target="_blank">Xem ngoài trang chủ ↗</a>
      </div>

      {query.saved ? (
        <div className="mt-6 rounded-xl border border-[#cfe5c5] bg-[#eff8eb] px-4 py-3 text-sm font-semibold text-[#47733a]" role="status">Nội dung đã được lưu thành công.</div>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(380px,0.85fr)_minmax(0,1.15fr)]">
        <article className="h-fit rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
          <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Tiêu đề và nút</p>
          <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">Phần đầu section</h2>

          <form className="mt-5 grid gap-4" action={updateNpcModelHeaderAction}>
            <label className={labelClasses}>Dòng 1 – phần đầu<input className={inputClasses} name="eyebrow" defaultValue={content.eyebrow} required /></label>
            <label className={labelClasses}>Dòng 1 – phần nổi bật<input className={inputClasses} name="heading" defaultValue={content.heading} required /></label>
            <label className={labelClasses}>Dòng 2<input className={inputClasses} name="badge" defaultValue={content.badge} required /></label>
            <label className={labelClasses}>Chữ trên nút<input className={inputClasses} name="ctaLabel" defaultValue={content.ctaLabel} required /></label>
            <label className={labelClasses}>Liên kết nút<input className={inputClasses} name="ctaHref" defaultValue={content.ctaHref} required /></label>
            <p className="text-[11px] leading-5 text-[#8a918d]">Liên kết dạng “#lien-he” sẽ cuộn tới form đăng ký ngay trên trang chủ.</p>
            <button className="h-11 cursor-pointer rounded-xl border-0 bg-[#5d1476] px-5 text-sm font-bold text-white transition hover:bg-[#741b91]" type="submit">Lưu phần đầu section</button>
          </form>
        </article>

        <div className="space-y-6">
          <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Thẻ lật</p>
                <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">{content.cards.length} thẻ đang hiển thị</h2>
              </div>
              <span className="rounded-full bg-[#f3eaf6] px-3 py-1.5 text-[10px] font-extrabold text-[#66108b]">Ảnh dọc 9:16</span>
            </div>

            <div className="mt-5 grid gap-3">
              {content.cards.map((card, index) => (
                <details className="group overflow-hidden rounded-2xl border border-[#e7e4e8] bg-white" key={card.id}>
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4 marker:hidden">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-[#f2e5f6]">
                      <Image className="object-cover" src={card.image} alt="" fill sizes="44px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm text-[#23192a]">{card.name}</strong>
                      <span className="mt-0.5 block truncate text-[11px] text-[#8c7c90]">{card.tagline}</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-[#a58bab]">#{index + 1}</span>
                    <span className="text-lg text-[#8d7594] transition group-open:rotate-180">⌄</span>
                  </summary>
                  <div className="border-t border-[#eeeaf0] bg-[#fcfafc] p-4">
                    <form className="grid gap-3" action={updateNpcModelCardAction}>
                      <input type="hidden" name="id" value={card.id} />
                      <label className={labelClasses}>Tên thẻ<input className={inputClasses} name="name" defaultValue={card.name} required /></label>
                      <label className={labelClasses}>Dòng mô tả ngắn (mặt trước)<input className={inputClasses} name="tagline" defaultValue={card.tagline} required /></label>
                      <label className={labelClasses}>Nội dung mặt sau<textarea className={textareaClasses} name="description" defaultValue={card.description} required /></label>
                      <ImagePicker name="image" label="Thay ảnh mặt trước" library={library} />
                      <p className="text-[11px] leading-5 text-[#8a918d]">Nên dùng ảnh dọc tỉ lệ 9:16. Hỗ trợ JPG, PNG, WEBP; tối đa 8MB. Để trống nếu giữ ảnh hiện tại.</p>
                      <button className="h-10 cursor-pointer rounded-xl border-0 bg-[#5d1476] text-xs font-bold text-white hover:bg-[#741b91]" type="submit">Lưu thay đổi</button>
                    </form>
                    <form className="mt-2" action={deleteNpcModelCardAction}>
                      <input type="hidden" name="id" value={card.id} />
                      <button className="h-9 w-full cursor-pointer rounded-xl border border-[#f0cfc9] bg-[#fff3f0] text-xs font-bold text-[#a43a2c] hover:bg-[#ffe8e2]" type="submit">Xóa thẻ</button>
                    </form>
                  </div>
                </details>
              ))}
            </div>
          </article>

          <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Thêm mới</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">Thêm thẻ mô hình</h2>
            <form className="mt-5 grid gap-4" action={addNpcModelCardAction}>
              <label className={labelClasses}>Tên thẻ<input className={inputClasses} name="name" required /></label>
              <label className={labelClasses}>Dòng mô tả ngắn (mặt trước)<input className={inputClasses} name="tagline" required /></label>
              <label className={labelClasses}>Nội dung mặt sau<textarea className={textareaClasses} name="description" required /></label>
              <ImagePicker name="image" label="Ảnh mặt trước" library={library} />
              <button className="h-11 cursor-pointer rounded-xl border-0 bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(104,20,130,0.16)] transition hover:-translate-y-0.5" type="submit">+ Thêm thẻ</button>
            </form>
          </article>
        </div>
      </div>
    </section>
  );
}
