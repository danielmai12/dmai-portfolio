import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pageLinks = [
  { name: "home", href: "/" },
  { name: "experience", href: "/experience" },
  { name: "projects", href: "/projects" },
  { name: "blog", href: "/blog" },
  { name: "contact", href: "/contact" },
];
