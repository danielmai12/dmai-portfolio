export interface LeetcodeProblem {
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface LeetcodeTopic {
  order: number;
  title: string;
  slug: string;
  overview: string;
  problems: LeetcodeProblem[];
}

export const leetcodeTopics: LeetcodeTopic[] = [
  {
    order: 1,
    title: "Two Pointers",
    slug: "two-pointers",
    overview:
      "Uses two references that move through a sorted or structured input to find pairs or partitions in linear time. By advancing pointers based on conditions, you avoid nested loops and reduce O(n²) brute-force to O(n).",
    problems: [
      {
        title: "Valid Palindrome",
        slug: "valid-palindrome",
        difficulty: "Easy",
      },
    ],
  },
  {
    order: 2,
    title: "Sliding Window",
    slug: "sliding-window",
    overview:
      "A technique for processing subarrays/substrings by maintaining a window that slides across the input. Instead of recalculating from scratch, you expand or shrink the window to efficiently find optimal contiguous sequences.",
    problems: [
      {
        title: "3. Longest Substring Without Repeating Characters",
        slug: "longest-substring-without-repeating-characters",
        difficulty: "Medium",
      },
    ],
  },
];
