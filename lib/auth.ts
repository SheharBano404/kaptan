/**
 * Tiny stateless admin session: an HMAC-SHA256 signed token stored in an
 * httpOnly cookie. Uses Web Crypto (globalThis.crypto.subtle) so the same
 * code runs in both the Node.js API routes and the Edge middleware.
 */

export const SESSION_COOKIE = "kl_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return process.env.SESSION_SECRET || "kaptan-dev-secret";
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = "";
  for (const b of arr) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toBase64Url(sig);
}

export async function createSessionToken(): Promise<string> {
  const payload = `admin.${Date.now()}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, ts, sig] = parts;
  if (role !== "admin") return false;
  const payload = `${role}.${ts}`;
  const expected = await hmac(payload);
  // constant-time-ish compare
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return false;
  const issued = Number(ts);
  if (!Number.isFinite(issued)) return false;
  return Date.now() - issued < SESSION_TTL_MS;
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "kaptan2025";
  return password === expected;
}

export const sessionMaxAge = SESSION_TTL_MS / 1000;
