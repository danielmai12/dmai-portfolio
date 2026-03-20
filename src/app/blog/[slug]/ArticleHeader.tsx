"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useBlogPrefix } from "@/hooks/useBlogPath";

interface ArticleHeaderProps {
  category: string;
  title: string;
  date: string;
  readingTime: string;
}

export default function ArticleHeader({
  category,
  title,
  date,
  readingTime,
}: ArticleHeaderProps) {
  const blogPath = useBlogPrefix();
  return (
    <>
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Link
          href={blogPath("/blog")}
          className="block text-xs font-medium mb-8 transition-colors duration-200 hover:text-heading"
          style={{ color: "var(--muted-text)" }}
        >
          &larr; Back to Blog
        </Link>
      </motion.div>

      {/* Category tag */}
      <motion.span
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.06, ease: "easeOut" }}
        className="inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded mb-4"
        style={{
          color: "var(--primary-color)",
          border: "1px solid var(--primary-color)",
        }}
      >
        {category}
      </motion.span>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12, ease: "easeOut" }}
        className="text-2xl font-medium mb-3"
        style={{
          color: "var(--primary-color)",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </motion.h1>

      {/* Date + reading time */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.18, ease: "easeOut" }}
        className="flex items-center gap-2 text-xs mb-10"
        style={{ color: "var(--muted-text)" }}
      >
        <span>{date}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>{readingTime}</span>
      </motion.div>
    </>
  );
}
