import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "topmus_admin_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function hash(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEqual(left: string, right: string) {
  return timingSafeEqual(hash(left), hash(right));
}

function sessionSecret() {
  return process.env.TOPMUS_ADMIN_SESSION_SECRET;
}

function sign(payload: string) {
  const secret = sessionSecret();

  if (!secret) {
    return null;
  }

  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.TOPMUS_ADMIN_USERNAME;
  const expectedPassword = process.env.TOPMUS_ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return false;
  }

  const usernameMatches = safeEqual(username, expectedUsername);
  const passwordMatches = safeEqual(password, expectedPassword);

  return usernameMatches && passwordMatches;
}

export async function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = `admin.${expiresAt}`;
  const signature = sign(payload);

  if (!signature) {
    throw new Error("TOPMUS_ADMIN_SESSION_SECRET is not configured.");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
    priority: "high",
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function verifySessionToken(token?: string) {
  if (!token) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [role, expiresAtValue, providedSignature] = parts;
  const payload = `${role}.${expiresAtValue}`;
  const expectedSignature = sign(payload);
  const expiresAt = Number(expiresAtValue);

  if (
    role !== "admin" ||
    !expectedSignature ||
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= Math.floor(Date.now() / 1000)
  ) {
    return false;
  }

  return safeEqual(providedSignature, expectedSignature);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
