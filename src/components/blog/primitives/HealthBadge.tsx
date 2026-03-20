"use client";

export interface HealthBadgeProps {
  x: number;
  y: number;
  healthy: boolean;
  /** Size of the dot */
  r?: number;
}

/**
 * A small colored dot indicating health status.
 * Green = healthy, Red = unhealthy.
 */
export default function HealthBadge({
  x,
  y,
  healthy,
  r = 4,
}: HealthBadgeProps) {
  return (
    <circle
      cx={x}
      cy={y}
      r={r}
      fill={healthy ? "#2ecc71" : "#e74c3c"}
    />
  );
}
