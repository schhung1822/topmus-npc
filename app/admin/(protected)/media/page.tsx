import Image from "next/image";
import type { Metadata } from "next";
import { listMediaImages } from "@/lib/media-library";
import { deleteMediaImageAction } from "../../media-actions";

export const metadata: Metadata = {
  title: "Thư viện ảnh",
  robots: { index: false, follow: false },
};

const folderLabels = new Map([
  ["hero-banner", "Banner đầu trang"],
  ["npc", "Creator NPC"],
  ["npc-model", "Mô hình NPC"],
  ["seo", "SEO & chia sẻ"],
  ["seven-day-training", "Lộ trình 10 ngày"],
  ["why-topmus", "Vì sao chọn TOPMUS"],
  ["videos", "Ảnh nội dung NPC"],
]);

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [images, query] = await Promise.all([listMediaImages(), searchParams]);

  const totalSize = images.reduce((total, image) => total + image.size, 0);
  const unusedImages = images.filter((image) => !image.usedBy.length);

  return (
    <section className="px-6 py-10 lg:px-[54px] lg:py-12" aria-labelledby="media-admin-title">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#748079] uppercase">Nội dung LadiPage</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#16231d] lg:text-[42px]" id="media-admin-title">Thư viện ảnh</h1>
          <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#6f7772]">
            Toàn bộ ảnh đã tải lên từ trang quản trị. Ảnh chưa dùng đến có thể xóa để tiết kiệm dung lượng; ảnh đang dùng được khóa xóa để không làm hỏng giao diện trang chủ.
          </p>
        </div>
      </div>

      {query.saved ? (
        <div className="mt-6 rounded-xl border border-[#cfe5c5] bg-[#eff8eb] px-4 py-3 text-sm font-semibold text-[#47733a]" role="status">Đã xóa ảnh khỏi thư viện.</div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <article className="rounded-[18px] border border-[#eadfee] bg-white p-5">
          <p className="text-xs font-bold text-[#7d6883]">Tổng số ảnh</p>
          <strong className="mt-3 block text-3xl tracking-[-0.04em] text-[#37143f]">{images.length}</strong>
        </article>
        <article className="rounded-[18px] border border-[#eadfee] bg-white p-5">
          <p className="text-xs font-bold text-[#7d6883]">Dung lượng đang dùng</p>
          <strong className="mt-3 block text-3xl tracking-[-0.04em] text-[#37143f]">{formatSize(totalSize)}</strong>
        </article>
        <article className="rounded-[18px] border border-[#eadfee] bg-white p-5">
          <p className="text-xs font-bold text-[#7d6883]">Ảnh chưa được dùng</p>
          <strong className="mt-3 block text-3xl tracking-[-0.04em] text-[#37143f]">{unusedImages.length}</strong>
          <p className="mt-1 text-[11px] text-[#a092a4]">Có thể xóa an toàn</p>
        </article>
      </div>

      {images.length ? (
        <div className="mt-8 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
          {images.map((image) => (
            <article className="overflow-hidden rounded-[18px] border border-[#e5e6df] bg-[#fffefa]" key={image.path}>
              <div className="relative aspect-[4/3] w-full bg-[#f2e5f6]">
                <Image className="object-contain" src={image.path} alt={image.filename} fill sizes="240px" />
                <span className="absolute top-2 left-2 rounded-full bg-[#2b0b35]/80 px-2 py-1 text-[9px] font-extrabold text-white">
                  {folderLabels.get(image.folder) ?? image.folder}
                </span>
              </div>

              <div className="p-3.5">
                <p className="truncate text-xs font-bold text-[#23192a]" title={image.filename}>{image.filename}</p>
                <p className="mt-1 text-[10px] text-[#9c8ca1]">{formatSize(image.size)} · {formatDate(image.updatedAt)}</p>

                {image.usedBy.length ? (
                  <p className="mt-2 rounded-lg bg-[#f1f7ee] px-2 py-1.5 text-[10px] leading-4 font-bold text-[#4c7a3d]">
                    Đang dùng: {image.usedBy.join(", ")}
                  </p>
                ) : (
                  <p className="mt-2 rounded-lg bg-[#faf3f1] px-2 py-1.5 text-[10px] leading-4 font-bold text-[#a4795f]">
                    Chưa được dùng ở đâu
                  </p>
                )}

                <form className="mt-3" action={deleteMediaImageAction}>
                  <input type="hidden" name="path" value={image.path} />
                  <button
                    className="h-9 w-full cursor-pointer rounded-xl border border-[#f0cfc9] bg-[#fff3f0] text-xs font-bold text-[#a43a2c] transition hover:bg-[#ffe8e2] disabled:cursor-not-allowed disabled:border-[#e7e4e8] disabled:bg-[#f6f5f6] disabled:text-[#a8a2aa]"
                    type="submit"
                    disabled={image.usedBy.length > 0}
                  >
                    {image.usedBy.length ? "Đang được dùng" : "Xóa ảnh"}
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid min-h-[220px] place-items-center rounded-[18px] border border-dashed border-[#ddd0e0] bg-white px-6 text-center">
          <div>
            <p className="text-sm font-bold text-[#33203a]">Thư viện chưa có ảnh nào</p>
            <p className="mt-2 text-xs text-[#8a918d]">Ảnh sẽ xuất hiện tại đây sau khi bạn tải lên từ các mục quản lý nội dung.</p>
          </div>
        </div>
      )}
    </section>
  );
}
