import "server-only";

import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { saveUploadedImage } from "@/lib/image-upload";
import { normalizeUploadPaths } from "@/lib/upload-path";

export type TrainingStep = {
  id: string;
  day: string;
  title: string;
  description: string;
  image: string;
};

export type SevenDayTrainingContent = {
  headingHighlight: string;
  headingSuffix: string;
  headingBadge: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage: string;
  steps: TrainingStep[];
};

const contentPath = path.join(process.cwd(), "data", "seven-day-training-section.json");

export async function getSevenDayTrainingContent(): Promise<SevenDayTrainingContent> {
  return normalizeUploadPaths(
    JSON.parse(await readFile(contentPath, "utf8")) as SevenDayTrainingContent,
  );
}

export async function saveSevenDayTrainingContent(content: SevenDayTrainingContent) {
  const tempPath = `${contentPath}.${randomUUID()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  await rename(tempPath, contentPath);
}

export function saveSevenDayTrainingImage(file: File, prefix: string) {
  return saveUploadedImage({ file, folder: "seven-day-training", prefix });
}
