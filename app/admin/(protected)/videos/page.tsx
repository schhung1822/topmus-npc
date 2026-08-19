import Image from "next/image";
import type { Metadata } from "next";
import { getVideoSectionContent } from "@/lib/video-content";
import { ImagePicker } from "@/components/admin/image-picker";
import { listMediaImages } from "@/lib/media-library";
import {
  addVideoAction,
  deleteVideoAction,
  moveVideoAction,
  updateVideoAction,
  updateVideoSectionAction,
} from "../../video-actions";

export const metadata: Metadata = {
  title: "Quản lý video highlight",
  robots: { index: false, follow: false },
};

const inputClasses =
  "mt-2 h-11 w-full rounded-xl border border-[#dfe3dc] bg-white px-3 text-sm text-[#1b2922] outline-none transition focus:border-[#5e1779] focus:ring-4 focus:ring-[#5e1779]/10";
const labelClasses = "text-xs font-bold text-[#526057]";

export default async function AdminVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [content, query, library] = await Promise.all([
    getVideoSectionContent(),
    searchParams,
    listMediaImages(),
  ]);

  return (
    <section className="px-6 py-10 lg:px-[54px] lg:py-12" aria-labelledby="video-admin-title">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#748079] uppercase">Nội dung LadiPage</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#16231d] lg:text-[42px]" id="video-admin-title">Video highlight</h1>
          <p className="mt-3 max-w-[680px] text-sm leading-6 text-[#6f7772]">Nhúng YouTube Shorts bằng URL. Thumbnail lấy tự động từ YouTube, hoặc tải ảnh riêng cho từng video.</p>
        </div>
        <a className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-xs font-bold text-[#260048] no-underline shadow-[0_8px_20px_rgba(104,20,130,0.18)] transition hover:-translate-y-0.5" href="/#quyen-loi" target="_blank">Xem ngoài trang chủ ↗</a>
      </div>

      {query.saved ? (
        <div className="mt-6 rounded-xl border border-[#cfe5c5] bg-[#eff8eb] px-4 py-3 text-sm font-semibold text-[#47733a]" role="status">Nội dung đã được lưu thành công.</div>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(360px,0.72fr)_minmax(0,1.28fr)]">
        <div className="space-y-6">
          <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Thiết lập section</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">Tiêu đề hiển thị</h2>
            <form className="mt-5 grid gap-4" action={updateVideoSectionAction}>
              <label className={labelClasses}>Tiêu đề<input className={inputClasses} name="heading" defaultValue={content.heading} required /></label>
              <label className={labelClasses}>Mô tả<input className={inputClasses} name="subtitle" defaultValue={content.subtitle} required /></label>
              <button className="h-11 cursor-pointer rounded-xl border-0 bg-[#5d1476] text-sm font-bold text-white hover:bg-[#741b91]" type="submit">Lưu tiêu đề</button>
            </form>
          </article>

          <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Thêm mới</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">Thêm YouTube Short</h2>
            <form className="mt-5 grid gap-4" action={addVideoAction}>
              <label className={labelClasses}>URL YouTube Shorts<input className={inputClasses} type="url" name="youtubeUrl" placeholder="https://youtube.com/shorts/..." required /></label>
              <label className={labelClasses}>Tên video<input className={inputClasses} name="title" placeholder="Ví dụ: NPC GAME" required /></label>
              <label className={labelClasses}>Nhãn<input className={inputClasses} name="label" defaultValue="YouTube Shorts" required /></label>
              <ImagePicker name="thumbnail" label="Thumbnail riêng (không bắt buộc)" library={library} />
              <p className="text-[11px] leading-5 text-[#8a918d]">Chấp nhận URL Shorts, Watch hoặc youtu.be. Bỏ trống thumbnail thì hệ thống tự lấy ảnh từ YouTube; ảnh riêng nên là ảnh dọc 9:16, tối đa 8MB.</p>
              <button className="h-11 cursor-pointer rounded-xl border-0 bg-[linear-gradient(90deg,#671482,#a52aaa)] text-sm font-bold text-white shadow-[0_8px_20px_rgba(104,20,130,0.16)] transition hover:-translate-y-0.5" type="submit">+ Thêm video</button>
            </form>
          </article>
        </div>

        <article className="h-fit rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Slider</p>
              <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">{content.videos.length} video</h2>
            </div>
            <span className="rounded-full bg-[#f3eaf6] px-3 py-1.5 text-[10px] font-extrabold text-[#66108b]">YouTube</span>
          </div>

          {content.videos.length ? (
            <div className="mt-5 grid gap-3">
              {content.videos.map((video, index) => (
                <details className="group overflow-hidden rounded-2xl border border-[#e7e4e8] bg-white" key={video.id}>
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-3 marker:hidden">
                    <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-[#20102a]">
                      <Image className="object-cover" src={video.thumbnail || `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" fill sizes="56px" />
                    </div>
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#f2e5f6] text-[10px] font-extrabold text-[#66108b]">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-sm text-[#23192a]">{video.title}</strong>
                      <span className="mt-1 block truncate text-[10px] text-[#8a788e]">{video.youtubeUrl}</span>
                    </div>
                    <span className="text-lg text-[#8d7594] transition group-open:rotate-180">⌄</span>
                  </summary>

                  <div className="border-t border-[#eeeaf0] bg-[#fcfafc] p-4">
                    <form className="grid gap-3" action={updateVideoAction}>
                      <input type="hidden" name="id" value={video.id} />
                      <label className={labelClasses}>URL YouTube<input className={inputClasses} type="url" name="youtubeUrl" defaultValue={video.youtubeUrl} required /></label>
                      <label className={labelClasses}>Tên video<input className={inputClasses} name="title" defaultValue={video.title} required /></label>
                      <label className={labelClasses}>Nhãn<input className={inputClasses} name="label" defaultValue={video.label} required /></label>

                      <div className="rounded-xl border border-[#eee7f0] bg-white p-3">
                        <div className="flex items-center gap-3">
                          <span className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg bg-[#20102a]">
                            <Image className="object-cover" src={video.thumbnail || `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" fill sizes="44px" />
                          </span>
                          <span className="min-w-0">
                            <strong className="block text-xs text-[#23192a]">
                              {video.thumbnail ? "Đang dùng thumbnail tải lên" : "Đang dùng thumbnail YouTube"}
                            </strong>
                            <span className="mt-1 block text-[10px] leading-4 text-[#8a788e]">Ảnh dọc 9:16 hiển thị đẹp nhất trong khung. JPG, PNG hoặc WEBP; tối đa 8MB.</span>
                          </span>
                        </div>
                        <ImagePicker className="mt-3" name="thumbnail" label="Thay thumbnail" library={library} />
                        {video.thumbnail ? (
                          <label className="mt-3 flex items-center gap-2 text-[11px] font-bold text-[#65526a]">
                            <input className="size-4 accent-[#5d1476]" type="checkbox" name="useYouTubeThumbnail" />
                            Quay lại dùng thumbnail của YouTube
                          </label>
                        ) : null}
                      </div>

                      <button className="h-10 cursor-pointer rounded-xl border-0 bg-[#5d1476] text-xs font-bold text-white hover:bg-[#741b91]" type="submit">Lưu thay đổi</button>
                    </form>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <form action={moveVideoAction}>
                        <input type="hidden" name="id" value={video.id} /><input type="hidden" name="direction" value="up" />
                        <button className="h-9 w-full cursor-pointer rounded-xl border border-[#ddd5df] bg-white text-xs font-bold text-[#65526a] disabled:cursor-not-allowed disabled:opacity-40" type="submit" disabled={index === 0}>↑ Đưa lên</button>
                      </form>
                      <form action={moveVideoAction}>
                        <input type="hidden" name="id" value={video.id} /><input type="hidden" name="direction" value="down" />
                        <button className="h-9 w-full cursor-pointer rounded-xl border border-[#ddd5df] bg-white text-xs font-bold text-[#65526a] disabled:cursor-not-allowed disabled:opacity-40" type="submit" disabled={index === content.videos.length - 1}>↓ Đưa xuống</button>
                      </form>
                    </div>
                    <form className="mt-2" action={deleteVideoAction}>
                      <input type="hidden" name="id" value={video.id} />
                      <button className="h-9 w-full cursor-pointer rounded-xl border border-[#f0cfc9] bg-[#fff3f0] text-xs font-bold text-[#a43a2c] hover:bg-[#ffe8e2]" type="submit">Xóa video</button>
                    </form>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="mt-5 grid min-h-[240px] place-items-center rounded-2xl border border-dashed border-[#dcd5df] bg-[#fcfafc] p-8 text-center">
              <div><p className="text-sm font-bold text-[#5f5163]">Chưa có video</p><p className="mt-2 text-xs leading-5 text-[#908593]">Thêm URL YouTube Shorts bằng biểu mẫu bên trái.</p></div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
