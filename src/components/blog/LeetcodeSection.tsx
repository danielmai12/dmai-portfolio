"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Accordion from "./Accordion";
import { leetcodeTopics } from "@/data/leetcode/leetcode-topics";
import { useBlogPrefix } from "@/hooks/useBlogPath";

const difficultyColor: Record<string, string> = {
  Easy: "#4caf50",
  Medium: "#ff9800",
  Hard: "#f44336",
};

const LeetcodeSection = () => {
  const blogPath = useBlogPrefix();

  const items = leetcodeTopics
    .sort((a, b) => a.order - b.order)
    .map((topic) => ({
      id: topic.slug,
      order: topic.order,
      title: topic.title,
      children: (
        <div>
          {/* Overview */}
          <p
            className="text-xs leading-relaxed font-light mb-4"
            style={{ color: "var(--text-color)" }}
          >
            {topic.overview}
          </p>

          {/* View more link */}
          <Link
            href={blogPath(`/blog/${topic.slug}`)}
            className="inline-flex items-center gap-1.5 text-xs font-medium mb-4 transition-opacity duration-200 hover:opacity-70"
            style={{ color: "var(--accent-color)" }}
          >
            View more
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          {/* Problems */}
          <div className="flex flex-col gap-2">
            {topic.problems.map((problem) => (
              <Link
                key={problem.slug}
                href={blogPath(`/blog/${problem.slug}`)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-xs transition-colors duration-200 group"
                style={{
                  border: "1px solid var(--border-color)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary-color)";
                  e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {/* Problem icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--muted-text)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>

                {/* Problem title */}
                <span
                  className="flex-1 font-medium"
                  style={{ color: "var(--primary-color)" }}
                >
                  {problem.title}
                </span>

                {/* Difficulty badge */}
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    color: difficultyColor[problem.difficulty],
                    border: `1px solid ${difficultyColor[problem.difficulty]}`,
                  }}
                >
                  {problem.difficulty}
                </span>

                {/* Arrow */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--muted-text)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      ),
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Accordion items={items} />
    </motion.div>
  );
};

export default LeetcodeSection;
