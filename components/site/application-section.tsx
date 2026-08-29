"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MessageCircle, Send } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const benefits = [
  "Cơ hội trở thành nhà sáng tạo hàng đầu trên TikTok",
  "Bứt phá thu nhập với lương cứng 10 - 50 triệu + hoa hồng tới 60% + thưởng nóng hấp dẫn.",
  "Xây dựng thương hiệu cá nhân bài bản theo lộ trình chuyên nghiệp riêng.",
  "Không gian làm việc đẳng cấp với hệ thống thiết bị livestream trị giá 10.000 USD.",
  "Kết nối và thăng tiến qua sự kiện offline, minishow và cơ hội lên báo lớn.",
];

const inputClasses =
  "mt-2 min-h-[40px] w-full rounded-md border border-[#d8c9da] bg-white px-3 text-[14px] text-[#2b1730] shadow-[inset_0_1px_2px_rgba(49,0,58,0.05)] outline-none transition placeholder:text-[#d8c6d9] placeholder:font-medium hover:border-[#e4a9df] focus:border-[#ed37d6] focus:ring-4 focus:ring-[#ed37d6]/15";

function normalizePhoneNumber(value: string) {
  const compact = value.trim().replace(/[\s.()-]/g, "");
  return /^84\d{9}$/.test(compact) ? `+${compact}` : compact;
}

function isValidVietnamesePhone(value: string) {
  return /^(?:0\d{9}|\+84\d{9})$/.test(normalizePhoneNumber(value));
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function readCookie(name: string) {
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!cookie) return "";

  try {
    return decodeURIComponent(cookie.slice(prefix.length));
  } catch {
    return cookie.slice(prefix.length);
  }
}

async function getPublicIp() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch("https://api.ipify.org?format=json", {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) return "";

    const data = (await response.json()) as { ip?: unknown };
    return typeof data.ip === "string" ? data.ip.trim() : "";
  } catch {
    return "";
  } finally {
    window.clearTimeout(timeout);
  }
}

async function collectTrackingData() {
  const searchParams = new URLSearchParams(window.location.search);
  const fbclid = searchParams.get("fbclid") ?? "";
  const cookieFbc = readCookie("_fbc");

  return {
    user_agent: navigator.userAgent,
    user_ip: await getPublicIp(),
    fbp: readCookie("_fbp"),
    fbc: cookieFbc || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : ""),
    fbclid,
    utm_source: searchParams.get("utm_source") ?? "",
    utm_medium: searchParams.get("utm_medium") ?? "",
    utm_campaign: searchParams.get("utm_campaign") ?? "",
    utm_term: searchParams.get("utm_term") ?? "",
    utm_content: searchParams.get("utm_content") ?? "",
    page_url: window.location.href,
    referrer: document.referrer,
  };
}

