/**
 * Strips Mongo/Mongoose internals and server-only fields from CMS PUT payloads.
 */
export function sanitizeContentBody(body: unknown): Record<string, unknown> {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return {};
  }

  const raw = body as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  for (const key of Object.keys(raw)) {
    if (key === "_id" || key === "__v" || key === "id") continue;
    if (key === "admin") continue;
    if (key === "__proto__" || key === "constructor" || key === "prototype")
      continue;
    out[key] = raw[key];
  }

  return out;
}
