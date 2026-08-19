"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { resolveSelectedImage } from "@/lib/media-library";
import {
  getNpcSectionContent,
  saveNpcImage,
  saveNpcSectionContent,
} from "@/lib/npc-content";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function requiredText(formData: FormData, name: string, label: string) {
  const value = text(formData, name);
  if (!value) throw new Error(`${label} không được để trống.`);
  return value;
}

function refreshNpcPages() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/npc");
}

export async function updateNpcSectionAction(formData: FormData) {
  await requireAdmin();
  const content = await getNpcSectionContent();
  const bannerFile = formData.get("banner");
  const bannerImage =
    (bannerFile instanceof File ? await saveNpcImage(bannerFile, "banner") : null) ||
    (await resolveSelectedImage(formData, "banner"));

  content.title = requiredText(formData, "title", "Tiêu đề");
  if (bannerImage) content.bannerImage = bannerImage;
  await saveNpcSectionContent(content);
  refreshNpcPages();
  redirect("/admin/npc?saved=section");
}

export async function addNpcAction(formData: FormData) {
  await requireAdmin();
  const content = await getNpcSectionContent();
  const categoryId = requiredText(formData, "categoryId", "Danh mục");
  if (!content.categories.some((category) => category.id === categoryId)) {
    throw new Error("Danh mục NPC không hợp lệ.");
  }

  const imageFile = formData.get("image");
  const uploadedImage =
    (imageFile instanceof File ? await saveNpcImage(imageFile, "creator") : null) ||
    (await resolveSelectedImage(formData, "image"));

  content.npcs.push({
    id: randomUUID(),
    name: requiredText(formData, "name", "Tên NPC"),
    categoryId,
    tag: requiredText(formData, "tag", "Vai trò"),
    liveTime: requiredText(formData, "liveTime", "Giờ live"),
    platform: text(formData, "platform") || "TikTok",
    contentType: text(formData, "contentType") || "Video",
    image: uploadedImage || content.bannerImage,
  });

  await saveNpcSectionContent(content);
  refreshNpcPages();
  redirect("/admin/npc?saved=added");
}

export async function updateNpcAction(formData: FormData) {
  await requireAdmin();
  const content = await getNpcSectionContent();
  const id = requiredText(formData, "id", "ID NPC");
  const npc = content.npcs.find((item) => item.id === id);
  if (!npc) throw new Error("Không tìm thấy NPC cần cập nhật.");

  const categoryId = requiredText(formData, "categoryId", "Danh mục");
  if (!content.categories.some((category) => category.id === categoryId)) {
    throw new Error("Danh mục NPC không hợp lệ.");
  }

  const imageFile = formData.get("image");
  const uploadedImage =
    (imageFile instanceof File ? await saveNpcImage(imageFile, "creator") : null) ||
    (await resolveSelectedImage(formData, "image"));

  npc.name = requiredText(formData, "name", "Tên NPC");
  npc.categoryId = categoryId;
  npc.tag = requiredText(formData, "tag", "Vai trò");
  npc.liveTime = requiredText(formData, "liveTime", "Giờ live");
  npc.platform = text(formData, "platform") || "TikTok";
  npc.contentType = text(formData, "contentType") || "Video";
  if (uploadedImage) npc.image = uploadedImage;

  await saveNpcSectionContent(content);
  refreshNpcPages();
  redirect("/admin/npc?saved=updated");
}

export async function deleteNpcAction(formData: FormData) {
  await requireAdmin();
  const content = await getNpcSectionContent();
  const id = requiredText(formData, "id", "ID NPC");
  content.npcs = content.npcs.filter((item) => item.id !== id);
  await saveNpcSectionContent(content);
  refreshNpcPages();
  redirect("/admin/npc?saved=deleted");
}
