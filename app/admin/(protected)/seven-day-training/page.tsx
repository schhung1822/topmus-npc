import Image from "next/image";
import type { Metadata } from "next";
import { getSevenDayTrainingContent } from "@/lib/seven-day-training-content";
import { ImagePicker } from "@/components/admin/image-picker";
import { listMediaImages } from "@/lib/media-library";
import {
  addTrainingStepAction,
  deleteTrainingStepAction,
  moveTrainingStepAction,
  updateTrainingBackgroundAction,
  updateTrainingHeaderAction,
  updateTrainingStepAction,
} from "../../seven-day-training-actions";

export const metadata: Metadata = {
  title: "Quản lý lộ trình 7 ngày",
  robots: { index: false, follow: false },
};

const inputClasses =
  "mt-2 h-11 w-full rounded-xl border border-[#dfe3dc] bg-white px-3 text-sm text-[#1b2922] outline-none transition focus:border-[#5e1779] focus:ring-4 focus:ring-[#5e1779]/10";
const textareaClasses = `${inputClasses} h-auto min-h-28 resize-y py-3 leading-6`;
const labelClasses = "text-xs font-bold text-[#526057]";
const primaryButtonClasses =
  "h-11 cursor-pointer rounded-xl border-0 bg-[#5d1476] px-5 text-sm font-bold text-white transition hover:bg-[#741b91]";

