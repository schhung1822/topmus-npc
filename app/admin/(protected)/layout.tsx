import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
