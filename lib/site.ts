const FALLBACK_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const candidate =
    configured ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : FALLBACK_SITE_URL);

  try {
    return new URL(candidate).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function absoluteImageUrl(image: string): string {
  if (/^https?:\/\//i.test(image)) return image;
  return `${getSiteUrl()}${image.startsWith("/") ? "" : "/"}${image}`;
}
