import Image from "next/image";
import type { Metadata } from "next";
import { ImagePicker } from "@/components/admin/image-picker";
import { listMediaImages } from "@/lib/media-library";
import {
  getWhyTopmusContent,
  type WhyTopmusSlide,
} from "@/lib/why-topmus-content";
import {
  addWhyTopmusSlideAction,
  deleteWhyTopmusSlideAction,
  moveWhyTopmusSlideAction,
  updateWhyTopmusSlideAction,
} from "../../why-topmus-actions";

export const metadata: Metadata = {
  title: "Quản lý Vì sao chọn TOPMUS",
  robots: { index: false, follow: false },
};

const inputClasses =
  "mt-2 h-11 w-full rounded-xl border border-[#dfe3dc] bg-white px-3 text-sm text-[#1b2922] outline-none transition focus:border-[#5e1779] focus:ring-4 focus:ring-[#5e1779]/10";
const labelClasses = "text-xs font-bold text-[#526057]";
const primaryButtonClasses =
  "h-11 cursor-pointer rounded-xl border-0 bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(104,20,130,0.16)] transition hover:-translate-y-0.5";

type SliderKey = "creatorSlides" | "trainingSlides";

type SliderManagerProps = {
  eyebrow: string;
  title: string;
  description: string;
  sliderKey: SliderKey;
  slides: WhyTopmusSlide[];
  library: Awaited<ReturnType<typeof listMediaImages>>;
};

