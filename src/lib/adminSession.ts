/**
 * Admin session cookie value must match this secret. In production, ADMIN_SESSION_TOKEN is required.
 */
export function getAdminSessionSecret(): string | null {
  const fromEnv = process.env.ADMIN_SESSION_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") return null;
  return "secure_admin_logged_in_default_token";
}

export function isAdminConfigured(): boolean {
  return getAdminSessionSecret() !== null;
}