export default async function AdminSevenDayTrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [content, query, library] = await Promise.all([
    getSevenDayTrainingContent(),
    searchParams,
    listMediaImages(),
  ]);

  return (
    <section className="px-6 py-10 lg:px-[54px] lg:py-12" aria-labelledby="training-admin-title">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#748079] uppercase">Nội dung LadiPage</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#16231d] lg:text-[42px]" id="training-admin-title">Section “Lộ trình 7 ngày”</h1>
          <p className="mt-3 max-w-[650px] text-sm leading-6 text-[#6f7772]">Quản lý tiêu đề, đoạn mô tả, nút đăng ký, ảnh nền và từng bước trong lộ trình đào tạo.</p>
        </div>
        <a className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-xs font-bold text-white no-underline shadow-[0_8px_20px_rgba(104,20,130,0.18)] transition hover:-translate-y-0.5" href="/#lo-trinh-7-ngay" target="_blank">Xem ngoài trang chủ ↗</a>
      </div>

      {query.saved ? (
        <div className="mt-6 rounded-xl border border-[#cfe5c5] bg-[#eff8eb] px-4 py-3 text-sm font-semibold text-[#47733a]" role="status">Nội dung đã được lưu thành công.</div>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(380px,0.85fr)_minmax(0,1.15fr)]">
        <div className="space-y-6">
          <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Tiêu đề và nút</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">Phần đầu section</h2>

            <form className="mt-5 grid gap-4" action={updateTrainingHeaderAction}>
              <label className={labelClasses}>Tiêu đề lớn<input className={inputClasses} name="headingHighlight" defaultValue={content.headingHighlight} required /></label>
              <label className={labelClasses}>Chữ bên phải tiêu đề<input className={inputClasses} name="headingSuffix" defaultValue={content.headingSuffix} required /></label>
              <label className={labelClasses}>Nhãn hồng<input className={inputClasses} name="headingBadge" defaultValue={content.headingBadge} required /></label>
              <p className="text-[11px] leading-5 text-[#8a918d]">Tiêu đề lớn hiển thị trên một dòng, nên giữ ngắn như “7 NGÀY” để không bị tràn trên điện thoại.</p>
              <label className={labelClasses}>Đoạn mô tả<textarea className={textareaClasses} name="intro" defaultValue={content.intro} required /></label>
              <label className={labelClasses}>Chữ trên nút<input className={inputClasses} name="ctaLabel" defaultValue={content.ctaLabel} required /></label>
              <label className={labelClasses}>Liên kết nút<input className={inputClasses} name="ctaHref" defaultValue={content.ctaHref} required /></label>
              <p className="text-[11px] leading-5 text-[#8a918d]">Liên kết dạng “#lien-he” sẽ cuộn tới form đăng ký ngay trên trang chủ.</p>
              <button className={primaryButtonClasses} type="submit">Lưu phần đầu section</button>
            </form>
          </article>

          <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Hình nền</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">Một ảnh nền cho toàn section</h2>

            <div className="mt-5">
              <p className="text-[11px] font-bold text-[#8c7c90]">Ảnh nền hiện tại</p>
              <span className="relative mt-2 block aspect-[16/9] overflow-hidden rounded-xl bg-[#f2e5f6]">
                <Image className="object-cover" src={content.backgroundImage} alt="" fill sizes="500px" />
              </span>
            </div>

            <form className="mt-5 grid gap-4" action={updateTrainingBackgroundAction}>
              <ImagePicker name="backgroundImage" label="Thay ảnh nền" library={library} />
              <p className="text-[11px] leading-5 text-[#8a918d]">Ảnh này phủ toàn bộ section theo chế độ object-cover. Nên dùng ảnh ngang tối màu, rộng tối thiểu 1920px. Hỗ trợ JPG, PNG, WEBP; tối đa 8MB. Để trống nếu giữ ảnh hiện tại.</p>
              <button className={primaryButtonClasses} type="submit">Lưu hình nền</button>
            </form>
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Các bước</p>
                <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">{content.steps.length} bước trong lộ trình</h2>
              </div>
              <span className="rounded-full bg-[#f3eaf6] px-3 py-1.5 text-[10px] font-extrabold text-[#66108b]">Ảnh vuông 1:1</span>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-[#8a918d]">Các bước xếp thành bậc thang từ trái sang phải theo đúng thứ tự bên dưới. Nên giữ 3–5 bước để bố cục trên máy tính vừa khung.</p>

            <div className="mt-5 grid gap-3">
              {content.steps.map((step, index) => (
                <details className="group overflow-hidden rounded-2xl border border-[#e7e4e8] bg-white" key={step.id}>
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4 marker:hidden">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-[#f2e5f6]">
                      <Image className="object-cover" src={step.image} alt="" fill sizes="44px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm text-[#23192a]">{step.title}</strong>
                      <span className="mt-0.5 block truncate text-[11px] text-[#8c7c90]">Ngày {step.day}</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-[#a58bab]">#{index + 1}</span>
                    <span className="text-lg text-[#8d7594] transition group-open:rotate-180">⌄</span>
                  </summary>
                  <div className="border-t border-[#eeeaf0] bg-[#fcfafc] p-4">
                    <form className="grid gap-3" action={updateTrainingStepAction}>
                      <input type="hidden" name="id" value={step.id} />
                      <label className={labelClasses}>Số ngày<input className={inputClasses} name="day" defaultValue={step.day} required /></label>
                      <label className={labelClasses}>Tiêu đề bước<input className={inputClasses} name="title" defaultValue={step.title} required /></label>
                      <label className={labelClasses}>Nội dung bước<textarea className={textareaClasses} name="description" defaultValue={step.description} required /></label>
                      <ImagePicker name="image" label="Thay ảnh minh họa" library={library} />
                      <p className="text-[11px] leading-5 text-[#8a918d]">Ảnh hiển thị dạng vuông và được phóng to nhẹ, nên chọn ảnh có nhân vật ở giữa khung. Để trống nếu giữ ảnh hiện tại.</p>
                      <button className="h-10 cursor-pointer rounded-xl border-0 bg-[#5d1476] text-xs font-bold text-white hover:bg-[#741b91]" type="submit">Lưu thay đổi</button>
                    </form>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <form action={moveTrainingStepAction}>
                        <input type="hidden" name="id" value={step.id} /><input type="hidden" name="direction" value="up" />
                        <button className="h-9 w-full cursor-pointer rounded-xl border border-[#ddd5df] bg-white text-xs font-bold text-[#65526a] disabled:cursor-not-allowed disabled:opacity-40" type="submit" disabled={index === 0}>↑ Đưa lên</button>
                      </form>
                      <form action={moveTrainingStepAction}>
                        <input type="hidden" name="id" value={step.id} /><input type="hidden" name="direction" value="down" />
                        <button className="h-9 w-full cursor-pointer rounded-xl border border-[#ddd5df] bg-white text-xs font-bold text-[#65526a] disabled:cursor-not-allowed disabled:opacity-40" type="submit" disabled={index === content.steps.length - 1}>↓ Đưa xuống</button>
                      </form>
                    </div>
                    <form className="mt-2" action={deleteTrainingStepAction}>
                      <input type="hidden" name="id" value={step.id} />
                      <button className="h-9 w-full cursor-pointer rounded-xl border border-[#f0cfc9] bg-[#fff3f0] text-xs font-bold text-[#a43a2c] hover:bg-[#ffe8e2] disabled:cursor-not-allowed disabled:opacity-40" type="submit" disabled={content.steps.length <= 1}>Xóa bước</button>
                    </form>
                  </div>
                </details>
              ))}
            </div>
          </article>

          <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Thêm mới</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">Thêm bước vào lộ trình</h2>
            <form className="mt-5 grid gap-4" action={addTrainingStepAction}>
              <label className={labelClasses}>Số ngày<input className={inputClasses} name="day" placeholder="VD: 3–5" required /></label>
              <label className={labelClasses}>Tiêu đề bước<input className={inputClasses} name="title" required /></label>
              <label className={labelClasses}>Nội dung bước<textarea className={textareaClasses} name="description" required /></label>
              <ImagePicker name="image" label="Ảnh minh họa" library={library} />
              <button className="h-11 cursor-pointer rounded-xl border-0 bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(104,20,130,0.16)] transition hover:-translate-y-0.5" type="submit">+ Thêm bước</button>
            </form>
          </article>
        </div>
      </div>
    </section>
  );
}
