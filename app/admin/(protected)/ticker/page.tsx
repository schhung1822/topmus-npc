import Image from "next/image";
import type { Metadata } from "next";
import { getTickerContent } from "@/lib/ticker-content";
import { updateTickerContentAction } from "../../ticker-actions";

export const metadata: Metadata = {
  title: "Quản lý chữ chạy",
  robots: { index: false, follow: false },
};

export default async function AdminTickerPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [content, query] = await Promise.all([getTickerContent(), searchParams]);

  return (
    <section className="px-5 py-9 sm:px-6 lg:px-[54px] lg:py-12" aria-labelledby="ticker-admin-title">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#748079] uppercase">
            Nội dung dùng chung
          </p>
          <h1
            className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#16231d] lg:text-[42px]"
            id="ticker-admin-title"
          >
            Chữ chạy toàn trang
          </h1>
          <p className="mt-3 max-w-[680px] text-sm leading-6 text-[#6f7772]">
            Chỉnh nội dung một lần tại đây. Tất cả dải chữ chạy trên trang chủ sẽ tự động dùng
            cùng danh sách này, còn màu sắc và giao diện từng dải vẫn được giữ nguyên.
          </p>
        </div>
        <a
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(90deg,#671482,#a52aaa)] px-5 text-xs font-bold text-white no-underline shadow-[0_8px_20px_rgba(104,20,130,0.18)] transition hover:-translate-y-0.5"
          href="/#trang-chu"
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
          Nội dung chữ chạy đã được đồng bộ thành công.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-[22px] border border-[#e5e6df] bg-[#fffefa] p-5 shadow-[0_14px_38px_rgba(68,27,77,0.07)] sm:p-7">
          <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">
            Danh sách nội dung
          </p>
          <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] text-[#24182a]">
            Mỗi dòng là một nội dung chạy
          </h2>

          <form className="mt-5" action={updateTickerContentAction}>
            <label className="text-xs font-bold text-[#526057]">
              Nội dung chữ chạy
              <textarea
                className="mt-2 min-h-[270px] w-full resize-y rounded-xl border border-[#dfe3dc] bg-white px-4 py-3 text-sm leading-7 text-[#1b2922] outline-none transition focus:border-[#5e1779] focus:ring-4 focus:ring-[#5e1779]/10"
                name="items"
                defaultValue={content.items.join("\n")}
                maxLength={1212}
                required
              />
            </label>
            <p className="mt-3 text-[11px] leading-5 text-[#8a918d]">
              Tối đa 12 dòng, mỗi dòng không quá 100 ký tự. Thứ tự các dòng cũng là thứ tự hiển
              thị trên các dải chữ chạy.
            </p>
            <button
              className="mt-5 h-11 w-full cursor-pointer rounded-xl border-0 bg-[#5d1476] px-5 text-sm font-bold text-white transition hover:bg-[#741b91]"
              type="submit"
            >
              Lưu và đồng bộ tất cả chữ chạy
            </button>
          </form>
        </article>

        <aside className="h-fit rounded-[22px] border border-[#e5e6df] bg-white p-5 sm:p-6">
          <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">
            Nội dung hiện tại
          </p>
          <h2 className="mt-1.5 text-lg font-bold text-[#24182a]">
            {content.items.length} nội dung đang dùng
          </h2>
          <ol className="mt-5 grid list-none gap-3 p-0">
            {content.items.map((item, index) => (
              <li
                className="flex items-start gap-3 rounded-xl bg-[#f8f1fa] px-3 py-3 text-xs leading-5 text-[#4b3851]"
                key={`${index}-${item}`}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#ead9ef] text-[10px] font-extrabold text-[#6b197e]">
                  {index + 1}
                </span>
                <span className="pt-1">{item}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#eee4f1] px-3 py-3 text-[11px] text-[#806c86]">
            <Image src="/img/icon-start.webp" alt="" width={24} height={24} aria-hidden="true" />
            Biểu tượng và hiệu ứng chạy được giữ nguyên trên website.
          </div>
        </aside>
      </div>
    </section>
  );
}