function SliderManager({
  eyebrow,
  title,
  description,
  sliderKey,
  slides,
  library,
}: SliderManagerProps) {
  return (
    <article className="rounded-[18px] border border-[#e5e6df] bg-[#fffefa] p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">
            {title}
          </h2>
          <p className="mt-2 max-w-[520px] text-[11px] leading-5 text-[#8a918d]">
            {description}
          </p>
        </div>
        <span className="w-fit shrink-0 rounded-full bg-[#f3eaf6] px-3 py-1.5 text-[10px] font-extrabold text-[#66108b]">
          {slides.length} ảnh vuông
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {slides.map((slide, index) => (
          <details
            className="group overflow-hidden rounded-2xl border border-[#e7e4e8] bg-white"
            key={slide.id}
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4 marker:hidden">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#f2e5f6]">
                <Image
                  className="object-cover"
                  src={slide.src}
                  alt=""
                  fill
                  sizes="56px"
                />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-sm text-[#23192a]">
                  Ảnh #{index + 1}
                </strong>
                <span className="mt-1 block truncate text-[11px] text-[#8c7c90]">
                  {slide.alt}
                </span>
              </span>
              <span className="text-lg text-[#8d7594] transition group-open:rotate-180">
                ⌄
              </span>
            </summary>

            <div className="border-t border-[#eeeaf0] bg-[#fcfafc] p-4">
              <div className="grid gap-4 sm:grid-cols-[150px_minmax(0,1fr)]">
                <div>
                  <p className="text-[11px] font-bold text-[#8c7c90]">Ảnh hiện tại</p>
                  <span className="relative mt-2 block aspect-square overflow-hidden rounded-xl bg-[#f2e5f6]">
                    <Image
                      className="object-cover"
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="150px"
                    />
                  </span>
                </div>

                <form className="grid content-start gap-3" action={updateWhyTopmusSlideAction}>
                  <input type="hidden" name="slider" value={sliderKey} />
                  <input type="hidden" name="id" value={slide.id} />
                  <label className={labelClasses}>
                    Mô tả ảnh
                    <input
                      className={inputClasses}
                      name="alt"
                      defaultValue={slide.alt}
                      required
                    />
                  </label>
                  <ImagePicker
                    name="image"
                    label="Thay ảnh"
                    hint="Để trống nếu muốn giữ ảnh hiện tại."
                    library={library}
                  />
                  <button
                    className="h-10 cursor-pointer rounded-xl border-0 bg-[#5d1476] px-4 text-xs font-bold text-white transition hover:bg-[#741b91]"
                    type="submit"
                  >
                    Lưu thay đổi
                  </button>
                </form>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <form action={moveWhyTopmusSlideAction}>
                  <input type="hidden" name="slider" value={sliderKey} />
                  <input type="hidden" name="id" value={slide.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    className="h-9 w-full cursor-pointer rounded-xl border border-[#ddd5df] bg-white text-xs font-bold text-[#65526a] transition hover:border-[#c79ad2] disabled:cursor-not-allowed disabled:opacity-40"
                    type="submit"
                    disabled={index === 0}
                  >
                    ↑ Đưa lên
                  </button>
                </form>
                <form action={moveWhyTopmusSlideAction}>
                  <input type="hidden" name="slider" value={sliderKey} />
                  <input type="hidden" name="id" value={slide.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    className="h-9 w-full cursor-pointer rounded-xl border border-[#ddd5df] bg-white text-xs font-bold text-[#65526a] transition hover:border-[#c79ad2] disabled:cursor-not-allowed disabled:opacity-40"
                    type="submit"
                    disabled={index === slides.length - 1}
                  >
                    ↓ Đưa xuống
                  </button>
                </form>
              </div>

              <form className="mt-2" action={deleteWhyTopmusSlideAction}>
                <input type="hidden" name="slider" value={sliderKey} />
                <input type="hidden" name="id" value={slide.id} />
                <button
                  className="h-9 w-full cursor-pointer rounded-xl border border-[#f0cfc9] bg-[#fff3f0] text-xs font-bold text-[#a43a2c] transition hover:bg-[#ffe8e2] disabled:cursor-not-allowed disabled:opacity-40"
                  type="submit"
                  disabled={slides.length <= 1}
                >
                  {slides.length <= 1 ? "Cần giữ lại ít nhất 1 ảnh" : "Xóa ảnh"}
                </button>
              </form>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[#eadfee] bg-[#faf5fb] p-4 sm:p-5">
        <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">
          Thêm mới
        </p>
        <h3 className="mt-1.5 text-base font-bold text-[#33203a]">Thêm ảnh vào slider</h3>
        <form className="mt-4 grid gap-4" action={addWhyTopmusSlideAction}>
          <input type="hidden" name="slider" value={sliderKey} />
          <label className={labelClasses}>
            Mô tả ảnh
            <input
              className={inputClasses}
              name="alt"
              placeholder="Mô tả ngắn nội dung trong ảnh"
              required
            />
          </label>
          <ImagePicker
            name="image"
            label="Ảnh mới"
            hint="Chọn ảnh vuông 1:1, định dạng JPG, PNG hoặc WEBP; tối đa 8MB."
            library={library}
          />
          <button className={primaryButtonClasses} type="submit">
            + Thêm ảnh vào slider
          </button>
        </form>
      </div>
    </article>
  );
}

export default async function AdminWhyTopmusPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [content, query, library] = await Promise.all([
    getWhyTopmusContent(),
    searchParams,
    listMediaImages(),
  ]);

  return (
    <section
      className="px-6 py-10 lg:px-[54px] lg:py-12"
      aria-labelledby="why-topmus-admin-title"
    >
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#748079] uppercase">
            Nội dung LadiPage
          </p>
          <h1
            className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#16231d] lg:text-[42px]"
            id="why-topmus-admin-title"
          >
            Section “Vì sao chọn TOPMUS”
          </h1>
          <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#6f7772]">
            Quản lý độc lập danh sách ảnh và thứ tự hiển thị của hai slider trong section
            quyền lợi. Mỗi slider tự động chuyển ảnh theo thứ tự từ trên xuống dưới.
          </p>
        </div>
        <a
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-xs font-bold text-white no-underline shadow-[0_8px_20px_rgba(104,20,130,0.18)] transition hover:-translate-y-0.5"
          href="/#quyen-loi"
          target="_blank"
        >
          Xem ngoài trang chủ ↗
        </a>
      </div>

      {query.saved ? (
        <div
          className="mt-6 rounded-xl border border-[#cfe5c5] bg-[#eff8eb] px-4 py-3 text-sm font-semibold text-[#47733a]"
          role="status"
        >
          Danh sách ảnh đã được cập nhật thành công.
        </div>
      ) : null}

      <div className="mt-8 grid items-start gap-6 2xl:grid-cols-2">
        <SliderManager
          eyebrow="Slider bên trái"
          title="Slider bên trái – Creator"
          description="Danh sách ảnh creator xuất hiện trong khung vuông bên trái của section."
          sliderKey="creatorSlides"
          slides={content.creatorSlides}
          library={library}
        />
        <SliderManager
          eyebrow="Slider bên phải"
          title="Slider bên phải – Đào tạo"
          description="Danh sách ảnh hoạt động đào tạo xuất hiện trong khung vuông bên phải của section."
          sliderKey="trainingSlides"
          slides={content.trainingSlides}
          library={library}
        />
      </div>
    </section>
  );
}
