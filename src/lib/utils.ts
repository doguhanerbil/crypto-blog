import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the full URL for a Strapi media file.
 * @param url The relative URL from the Strapi API response.
 * @returns The absolute URL for the media file.
 */
export function getStrapiMedia(url: string | undefined | null): string | null {
  if (!url) {
    return null;
  }
  // If the URL is already absolute, return it as is.
  if (url.startsWith('http')) {
    return url;
  }
  // Otherwise, prepend the Strapi URL.
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
  return `${strapiUrl}${url}`;
}
