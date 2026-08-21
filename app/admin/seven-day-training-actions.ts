"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { resolveSelectedImage } from "@/lib/media-library";
import {
  getSevenDayTrainingContent,
  saveSevenDayTrainingContent,
  saveSevenDayTrainingImage,
} from "@/lib/seven-day-training-content";

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

/** Ưu tiên file mới tải lên, nếu không có thì dùng ảnh chọn lại từ thư viện. */
async function uploadedImage(formData: FormData, field: string, prefix: string) {
  const file = formData.get(field);
  const uploaded = file instanceof File ? await saveSevenDayTrainingImage(file, prefix) : null;
  return uploaded || (await resolveSelectedImage(formData, field));
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/seven-day-training");
}

export async function updateTrainingHeaderAction(formData: FormData) {
  await requireAdmin();
  const content = await getSevenDayTrainingContent();

  content.headingHighlight = requiredText(formData, "headingHighlight", "Tiêu đề lớn");
  content.headingSuffix = requiredText(formData, "headingSuffix", "Chữ bên phải tiêu đề");
  content.headingBadge = requiredText(formData, "headingBadge", "Nhãn hồng");
  content.intro = requiredText(formData, "intro", "Đoạn mô tả");
  content.ctaLabel = requiredText(formData, "ctaLabel", "Chữ trên nút");
  content.ctaHref = requiredText(formData, "ctaHref", "Liên kết nút");

  await saveSevenDayTrainingContent(content);
  refresh();
  redirect("/admin/seven-day-training?saved=header");
}

export async function updateTrainingBackgroundAction(formData: FormData) {
  await requireAdmin();
  const content = await getSevenDayTrainingContent();

  const background = await uploadedImage(formData, "backgroundImage", "background");
  if (background) content.backgroundImage = background;

  await saveSevenDayTrainingContent(content);
  refresh();
  redirect("/admin/seven-day-training?saved=background");
}

export async function addTrainingStepAction(formData: FormData) {
  await requireAdmin();
  const content = await getSevenDayTrainingContent();
  const image = await uploadedImage(formData, "image", "step");

  content.steps.push({
    id: randomUUID(),
    day: requiredText(formData, "day", "Số ngày"),
    title: requiredText(formData, "title", "Tiêu đề bước"),
    description: requiredText(formData, "description", "Nội dung bước"),
    image: image || "/img/banner_sec2.webp",
  });

  await saveSevenDayTrainingContent(content);
  refresh();
  redirect("/admin/seven-day-training?saved=added");
}

export async function updateTrainingStepAction(formData: FormData) {
  await requireAdmin();
  const content = await getSevenDayTrainingContent();
  const id = requiredText(formData, "id", "ID bước");
  const step = content.steps.find((item) => item.id === id);
  if (!step) throw new Error("Không tìm thấy bước cần cập nhật.");

  const image = await uploadedImage(formData, "image", "step");

  step.day = requiredText(formData, "day", "Số ngày");
  step.title = requiredText(formData, "title", "Tiêu đề bước");
  step.description = requiredText(formData, "description", "Nội dung bước");
  if (image) step.image = image;

  await saveSevenDayTrainingContent(content);
  refresh();
  redirect("/admin/seven-day-training?saved=updated");
}

export async function deleteTrainingStepAction(formData: FormData) {
  await requireAdmin();
  const content = await getSevenDayTrainingContent();
  const id = requiredText(formData, "id", "ID bước");

  if (content.steps.length <= 1) {
    throw new Error("Cần giữ lại ít nhất một bước trong lộ trình.");
  }

  content.steps = content.steps.filter((item) => item.id !== id);
  await saveSevenDayTrainingContent(content);
  refresh();
  redirect("/admin/seven-day-training?saved=deleted");
}

export async function moveTrainingStepAction(formData: FormData) {
  await requireAdmin();
  const content = await getSevenDayTrainingContent();
  const id = requiredText(formData, "id", "ID bước");
  const direction = text(formData, "direction");
  const currentIndex = content.steps.findIndex((item) => item.id === id);
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (currentIndex >= 0 && targetIndex >= 0 && targetIndex < content.steps.length) {
    [content.steps[currentIndex], content.steps[targetIndex]] = [
      content.steps[targetIndex],
      content.steps[currentIndex],
    ];
    await saveSevenDayTrainingContent(content);
  }

  refresh();
  redirect("/admin/seven-day-training?saved=moved");
}
