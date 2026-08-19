import "server-only";

import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type NpcIntroFeature = {
  id: string;
  title: string;
  description: string;
};

export type NpcIntroContent = {
  heading: string;
  paragraphs: string[];
  bannerImage: string;
  features: NpcIntroFeature[];
};

const contentPath = path.join(process.cwd(), "data", "npc-intro-section.json");

export async function getNpcIntroContent(): Promise<NpcIntroContent> {
  return JSON.parse(await readFile(contentPath, "utf8")) as NpcIntroContent;
}

export async function saveNpcIntroContent(content: NpcIntroContent) {
  const tempPath = `${contentPath}.${randomUUID()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  await rename(tempPath, contentPath);
}
