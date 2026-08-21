import "server-only";

import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { saveUploadedImage } from "@/lib/image-upload";
import { normalizeUploadPaths } from "@/lib/upload-path";

export type NpcModelCard = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
};

export type NpcModelContent = {
  eyebrow: string;
  heading: string;
  badge: string;
  ctaLabel: string;
  ctaHref: string;
  cards: NpcModelCard[];
};

const contentPath = path.join(process.cwd(), "data", "npc-model-section.json");

export async function getNpcModelContent(): Promise<NpcModelContent> {
  return normalizeUploadPaths(
    JSON.parse(await readFile(contentPath, "utf8")) as NpcModelContent,
  );
}

export async function saveNpcModelContent(content: NpcModelContent) {
  const tempPath = `${contentPath}.${randomUUID()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  await rename(tempPath, contentPath);
}

export function saveNpcModelImage(file: File, prefix: string) {
  return saveUploadedImage({ file, folder: "npc-model", prefix });
}
