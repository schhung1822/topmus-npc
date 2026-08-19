"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { resolveSelectedImage } from "@/lib/media-library";
import { saveNpcImage } from "@/lib/npc-content";
import {
  getNpcIntroContent,
  saveNpcIntroContent,
} from "@/lib/npc-intro-content";

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

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/npc-intro");
}

export async function updateNpcIntroAction(formData: FormData) {
  await requireAdmin();
  const content = await getNpcIntroContent();
  const bannerFile = formData.get("banner");
  const uploadedBanner =
    (bannerFile instanceof File ? await saveNpcImage(bannerFile, "intro-banner") : null) ||
    (await resolveSelectedImage(formData, "banner"));

  content.heading = requiredText(formData, "heading", "Tiêu đề");
  content.paragraphs = [
    requiredText(formData, "paragraph1", "Đoạn giới thiệu thứ nhất"),
    requiredText(formData, "paragraph2", "Đoạn giới thiệu thứ hai"),
  ];
  if (uploadedBanner) content.bannerImage = uploadedBanner;

  await saveNpcIntroContent(content);
  refresh();
  redirect("/admin/npc-intro?saved=section");
}

export async function addNpcIntroFeatureAction(formData: FormData) {
  await requireAdmin();
  const content = await getNpcIntroContent();
  content.features.push({
    id: randomUUID(),
    title: requiredText(formData, "title", "Tiêu đề"),
    description: requiredText(formData, "description", "Nội dung"),
  });
  await saveNpcIntroContent(content);
  refresh();
  redirect("/admin/npc-intro?saved=added");
}

export async function updateNpcIntroFeatureAction(formData: FormData) {
  await requireAdmin();
  const content = await getNpcIntroContent();
  const id = requiredText(formData, "id", "ID nội dung");
  const feature = content.features.find((item) => item.id === id);
  if (!feature) throw new Error("Không tìm thấy nội dung cần cập nhật.");
  feature.title = requiredText(formData, "title", "Tiêu đề");
  feature.description = requiredText(formData, "description", "Nội dung");
  await saveNpcIntroContent(content);
  refresh();
  redirect("/admin/npc-intro?saved=updated");
}

export async function deleteNpcIntroFeatureAction(formData: FormData) {
  await requireAdmin();
  const content = await getNpcIntroContent();
  const id = requiredText(formData, "id", "ID nội dung");
  content.features = content.features.filter((item) => item.id !== id);
  await saveNpcIntroContent(content);
  refresh();
  redirect("/admin/npc-intro?saved=deleted");
}
