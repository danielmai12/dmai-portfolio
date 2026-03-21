"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Packet, HealthBadge } from "@/components/blog/primitives";

export type ScalingMode =
  | "idle"
  | "why-scale"
  | "scale-out-in"
  | "auto-scaling"
  | "health-checks"
  | "ha-zones"
  | "ha-failover"
  | "lb-types"
  | "mig"
  | "summary";

interface ScalingDiagramProps {
  mode: ScalingMode;
}

// Layout constants
const lbNode = { x: 100, y: 180 };
const client = { x: 20, y: 180 };

// Zone A servers (top)
const zoneA = [
  { x: 260, y: 70, label: "VM #1" },
  { x: 260, y: 160, label: "VM #2" },
];

// Zone B servers (bottom)
const zoneB = [
  { x: 260, y: 250, label: "VM #3" },
  { x: 260, y: 340, label: "VM #4" },
];

const allServers = [...zoneA, ...zoneB];

// Scaled-out server
const scaledServer = { x: 370, y: 250, label: "VM #5" };

function ServerNode({
  x, y, label, healthy, active, faded, emoji,
}: {
  x: number; y: number; label: string; healthy: boolean;
  active: boolean; faded?: boolean; emoji?: string;
}) {
  return (
    <g>
      <motion.circle
        cx={x} cy={y} r={28} fill="none" strokeWidth={2}
        stroke={healthy ? "var(--accent-color)" : "#e74c3c"}
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.rect
        x={x - 22} y={y - 18} width={44} height={36} rx={6}
        fill="var(--card-bg)"
        stroke={!healthy ? "#e74c3c" : active ? "var(--accent-color)" : "var(--border-color)"}
        strokeWidth={active || !healthy ? 2 : 1}
        animate={{ opacity: faded ? 0.2 : healthy ? 1 : 0.4 }}
        transition={{ duration: 0.4 }}
      />
      <motion.text
        x={x} y={y + 2} textAnchor="middle" dominantBaseline="central" fontSize={16}
        animate={{ opacity: faded ? 0.2 : 1 }}
      >
        {healthy ? (emoji ?? "🖥️") : "💀"}
      </motion.text>
      <motion.text
        x={x} y={y + 32} textAnchor="middle" fontSize={9} fontWeight={500}
        fill={!healthy ? "#e74c3c" : active ? "var(--primary-color)" : "var(--muted-text)"}
        animate={{ opacity: faded ? 0.2 : 1 }}
      >
        {label}
      </motion.text>
      <HealthBadge x={x - 18} y={y - 24} healthy={healthy} />
    </g>
  );
}

