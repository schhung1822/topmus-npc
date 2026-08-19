"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteMediaImage } from "@/lib/media-library";

export async function deleteMediaImageAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const publicPath = String(formData.get("path") ?? "").trim();
  if (!publicPath) throw new Error("Thiếu đường dẫn ảnh cần xóa.");

  await deleteMediaImage(publicPath);

  revalidatePath("/admin");
  revalidatePath("/admin/media");
  redirect("/admin/media?saved=deleted");
}
