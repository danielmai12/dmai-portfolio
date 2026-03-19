import { Article } from "./types";

export const leetcodeArticles: Article[] = [
  //   {
  //     slug: "two-sum-patterns",
  //     title: "Two Sum and Hash Map Patterns",
  //     date: "Mar 19, 2026",
  //     category: "Leetcode",
  //     summary:
  //       "Breaking down the classic Two Sum problem and how hash map lookups generalize to a family of interview patterns.",
  //     readingTime: "5 min read",
  //     content: `## Two Sum and Hash Map Patterns
  // The Two Sum problem is often the first leetcode problem people encounter, but the underlying pattern — trading space for time with a hash map — shows up everywhere.
  // ### The Brute Force
  // \`\`\`python
  // def twoSum(nums, target):
  //     for i in range(len(nums)):
  //         for j in range(i + 1, len(nums)):
  //             if nums[i] + nums[j] == target:
  //                 return [i, j]
  // \`\`\`
  // **Time:** O(n²) — nested loops scanning every pair.
  // ### The Hash Map Approach
  // \`\`\`python
  // def twoSum(nums, target):
  //     seen = {}
  //     for i, num in enumerate(nums):
  //         complement = target - num
  //         if complement in seen:
  //             return [seen[complement], i]
  //         seen[num] = i
  // \`\`\`
  // **Time:** O(n) — single pass with O(1) lookups.
  // ### Where This Pattern Recurs
  // - **Three Sum / Four Sum** — sort + two pointers, or reduce to Two Sum.
  // - **Subarray Sum Equals K** — prefix sums stored in a hash map.
  // - **Longest Substring Without Repeating Characters** — sliding window with a hash set.
  // The core idea: if you need to find a complement or check existence in O(1), reach for a hash map.`,
  //   },
];
