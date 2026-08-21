import "server-only";

import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { saveUploadedImage } from "@/lib/image-upload";
import { normalizeUploadPaths } from "@/lib/upload-path";

export type NpcCategory = {
  id: string;
  label: string;
  subtitle: string;
};

export type NpcProfile = {
  id: string;
  name: string;
  categoryId: string;
  tag: string;
  liveTime: string;
  platform: string;
  contentType: string;
  image: string;
};

export type NpcSectionContent = {
  title: string;
  bannerImage: string;
  categories: NpcCategory[];
  npcs: NpcProfile[];
};

const contentPath = path.join(process.cwd(), "data", "npc-section.json");

export async function getNpcSectionContent(): Promise<NpcSectionContent> {
  const rawContent = await readFile(contentPath, "utf8");
  return normalizeUploadPaths(JSON.parse(rawContent) as NpcSectionContent);
}

export async function saveNpcSectionContent(content: NpcSectionContent) {
  const tempPath = `${contentPath}.${randomUUID()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  await rename(tempPath, contentPath);
}

export function saveNpcImage(file: File, prefix: string) {
  return saveUploadedImage({ file, folder: "npc", prefix });
}
