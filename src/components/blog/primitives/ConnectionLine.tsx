"use client";

import { motion } from "framer-motion";

export interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  delay?: number;
  /** Override the active color */
  color?: string;
  /** Override the inactive color */
  inactiveColor?: string;
}

export default function ConnectionLine({
  x1,
  y1,
  x2,
  y2,
  active,
  delay = 0,
  color = "var(--accent-color)",
  inactiveColor = "var(--border-color)",
}: ConnectionLineProps) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={active ? color : inactiveColor}
      strokeWidth={active ? 2 : 1}
      strokeDasharray={active ? "none" : "4 4"}
      initial={{ opacity: 0.2 }}
      animate={{ opacity: active ? 0.8 : 0.2 }}
      transition={{ duration: 0.5, delay }}
    />
  );
}
