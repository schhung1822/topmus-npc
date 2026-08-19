const ga4IdPattern = /\b(?:G|GT)-[A-Z0-9]{4,}\b/;
const universalIdPattern = /\bUA-\d{4,}-\d{1,4}\b/;
const tagManagerIdPattern = /\bGTM-[A-Z0-9]{4,}\b/;

/** Google không cho liên kết tới báo cáo bằng mã đo lường, nên chỉ mở trang tổng quan. */
export const analyticsHomeUrl = "https://analytics.google.com/analytics/web/";

/**
 * Nhận cả mã đo lường gõ tay lẫn đoạn mã gtag.js dán nguyên khối, để người quản trị
 * chỉ cần dán đúng thứ họ copy được từ Google Analytics.
 */
export function extractAnalyticsId(value: string) {
  const text = value.trim().toUpperCase();
  if (!text) return "";
  const match = ga4IdPattern.exec(text) ?? universalIdPattern.exec(text);
  return match ? match[0] : "";
}

export function isTagManagerId(value: string) {
  return tagManagerIdPattern.test(value.trim().toUpperCase());
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}
