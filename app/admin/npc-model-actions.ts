"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { resolveSelectedImage } from "@/lib/media-library";
import {
  getNpcModelContent,
  saveNpcModelContent,
  saveNpcModelImage,
} from "@/lib/npc-model-content";

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
  revalidatePath("/admin");
  revalidatePath("/admin/npc-model");
}

export async function updateNpcModelHeaderAction(formData: FormData) {
  await requireAdmin();
  const content = await getNpcModelContent();

  content.eyebrow = requiredText(formData, "eyebrow", "Dòng chữ nhỏ");
  content.heading = requiredText(formData, "heading", "Tiêu đề lớn");
  content.badge = requiredText(formData, "badge", "Nhãn tròn");
  content.ctaLabel = requiredText(formData, "ctaLabel", "Chữ trên nút");
  content.ctaHref = requiredText(formData, "ctaHref", "Liên kết nút");

  await saveNpcModelContent(content);
  refresh();
  redirect("/admin/npc-model?saved=header");
}

async function pickedImage(formData: FormData) {
  const file = formData.get("image");
  const uploaded = file instanceof File ? await saveNpcModelImage(file, "card") : null;
  return uploaded || (await resolveSelectedImage(formData, "image"));
}

export async function addNpcModelCardAction(formData: FormData) {
  await requireAdmin();
  const content = await getNpcModelContent();

  const uploadedImage = await pickedImage(formData);

  content.cards.push({
    id: randomUUID(),
    name: requiredText(formData, "name", "Tên thẻ"),
    tagline: requiredText(formData, "tagline", "Dòng mô tả ngắn"),
    description: requiredText(formData, "description", "Nội dung mặt sau"),
    image: uploadedImage || "/img/banner_sec2.webp",
  });

  await saveNpcModelContent(content);
  refresh();
  redirect("/admin/npc-model?saved=added");
}

export async function updateNpcModelCardAction(formData: FormData) {
  await requireAdmin();
  const content = await getNpcModelContent();
  const id = requiredText(formData, "id", "ID thẻ");
  const card = content.cards.find((item) => item.id === id);
  if (!card) throw new Error("Không tìm thấy thẻ cần cập nhật.");

  const uploadedImage = await pickedImage(formData);

  card.name = requiredText(formData, "name", "Tên thẻ");
  card.tagline = requiredText(formData, "tagline", "Dòng mô tả ngắn");
  card.description = requiredText(formData, "description", "Nội dung mặt sau");
  if (uploadedImage) card.image = uploadedImage;

  await saveNpcModelContent(content);
  refresh();
  redirect("/admin/npc-model?saved=updated");
}

export async function deleteNpcModelCardAction(formData: FormData) {
  await requireAdmin();
  const content = await getNpcModelContent();
  const id = requiredText(formData, "id", "ID thẻ");
  content.cards = content.cards.filter((item) => item.id !== id);
  await saveNpcModelContent(content);
  refresh();
  redirect("/admin/npc-model?saved=deleted");
}
