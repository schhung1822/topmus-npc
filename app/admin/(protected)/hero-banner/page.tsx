import Image from "next/image";
import type { Metadata } from "next";
import { updateHeroBannerAction } from "../../hero-banner-actions";
import { getHeroBannerContent } from "@/lib/hero-banner-content";
import { ImagePicker } from "@/components/admin/image-picker";
import { listMediaImages } from "@/lib/media-library";

export const metadata: Metadata = {
  title: "Quản lý banner đầu trang",
  robots: { index: false, follow: false },
};

export default async function AdminHeroBannerPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [content, query, library] = await Promise.all([
    getHeroBannerContent(),
    searchParams,
    listMediaImages(),
  ]);

  return (
    <section
      className="px-5 py-9 sm:px-6 lg:px-[54px] lg:py-12"
      aria-labelledby="hero-banner-admin-title"
    >
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#748079] uppercase">
            Nội dung LadiPage
          </p>
          <h1
            className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#16231d] lg:text-[42px]"
            id="hero-banner-admin-title"
          >
            Banner đầu trang
          </h1>
          <p className="mt-3 max-w-[650px] text-sm leading-6 text-[#6f7772]">
            Thay ảnh banner hiển thị ngay dưới thanh điều hướng của trang chủ.
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
          Banner đã được cập nhật thành công.
        </div>
      ) : null}

      <article className="mt-8 overflow-hidden rounded-[22px] border border-[#e5e6df] bg-[#fffefa] p-5 shadow-[0_14px_38px_rgba(68,27,77,0.07)] sm:p-7">
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">
            Ảnh đang sử dụng
          </p>
          <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">
            Xem trước banner
          </h2>
        </div>

        <div className="relative mt-5 aspect-[2/1] w-full overflow-hidden rounded-2xl bg-[#26003f] shadow-[0_16px_36px_rgba(46,0,70,0.18)]">
          <Image
            className="object-contain"
            src={content.image}
            alt={content.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            priority
          />
        </div>

        <form
          className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.75fr)]"
          action={updateHeroBannerAction}
        >
          <label className="text-xs font-bold text-[#526057]">
            Mô tả ảnh
            <input
              className="mt-2 h-11 w-full rounded-xl border border-[#dfe3dc] bg-white px-3 text-sm text-[#1b2922] outline-none transition focus:border-[#5e1779] focus:ring-4 focus:ring-[#5e1779]/10"
              type="text"
              name="alt"
              defaultValue={content.alt}
              maxLength={180}
              required
            />
          </label>

          <ImagePicker name="image" label="Thay ảnh banner" library={library} />

          <p className="text-[11px] leading-5 text-[#8a918d] lg:col-span-2">
            Nên dùng ảnh tỷ lệ 2:1 để hiển thị đẹp nhất. Hỗ trợ JPG, PNG, WEBP; tối đa 8MB.
            Để trống nếu chỉ muốn sửa mô tả ảnh.
          </p>

          <button
            className="h-11 cursor-pointer rounded-xl border-0 bg-[#5d1476] px-5 text-sm font-bold text-white transition hover:bg-[#741b91] lg:col-span-2"
            type="submit"
          >
            Lưu banner đầu trang
          </button>
        </form>
      </article>
    </section>
  );
}
