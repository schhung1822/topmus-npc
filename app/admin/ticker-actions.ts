"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { saveTickerContent } from "@/lib/ticker-content";

const MAX_ITEMS = 12;
const MAX_ITEM_LENGTH = 100;

export async function updateTickerContentAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const items = String(formData.get("items") ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!items.length) throw new Error("Cần có ít nhất một nội dung chữ chạy.");
  if (items.length > MAX_ITEMS) {
    throw new Error(`Chỉ được nhập tối đa ${MAX_ITEMS} nội dung chữ chạy.`);
  }
  if (items.some((item) => item.length > MAX_ITEM_LENGTH)) {
    throw new Error(`Mỗi nội dung không được vượt quá ${MAX_ITEM_LENGTH} ký tự.`);
  }

  await saveTickerContent({ items });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/ticker");
  redirect("/admin/ticker?saved=1");
}
