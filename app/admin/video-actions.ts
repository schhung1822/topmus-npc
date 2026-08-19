"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { resolveSelectedImage } from "@/lib/media-library";
import {
  extractYouTubeVideoId,
  getVideoSectionContent,
  saveVideoSectionContent,
  saveVideoThumbnail,
} from "@/lib/video-content";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

function text(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
}

function requiredText(formData: FormData, field: string, label: string) {
  const value = text(formData, field);
  if (!value) throw new Error(`${label} không được để trống.`);
  return value;
}

function parseYouTubeUrl(formData: FormData) {
  const youtubeUrl = requiredText(formData, "youtubeUrl", "URL YouTube Shorts");
  const youtubeId = extractYouTubeVideoId(youtubeUrl);
  if (!youtubeId) {
    throw new Error("URL YouTube không hợp lệ. Hãy dùng URL Shorts, Watch hoặc youtu.be.");
  }
  return { youtubeId, youtubeUrl: `https://www.youtube.com/shorts/${youtubeId}` };
}

/** Ưu tiên file mới tải lên, nếu không có thì dùng ảnh chọn lại từ thư viện. */
async function uploadedThumbnail(formData: FormData) {
  const file = formData.get("thumbnail");
  const uploaded = file instanceof File ? await saveVideoThumbnail(file) : null;
  return uploaded || (await resolveSelectedImage(formData, "thumbnail"));
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/videos");
}

export async function updateVideoSectionAction(formData: FormData) {
  await requireAdmin();
  const content = await getVideoSectionContent();
  content.heading = requiredText(formData, "heading", "Tiêu đề section");
  content.subtitle = requiredText(formData, "subtitle", "Mô tả section");
  await saveVideoSectionContent(content);
  refresh();
  redirect("/admin/videos?saved=section");
}

export async function addVideoAction(formData: FormData) {
  await requireAdmin();
  const content = await getVideoSectionContent();
  const youtube = parseYouTubeUrl(formData);
  content.videos.push({
    id: randomUUID(),
    ...youtube,
    title: requiredText(formData, "title", "Tên video"),
    label: text(formData, "label") || "YouTube Shorts",
    thumbnail: (await uploadedThumbnail(formData)) || "",
  });
  await saveVideoSectionContent(content);
  refresh();
  redirect("/admin/videos?saved=added");
}

export async function updateVideoAction(formData: FormData) {
  await requireAdmin();
  const content = await getVideoSectionContent();
  const id = requiredText(formData, "id", "ID video");
  const video = content.videos.find((item) => item.id === id);
  if (!video) throw new Error("Không tìm thấy video cần cập nhật.");
  const youtube = parseYouTubeUrl(formData);
  const thumbnail = await uploadedThumbnail(formData);
  const useYouTubeThumbnail = text(formData, "useYouTubeThumbnail") === "on";

  Object.assign(video, youtube, {
    title: requiredText(formData, "title", "Tên video"),
    label: text(formData, "label") || "YouTube Shorts",
    thumbnail: useYouTubeThumbnail ? "" : thumbnail || video.thumbnail,
  });
  await saveVideoSectionContent(content);
  refresh();
  redirect("/admin/videos?saved=updated");
}

export async function deleteVideoAction(formData: FormData) {
  await requireAdmin();
  const content = await getVideoSectionContent();
  const id = requiredText(formData, "id", "ID video");
  content.videos = content.videos.filter((item) => item.id !== id);
  await saveVideoSectionContent(content);
  refresh();
  redirect("/admin/videos?saved=deleted");
}

export async function moveVideoAction(formData: FormData) {
  await requireAdmin();
  const content = await getVideoSectionContent();
  const id = requiredText(formData, "id", "ID video");
  const direction = text(formData, "direction");
  const currentIndex = content.videos.findIndex((item) => item.id === id);
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (currentIndex >= 0 && targetIndex >= 0 && targetIndex < content.videos.length) {
    [content.videos[currentIndex], content.videos[targetIndex]] = [
      content.videos[targetIndex],
      content.videos[currentIndex],
    ];
    await saveVideoSectionContent(content);
  }
  refresh();
  redirect("/admin/videos?saved=moved");
}
