"use client";

import { motion } from "framer-motion";

export interface PacketProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color?: string;
  delay?: number;
  duration?: number;
  label?: string;
  /** Size of the dot */
  r?: number;
}

/**
 * A one-shot animated packet dot that moves from (fromX, fromY) to (toX, toY).
 * Fades in at start and out at end.
 */
export default function Packet({
  fromX,
  fromY,
  toX,
  toY,
  color = "var(--accent-color)",
  delay = 0,
  duration = 0.6,
  label,
  r = 5,
}: PacketProps) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration, delay, ease: "easeInOut" }}
    >
      <motion.circle
        r={r}
        fill={color}
        initial={{ cx: fromX, cy: fromY }}
        animate={{ cx: toX, cy: toY }}
        transition={{ duration, delay, ease: "easeInOut" }}
      />
      {label && (
        <motion.text
          fontSize={7}
          fontWeight={600}
          fill={color}
          textAnchor="middle"
          initial={{ x: fromX, y: fromY - 10 }}
          animate={{ x: toX, y: toY - 10 }}
          transition={{ duration, delay, ease: "easeInOut" }}
        >
          {label}
        </motion.text>
      )}
    </motion.g>
  );
}
