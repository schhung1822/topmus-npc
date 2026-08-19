import Image from "next/image";
import type { Metadata } from "next";
import { getNpcIntroContent } from "@/lib/npc-intro-content";
import { ImagePicker } from "@/components/admin/image-picker";
import { listMediaImages } from "@/lib/media-library";
import {
  addNpcIntroFeatureAction,
  deleteNpcIntroFeatureAction,
  updateNpcIntroAction,
  updateNpcIntroFeatureAction,
} from "../../npc-intro-actions";

export const metadata: Metadata = {
  title: "Quản lý NPC là gì?",
  robots: { index: false, follow: false },
};

const inputClasses =
  "mt-2 h-11 w-full rounded-xl border border-[#dfe3dc] bg-white px-3 text-sm text-[#1b2922] outline-none transition focus:border-[#5e1779] focus:ring-4 focus:ring-[#5e1779]/10";
const textareaClasses = `${inputClasses} h-auto min-h-28 resize-y py-3 leading-6`;
const labelClasses = "text-xs font-bold text-[#526057]";

export default async function AdminNpcIntroPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [content, query, library] = await Promise.all([
    getNpcIntroContent(),
    searchParams,
    listMediaImages(),
  ]);

  return (
    <section className="px-6 py-10 lg:px-[54px] lg:py-12" aria-labelledby="intro-admin-title">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#748079] uppercase">Nội dung LadiPage</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#16231d] lg:text-[42px]" id="intro-admin-title">Section “NPC là gì?”</h1>
          <p className="mt-3 max-w-[650px] text-sm leading-6 text-[#6f7772]">Quản lý banner giới thiệu và các nội dung nổi bật của section thứ ba.</p>
        </div>
        <a className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-xs font-bold text-[#260048] no-underline shadow-[0_8px_20px_rgba(104,20,130,0.18)] transition hover:-translate-y-0.5" href="/#chuong-trinh" target="_blank">Xem ngoài trang chủ ↗</a>
      </div>

      {query.saved ? (
        <div className="mt-6 rounded-xl border border-[#cfe5c5] bg-[#eff8eb] px-4 py-3 text-sm font-semibold text-[#47733a]" role="status">Nội dung đã được lưu thành công.</div>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(420px,0.9fr)_minmax(0,1.1fr)]">
        <article className="h-fit rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
          <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Banner giới thiệu</p>
          <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">Hình ảnh và mô tả</h2>

          <div className="relative mt-5 aspect-[2.05/1] overflow-hidden rounded-2xl bg-[#efe7f3]">
            <Image className="object-cover" src={content.bannerImage} alt="Banner NPC là gì hiện tại" fill sizes="600px" />
          </div>

          <form className="mt-5 grid gap-4" action={updateNpcIntroAction}>
            <label className={labelClasses}>Tiêu đề<input className={inputClasses} name="heading" defaultValue={content.heading} required /></label>
            <label className={labelClasses}>Đoạn giới thiệu 1<textarea className={textareaClasses} name="paragraph1" defaultValue={content.paragraphs[0]} required /></label>
            <label className={labelClasses}>Đoạn giới thiệu 2<textarea className={textareaClasses} name="paragraph2" defaultValue={content.paragraphs[1]} required /></label>
            <ImagePicker name="banner" label="Thay banner" library={library} />
            <p className="text-[11px] leading-5 text-[#8a918d]">Hỗ trợ JPG, PNG, WEBP; tối đa 8MB. Để trống nếu giữ ảnh hiện tại.</p>
            <button className="h-11 cursor-pointer rounded-xl border-0 bg-[#5d1476] px-5 text-sm font-bold text-white transition hover:bg-[#741b91]" type="submit">Lưu banner và mô tả</button>
          </form>
        </article>

        <div className="space-y-6">
          <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Các ô nội dung</p>
                <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">{content.features.length} nội dung nổi bật</h2>
              </div>
              <span className="rounded-full bg-[#f3eaf6] px-3 py-1.5 text-[10px] font-extrabold text-[#66108b]">NoSQL document</span>
            </div>

            <div className="mt-5 grid gap-3">
              {content.features.map((feature, index) => (
                <details className="group overflow-hidden rounded-2xl border border-[#e7e4e8] bg-white" key={feature.id}>
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4 marker:hidden">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f2e5f6] text-xs font-extrabold text-[#66108b]">{index + 1}</span>
                    <strong className="min-w-0 flex-1 truncate text-sm text-[#23192a]">{feature.title}</strong>
                    <span className="text-lg text-[#8d7594] transition group-open:rotate-180">⌄</span>
                  </summary>
                  <div className="border-t border-[#eeeaf0] bg-[#fcfafc] p-4">
                    <form className="grid gap-3" action={updateNpcIntroFeatureAction}>
                      <input type="hidden" name="id" value={feature.id} />
                      <label className={labelClasses}>Tiêu đề<input className={inputClasses} name="title" defaultValue={feature.title} required /></label>
                      <label className={labelClasses}>Nội dung<textarea className={textareaClasses} name="description" defaultValue={feature.description} required /></label>
                      <button className="h-10 cursor-pointer rounded-xl border-0 bg-[#5d1476] text-xs font-bold text-white hover:bg-[#741b91]" type="submit">Lưu thay đổi</button>
                    </form>
                    <form className="mt-2" action={deleteNpcIntroFeatureAction}>
                      <input type="hidden" name="id" value={feature.id} />
                      <button className="h-9 w-full cursor-pointer rounded-xl border border-[#f0cfc9] bg-[#fff3f0] text-xs font-bold text-[#a43a2c] hover:bg-[#ffe8e2]" type="submit">Xóa nội dung</button>
                    </form>
                  </div>
                </details>
              ))}
            </div>
          </article>

          <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Thêm mới</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">Thêm ô nội dung</h2>
            <form className="mt-5 grid gap-4" action={addNpcIntroFeatureAction}>
              <label className={labelClasses}>Tiêu đề<input className={inputClasses} name="title" required /></label>
              <label className={labelClasses}>Nội dung<textarea className={textareaClasses} name="description" required /></label>
              <button className="h-11 cursor-pointer rounded-xl border-0 bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(104,20,130,0.16)] transition hover:-translate-y-0.5" type="submit">+ Thêm ô nội dung</button>
            </form>
          </article>
        </div>
      </div>
    </section>
  );
}
