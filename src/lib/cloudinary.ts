/**
 * Optimizes Cloudinary URLs on the fly by injecting f_auto (format auto, e.g. AVIF/WebP)
 * and q_auto (quality auto) transformations for optimal performance.
 * 
 * Safe for both Client and Server Components.
 */
export function getOptimizedImageUrl(url: string): string {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return url;
  }
  // Avoid double-injecting transformations
  if (url.includes("/image/upload/f_auto") || url.includes("/image/upload/q_auto")) {
    return url;
  }
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}
