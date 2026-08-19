import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");

  return (
    <main className="grid min-h-screen bg-[#f9f3fb] p-0 lg:grid-cols-[minmax(430px,0.88fr)_minmax(540px,1.12fr)] lg:p-4">
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:min-h-0 lg:px-[clamp(42px,6vw,88px)]" aria-labelledby="login-title">
        <div className="w-full max-w-[430px]">
          <Link className="inline-flex w-[172px]" href="/" aria-label="TOPMUS - Trang chủ">
            <Image className="h-auto w-full object-contain" src="/img/logo_topmus.webp" alt="TOPMUS Entertainment" width={500} height={220} priority />
          </Link>

          <div className="mt-16">
            <p className="text-[10px] font-extrabold tracking-[0.15em] text-[#a12aaa] uppercase">Khu vực quản trị</p>
            <h1 className="mt-3 text-[clamp(34px,5vw,50px)] leading-[1.05] font-extrabold tracking-[-0.05em] text-[#32103e]" id="login-title">Chào mừng trở lại.</h1>
            <p className="mt-4 text-sm leading-6 text-[#827187] sm:text-base">Đăng nhập để quản lý nội dung LadiPage và dữ liệu khách hàng của TOPMUS.</p>
          </div>

          <div className="mt-9"><LoginForm /></div>

          <p className="mt-6 flex items-start gap-2 text-[11px] leading-5 text-[#9b8e9f]"><span className="mt-0.5 text-[#b12fb3]">◆</span>Phiên đăng nhập được bảo vệ và tự hết hạn sau 8 giờ.</p>
        </div>
      </section>

      <aside className="relative hidden min-h-[calc(100vh-32px)] overflow-hidden rounded-[28px] bg-[#39005b] bg-[image:url('/img/bg_sec2.webp')] bg-cover bg-center text-white lg:flex lg:items-end lg:p-[clamp(44px,6vw,80px)]" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(38,0,72,0.12),rgba(38,0,72,0.68))]" />
        <div className="absolute top-[12%] right-[10%] size-48 rounded-full border-[32px] border-white/8" />
        <div className="relative max-w-[600px]">
          <span className="inline-flex items-center gap-3 text-[11px] font-extrabold tracking-[0.13em] text-[#ff9aef] uppercase before:h-0.5 before:w-7 before:bg-current">TOPMUS Content Hub</span>
          <h2 className="mt-5 text-[clamp(38px,4vw,62px)] leading-[1.04] font-extrabold tracking-[-0.05em]">Nội dung rõ ràng.<br />Vận hành liền mạch.</h2>
          <p className="mt-5 max-w-[510px] text-sm leading-7 text-white/65">Trung tâm quản lý dành cho LadiPage TOPMUS — thuận tiện để cập nhật, theo dõi và sẵn sàng để phát triển.</p>
        </div>
      </aside>
    </main>
  );
}
