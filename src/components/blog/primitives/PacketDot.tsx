"use client";

import { motion } from "framer-motion";

export interface PacketDotProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  delay?: number;
  color?: string;
  /** Dot radius */
  r?: number;
}

/**
 * A looping animated packet dot that continuously travels between two points
 * while active. Unlike Packet which is one-shot, this repeats indefinitely.
 */
export default function PacketDot({
  x1,
  y1,
  x2,
  y2,
  active,
  delay = 0,
  color = "var(--accent-color)",
  r = 4,
}: PacketDotProps) {
  if (!active) return null;

  return (
    <motion.circle
      r={r}
      fill={color}
      initial={{ cx: x1, cy: y1, opacity: 0 }}
      animate={{
        cx: [x1, x2],
        cy: [y1, y2],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        repeatDelay: 0.5,
        ease: "easeInOut",
      }}
    />
  );
}
