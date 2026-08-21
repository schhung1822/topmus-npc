import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { uploadsRoot } from "@/lib/upload-path";

/** Định dạng ảnh được phép tải lên; tất cả đều được chuyển sang WEBP khi lưu. */
export const uploadImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const webpQuality = 82;

type SaveUploadedImageOptions = {
  file: File;
  /** Thư mục con trong public/uploads, ví dụ "npc" hoặc "seo". */
  folder: string;
  /** Tiền tố tên file để dễ nhận biết, ví dụ "banner". */
  prefix: string;
  maximumSize?: number;
  allowedTypes?: Set<string>;
  typeErrorMessage?: string;
  sizeErrorMessage?: string;
};

/**
 * Lưu ảnh tải lên từ trang quản trị dưới dạng WEBP.
 * Trả về đường dẫn endpoint công khai của ảnh, hoặc null khi người dùng không chọn file.
 */
export async function saveUploadedImage({
  file,
  folder,
  prefix,
  maximumSize = 8 * 1024 * 1024,
  allowedTypes = uploadImageTypes,
  typeErrorMessage = "Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.",
  sizeErrorMessage = "Ảnh tải lên không được vượt quá 8MB.",
}: SaveUploadedImageOptions) {
  if (!file.size) return null;
  if (!allowedTypes.has(file.type)) throw new Error(typeErrorMessage);
  if (file.size > maximumSize) throw new Error(sizeErrorMessage);

  let webpImage: Buffer;

  try {
    webpImage = await sharp(Buffer.from(await file.arrayBuffer()))
      // Xoay theo dữ liệu EXIF trước khi chuyển đổi, vì EXIF bị bỏ khi sang WEBP.
      .rotate()
      .webp({ quality: webpQuality })
      .toBuffer();
  } catch {
    throw new Error("Không đọc được ảnh tải lên. Hãy thử lại với ảnh JPG, PNG hoặc WEBP khác.");
  }

  const directory = path.join(uploadsRoot, folder);
  await mkdir(directory, { recursive: true });
  const filename = `${prefix}-${randomUUID()}.webp`;
  await writeFile(path.join(directory, filename), webpImage);
  return `/api/uploads/${folder}/${filename}`;
}
