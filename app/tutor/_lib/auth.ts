// Shared auth helpers for the /tutor gate.
// A single shared password (TUTOR_PASSWORD) protects the course tutors.
// On login we set an httpOnly cookie whose value is an HMAC of the password,
// so it cannot be forged without the secret and rotates if the password changes.
// Uses Web Crypto so it works in both the Edge middleware and Node route handlers.

export const TUTOR_COOKIE = "tutor_auth";

const encoder = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Deterministic token derived from the shared password. */
export async function computeToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode("tutor-gate-v1"));
  return toHex(sig);
}

/** The token a valid cookie must carry, derived from the configured password. */
export async function expectedToken(): Promise<string | null> {
  const password = process.env.TUTOR_PASSWORD;
  if (!password) return null;
  return computeToken(password);
}

/** Constant-time-ish comparison. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
