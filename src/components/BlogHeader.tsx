"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useBlogPrefix } from "@/hooks/useBlogPath";

const isProd = process.env.NODE_ENV === "production";
const portfolioHref = isProd ? "https://codewithdmai.com" : "/";

const BlogHeader = () => {
  const blogPath = useBlogPrefix();

  return (
    <header
      className="py-5 fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href={blogPath("/blog")}>
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--primary-color)" }}
          >
            dmai<span style={{ color: "var(--accent-color)" }}>/blog</span>
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={portfolioHref}
            className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-200"
            style={{
              color: "var(--muted-text)",
              border: "1px solid var(--border-color)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--primary-color)";
              e.currentTarget.style.color = "var(--primary-color)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.color = "var(--muted-text)";
            }}
          >
            Portfolio &rarr;
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;
