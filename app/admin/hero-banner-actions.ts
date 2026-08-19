"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { resolveSelectedImage } from "@/lib/media-library";
import {
  getHeroBannerContent,
  saveHeroBannerContent,
  saveHeroBannerImage,
} from "@/lib/hero-banner-content";

export async function updateHeroBannerAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const content = await getHeroBannerContent();
  const alt = String(formData.get("alt") ?? "").trim();
  const imageFile = formData.get("image");
  const uploadedImage = imageFile instanceof File ? await saveHeroBannerImage(imageFile) : null;
  const image = uploadedImage || (await resolveSelectedImage(formData, "image"));

  if (!alt) throw new Error("Mô tả ảnh không được để trống.");

  content.alt = alt;
  if (image) content.image = image;

  await saveHeroBannerContent(content);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/hero-banner");
  redirect("/admin/hero-banner?saved=1");
}
