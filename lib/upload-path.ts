import "server-only";

import path from "node:path";

const legacyUploadPrefix = "/uploads/";
const servedUploadPrefix = "/api/uploads/";

export const uploadsRoot = path.resolve(process.cwd(), "public", "uploads");

/** Chuyển đường dẫn upload cũ sang endpoint động, không phụ thuộc static files của Next/Nginx. */
export function toServedUploadPath(value: string) {
  if (value.startsWith(legacyUploadPrefix)) {
    return `${servedUploadPrefix}${value.slice(legacyUploadPrefix.length)}`;
  }

  return value;
}

/** Chuẩn hóa mọi URL upload trong dữ liệu JSON, kể cả dữ liệu cũ đang lưu trên VPS. */
export function normalizeUploadPaths<T>(value: T): T {
  if (typeof value === "string") {
    return toServedUploadPath(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeUploadPaths(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeUploadPaths(item)]),
    ) as T;
  }

  return value;
}

/** Ánh xạ URL công khai về đúng file trong public/uploads và chặn path traversal. */
export function resolveUploadFilePath(publicPath: string) {
  const normalizedPublicPath = toServedUploadPath(publicPath);
  if (!normalizedPublicPath.startsWith(servedUploadPrefix)) return null;

  const relativePath = normalizedPublicPath.slice(servedUploadPrefix.length);
  const segments = relativePath.split("/");
  if (!segments.length || segments.some((segment) => !segment || segment === "." || segment === "..")) {
    return null;
  }

  const absolutePath = path.resolve(uploadsRoot, ...segments);
  if (!absolutePath.startsWith(`${uploadsRoot}${path.sep}`)) return null;

  return absolutePath;
}
