import "server-only";

import { readdir, readFile, stat, unlink } from "node:fs/promises";
import path from "node:path";
import {
  resolveUploadFilePath,
  toServedUploadPath,
  uploadsRoot,
} from "@/lib/upload-path";

export type MediaImage = {
  /** Đường dẫn công khai, ví dụ "/api/uploads/npc/creator-abc.webp". */
  path: string;
  folder: string;
  filename: string;
  size: number;
  updatedAt: string;
  /** Tên các mục đang dùng ảnh này; rỗng nghĩa là ảnh chưa được dùng ở đâu. */
  usedBy: string[];
};

const dataDirectory = path.join(process.cwd(), "data");
const imageExtensions = new Set([".webp", ".jpg", ".jpeg", ".png", ".ico"]);

const dataFileLabels = new Map([
  ["hero-banner.json", "Banner đầu trang"],
  ["npc-section.json", "Creator NPC"],
  ["npc-intro-section.json", "NPC là gì?"],
  ["npc-model-section.json", "Mô hình NPC"],
  ["seo-settings.json", "SEO & Favicon"],
  ["seven-day-training-section.json", "Lộ trình 7 ngày"],
]);

function collectImagePaths(value: unknown, found: Set<string>) {
  if (typeof value === "string") {
    if (value.startsWith("/uploads/") || value.startsWith("/api/uploads/")) {
      found.add(toServedUploadPath(value));
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectImagePaths(item, found);
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectImagePaths(item, found);
  }
}

/** Tra cứu ảnh nào đang được section nào sử dụng, đọc từ toàn bộ file trong data/. */
async function getImageUsage() {
  const usage = new Map<string, string[]>();
  const entries = await readdir(dataDirectory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;

    let parsed: unknown;
    try {
      parsed = JSON.parse(await readFile(path.join(dataDirectory, entry.name), "utf8"));
    } catch {
      continue;
    }

    const found = new Set<string>();
    collectImagePaths(parsed, found);
    const label = dataFileLabels.get(entry.name) ?? entry.name;

    for (const imagePath of found) {
      usage.set(imagePath, [...(usage.get(imagePath) ?? []), label]);
    }
  }

  return usage;
}

export async function listMediaImages(): Promise<MediaImage[]> {
  let folders: string[];

  try {
    folders = (await readdir(uploadsRoot, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return [];
  }

  const usage = await getImageUsage();
  const images: MediaImage[] = [];

  for (const folder of folders) {
    const files = await readdir(path.join(uploadsRoot, folder), { withFileTypes: true });

    for (const file of files) {
      if (!file.isFile() || !imageExtensions.has(path.extname(file.name).toLowerCase())) continue;

      const publicPath = `/api/uploads/${folder}/${file.name}`;
      const details = await stat(path.join(uploadsRoot, folder, file.name));

      images.push({
        path: publicPath,
        folder,
        filename: file.name,
        size: details.size,
        updatedAt: details.mtime.toISOString(),
        usedBy: usage.get(publicPath) ?? [],
      });
    }
  }

  return images.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Chỉ chấp nhận đường dẫn nằm gọn trong public/uploads để chặn thoát thư mục. */
function resolveUploadPath(publicPath: string) {
  const normalized = resolveUploadFilePath(publicPath);
  if (!normalized || !imageExtensions.has(path.extname(normalized).toLowerCase())) return null;

  return normalized;
}

/** Kiểm tra một ảnh được chọn lại từ thư viện có thật sự tồn tại hay không. */
export async function resolveSelectedImage(formData: FormData, field: string) {
  const publicPath = String(formData.get(`${field}Path`) ?? "").trim();
  if (!publicPath) return null;

  const absolutePath = resolveUploadPath(publicPath);
  if (!absolutePath) throw new Error("Ảnh chọn từ thư viện không hợp lệ.");

  try {
    await stat(absolutePath);
  } catch {
    throw new Error("Ảnh chọn từ thư viện không còn tồn tại.");
  }

  return publicPath;
}

export async function deleteMediaImage(publicPath: string) {
  const absolutePath = resolveUploadPath(publicPath);
  if (!absolutePath) throw new Error("Đường dẫn ảnh không hợp lệ.");

  const usage = await getImageUsage();
  const usedBy = usage.get(publicPath) ?? [];
  if (usedBy.length) {
    throw new Error(
      `Ảnh đang được dùng ở: ${usedBy.join(", ")}. Hãy thay ảnh khác cho các mục này trước khi xóa.`,
    );
  }

  await unlink(absolutePath);
}
