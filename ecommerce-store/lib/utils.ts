import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price from cents to a currency string
 */
export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

/**
 * Generates a dynamic store URL based on store name
 * @param storeName - The name of the store (will be converted to subdomain format)
 * @param path - Optional path to append to the URL
 * @returns Formatted store URL
 */
export function getStoreUrl(storeName: string, path: string = '/'): string {
  // Convert store name to subdomain format (lowercase, replace spaces with hyphens)
  const subdomain = storeName.toLowerCase().replace(/\s+/g, '-');

  // Get base domain from environment variable or use default
  const baseDomain = process.env.NEXT_PUBLIC_STORE_DOMAIN || 'ecommercestore-online.vercel.app';

  // Ensure path starts with a slash
  const formattedPath = path.startsWith('/') ? path : `/${path}`;

  // Generate the full URL
  return `https://${subdomain}.${baseDomain}${formattedPath}`;
}
