"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Packet, HealthBadge, CountBadge } from "@/components/blog/primitives";

export type LbMode =
  | "idle"
  | "reverse-proxy"
  | "api-gateway"
  | "round-robin"
  | "least-connections"
  | "health-check"
  | "sticky-session"
  | "l4-vs-l7";

interface LbDiagramProps {
  mode: LbMode;
}

const servers = [
  { x: 320, y: 70, label: "App #1" },
  { x: 320, y: 180, label: "App #2" },
  { x: 320, y: 290, label: "App #3" },
];
const client = { x: 40, y: 180 };
const lb = { x: 180, y: 180 };

const nodeTransition = "transition-all duration-500 ease-out";

// --- Server Node (LB-specific with health/session support) ---
function ServerNode({
  x, y, label, healthy, active, connections, sessionColor, emoji,
}: {
  x: number; y: number; label: string; healthy: boolean;
  active: boolean; connections?: number; sessionColor?: string; emoji?: string;
}) {
  return (
    <g>
      <motion.circle
        cx={x} cy={y} r={28} fill="none" strokeWidth={2}
        stroke={sessionColor ?? (healthy ? "var(--accent-color)" : "#e74c3c")}
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.rect
        x={x - 22} y={y - 18} width={44} height={36} rx={6}
        fill="var(--card-bg)"
        stroke={!healthy ? "#e74c3c" : active ? "var(--accent-color)" : "var(--border-color)"}
        strokeWidth={active || !healthy ? 2 : 1}
        animate={{ opacity: healthy ? 1 : 0.4 }}
        transition={{ duration: 0.4 }}
      />
      <text x={x} y={y + 2} textAnchor="middle" dominantBaseline="central" fontSize={16}>
        {healthy ? (emoji ?? "🖥️") : "💀"}
      </text>
      <text
        x={x} y={y + 32} textAnchor="middle" fontSize={9} fontWeight={500}
        fill={!healthy ? "#e74c3c" : active ? "var(--primary-color)" : "var(--muted-text)"}
        className={nodeTransition}
      >
        {label}
      </text>
      {connections !== undefined && (
        <CountBadge x={x + 18} y={y - 28} count={connections} />
      )}
      <HealthBadge x={x - 18} y={y - 24} healthy={healthy} />
    </g>
  );
}

// --- Packet animation helpers ---
function RoundRobinPackets({ cycle }: { cycle: number }) {
  const target = servers[cycle % 3];
  return (
    <>
      <Packet fromX={client.x + 20} fromY={client.y} toX={lb.x - 20} toY={lb.y} delay={0} label={`#${cycle + 1}`} />
      <Packet fromX={lb.x + 20} fromY={lb.y} toX={target.x - 24} toY={target.y} delay={0.6} />
    </>
  );
}

function LeastConnectionsPackets() {
  const target = servers[1];
  return (
    <>
      <Packet fromX={client.x + 20} fromY={client.y} toX={lb.x - 20} toY={lb.y} delay={0} label="new" />
      <Packet fromX={lb.x + 20} fromY={lb.y} toX={target.x - 24} toY={target.y} delay={0.6} />
    </>
  );
}

function StickySessionPackets({ cycle }: { cycle: number }) {
  const users = [
    { color: "#3498db", target: 0, label: "A" },
    { color: "#2ecc71", target: 1, label: "B" },
  ];
  const user = users[cycle % 2];
  const target = servers[user.target];
  return (
    <>
      <Packet fromX={client.x + 20} fromY={client.y} toX={lb.x - 20} toY={lb.y} color={user.color} delay={0} label={`User ${user.label}`} />
      <Packet fromX={lb.x + 20} fromY={lb.y} toX={target.x - 24} toY={target.y} color={user.color} delay={0.6} />
    </>
  );
}

