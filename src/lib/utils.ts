import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price value as UGX (Ugandan Shilling)
 * @param price - The price value to format
 * @returns Formatted price string (e.g., "UGX 50,000")
 */
export function formatPrice(price: number): string {
  return `UGX ${price.toLocaleString('en-US')}`;
}
