import "server-only";

import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { saveUploadedImage } from "@/lib/image-upload";

export type HighlightVideo = {
  id: string;
  youtubeId: string;
  youtubeUrl: string;
  title: string;
  label: string;
  /** Ảnh đại diện tự tải lên. Để trống thì dùng thumbnail mặc định của YouTube. */
  thumbnail: string;
};

export type VideoSectionContent = {
  heading: string;
  subtitle: string;
  videos: HighlightVideo[];
};

const contentPath = path.join(process.cwd(), "data", "video-section.json");
const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;

export function extractYouTubeVideoId(input: string) {
  const value = input.trim();
  if (youtubeIdPattern.test(value)) return value;

  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, "");
    let candidate = "";

    if (hostname === "youtu.be") {
      candidate = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/")) {
        candidate = url.pathname.split("/").filter(Boolean)[1] ?? "";
      } else {
        candidate = url.searchParams.get("v") ?? "";
      }
    }

    return youtubeIdPattern.test(candidate) ? candidate : null;
  } catch {
    return null;
  }
}

export async function getVideoSectionContent(): Promise<VideoSectionContent> {
  const content = JSON.parse(await readFile(contentPath, "utf8")) as VideoSectionContent;

  return {
    ...content,
    videos: content.videos.map((video) => ({
      ...video,
      thumbnail: typeof video.thumbnail === "string" ? video.thumbnail : "",
    })),
  };
}

export function saveVideoThumbnail(file: File) {
  return saveUploadedImage({
    file,
    folder: "videos",
    prefix: "thumbnail",
    typeErrorMessage: "Thumbnail chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.",
    sizeErrorMessage: "Thumbnail tải lên không được vượt quá 8MB.",
  });
}

export async function saveVideoSectionContent(content: VideoSectionContent) {
  const tempPath = `${contentPath}.${randomUUID()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  await rename(tempPath, contentPath);
}
