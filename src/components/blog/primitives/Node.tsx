"use client";

import { motion } from "framer-motion";

const transitionBase = "transition-all duration-500 ease-out";

export interface NodeProps {
  x: number;
  y: number;
  label: string;
  icon: string;
  active: boolean;
  delay?: number;
  /** Override the active glow/stroke color */
  color?: string;
  /** Node shape: "circle" (default) or "rect" */
  shape?: "circle" | "rect";
}

export default function Node({
  x,
  y,
  label,
  icon,
  active,
  delay = 0,
  color = "var(--accent-color)",
  shape = "circle",
}: NodeProps) {
  if (shape === "rect") {
    return (
      <motion.g
        initial={{ opacity: 0.3 }}
        animate={{ opacity: active ? 1 : 0.3 }}
        transition={{ duration: 0.5, delay }}
      >
        <motion.circle
          cx={x}
          cy={y}
          r={28}
          fill="none"
          strokeWidth={2}
          stroke={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 0.6 : 0 }}
          transition={{ duration: 0.3, delay }}
        />
        <rect
          x={x - 22}
          y={y - 18}
          width={44}
          height={36}
          rx={6}
          fill="var(--card-bg)"
          stroke={active ? color : "var(--border-color)"}
          strokeWidth={active ? 2 : 1}
          className={transitionBase}
        />
        <text
          x={x}
          y={y + 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={16}
        >
          {icon}
        </text>
        <text
          x={x}
          y={y + 32}
          textAnchor="middle"
          fontSize={9}
          fontWeight={500}
          fill={active ? "var(--primary-color)" : "var(--muted-text)"}
          className={transitionBase}
        >
          {label}
        </text>
      </motion.g>
    );
  }

  return (
    <motion.g
      initial={{ opacity: 0.3 }}
      animate={{ opacity: active ? 1 : 0.3 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Glow ring */}
      <motion.circle
        cx={x}
        cy={y}
        r={32}
        fill="none"
        strokeWidth={2}
        stroke={color}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: active ? 0.6 : 0,
          scale: active ? 1 : 0.8,
        }}
        transition={{ duration: 0.4, delay }}
        style={{ transformOrigin: `${x}px ${y}px` }}
      />
      {/* Node circle */}
      <circle
        cx={x}
        cy={y}
        r={26}
        fill="var(--card-bg)"
        stroke={active ? color : "var(--border-color)"}
        strokeWidth={active ? 2 : 1}
        className={transitionBase}
      />
      {/* Icon */}
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={18}
      >
        {icon}
      </text>
      {/* Label */}
      <text
        x={x}
        y={y + 42}
        textAnchor="middle"
        fontSize={10}
        fontWeight={500}
        fill={active ? "var(--primary-color)" : "var(--muted-text)"}
        className={transitionBase}
      >
        {label}
      </text>
    </motion.g>
  );
}
