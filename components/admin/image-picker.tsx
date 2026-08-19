"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

export type PickerImage = {
  path: string;
  folder: string;
  filename: string;
};

const fileClasses =
  "mt-2 block w-full rounded-xl border border-[#dfe3dc] bg-white p-2 text-xs text-[#526057] file:mr-3 file:rounded-lg file:border-0 file:bg-[#f0e5f4] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#66108b]";

type ImagePickerProps = {
  /** Tên field file; ảnh chọn lại từ thư viện gửi kèm ở field "<name>Path". */
  name: string;
  label: string;
  hint?: string;
  library: PickerImage[];
  className?: string;
};

export function ImagePicker({ name, label, hint, library, className }: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const normalizedKeyword = keyword.trim().toLowerCase();
  const visibleImages = normalizedKeyword
    ? library.filter((image) =>
        `${image.folder}/${image.filename}`.toLowerCase().includes(normalizedKeyword),
      )
    : library;

  function chooseFromLibrary(imagePath: string) {
    setSelected(imagePath);
    setOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className={className}>
      <label className="text-xs font-bold text-[#526057]">
        {label}
        <input
          className={fileClasses}
          type="file"
          name={name}
          accept="image/jpeg,image/png,image/webp"
          ref={fileInputRef}
          onChange={() => setSelected("")}
        />
      </label>

      <input type="hidden" name={`${name}Path`} value={selected} />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          className="h-9 cursor-pointer rounded-xl border border-[#ddd5df] bg-white px-3 text-[11px] font-bold text-[#65526a] transition hover:border-[#c79ad2] hover:text-[#5d1476]"
          type="button"
          onClick={() => setOpen(true)}
          disabled={!library.length}
        >
          Chọn ảnh có sẵn ({library.length})
        </button>

        {selected ? (
          <span className="inline-flex items-center gap-2 rounded-xl border border-[#e0d3e4] bg-[#faf5fb] py-1 pr-2 pl-1">
            <span className="relative size-8 overflow-hidden rounded-lg bg-[#f2e5f6]">
              <Image className="object-cover" src={selected} alt="" fill sizes="32px" />
            </span>
            <span className="max-w-[160px] truncate text-[10px] font-bold text-[#5d1476]">
              {selected.split("/").pop()}
            </span>
            <button
              className="cursor-pointer border-0 bg-transparent px-1 text-xs font-bold text-[#a43a2c]"
              type="button"
              aria-label="Bỏ chọn ảnh từ thư viện"
              onClick={() => setSelected("")}
            >
              ✕
            </button>
          </span>
        ) : null}
      </div>

      {hint ? <p className="mt-1.5 text-[11px] leading-4 text-[#969c98]">{hint}</p> : null}

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[120] grid place-items-center bg-[#1d0f22]/55 p-4 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-label="Thư viện ảnh"
              onClick={() => setOpen(false)}
            >
              <div
                className="flex max-h-[86vh] w-full max-w-[880px] flex-col overflow-hidden rounded-[18px] border border-[#e5e6df] bg-white shadow-[0_30px_60px_rgba(38,0,72,0.28)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center gap-3 border-b border-[#eeeaf0] p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-extrabold tracking-[0.1em] text-[#8c6896] uppercase">Thư viện ảnh</p>
                    <p className="mt-1 text-sm font-bold text-[#24182a]">Chọn ảnh đã tải lên trước đó</p>
                  </div>
                  <input
                    className="h-10 w-[200px] rounded-xl border border-[#dfe3dc] bg-white px-3 text-xs text-[#1b2922] outline-none focus:border-[#5e1779]"
                    type="search"
                    value={keyword}
                    placeholder="Tìm theo tên file"
                    aria-label="Tìm ảnh trong thư viện"
                    onChange={(event) => setKeyword(event.target.value)}
                  />
                  <button
                    className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-[#ddd5df] bg-white text-sm font-bold text-[#65526a]"
                    type="button"
                    aria-label="Đóng thư viện ảnh"
                    onClick={() => setOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="grid gap-3 overflow-y-auto p-4 [grid-template-columns:repeat(auto-fill,minmax(120px,1fr))]">
                  {visibleImages.map((image) => (
                    <button
                      className="group cursor-pointer overflow-hidden rounded-xl border border-[#e7e4e8] bg-white p-0 text-left transition hover:border-[#c79ad2] hover:shadow-[0_10px_22px_rgba(78,21,91,0.12)]"
                      type="button"
                      key={image.path}
                      onClick={() => chooseFromLibrary(image.path)}
                    >
                      <span className="relative block aspect-square w-full bg-[#f2e5f6]">
                        <Image className="object-cover" src={image.path} alt="" fill sizes="140px" />
                      </span>
                      <span className="block px-2 py-2">
                        <span className="block truncate text-[10px] font-bold text-[#33203a]">{image.filename}</span>
                        <span className="mt-0.5 block truncate text-[10px] text-[#9c8ca1]">{image.folder}</span>
                      </span>
                    </button>
                  ))}

                  {!visibleImages.length ? (
                    <p className="col-span-full py-8 text-center text-xs text-[#8a918d]">
                      Không tìm thấy ảnh phù hợp.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
