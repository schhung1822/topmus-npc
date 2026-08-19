"use server";

import { redirect } from "next/navigation";
import {
  createAdminSession,
  deleteAdminSession,
  verifyAdminCredentials,
} from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu." };
  }

  if (!verifyAdminCredentials(username, password)) {
    return { error: "Tên đăng nhập hoặc mật khẩu không chính xác." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await deleteAdminSession();
  redirect("/admin/login");
}
