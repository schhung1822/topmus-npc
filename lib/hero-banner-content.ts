import "server-only";

import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { saveUploadedImage } from "@/lib/image-upload";
import { normalizeUploadPaths } from "@/lib/upload-path";

export type HeroBannerContent = {
  image: string;
  alt: string;
};

const contentPath = path.join(process.cwd(), "data", "hero-banner.json");

export async function getHeroBannerContent(): Promise<HeroBannerContent> {
  const rawContent = await readFile(contentPath, "utf8");
  return normalizeUploadPaths(JSON.parse(rawContent) as HeroBannerContent);
}

export async function saveHeroBannerContent(content: HeroBannerContent) {
  const tempPath = `${contentPath}.${randomUUID()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  await rename(tempPath, contentPath);
}

export function saveHeroBannerImage(file: File) {
  return saveUploadedImage({ file, folder: "hero-banner", prefix: "banner" });
}
