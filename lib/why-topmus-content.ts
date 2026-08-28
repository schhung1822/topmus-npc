import "server-only";

import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { saveUploadedImage } from "@/lib/image-upload";
import { normalizeUploadPaths } from "@/lib/upload-path";

export type WhyTopmusSlide = {
  id: string;
  src: string;
  alt: string;
};

export type WhyTopmusContent = {
  creatorSlides: WhyTopmusSlide[];
  trainingSlides: WhyTopmusSlide[];
};

const contentPath = path.join(process.cwd(), "data", "why-topmus-section.json");

export async function getWhyTopmusContent(): Promise<WhyTopmusContent> {
  return normalizeUploadPaths(
    JSON.parse(await readFile(contentPath, "utf8")) as WhyTopmusContent,
  );
}

export async function saveWhyTopmusContent(content: WhyTopmusContent) {
  const tempPath = `${contentPath}.${randomUUID()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  await rename(tempPath, contentPath);
}

export function saveWhyTopmusImage(file: File, prefix: string) {
  return saveUploadedImage({ file, folder: "why-topmus", prefix });
}
