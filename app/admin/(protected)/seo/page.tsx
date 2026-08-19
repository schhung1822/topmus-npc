import Image from "next/image";
import type { Metadata } from "next";
import { updateSeoSettingsAction } from "../../seo-actions";
import { analyticsHomeUrl } from "@/lib/analytics";
import { getSeoSettings } from "@/lib/seo-settings";
import { ImagePicker } from "@/components/admin/image-picker";
import { listMediaImages } from "@/lib/media-library";

export const metadata: Metadata = {
  title: "Quản lý SEO & Favicon",
  robots: { index: false, follow: false },
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#dfe3dc] bg-white px-3 text-sm text-[#1b2922] outline-none transition focus:border-[#6d1786] focus:ring-4 focus:ring-[#6d1786]/10";

export default async function AdminSeoPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [seo, query, library] = await Promise.all([
    getSeoSettings(),
    searchParams,
    listMediaImages(),
  ]);

  return (
    <section className="px-5 py-9 sm:px-6 lg:px-[54px] lg:py-12" aria-labelledby="seo-admin-title">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#748079] uppercase">
            Cấu hình LadiPage
          </p>
          <h1
            className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#16231d] lg:text-[42px]"
            id="seo-admin-title"
          >
            SEO &amp; Favicon
          </h1>
          <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#6f7772]">
            Quản lý nội dung hiển thị trên Google, ảnh khi chia sẻ liên kết và biểu tượng của website.
          </p>
        </div>
        <a
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-xs font-bold text-white no-underline shadow-[0_8px_20px_rgba(104,20,130,0.18)] transition hover:-translate-y-0.5"
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          Xem ngoài trang chủ ↗
        </a>
      </div>

      {query.saved ? (
        <div
          className="mt-6 rounded-xl border border-[#cfe5c5] bg-[#eff8eb] px-4 py-3 text-sm font-semibold text-[#47733a]"
          role="status"
        >
          Cấu hình SEO và favicon đã được cập nhật thành công.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        <form
          className="rounded-[22px] border border-[#e5e6df] bg-[#fffefa] p-5 shadow-[0_14px_38px_rgba(68,27,77,0.07)] sm:p-7"
          action={updateSeoSettingsAction}
        >
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">
              Nội dung tìm kiếm
            </p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">
              Thông tin SEO cơ bản
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="text-xs font-bold text-[#526057]">
              Tên website
              <input
                className={`${inputClass} h-11`}
                type="text"
                name="siteName"
                defaultValue={seo.siteName}
                maxLength={80}
                required
              />
            </label>

            <label className="text-xs font-bold text-[#526057]">
              Địa chỉ website chính thức
              <input
                className={`${inputClass} h-11`}
                type="url"
                name="siteUrl"
                defaultValue={seo.siteUrl}
                placeholder="https://example.com/"
                required
              />
            </label>

            <label className="text-xs font-bold text-[#526057] sm:col-span-2">
              Tiêu đề SEO
              <input
                className={`${inputClass} h-11`}
                type="text"
                name="title"
                defaultValue={seo.title}
                maxLength={70}
                required
              />
              <span className="mt-1.5 block text-[10px] font-medium text-[#969c98]">
                Nên dài khoảng 50–60 ký tự để hiển thị tốt trên Google.
              </span>
            </label>

            <label className="text-xs font-bold text-[#526057] sm:col-span-2">
              Mô tả SEO
              <textarea
                className={`${inputClass} min-h-[108px] resize-y py-3 leading-6`}
                name="description"
                defaultValue={seo.description}
                maxLength={180}
                required
              />
              <span className="mt-1.5 block text-[10px] font-medium text-[#969c98]">
                Nên dài khoảng 120–160 ký tự, mô tả rõ nội dung và lợi ích chính của landing page.
              </span>
            </label>

            <label className="text-xs font-bold text-[#526057] sm:col-span-2">
              Từ khóa
              <input
                className={`${inputClass} h-11`}
                type="text"
                name="keywords"
                defaultValue={seo.keywords.join(", ")}
                placeholder="TOPMUS, NPC Live, TikTok Live"
              />
              <span className="mt-1.5 block text-[10px] font-medium text-[#969c98]">
                Phân cách từng từ khóa bằng dấu phẩy, tối đa 20 từ khóa.
              </span>
            </label>
          </div>

          <div className="mt-8 border-t border-[#ece7ed] pt-7">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">
              Đo lường
            </p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">
              Kết nối Google Analytics
            </h2>
            <p className="mt-2 text-xs leading-5 text-[#8a918d]">
              Dán mã đo lường vào ô bên dưới rồi bấm lưu. Landing page sẽ tự gắn thẻ gtag.js và
              bắt đầu gửi dữ liệu về Google Analytics, không cần chỉnh sửa mã nguồn.
            </p>
          </div>

          <div className="mt-5">
            <label className="text-xs font-bold text-[#526057]">
              Mã Google Analytics
              <input
                className={`${inputClass} h-11 font-mono tracking-[0.04em] uppercase`}
                type="text"
                name="googleAnalyticsId"
                defaultValue={seo.googleAnalyticsId}
                placeholder="G-XXXXXXXXXX"
                autoComplete="off"
                spellCheck={false}
              />
              <span className="mt-1.5 block text-[10px] font-medium leading-4 text-[#969c98]">
                Hỗ trợ GA4 (G-XXXXXXXXXX) và Universal Analytics (UA-XXXXXXX-X). Bạn có thể dán cả
                đoạn mã gtag.js, hệ thống sẽ tự tách mã. Để trống nếu muốn ngắt kết nối.
              </span>
            </label>
          </div>

          <div className="mt-8 border-t border-[#ece7ed] pt-7">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">
              Chia sẻ mạng xã hội
            </p>
            <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">
              Ảnh đại diện liên kết
            </h2>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-xs font-bold text-[#526057] sm:col-span-2">
              Mô tả ảnh chia sẻ
              <input
                className={`${inputClass} h-11`}
                type="text"
                name="socialImageAlt"
                defaultValue={seo.socialImageAlt}
                maxLength={180}
                required
              />
            </label>

            <ImagePicker
              name="socialImage"
              label="Thay ảnh chia sẻ"
              hint="Khuyến nghị 1200 × 630px. JPG, PNG hoặc WEBP; tối đa 8MB."
              library={library}
            />

            <label className="text-xs font-bold text-[#526057]">
              Thay favicon
              <input
                className="mt-2 block w-full rounded-xl border border-[#dfe3dc] bg-white p-2 text-xs text-[#526057] file:mr-3 file:rounded-lg file:border-0 file:bg-[#f0e5f4] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#66108b]"
                type="file"
                name="favicon"
                accept=".ico,image/png,image/webp,image/x-icon,image/vnd.microsoft.icon"
              />
              <span className="mt-1.5 block text-[10px] font-medium leading-4 text-[#969c98]">
                Nên dùng ảnh vuông 32 × 32px hoặc 512 × 512px. PNG, WEBP hoặc ICO; tối đa 2MB.
              </span>
            </label>
          </div>

          <button
            className="mt-7 h-11 w-full cursor-pointer rounded-xl border-0 bg-[#5d1476] px-5 text-sm font-bold text-white transition hover:bg-[#741b91] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#b939bb]"
            type="submit"
          >
            Lưu cấu hình SEO &amp; favicon
          </button>
        </form>

        <aside className="space-y-6">
          <article className="rounded-[22px] border border-[#e5e6df] bg-white p-5 shadow-[0_14px_38px_rgba(68,27,77,0.07)] sm:p-6">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">
              Xem trước Google
            </p>
            <div className="mt-5 rounded-2xl border border-[#ececec] bg-white p-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center overflow-hidden rounded-full border border-[#e5e5e5] bg-[#f7f2f8]">
                  <Image src={seo.favicon} alt="" width={24} height={24} unoptimized />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-[#202124]">{seo.siteName}</p>
                  <p className="truncate text-[10px] text-[#4d5156]">{seo.siteUrl}</p>
                </div>
              </div>
              <h3 className="mt-3 text-lg leading-6 font-medium text-[#1a0dab]">{seo.title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#4d5156]">{seo.description}</p>
            </div>
          </article>

          <article className="rounded-[22px] border border-[#e5e6df] bg-white p-5 shadow-[0_14px_38px_rgba(68,27,77,0.07)] sm:p-6">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">
              Xem trước khi chia sẻ
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-[#dfd5e2] bg-white shadow-[0_10px_26px_rgba(61,24,69,0.08)]">
              <div className="relative aspect-[1.91/1] w-full bg-[#31004f]">
                <Image
                  className="object-cover"
                  src={seo.socialImage}
                  alt={seo.socialImageAlt}
                  fill
                  sizes="420px"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold tracking-[0.06em] text-[#8f8292] uppercase">
                  {new URL(seo.siteUrl).hostname}
                </p>
                <h3 className="mt-1.5 text-sm font-extrabold leading-5 text-[#2b1b2f]">{seo.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#796d7c]">{seo.description}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[22px] border border-[#e5e6df] bg-white p-5 shadow-[0_14px_38px_rgba(68,27,77,0.07)] sm:p-6">
            <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">
              Trạng thái Google Analytics
            </p>

            {seo.googleAnalyticsId ? (
              <>
                <div className="mt-4 flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full bg-[#3aa758] shadow-[0_0_0_4px_rgba(58,167,88,0.16)]" aria-hidden="true" />
                  <p className="text-sm font-bold text-[#2c7c46]">Đã kết nối</p>
                </div>
                <p className="mt-3 rounded-xl border border-[#e6e9e4] bg-[#f7f9f6] px-3 py-2.5 font-mono text-sm font-bold tracking-[0.04em] text-[#24182a]">
                  {seo.googleAnalyticsId}
                </p>
                <p className="mt-3 text-xs leading-5 text-[#6f7772]">
                  Mở Google Analytics → Báo cáo → Thời gian thực, rồi tải lại trang chủ. Lượt truy
                  cập của bạn sẽ xuất hiện sau vài giây nếu kết nối thành công.
                </p>
                <a
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-[#dfd5e2] bg-white px-4 text-xs font-bold text-[#5d1476] no-underline transition hover:border-[#c79ad2]"
                  href={analyticsHomeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Mở Google Analytics ↗
                </a>
              </>
            ) : (
              <>
                <div className="mt-4 flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full bg-[#c8b7cd]" aria-hidden="true" />
                  <p className="text-sm font-bold text-[#7c6b81]">Chưa kết nối</p>
                </div>
                <ol className="mt-3 list-decimal space-y-2 pl-4 text-xs leading-5 text-[#6f7772]">
                  <li>Đăng nhập analytics.google.com và chọn thuộc tính GA4 của website.</li>
                  <li>
                    Vào Quản trị → Luồng dữ liệu → chọn luồng web để lấy mã đo lường dạng
                    G-XXXXXXXXXX.
                  </li>
                  <li>Dán mã vào ô “Mã Google Analytics” bên trái rồi bấm lưu cấu hình.</li>
                </ol>
              </>
            )}

            <div className="mt-5 border-t border-[#f0ecf1] pt-4">
              <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">
                Chỉ số landing page được gửi tự động
              </p>
              <ul className="mt-3 space-y-1.5 text-xs leading-5 text-[#6f7772]">
                <li>page_view — lượt xem trang, nguồn truy cập, thiết bị</li>
                <li>scroll_depth — cuộn tới 25%, 50%, 75%, 90% trang</li>
                <li>cta_click — bấm nút kêu gọi đăng ký ở từng section</li>
                <li>contact_click — bấm gọi điện hoặc nhắn Zalo</li>
                <li>form_start / form_error — bắt đầu điền và lỗi khi gửi form</li>
                <li>generate_lead — gửi hồ sơ đăng ký thành công</li>
              </ul>
            </div>
          </article>

          <article className="rounded-[22px] border border-[#eadfee] bg-[#f7eff9] p-5 text-xs leading-5 text-[#705c75]">
            <strong className="block text-sm text-[#53245f]">SEO đã được thiết lập</strong>
            <p className="mt-2">
              Trang chủ tự động tạo tiêu đề, mô tả, canonical URL, Open Graph, Twitter Card, robots.txt và sitemap.xml từ cấu hình này.
            </p>
          </article>
        </aside>
      </div>
    </section>
  );
}