function L7Packets({ cycle }: { cycle: number }) {
  const routes = [
    { label: "/images", target: 0, color: "#9b59b6" },
    { label: "/api", target: 1, color: "#e67e22" },
    { label: "/static", target: 2, color: "#1abc9c" },
  ];
  const route = routes[cycle % 3];
  const target = servers[route.target];
  return (
    <>
      <Packet fromX={client.x + 20} fromY={client.y} toX={lb.x - 20} toY={lb.y} color={route.color} delay={0} label={route.label} />
      <Packet fromX={lb.x + 20} fromY={lb.y} toX={target.x - 24} toY={target.y} color={route.color} delay={0.6} />
    </>
  );
}

function ReverseProxyPackets({ cycle }: { cycle: number }) {
  const labels = ["HTTPS", "GET /", "POST"];
  const label = labels[cycle % 3];
  // Always routes to server index 1 (the single origin behind proxy)
  return (
    <>
      <Packet fromX={client.x + 20} fromY={client.y} toX={lb.x - 20} toY={lb.y} color="#e67e22" delay={0} label={label} />
      <Packet fromX={lb.x + 20} fromY={lb.y} toX={servers[1].x - 24} toY={servers[1].y} color="#3498db" delay={0.6} label="HTTP" />
    </>
  );
}

function ApiGatewayPackets({ cycle }: { cycle: number }) {
  const routes = [
    { label: "/users", target: 0, color: "#3498db" },
    { label: "/orders", target: 1, color: "#e67e22" },
    { label: "/pay", target: 2, color: "#2ecc71" },
  ];
  const route = routes[cycle % 3];
  const target = servers[route.target];
  return (
    <>
      <Packet fromX={client.x + 20} fromY={client.y} toX={lb.x - 20} toY={lb.y} color={route.color} delay={0} label={route.label} />
      <Packet fromX={lb.x + 20} fromY={lb.y} toX={target.x - 24} toY={target.y} color={route.color} delay={0.6} />
    </>
  );
}

