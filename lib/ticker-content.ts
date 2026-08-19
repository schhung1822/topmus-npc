import "server-only";

import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type TickerContent = {
  items: string[];
};

const contentPath = path.join(process.cwd(), "data", "ticker-content.json");

export async function getTickerContent(): Promise<TickerContent> {
  return JSON.parse(await readFile(contentPath, "utf8")) as TickerContent;
}

export async function saveTickerContent(content: TickerContent) {
  const tempPath = `${contentPath}.${randomUUID()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  await rename(tempPath, contentPath);
}
