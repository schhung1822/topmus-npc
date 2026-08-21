import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { saveUploadedImage } from "@/lib/image-upload";
import { normalizeUploadPaths } from "@/lib/upload-path";

export type SeoSettings = {
  siteName: string;
  title: string;
  description: string;
  keywords: string[];
  siteUrl: string;
  socialImage: string;
  socialImageAlt: string;
  favicon: string;
  googleAnalyticsId: string;
  updatedAt: string;
};

const settingsPath = path.join(process.cwd(), "data", "seo-settings.json");
const uploadDirectory = path.join(process.cwd(), "public", "uploads", "seo");

const faviconTypes = new Map([
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/x-icon", "ico"],
  ["image/vnd.microsoft.icon", "ico"],
]);

export async function getSeoSettings(): Promise<SeoSettings> {
  const settings = normalizeUploadPaths(
    JSON.parse(await readFile(settingsPath, "utf8")) as SeoSettings,
  );

  return {
    ...settings,
    googleAnalyticsId:
      typeof settings.googleAnalyticsId === "string" ? settings.googleAnalyticsId : "",
  };
}

export async function saveSeoSettings(settings: SeoSettings) {
  const tempPath = `${settingsPath}.${randomUUID()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
  await rename(tempPath, settingsPath);
}

export function saveSocialImage(file: File) {
  return saveUploadedImage({
    file,
    folder: "seo",
    prefix: "social",
    typeErrorMessage: "Ảnh chia sẻ chỉ hỗ trợ JPG, PNG hoặc WEBP.",
    sizeErrorMessage: "Ảnh chia sẻ tải lên không được vượt quá 8MB.",
  });
}

/**
 * Favicon giữ nguyên định dạng gốc thay vì chuyển sang WEBP: Google Search và
 * một số trình duyệt cũ không đọc được favicon WEBP nên biểu tượng sẽ biến mất.
 */
export async function saveFavicon(file: File) {
  if (!file.size) return null;

  let extension = faviconTypes.get(file.type);
  if (!extension && path.extname(file.name).toLowerCase() === ".ico") {
    extension = "ico";
  }

  if (!extension) {
    throw new Error("Favicon chỉ hỗ trợ PNG, WEBP hoặc ICO.");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Favicon tải lên không được vượt quá 2MB.");
  }

  await mkdir(uploadDirectory, { recursive: true });
  const filename = `favicon-${randomUUID()}.${extension}`;
  await writeFile(path.join(uploadDirectory, filename), Buffer.from(await file.arrayBuffer()));
  return `/api/uploads/seo/${filename}`;
}
