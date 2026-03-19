"use client";

import { motion } from "framer-motion";

function parseMarkdown(content: string): string {
  let html = content
    // Code blocks
    .replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      '<pre class="article-code"><code>$2</code></pre>',
    )
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="article-inline-code">$1</code>')
    // Headers
    .replace(
      /^### (.+)$/gm,
      '<h3 class="article-h3">$1</h3>',
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="article-h2">$1</h2>',
    )
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Tables
    .replace(
      /^\|(.+)\|$/gm,
      (match) => {
        const cells = match
          .split("|")
          .filter((c) => c.trim() !== "");
        if (cells.every((c) => /^[\s-:]+$/.test(c))) {
          return "<!-- table-separator -->";
        }
        const isHeader = false;
        const tag = isHeader ? "th" : "td";
        const row = cells
          .map(
            (c) =>
              `<${tag} class="article-table-cell">${c.trim()}</${tag}>`,
          )
          .join("");
        return `<tr>${row}</tr>`;
      },
    )
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="article-li">$1</li>')
    // Paragraphs — wrap loose lines
    .replace(/^(?!<[hupltroi!]|$)(.+)$/gm, '<p class="article-p">$1</p>');

  // Wrap consecutive <tr> in <table>
  html = html.replace(
    /((?:<tr>.*<\/tr>\s*(?:<!-- table-separator -->\s*)?)+)/g,
    (match) => {
      const cleaned = match.replace(/<!-- table-separator -->/g, "");
      return `<table class="article-table">${cleaned}</table>`;
    },
  );

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /((?:<li class="article-li">.*<\/li>\s*)+)/g,
    '<ul class="article-ul">$1</ul>',
  );

  return html;
}

export default function ArticleContent({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.24 }}
      className="article-body"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}