export default function ScalingDiagram({ mode }: ScalingDiagramProps) {
  const [cycle, setCycle] = useState(-1);
  const [scaled, setScaled] = useState(false);
  const [zoneAHealthy, setZoneAHealthy] = useState(true);

  // Cycle timer for packet animations
  useEffect(() => {
    if (mode === "idle") return;
    const startDelay = setTimeout(() => setCycle(0), 400);
    const interval = setInterval(() => setCycle((c) => c + 1), 1800);
    return () => { clearTimeout(startDelay); clearInterval(interval); };
  }, [mode]);

  // Mode-specific state transitions
  useEffect(() => {
    setCycle(-1);
    setScaled(false);
    setZoneAHealthy(true);

    if (mode === "auto-scaling" || mode === "scale-out-in") {
      const t1 = setTimeout(() => setScaled(true), 2500);
      return () => clearTimeout(t1);
    }
    if (mode === "ha-failover") {
      const t1 = setTimeout(() => setZoneAHealthy(false), 2500);
      return () => clearTimeout(t1);
    }
  }, [mode]);

  // Determine visible servers based on mode
  const showZones = mode === "ha-zones" || mode === "ha-failover" || mode === "summary" || mode === "mig";
  const showScaled = (mode === "auto-scaling" || mode === "scale-out-in") && scaled;
  const showAllFour = showZones;

  // Which servers to show
  const visibleServers = showAllFour
    ? allServers
    : allServers.slice(0, 3); // Show 3 by default

  const getActiveServer = useCallback((): number => {
    if (cycle < 0) return -1;
    if (mode === "ha-failover" && !zoneAHealthy) {
      // Only zone B servers (index 2, 3)
      return 2 + (cycle % 2);
    }
    if (showScaled) {
      return cycle % (visibleServers.length + 1); // +1 for scaled server
    }
    return cycle % visibleServers.length;
  }, [mode, cycle, zoneAHealthy, showScaled, visibleServers.length]);

  const activeServer = getActiveServer();

  // Simple single-server mode for "why-scale"
  const isSingleServer = mode === "why-scale";
  const singleServer = { x: 260, y: 180, label: "Single Server" };

  return (
    <svg viewBox={`0 0 ${showScaled ? 430 : 380} ${showAllFour ? 410 : 380}`} className="w-full h-auto" style={{ maxHeight: "55vh" }}>
      {/* Zone backgrounds */}
      {showZones && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <rect
            x={220} y={30} width={90} height={180} rx={8}
            fill="none"
            stroke={mode === "ha-failover" && !zoneAHealthy ? "#e74c3c" : "#2ecc71"}
            strokeWidth={1} strokeDasharray="4 4" opacity={0.5}
          />
          <text
            x={265} y={46} textAnchor="middle" fontSize={8} fontWeight={600}
            fill={mode === "ha-failover" && !zoneAHealthy ? "#e74c3c" : "#2ecc71"}
          >
            {mode === "ha-failover" && !zoneAHealthy ? "Zone A ✗" : "Zone A"}
          </text>
          <rect
            x={220} y={220} width={90} height={180} rx={8}
            fill="none" stroke="#3498db"
            strokeWidth={1} strokeDasharray="4 4" opacity={0.5}
          />
          <text x={265} y={236} textAnchor="middle" fontSize={8} fontWeight={600} fill="#3498db">Zone B</text>
        </motion.g>
      )}

      {/* Client to LB line */}
      <line
        x1={client.x + 16} y1={client.y} x2={lbNode.x - 24} y2={lbNode.y}
        stroke="var(--border-color)" strokeWidth={1} strokeDasharray="4 4"
      />

      {isSingleServer ? (
        <>
          {/* Single server mode */}
          <line
            x1={lbNode.x + 24} y1={lbNode.y} x2={singleServer.x - 24} y2={singleServer.y}
            stroke="var(--border-color)" strokeWidth={1} strokeDasharray="4 4"
          />
          <ServerNode
            x={singleServer.x} y={singleServer.y} label={singleServer.label}
            healthy={true} active={cycle >= 0}
          />
          {/* Overload indicator */}
          {cycle >= 0 && (
            <motion.g>
              <Packet fromX={client.x + 16} fromY={client.y} toX={singleServer.x - 24} toY={singleServer.y} delay={0} />
              <motion.text
                x={singleServer.x} y={singleServer.y - 38}
                textAnchor="middle" fontSize={8} fontWeight={600}
                fill="#e74c3c"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                CPU: 95% 🔥
              </motion.text>
            </motion.g>
          )}
        </>
      ) : (
        <>
          {/* LB to server lines */}
          {visibleServers.map((s, i) => {
            const isUnhealthy = mode === "ha-failover" && !zoneAHealthy && i < 2;
            return (
              <motion.line
                key={i}
                x1={lbNode.x + 24} y1={lbNode.y} x2={s.x - 24} y2={s.y}
                stroke={isUnhealthy ? "#e74c3c" : activeServer === i ? "var(--accent-color)" : "var(--border-color)"}
                strokeWidth={activeServer === i ? 2 : 1}
                strokeDasharray={isUnhealthy ? "4 4" : activeServer === i ? "none" : "4 4"}
                animate={{ opacity: isUnhealthy ? 0.15 : activeServer === i ? 0.8 : 0.3 }}
                transition={{ duration: 0.3 }}
              />
            );
          })}

          {/* Line to scaled server */}
          {showScaled && (
            <motion.line
              x1={lbNode.x + 24} y1={lbNode.y} x2={scaledServer.x - 24} y2={scaledServer.y}
              stroke={activeServer === visibleServers.length ? "var(--accent-color)" : "var(--border-color)"}
              strokeWidth={activeServer === visibleServers.length ? 2 : 1}
              strokeDasharray={activeServer === visibleServers.length ? "none" : "4 4"}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeServer === visibleServers.length ? 0.8 : 0.3 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Server nodes */}
          {visibleServers.map((s, i) => {
            const isUnhealthy = mode === "ha-failover" && !zoneAHealthy && i < 2;
            return (
              <ServerNode
                key={i} x={s.x} y={s.y} label={s.label}
                healthy={!isUnhealthy}
                active={activeServer === i && mode !== "idle"}
              />
            );
          })}

          {/* Scaled server */}
          {(mode === "auto-scaling" || mode === "scale-out-in") && (
            <motion.g
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: scaled ? 1 : 0, scale: scaled ? 1 : 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <ServerNode
                x={scaledServer.x} y={scaledServer.y} label={scaledServer.label}
                healthy={true}
                active={scaled && activeServer === visibleServers.length}
              />
              <AnimatePresence>
                {scaled && (
                  <motion.text
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    x={scaledServer.x} y={scaledServer.y - 42}
                    textAnchor="middle" fontSize={8} fontWeight={600} fill="#2ecc71"
                  >
                    ↑ Scaled Out
                  </motion.text>
                )}
              </AnimatePresence>
            </motion.g>
          )}

          {/* Animated packets */}
          <AnimatePresence mode="wait">
            {cycle >= 0 && mode !== "idle" && (
              <motion.g key={`pkt-${cycle}`}>
                <Packet fromX={client.x + 16} fromY={client.y} toX={lbNode.x - 20} toY={lbNode.y} delay={0} />
                {(() => {
                  if (mode === "ha-failover" && !zoneAHealthy) {
                    const target = zoneB[cycle % 2];
                    return <Packet fromX={lbNode.x + 20} fromY={lbNode.y} toX={target.x - 24} toY={target.y} delay={0.6} />;
                  }
                  if (showScaled && activeServer === visibleServers.length) {
                    return <Packet fromX={lbNode.x + 20} fromY={lbNode.y} toX={scaledServer.x - 24} toY={scaledServer.y} delay={0.6} />;
                  }
                  const target = visibleServers[activeServer] ?? visibleServers[0];
                  return <Packet fromX={lbNode.x + 20} fromY={lbNode.y} toX={target.x - 24} toY={target.y} delay={0.6} />;
                })()}
              </motion.g>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Client node */}
      <circle cx={client.x} cy={client.y} r={14} fill="var(--card-bg)" stroke="var(--border-color)" strokeWidth={1} />
      <text x={client.x} y={client.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={12}>👤</text>
      <text x={client.x} y={client.y + 28} textAnchor="middle" fontSize={8} fontWeight={500} fill="var(--muted-text)">Client</text>

      {/* LB node */}
      {!isSingleServer && (
        <>
          <motion.circle cx={lbNode.x} cy={lbNode.y} r={24} fill="none" stroke="var(--accent-color)" strokeWidth={2} animate={{ opacity: mode !== "idle" ? 0.5 : 0 }} transition={{ duration: 0.3 }} />
          <circle cx={lbNode.x} cy={lbNode.y} r={20} fill="var(--card-bg)" stroke={mode !== "idle" ? "var(--accent-color)" : "var(--border-color)"} strokeWidth={mode !== "idle" ? 2 : 1} />
          <text x={lbNode.x} y={lbNode.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={16}>⚖️</text>
          <text x={lbNode.x} y={lbNode.y + 34} textAnchor="middle" fontSize={9} fontWeight={500} fill={mode !== "idle" ? "var(--primary-color)" : "var(--muted-text)"}>
            {mode === "lb-types" ? "HTTPS LB" : "Load Balancer"}
          </text>
        </>
      )}

      {/* Auto-scaling annotation */}
      {mode === "auto-scaling" && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.5 }}>
          <text x={lbNode.x} y={lbNode.y - 40} textAnchor="middle" fontSize={7} fill="var(--accent-color)" fontWeight={500}>
            Auto Scaler monitors metrics
          </text>
        </motion.g>
      )}

      {/* Health check annotation */}
      {mode === "health-checks" && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.5 }}>
          <text x={lbNode.x} y={lbNode.y - 40} textAnchor="middle" fontSize={7} fill="var(--accent-color)" fontWeight={500}>
            GET /health every 10s
          </text>
        </motion.g>
      )}

      {/* LB types annotation */}
      {mode === "lb-types" && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.3 }}>
          <text x={lbNode.x} y={46} textAnchor="middle" fontSize={7} fill="#3498db" fontWeight={500}>L7 — routes by path, headers</text>
          <text x={lbNode.x} y={320} textAnchor="middle" fontSize={7} fill="#e67e22" fontWeight={500}>L4 — routes by IP + port</text>
        </motion.g>
      )}

      {/* MIG annotation */}
      {mode === "mig" && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.3 }}>
          <rect x={320} y={100} width={55} height={210} rx={6} fill="none" stroke="var(--accent-color)" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
          <text x={347} y={118} textAnchor="middle" fontSize={7} fill="var(--accent-color)" fontWeight={600}>MIG</text>
          <text x={347} y={300} textAnchor="middle" fontSize={6} fill="var(--muted-text)">Instance Template</text>
          <text x={347} y={310} textAnchor="middle" fontSize={6} fill="var(--muted-text)">+ Auto Scaler</text>
        </motion.g>
      )}

      {/* Mode label */}
      {mode !== "idle" && (
        <motion.text
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          x={isSingleServer ? 160 : 200}
          y={showAllFour ? 400 : 370}
          textAnchor="middle" fontSize={9} fontWeight={500} fill="var(--muted-text)" fontStyle="italic"
        >
          {mode === "why-scale" && "Single server — limited capacity, single point of failure"}
          {mode === "scale-out-in" && (scaled ? "Scaled out — added VM #5 to handle spike" : "Traffic increasing...")}
          {mode === "auto-scaling" && (scaled ? "Auto scaler detected high CPU → added instance" : "Monitoring CPU, request rate, queue depth...")}
          {mode === "health-checks" && "Health checks detect failures → remove from rotation"}
          {mode === "ha-zones" && "VMs spread across zones for redundancy"}
          {mode === "ha-failover" && (zoneAHealthy ? "Both zones healthy, traffic distributed" : "Zone A down — all traffic shifted to Zone B")}
          {mode === "lb-types" && "GCP HTTPS LB (L7) — global, multi-region, path-based routing"}
          {mode === "mig" && "Managed Instance Group — template + auto scaler + multi-zone"}
          {mode === "summary" && "LB + Auto Scaling + Multi-Zone = High Availability"}
        </motion.text>
      )}
    </svg>
  );
}
