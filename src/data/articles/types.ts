export const categories = ["System Design", "Cloud & Infrastructure", "Backend", "Database", "Leetcode", "DevOps"] as const;
export type Category = (typeof categories)[number];

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
