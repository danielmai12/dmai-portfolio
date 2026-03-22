export { CATEGORY, categories, type Category, type Article } from "./types";

import { systemDesignArticles } from "./system-design";
import { cloudInfraArticles } from "./cloud-infrastructure";
import { backendArticles } from "./backend";
import { databaseArticles } from "./database";
import { leetcodeArticles } from "../leetcode/leetcode";
import { Article } from "./types";

export const articles: Article[] = [
  ...systemDesignArticles,
  ...cloudInfraArticles,
  ...backendArticles,
  ...databaseArticles,
  ...leetcodeArticles,
];
