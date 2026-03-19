export { categories, type Category, type Article } from "./types";

import { systemDesignArticles } from "./system-design";
import { backendArticles } from "./backend";
import { databaseArticles } from "./database";
import { leetcodeArticles } from "./leetcode";
import { devopsArticles } from "./devops";
import { Article } from "./types";

export const articles: Article[] = [
  ...systemDesignArticles,
  ...backendArticles,
  ...databaseArticles,
  ...leetcodeArticles,
  ...devopsArticles,
];
