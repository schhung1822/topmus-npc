"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { resolveSelectedImage } from "@/lib/media-library";
import {
  getWhyTopmusContent,
  saveWhyTopmusContent,
  saveWhyTopmusImage,
  type WhyTopmusContent,
} from "@/lib/why-topmus-content";

type SliderKey = "creatorSlides" | "trainingSlides";

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

function sliderKey(formData: FormData): SliderKey {
  const value = text(formData, "slider");
  if (value !== "creatorSlides" && value !== "trainingSlides") {
    throw new Error("Slider không hợp lệ.");
  }
  return value;
}

function sliderLabel(key: SliderKey) {
  return key === "creatorSlides" ? "slider bên trái" : "slider bên phải";
}

function slidesFor(content: WhyTopmusContent, key: SliderKey) {
  return content[key];
}

function refreshWhyTopmusPages() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/why-topmus");
}

async function pickedImage(formData: FormData, key: SliderKey) {
  const file = formData.get("image");
  const prefix = key === "creatorSlides" ? "creator" : "training";
  const uploaded = file instanceof File ? await saveWhyTopmusImage(file, prefix) : null;
  return uploaded || (await resolveSelectedImage(formData, "image"));
}

export async function addWhyTopmusSlideAction(formData: FormData) {
  await requireAdmin();
  const content = await getWhyTopmusContent();
  const key = sliderKey(formData);
  const image = await pickedImage(formData, key);
  if (!image) throw new Error(`Hãy chọn ảnh cho ${sliderLabel(key)}.`);

  slidesFor(content, key).push({
    id: randomUUID(),
    src: image,
    alt: requiredText(formData, "alt", "Mô tả ảnh"),
  });

  await saveWhyTopmusContent(content);
  refreshWhyTopmusPages();
  redirect("/admin/why-topmus?saved=added");
}

export async function updateWhyTopmusSlideAction(formData: FormData) {
  await requireAdmin();
  const content = await getWhyTopmusContent();
  const key = sliderKey(formData);
  const id = requiredText(formData, "id", "ID ảnh");
  const slide = slidesFor(content, key).find((item) => item.id === id);
  if (!slide) throw new Error("Không tìm thấy ảnh cần cập nhật.");

  const image = await pickedImage(formData, key);
  slide.alt = requiredText(formData, "alt", "Mô tả ảnh");
  if (image) slide.src = image;

  await saveWhyTopmusContent(content);
  refreshWhyTopmusPages();
  redirect("/admin/why-topmus?saved=updated");
}

export async function deleteWhyTopmusSlideAction(formData: FormData) {
  await requireAdmin();
  const content = await getWhyTopmusContent();
  const key = sliderKey(formData);
  const slides = slidesFor(content, key);
  if (slides.length <= 1) {
    throw new Error(`Cần giữ lại ít nhất một ảnh trong ${sliderLabel(key)}.`);
  }

  const id = requiredText(formData, "id", "ID ảnh");
  content[key] = slides.filter((item) => item.id !== id);

  await saveWhyTopmusContent(content);
  refreshWhyTopmusPages();
  redirect("/admin/why-topmus?saved=deleted");
}

export async function moveWhyTopmusSlideAction(formData: FormData) {
  await requireAdmin();
  const content = await getWhyTopmusContent();
  const key = sliderKey(formData);
  const slides = slidesFor(content, key);
  const id = requiredText(formData, "id", "ID ảnh");
  const direction = text(formData, "direction");
  const currentIndex = slides.findIndex((item) => item.id === id);
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (currentIndex >= 0 && targetIndex >= 0 && targetIndex < slides.length) {
    [slides[currentIndex], slides[targetIndex]] = [slides[targetIndex], slides[currentIndex]];
    await saveWhyTopmusContent(content);
  }

  refreshWhyTopmusPages();
  redirect("/admin/why-topmus?saved=moved");
}