export function ApplicationSection() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const formStarted = useRef(false);

  function handleFormStart() {
    if (formStarted.current) return;
    formStarted.current = true;
    router.prefetch("/cam-on");
    trackEvent("form_start", { form_id: "dang-ky-npc" });
  }

  function validatePhone(value: string) {
    const error = value.trim()
      ? isValidVietnamesePhone(value)
        ? ""
        : "Số điện thoại chưa đúng. Vui lòng nhập 10 số bắt đầu bằng 0 hoặc mã +84."
      : "Vui lòng nhập số điện thoại.";

    setPhoneError(error);
    return !error;
  }

  function validateEmail(value: string) {
    const error = value.trim()
      ? isValidEmail(value)
        ? ""
        : "Email chưa đúng. Vui lòng nhập đầy đủ, ví dụ: ten@gmail.com."
      : "Vui lòng nhập email.";

    setEmailError(error);
    return !error;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const rawPhone = String(formData.get("phone") ?? "");
    const rawEmail = String(formData.get("email") ?? "");
    const phoneIsValid = validatePhone(rawPhone);
    const emailIsValid = validateEmail(rawEmail);

    if (!phoneIsValid || !emailIsValid) {
      const invalidField = form.elements.namedItem(phoneIsValid ? "email" : "phone");
      if (invalidField instanceof HTMLInputElement) invalidField.focus();
      trackEvent("form_error", {
        form_id: "dang-ky-npc",
        error_field: phoneIsValid ? "email" : "phone",
      });
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const trackingData = await collectTrackingData();
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: String(formData.get("full_name") ?? ""),
          phone: normalizePhoneNumber(rawPhone),
          email: rawEmail.trim(),
          social_profile: String(formData.get("social_profile") ?? ""),
          website: String(formData.get("website") ?? ""),
          ...trackingData,
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        field?: string;
        message?: string;
      } | null;

      if (!response.ok) {
        if (result?.field === "phone" || result?.field === "email") {
          if (result.field === "phone") {
            setPhoneError(result.message ?? "Số điện thoại chưa đúng.");
          }
          if (result.field === "email") {
            setEmailError(result.message ?? "Email chưa đúng.");
          }
          const invalidField = form.elements.namedItem(result.field);
          if (invalidField instanceof HTMLInputElement) invalidField.focus();
          setStatus("idle");
          return;
        }
        throw new Error(result?.message || "Không thể gửi hồ sơ lúc này.");
      }

      form.reset();
      trackEvent("generate_lead", {
        form_id: "dang-ky-npc",
        utm_source: trackingData.utm_source,
        utm_medium: trackingData.utm_medium,
        utm_campaign: trackingData.utm_campaign,
      });
      router.push("/cam-on");
    } catch (error) {
      trackEvent("form_error", { form_id: "dang-ky-npc", error_field: "submit" });
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
    }
  }

  return (
    <section
      className="relative isolate overflow-hidden border-t border-[#f13de2]/25 bg-[#210035] py-16 text-white sm:py-18 lg:min-h-[720px] lg:py-20"
      id="lien-he"
    >
      <div
        className="pointer-events-none absolute top-[-180px] left-[22%] -z-10 size-[420px] rounded-full bg-[#8b0aa0]/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[10%] bottom-[-180px] -z-10 size-[380px] rounded-full bg-[#d925c2]/10 blur-[110px]"
        aria-hidden="true"
      />

      <div className="mx-auto grid w-full max-w-[1280px] items-start gap-10 px-5 sm:px-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:gap-[46px]">
        <div>
          <span className="inline-flex items-center rounded-full bg-[#f22ad8] px-4 py-1.5 text-[12px] leading-none font-bold text-white shadow-[0_8px_20px_rgba(242,42,216,0.2)]">
            🔥 Tuyển dụng NPC Live
          </span>

          <h2 className="mt-7 text-[clamp(32px,4vw,48px)] leading-[1.04] font-bold tracking-[-0.045em] text-[#eddcff]">
            <span className="block">Gửi hồ sơ – TOPMUS liên</span>
            <span className="block">hệ bạn trong <span className="text-[#FFAEDE]">24–48h</span></span>
          </h2>

          <p className="mt-7 max-w-[560px] text-[14px] leading-[1.55] text-[#DFBDCF] sm:text-[16px]">
            Trở thành Nhà Sáng Tạo NPC Live tại TOPMUS đồng nghĩa bạn sẽ biến đam mê thành sự
            nghiệp vững chắc với hệ sinh thái hỗ trợ toàn diện.
          </p>

          <ul className="mt-10 grid gap-5">
            {benefits.map((benefit) => (
              <li
                className="flex max-w-[580px] items-center gap-4 text-[15px] leading-[1.45] text-[#EDDCFF]"
                key={benefit}
              >
                <Image
                  className="mt-[-2px] size-[22px] shrink-0 object-contain"
                  src="/img/icon-start.webp"
                  alt=""
                  width={32}
                  height={32}
                  aria-hidden="true"
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <a
            className="mt-10 flex min-h-[102px] max-w-[580px] items-center gap-5 rounded-[12px] border border-white/10 bg-[linear-gradient(105deg,rgba(72,22,83,0.78),rgba(53,13,68,0.8))] px-5 py-4 text-white no-underline shadow-[inset_0_1px_rgba(255,255,255,0.04),0_16px_36px_rgba(8,0,15,0.16)] transition hover:-translate-y-0.5 hover:border-[#f244de]/35 hover:bg-[#4e185a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f244de]"
            href="https://zalo.me/g/aceotd514"
            target="_blank"
            rel="noreferrer"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ed37db] text-white shadow-[0_8px_20px_rgba(237,55,219,0.3)]">
              <MessageCircle className="size-5" fill="currentColor" aria-hidden="true" />
            </span>
            <span>
              <strong className="block text-[18px] leading-[1.15] font-extrabold text-[#EDDCFF] sm:text-[20px]">
                Cộng đồng 2.000+ nhà sáng tạo tinh hoa
              </strong>
              <span className="mt-1.5 block text-[11px] font-bold text-[#D1BCFF]">
                Tham gia nhóm Zalo TOPMUS →
              </span>
            </span>
          </a>
        </div>

        <div className="rounded-[10px] border border-white/10 bg-[linear-gradient(155deg,rgba(78,25,88,0.78),rgba(71,20,78,0.7))] p-5 shadow-[0_24px_60px_rgba(9,0,18,0.2)] backdrop-blur-md sm:px-8 sm:py-12">
          <div className="text-center">
            <h2 className="text-[19px] leading-tight font-bold text-[#f1e5f4] sm:text-[24px]">
              Form ứng tuyển <span className="text-[#f02bd5]">NPC Live</span>
            </h2>
            <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-[1.45] text-[#c9afcb]">
              Dành cho ứng viên nữ từ 18 tuổi. Điền đúng SĐT có dùng Zalo để TOPMUS liên hệ bạn
              nhanh nhất.
            </p>
          </div>

          <form className="mt-7 grid gap-3.5" onSubmit={handleSubmit} onFocusCapture={handleFormStart}>
            <label className="text-[13px] font-bold text-[#eadced]">
              Họ và tên <span className="text-[#f053dd]">*</span>
              <input
                className={inputClasses}
                name="full_name"
                placeholder="VD: Nguyễn Minh Anh"
                autoComplete="name"
                maxLength={120}
                required
              />
            </label>

            <label className="text-[13px] mt-1 font-bold text-[#eadced]">
              Số điện thoại (liên kết Zalo) <span className="text-[#f053dd]">*</span>
              <input
                aria-describedby={phoneError ? "phone-help" : undefined}
                aria-invalid={Boolean(phoneError)}
                className={`${inputClasses} ${
                  phoneError
                    ? "border-[#ff6b87] bg-[#fff4f6] focus:border-[#ff6b87] focus:ring-[#ff6b87]/15"
                    : ""
                }`}
                name="phone"
                placeholder="VD: 0901234567"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={20}
                onBlur={(event) => validatePhone(event.currentTarget.value)}
                onChange={(event) => {
                  if (phoneError) validatePhone(event.currentTarget.value);
                }}
                required
              />
              {phoneError ? (
                <span className="mt-1.5 block text-[10px] font-medium text-[#ff9bac]" id="phone-help">
                  {phoneError}
                </span>
              ) : null}
            </label>

            <label className="text-[13px] mt-1 font-bold text-[#eadced]">
              Email <span className="text-[#f053dd]">*</span>
              <input
                aria-describedby={emailError ? "email-help" : undefined}
                aria-invalid={Boolean(emailError)}
                className={`${inputClasses} ${
                  emailError
                    ? "border-[#ff6b87] bg-[#fff4f6] focus:border-[#ff6b87] focus:ring-[#ff6b87]/15"
                    : ""
                }`}
                name="email"
                placeholder="VD: email@gmail.com"
                type="email"
                autoComplete="email"
                maxLength={180}
                onBlur={(event) => validateEmail(event.currentTarget.value)}
                onChange={(event) => {
                  if (emailError) validateEmail(event.currentTarget.value);
                }}
                required
              />
              {emailError ? (
                <span className="mt-1.5 block text-[10px] font-medium text-[#ff9bac]" id="email-help">
                  {emailError}
                </span>
              ) : null}
            </label>

            <label className="text-[13px] mt-1 font-bold text-[#eadced]">
              ID TikTok hoặc link Facebook <span className="text-[#f053dd]">*</span>
              <input
                className={inputClasses}
                name="social_profile"
                placeholder="VD: @tenkenh hoặc link trang cá nhân"
                autoComplete="url"
                maxLength={300}
                required
              />
            </label>

            <label className="absolute -left-[9999px]" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>

            <button
              className="mt-4 flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-[linear-gradient(90deg,#8520ec,#f12cd4)] px-5 text-[11px] font-bold text-white shadow-[0_10px_24px_rgba(184,31,216,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(211,39,213,0.34)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#fb7cec] disabled:cursor-wait disabled:opacity-65 disabled:hover:translate-y-0"
              disabled={status === "submitting"}
              type="submit"
            >
              <Send className="size-4" aria-hidden="true" />
              {status === "submitting" ? "Đang gửi hồ sơ..." : "Gửi hồ sơ ứng tuyển"}
            </button>

            {message ? (
              <p
                className="rounded-md border border-red-300/20 bg-red-300/10 px-3 py-2.5 text-center text-[10px] font-semibold text-red-200"
                role="status"
              >
                {message}
              </p>
            ) : null}

            <p className="mt-2 text-center text-[12px] leading-4 text-[#DFBDCF]">
              Khi gửi hồ sơ, bạn đồng ý với{" "}
              <a
                className="font-semibold text-[#FFAEDE] underline-offset-2 hover:underline"
                href="https://topmus.vn/chinh-sach-bao-mat-thong-tin/"
                target="_blank"
                rel="noreferrer"
              >
                Chính sách bảo mật
              </a>{" "}
              của TOPMUS.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
