import { createHash, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { getAdminSessionSecret } from "@/lib/adminSession";

function hashToken(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/** Constant-time comparison of session cookie to configured secret. */
export function isAdminSessionValid(request: NextRequest): boolean {
  const secret = getAdminSessionSecret();
  if (!secret) return false;
  const session = request.cookies.get("admin_session")?.value;
  if (!session) return false;
  try {
    const a = hashToken(session);
    const b = hashToken(secret);
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
