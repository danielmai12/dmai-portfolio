"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { articles, categories, type Category } from "@/data/articles";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("System Design");

  const filtered = articles.filter((a) => a.category === activeCategory);

  return (
    <section className="py-16 h-screen flex flex-col">
      <div className="container mx-auto flex flex-col flex-1 min-h-0">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <h2
            className="text-2xl font-medium flex-shrink-0"
            style={{ color: "var(--primary-color)", letterSpacing: "-0.02em" }}
          >
            Blog
          </h2>
          <div
            className="flex-1 h-px opacity-60"
            style={{ backgroundColor: "var(--border-color)" }}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-sm font-light leading-relaxed mb-8"
          style={{ color: "var(--text-color)" }}
        >
          I believe the best engineers never stop learning. This is where I
          document what I study each week — system design trade-offs, database
          internals, algorithm patterns, and everything in between. Writing
          things down forces clarity, and sharing it keeps me accountable.
        </motion.p>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-2 mb-10 flex-wrap"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200"
              style={{
                border: "1px solid var(--border-color)",
                backgroundColor:
                  activeCategory === cat
                    ? "var(--primary-color)"
                    : "transparent",
                color:
                  activeCategory === cat
                    ? "var(--bg-color, #fff)"
                    : "var(--muted-text)",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Article list */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col items-center justify-center py-20"
            >
              <span className="text-4xl mb-4">🚧</span>
              <p
                className="text-sm font-medium mb-2"
                style={{ color: "var(--primary-color)" }}
              >
                Brewing fresh content...
              </p>
              <p
                className="text-xs font-light"
                style={{ color: "var(--muted-text)" }}
              >
                New {activeCategory} articles are on the way. Check back soon!
              </p>
            </motion.div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((article, i) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
              >
                <Link
                  href={`/blog/${article.slug}`}
                  className="group block rounded-lg p-5 h-full"
                  style={{
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--card-bg, transparent)",
                    transition: "border-color 0.2s, background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--primary-color)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--border-color)";
                  }}
                >
                  {/* Category tag */}
                  <span
                    className="inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded mb-3"
                    style={{
                      color: "var(--primary-color)",
                      border: "1px solid var(--primary-color)",
                    }}
                  >
                    {article.category}
                  </span>

                  {/* Title */}
                  <h3
                    className="text-sm font-medium mb-2 leading-snug"
                    style={{
                      color: "var(--heading-color)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p
                    className="text-xs leading-relaxed font-light mb-4"
                    style={{ color: "var(--text-color)" }}
                  >
                    {article.summary}
                  </p>

                  {/* Date + reading time */}
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "var(--muted-text)" }}
                  >
                    <span>{article.date}</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>{article.readingTime}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogPage;
