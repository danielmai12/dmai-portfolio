"use client";

export interface CountBadgeProps {
  x: number;
  y: number;
  count: number;
  color?: string;
}

/**
 * A small pill-shaped badge showing a number (e.g. connection count).
 */
export default function CountBadge({
  x,
  y,
  count,
  color = "var(--accent-color)",
}: CountBadgeProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={22}
        height={16}
        rx={8}
        fill={color}
        opacity={0.9}
      />
      <text
        x={x + 11}
        y={y + 9}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={9}
        fontWeight={600}
        fill="var(--bg-color)"
      >
        {count}
      </text>
    </g>
  );
}
