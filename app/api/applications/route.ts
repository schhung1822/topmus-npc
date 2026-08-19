import { isIP } from "node:net";

const WEBHOOK_URL =
  process.env.APPLICATION_WEBHOOK_URL ??
  "https://nextg.nextgency.vn/webhook/topmus/data-ladi";

const MAX_BODY_SIZE = 32_000;

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizePhoneNumber(value: string) {
  const compact = value.trim().replace(/[\s.()-]/g, "");
  return /^84\d{9}$/.test(compact) ? `+${compact}` : compact;
}

function isValidVietnamesePhone(value: string) {
  return /^(?:0\d{9}|\+84\d{9})$/.test(value);
}

function cookieValue(cookieHeader: string, name: string) {
  const prefix = `${name}=`;
  const cookie = cookieHeader
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

function clientIp(headers: Headers) {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    ""
  );
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_SIZE) {
      return Response.json({ message: "Dữ liệu gửi lên quá lớn." }, { status: 413 });
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_SIZE) {
      return Response.json({ message: "Dữ liệu gửi lên quá lớn." }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      return Response.json({ message: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
    }
    const fullName = text(body.full_name, 120);
    const phone = normalizePhoneNumber(text(body.phone, 20));
    const email = text(body.email, 180).toLowerCase();
    const socialProfile = text(body.social_profile, 300);

    if (text(body.website, 200)) {
      return Response.json({ ok: true });
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!fullName) {
      return Response.json(
        { field: "full_name", message: "Vui lòng nhập họ và tên." },
        { status: 400 },
      );
    }

    if (!isValidVietnamesePhone(phone)) {
      return Response.json(
        {
          field: "phone",
          message: "Số điện thoại chưa đúng. Vui lòng nhập 10 số bắt đầu bằng 0 hoặc mã +84.",
        },
        { status: 400 },
      );
    }

    if (!validEmail) {
      return Response.json(
        { field: "email", message: "Email chưa đúng. Vui lòng nhập đầy đủ, ví dụ: ten@gmail.com." },
        { status: 400 },
      );
    }

    if (!socialProfile) {
      return Response.json(
        { field: "social_profile", message: "Vui lòng nhập ID TikTok hoặc link Facebook." },
        { status: 400 },
      );
    }

    const cookieHeader = request.headers.get("cookie") ?? "";
    const ipifyIp = text(body.user_ip, 64);
    const payload = {
      form_name: "TOPMUS NPC Live Application",
      full_name: fullName,
      phone,
      email,
      social_profile: socialProfile,
      user_agent: request.headers.get("user-agent") || text(body.user_agent, 500),
      user_ip: isIP(ipifyIp) ? ipifyIp : clientIp(request.headers),
      fbp: cookieValue(cookieHeader, "_fbp") || text(body.fbp, 300),
      fbc: cookieValue(cookieHeader, "_fbc") || text(body.fbc, 500),
      fbclid: text(body.fbclid, 500),
      utm_source: text(body.utm_source, 300),
      utm_medium: text(body.utm_medium, 300),
      utm_campaign: text(body.utm_campaign, 300),
      utm_term: text(body.utm_term, 300),
      utm_content: text(body.utm_content, 300),
      page_url: text(body.page_url, 1_000),
      referrer: text(body.referrer, 1_000),
      submitted_at: new Date().toISOString(),
    };

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });

    if (!webhookResponse.ok) {
      console.error("Application webhook failed", webhookResponse.status);
      return Response.json(
        { message: "Hệ thống đang bận, vui lòng thử lại sau ít phút." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Application submission failed", error);
    return Response.json(
      { message: "Không thể gửi hồ sơ lúc này. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}
