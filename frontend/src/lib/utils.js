export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// You'll also need these dependencies:
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge" 