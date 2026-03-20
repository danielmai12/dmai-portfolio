"use client";

import { useRef, useEffect, ReactNode } from "react";
import { motion, useInView } from "framer-motion";

export interface SectionBlockProps {
  index: number;
  isFirst?: boolean;
  title: string;
  children: ReactNode;
  onVisible: (index: number, visible: boolean) => void;
}

/**
 * A scroll-triggered section for scrollytelling layouts.
 * Reports visibility to parent so the topmost visible section can be determined.
 */
export default function SectionBlock({
  index,
  isFirst,
  title,
  children,
  onVisible,
}: SectionBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    onVisible(index, isInView);
  }, [isInView, index, onVisible]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.3 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 0.4 }}
      className={
        isFirst ? "" : "min-h-[40vh] flex flex-col justify-center py-8"
      }
    >
      <h3
        className="text-lg font-medium mb-4"
        style={{ color: "var(--primary-color)", letterSpacing: "-0.01em" }}
      >
        {title}
      </h3>
      <div
        className="text-base font-light leading-relaxed space-y-2"
        style={{ color: "var(--text-color)" }}
      >
        {children}
      </div>
    </motion.div>
  );
}
