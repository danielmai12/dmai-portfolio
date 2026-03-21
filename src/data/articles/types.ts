export const CATEGORY = {
  SYSTEM_DESIGN: "System Design",
  CLOUD_INFRA: "Cloud & Infrastructure",
  BACKEND: "Backend",
  DATABASE: "Database",
  LEETCODE: "Leetcode",
} as const;

export const categories = Object.values(CATEGORY);
export type Category = (typeof CATEGORY)[keyof typeof CATEGORY];

export interface Article {
  slug: string;
  title: string;
  date: string;
  category: Category;
  summary: string;
  readingTime: string;
  content: string;
  /** If set, render a custom interactive component instead of markdown */
  interactive?: boolean;
}
