import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const pageLinks = [
  { name: "home", href: "/" },
  { name: "projects", href: "/projects" },
  { name: "work", href: "/work" },
  { name: "contact", href: "/contact" },
  { name: "blog", href: "/blog" },
];
