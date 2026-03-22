"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionProps {
  items: {
    id: string;
    order: number;
    title: string;
    children: React.ReactNode;
  }[];
}

const Accordion = ({ items }: AccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="rounded-lg overflow-hidden transition-colors duration-200"
            style={{
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--card-bg, transparent)",
            }}
          >
            {/* Header */}
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors duration-200"
              style={{ backgroundColor: isOpen ? "var(--hover-bg)" : "transparent" }}
              onMouseEnter={(e) => {
                if (!isOpen) e.currentTarget.style.backgroundColor = "var(--hover-bg)";
              }}
              onMouseLeave={(e) => {
                if (!isOpen) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {/* Order number */}
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--bg-color)",
                }}
              >
                {item.order}
              </span>

              {/* Title */}
              <span
                className="flex-1 text-sm font-medium"
                style={{ color: "var(--primary-color)", letterSpacing: "-0.01em" }}
              >
                {item.title}
              </span>

              {/* Chevron */}
              <motion.svg
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--muted-text)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </button>

            {/* Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div
                    className="px-5 pb-5 pt-1"
                    style={{ borderTop: "1px solid var(--border-color)" }}
                  >
                    {item.children}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