// --- Main Diagram ---
export default function LbDiagram({ mode }: LbDiagramProps) {
  const [cycle, setCycle] = useState(-1);
  const [healthyServers, setHealthyServers] = useState([true, true, true]);

  useEffect(() => {
    if (mode === "idle") return;
    const startDelay = setTimeout(() => setCycle(0), 400);
    const interval = setInterval(() => setCycle((c) => c + 1), 1800);
    return () => { clearTimeout(startDelay); clearInterval(interval); };
  }, [mode]);

  useEffect(() => {
    setCycle(-1);
    if (mode === "health-check") {
      setHealthyServers([true, true, true]);
      const t1 = setTimeout(() => setHealthyServers([true, false, true]), 2000);
      return () => clearTimeout(t1);
    } else {
      setHealthyServers([true, true, true]);
    }
  }, [mode]);

  const getActiveServer = useCallback((): number => {
    if (cycle < 0) return -1;
    switch (mode) {
      case "reverse-proxy": return 1;
      case "api-gateway": return cycle % 3;
      case "round-robin": return cycle % 3;
      case "least-connections": return 1;
      case "health-check": return healthyServers[1] ? cycle % 3 : cycle % 2 === 0 ? 0 : 2;
      case "sticky-session": return cycle % 2 === 0 ? 0 : 1;
      case "l4-vs-l7": return cycle % 3;
      default: return -1;
    }
  }, [mode, cycle, healthyServers]);

  const activeServer = getActiveServer();
  const connectionCounts = mode === "least-connections" ? [12, 3, 7] : undefined;
  const getSessionColor = (idx: number) => {
    if (mode !== "sticky-session") return undefined;
    if (idx === 0) return "#3498db";
    if (idx === 1) return "#2ecc71";
    return undefined;
  };
  const l7Labels = mode === "l4-vs-l7" ? ["/images/*", "/api/*", "/static/*"] : undefined;
  const apiGwLabels = mode === "api-gateway" ? ["/users", "/orders", "/payments"] : undefined;

  // Dynamic labels based on mode
  const centerEmoji = mode === "reverse-proxy" ? "🛡️" : mode === "api-gateway" ? "🚪" : "⚖️";
  const centerLabel = mode === "reverse-proxy" ? "Reverse Proxy" : mode === "api-gateway" ? "API Gateway" : mode === "l4-vs-l7" ? "L7 LB" : "Load Balancer";
  const serverLabels = mode === "reverse-proxy"
    ? ["Cache", "Origin", "Logs"]
    : mode === "api-gateway"
      ? ["Users Svc", "Orders Svc", "Pay Svc"]
      : ["App #1", "App #2", "App #3"];
  const serverEmojis = mode === "reverse-proxy"
    ? ["📦", "🖥️", "📊"]
    : mode === "api-gateway"
      ? ["👤", "📦", "💳"]
      : undefined;

  return (
    <svg viewBox="0 0 400 340" className="w-full h-auto" style={{ maxHeight: "55vh" }}>
      {/* Client to LB line */}
      <line
        x1={client.x + 20} y1={client.y} x2={lb.x - 24} y2={lb.y}
        stroke="var(--border-color)" strokeWidth={1} strokeDasharray="4 4"
      />

      {/* LB to server lines */}
      {servers.map((s, i) => (
        <motion.line
          key={i}
          x1={lb.x + 24} y1={lb.y} x2={s.x - 24} y2={s.y}
          stroke={!healthyServers[i] ? "#e74c3c" : activeServer === i ? "var(--accent-color)" : "var(--border-color)"}
          strokeWidth={activeServer === i ? 2 : 1}
          strokeDasharray={!healthyServers[i] ? "4 4" : activeServer === i ? "none" : "4 4"}
          animate={{ opacity: !healthyServers[i] ? 0.2 : activeServer === i ? 0.8 : 0.3 }}
          transition={{ duration: 0.3 }}
        />
      ))}

      {/* L7 path labels */}
      {l7Labels && servers.map((s, i) => (
        <text
          key={`l7-${i}`}
          x={(lb.x + 24 + s.x - 24) / 2} y={(lb.y + s.y) / 2 - 8}
          textAnchor="middle" fontSize={8} fontWeight={500}
          fill={["#9b59b6", "#e67e22", "#1abc9c"][i]}
        >
          {l7Labels[i]}
        </text>
      ))}

      {/* API Gateway path labels */}
      {apiGwLabels && servers.map((s, i) => (
        <text
          key={`gw-${i}`}
          x={(lb.x + 24 + s.x - 24) / 2} y={(lb.y + s.y) / 2 - 8}
          textAnchor="middle" fontSize={8} fontWeight={500}
          fill={["#3498db", "#e67e22", "#2ecc71"][i]}
        >
          {apiGwLabels[i]}
        </text>
      ))}

      {/* Reverse proxy annotations */}
      {mode === "reverse-proxy" && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <text x={lb.x} y={lb.y - 38} textAnchor="middle" fontSize={7} fill="var(--accent-color)" fontWeight={500}>SSL • Cache • Compress</text>
        </motion.g>
      )}

      {/* API gateway annotations */}
      {mode === "api-gateway" && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <text x={lb.x} y={lb.y - 38} textAnchor="middle" fontSize={7} fill="var(--accent-color)" fontWeight={500}>Auth • Rate Limit • Transform</text>
        </motion.g>
      )}

      {/* Health check X mark */}
      {mode === "health-check" && !healthyServers[1] && (
        <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
          <line x1={(lb.x + 24 + servers[1].x - 24) / 2 - 6} y1={lb.y - 6} x2={(lb.x + 24 + servers[1].x - 24) / 2 + 6} y2={lb.y + 6} stroke="#e74c3c" strokeWidth={2.5} strokeLinecap="round" />
          <line x1={(lb.x + 24 + servers[1].x - 24) / 2 + 6} y1={lb.y - 6} x2={(lb.x + 24 + servers[1].x - 24) / 2 - 6} y2={lb.y + 6} stroke="#e74c3c" strokeWidth={2.5} strokeLinecap="round" />
        </motion.g>
      )}

      {/* Animated packets */}
      <AnimatePresence mode="wait">
        {cycle >= 0 && mode === "reverse-proxy" && (
          <motion.g key={`rp-${cycle}`}><ReverseProxyPackets cycle={cycle} /></motion.g>
        )}
        {cycle >= 0 && mode === "api-gateway" && (
          <motion.g key={`gw-${cycle}`}><ApiGatewayPackets cycle={cycle} /></motion.g>
        )}
        {cycle >= 0 && mode === "round-robin" && (
          <motion.g key={`rr-${cycle}`}><RoundRobinPackets cycle={cycle} /></motion.g>
        )}
        {cycle >= 0 && mode === "least-connections" && (
          <motion.g key={`lc-${cycle}`}><LeastConnectionsPackets /></motion.g>
        )}
        {cycle >= 0 && mode === "sticky-session" && (
          <motion.g key={`ss-${cycle}`}><StickySessionPackets cycle={cycle} /></motion.g>
        )}
        {cycle >= 0 && mode === "l4-vs-l7" && (
          <motion.g key={`l7-${cycle}`}><L7Packets cycle={cycle} /></motion.g>
        )}
        {cycle >= 0 && mode === "health-check" && !healthyServers[1] && (
          <motion.g key={`hc-${cycle}`}>
            <Packet fromX={client.x + 20} fromY={client.y} toX={lb.x - 20} toY={lb.y} delay={0} />
            <Packet
              fromX={lb.x + 20} fromY={lb.y}
              toX={servers[cycle % 2 === 0 ? 0 : 2].x - 24}
              toY={servers[cycle % 2 === 0 ? 0 : 2].y}
              delay={0.6}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Client node */}
      <circle cx={client.x} cy={client.y} r={20} fill="var(--card-bg)" stroke="var(--border-color)" strokeWidth={1} />
      <text x={client.x} y={client.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={16}>👤</text>
      <text x={client.x} y={client.y + 34} textAnchor="middle" fontSize={9} fontWeight={500} fill="var(--muted-text)">Client</text>

      {/* Center node */}
      <motion.circle cx={lb.x} cy={lb.y} r={24} fill="none" stroke="var(--accent-color)" strokeWidth={2} animate={{ opacity: mode !== "idle" ? 0.5 : 0 }} transition={{ duration: 0.3 }} />
      <circle cx={lb.x} cy={lb.y} r={20} fill="var(--card-bg)" stroke={mode !== "idle" ? "var(--accent-color)" : "var(--border-color)"} strokeWidth={mode !== "idle" ? 2 : 1} />
      <text x={lb.x} y={lb.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={16}>{centerEmoji}</text>
      <text x={lb.x} y={lb.y + 34} textAnchor="middle" fontSize={9} fontWeight={500} fill={mode !== "idle" ? "var(--primary-color)" : "var(--muted-text)"}>
        {centerLabel}
      </text>

      {/* Server nodes */}
      {servers.map((s, i) => (
        <ServerNode
          key={i} x={s.x} y={s.y}
          label={serverLabels[i]}
          healthy={healthyServers[i]}
          active={activeServer === i && mode !== "idle"}
          connections={connectionCounts?.[i]}
          sessionColor={getSessionColor(i)}
          emoji={serverEmojis?.[i]}
        />
      ))}

      {/* Mode label */}
      {mode !== "idle" && (
        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} x={200} y={330} textAnchor="middle" fontSize={9} fontWeight={500} fill="var(--muted-text)" fontStyle="italic">
          {mode === "reverse-proxy" && "Reverse Proxy — shield between clients and origin"}
          {mode === "api-gateway" && "API Gateway — auth, routing, and rate limiting"}
          {mode === "round-robin" && "Round Robin — requests cycle through servers"}
          {mode === "least-connections" && "Least Connections — route to least busy"}
          {mode === "health-check" && (healthyServers[1] ? "Monitoring server health..." : "App #2 failed — traffic rerouted")}
          {mode === "sticky-session" && "Sticky Sessions — same user, same server"}
          {mode === "l4-vs-l7" && "L7 Routing — path-based traffic splitting"}
        </motion.text>
      )}
    </svg>
  );
}
