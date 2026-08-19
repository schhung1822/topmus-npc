"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { extractAnalyticsId, isTagManagerId } from "@/lib/analytics";
import { isAdminAuthenticated } from "@/lib/auth";
import { resolveSelectedImage } from "@/lib/media-library";
import {
  getSeoSettings,
  saveFavicon,
  saveSeoSettings,
  saveSocialImage,
} from "@/lib/seo-settings";

function requiredText(formData: FormData, field: string, label: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`${label} không được để trống.`);
  return value;
}

function normalizeSiteUrl(value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("Địa chỉ website không hợp lệ.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Địa chỉ website phải bắt đầu bằng http:// hoặc https://.");
  }

  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url.toString();
}

function normalizeAnalyticsId(value: string) {
  const raw = value.trim();
  if (!raw) return "";

  const analyticsId = extractAnalyticsId(raw);
  if (analyticsId) return analyticsId;

  if (isTagManagerId(raw)) {
    throw new Error(
      "Đây là mã Google Tag Manager (GTM-...). Vui lòng nhập mã đo lường Google Analytics dạng G-XXXXXXXXXX.",
    );
  }

  throw new Error(
    "Mã Google Analytics không hợp lệ. Hãy nhập mã đo lường dạng G-XXXXXXXXXX (GA4) hoặc UA-XXXXXXX-X.",
  );
}

export async function updateSeoSettingsAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const settings = await getSeoSettings();
  const siteName = requiredText(formData, "siteName", "Tên website");
  const title = requiredText(formData, "title", "Tiêu đề SEO");
  const description = requiredText(formData, "description", "Mô tả SEO");
  const socialImageAlt = requiredText(formData, "socialImageAlt", "Mô tả ảnh chia sẻ");
  const siteUrl = normalizeSiteUrl(requiredText(formData, "siteUrl", "Địa chỉ website"));
  const googleAnalyticsId = normalizeAnalyticsId(String(formData.get("googleAnalyticsId") ?? ""));
  const keywords = String(formData.get("keywords") ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 20);

  if (siteName.length > 80) throw new Error("Tên website không được vượt quá 80 ký tự.");
  if (title.length > 70) throw new Error("Tiêu đề SEO không được vượt quá 70 ký tự.");
  if (description.length > 180) throw new Error("Mô tả SEO không được vượt quá 180 ký tự.");
  if (socialImageAlt.length > 180) throw new Error("Mô tả ảnh không được vượt quá 180 ký tự.");

  const socialImageFile = formData.get("socialImage");
  const faviconFile = formData.get("favicon");
  const uploadedSocialImage =
    (socialImageFile instanceof File ? await saveSocialImage(socialImageFile) : null) ||
    (await resolveSelectedImage(formData, "socialImage"));
  const uploadedFavicon = faviconFile instanceof File ? await saveFavicon(faviconFile) : null;

  await saveSeoSettings({
    ...settings,
    siteName,
    title,
    description,
    keywords,
    siteUrl,
    socialImage: uploadedSocialImage || settings.socialImage,
    socialImageAlt,
    favicon: uploadedFavicon || settings.favicon,
    googleAnalyticsId,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/", "layout");
  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/admin/seo");
  redirect("/admin/seo?saved=1");
}
