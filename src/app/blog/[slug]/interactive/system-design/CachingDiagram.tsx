"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Packet } from "@/components/blog/primitives";

export type CachingMode =
  | "idle"
  | "why-cache"
  | "cache-hit"
  | "cache-miss"
  | "cache-aside"
  | "write-through"
  | "write-behind"
  | "invalidation"
  | "eviction"
  | "multi-layer"
  | "stampede"
  | "summary";

interface CachingDiagramProps {
  mode: CachingMode;
}

// Core node positions
const client = { x: 50, y: 180 };
const cache = { x: 200, y: 180 };
const db = { x: 360, y: 180 };

// Multi-layer positions
const layers = [
  { x: 50, y: 180, label: "Browser", emoji: "🌐" },
  { x: 150, y: 180, label: "CDN", emoji: "🌍" },
  { x: 260, y: 180, label: "Redis", emoji: "🗄️" },
  { x: 370, y: 180, label: "Database", emoji: "🗃️" },
];

// Eviction slots
const slotX = 130;
const slotW = 140;
const slotH = 36;
const slotGap = 6;
const slotStartY = 80;

function CacheNode({
  x, y, emoji, label, active, hit, miss, dimmed,
}: {
  x: number; y: number; emoji: string; label: string;
  active?: boolean; hit?: boolean; miss?: boolean; dimmed?: boolean;
}) {
  const strokeColor = hit ? "#2ecc71" : miss ? "#e74c3c" : active ? "var(--accent-color)" : "var(--border-color)";
  return (
    <g>
      {active && (
        <motion.circle
          cx={x} cy={y} r={36} fill="none" strokeWidth={2}
          stroke={hit ? "#2ecc71" : miss ? "#e74c3c" : "var(--accent-color)"}
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <motion.rect
        x={x - 28} y={y - 22} width={56} height={44} rx={8}
        fill="var(--card-bg)" stroke={strokeColor}
        strokeWidth={active || hit || miss ? 2 : 1}
        animate={{ opacity: dimmed ? 0.25 : 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.text
        x={x} y={y + 2} textAnchor="middle" dominantBaseline="central" fontSize={22}
        animate={{ opacity: dimmed ? 0.25 : 1 }}
      >
        {emoji}
      </motion.text>
      <motion.text
        x={x} y={y + 38} textAnchor="middle" fontSize={11} fontWeight={500}
        fill={active ? "var(--primary-color)" : "var(--muted-text)"}
        animate={{ opacity: dimmed ? 0.25 : 1 }}
      >
        {label}
      </motion.text>
    </g>
  );
}

function ConnectionLine({
  x1, y1, x2, y2, active, dimmed, dashed = true,
}: {
  x1: number; y1: number; x2: number; y2: number;
  active?: boolean; dimmed?: boolean; dashed?: boolean;
}) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={active ? "var(--accent-color)" : "var(--border-color)"}
      strokeWidth={active ? 2 : 1}
      strokeDasharray={dashed && !active ? "4 4" : "none"}
      animate={{ opacity: dimmed ? 0.1 : active ? 0.8 : 0.3 }}
      transition={{ duration: 0.3 }}
    />
  );
}

export default function CachingDiagram({ mode }: CachingDiagramProps) {
  const [cycle, setCycle] = useState(-1);
  const [ttl, setTtl] = useState(60);
  const [slotsUsed, setSlotsUsed] = useState(0);
  const [stampedePhase, setStampedePhase] = useState(0);
  const [hitResult, setHitResult] = useState<"hit" | "miss" | null>(null);

  // Cycle timer
  const interval = mode === "cache-miss" || mode === "cache-aside" || mode === "write-through" || mode === "write-behind" ? 3000 : 1800;
  useEffect(() => {
    if (mode === "idle") return;
    const startDelay = setTimeout(() => setCycle(0), 400);
    const timer = setInterval(() => setCycle((c) => c + 1), interval);
    return () => { clearTimeout(startDelay); clearInterval(timer); };
  }, [mode, interval]);

  // Mode-specific state
  useEffect(() => {
    setCycle(-1);
    setTtl(60);
    setSlotsUsed(0);
    setStampedePhase(0);
    setHitResult(null);

    if (mode === "invalidation") {
      const t1 = setTimeout(() => setTtl(30), 1500);
      const t2 = setTimeout(() => setTtl(10), 3000);
      const t3 = setTimeout(() => setTtl(3), 4000);
      const t4 = setTimeout(() => setTtl(0), 5000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
    if (mode === "eviction") {
      const timers = [
        setTimeout(() => setSlotsUsed(1), 800),
        setTimeout(() => setSlotsUsed(2), 1600),
        setTimeout(() => setSlotsUsed(3), 2400),
        setTimeout(() => setSlotsUsed(4), 3200),
        setTimeout(() => setSlotsUsed(5), 4500), // triggers eviction
      ];
      return () => timers.forEach(clearTimeout);
    }
    if (mode === "stampede") {
      const t1 = setTimeout(() => setStampedePhase(1), 1500);
      const t2 = setTimeout(() => setStampedePhase(2), 3500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    if (mode === "cache-hit") {
      const t1 = setTimeout(() => setHitResult("hit"), 800);
      return () => clearTimeout(t1);
    }
    if (mode === "cache-miss" || mode === "cache-aside") {
      const t1 = setTimeout(() => setHitResult("miss"), 800);
      return () => clearTimeout(t1);
    }
  }, [mode]);

  // Multi-layer hit level cycles through layers
  const multiLayerHitLevel = mode === "multi-layer" ? (cycle < 0 ? -1 : cycle % 4) : -1;

  const isMultiLayer = mode === "multi-layer" || mode === "summary";
  const isEviction = mode === "eviction";
  const isStampede = mode === "stampede";

  const showCache = !isMultiLayer && mode !== "why-cache" && !isEviction && !isStampede;
  const showDb = !isMultiLayer && !isEviction && !isStampede;

  // Determine viewBox
  const viewH = isEviction ? 320 : 350;

  return (
    <svg viewBox={`0 0 420 ${viewH}`} className="w-full h-auto" style={{ maxHeight: "55vh" }}>
      {isMultiLayer ? (
        // Multi-layer view
        <>
          {layers.map((layer, i) => {
            const isHit = multiLayerHitLevel === i;
            const isPassed = multiLayerHitLevel > i;
            const isMissed = multiLayerHitLevel > i && multiLayerHitLevel < layers.length;
            return (
              <g key={i}>
                {i < layers.length - 1 && (
                  <ConnectionLine
                    x1={layer.x + 30} y1={layer.y}
                    x2={layers[i + 1].x - 30} y2={layers[i + 1].y}
                    active={isPassed || isHit}
                    dimmed={multiLayerHitLevel >= 0 && multiLayerHitLevel < i}
                  />
                )}
                <CacheNode
                  x={layer.x} y={layer.y} emoji={layer.emoji} label={layer.label}
                  active={isHit || isPassed}
                  hit={isHit}
                  dimmed={multiLayerHitLevel >= 0 && multiLayerHitLevel < i}
                />
                {isHit && (
                  <motion.text
                    x={layer.x} y={layer.y - 42} textAnchor="middle" fontSize={12} fontWeight={700}
                    fill="#2ecc71"
                    initial={{ opacity: 0, y: layer.y - 36 }}
                    animate={{ opacity: 1, y: layer.y - 42 }}
                  >
                    HIT
                  </motion.text>
                )}
                {isMissed && !isHit && (
                  <text x={layer.x} y={layer.y - 42} textAnchor="middle" fontSize={10} fontWeight={500} fill="#e74c3c" opacity={0.6}>
                    MISS
                  </text>
                )}
              </g>
            );
          })}
          {/* Multi-layer packet */}
          <AnimatePresence mode="wait">
            {cycle >= 0 && (
              <motion.g key={`ml-${cycle}`}>
                {multiLayerHitLevel === 0 && (
                  <Packet fromX={layers[0].x - 20} fromY={layers[0].y} toX={layers[0].x - 2} toY={layers[0].y} delay={0} duration={0.3} color="#2ecc71" label="cached" />
                )}
                {multiLayerHitLevel === 1 && (
                  <>
                    <Packet fromX={layers[0].x + 30} fromY={layers[0].y} toX={layers[1].x - 30} toY={layers[1].y} delay={0} color="#e67e22" />
                    <Packet fromX={layers[1].x - 30} fromY={layers[1].y} toX={layers[0].x + 30} toY={layers[0].y} delay={0.7} color="#2ecc71" />
                  </>
                )}
                {multiLayerHitLevel === 2 && (
                  <>
                    <Packet fromX={layers[0].x + 30} fromY={layers[0].y} toX={layers[1].x - 30} toY={layers[1].y} delay={0} duration={0.3} color="#e67e22" />
                    <Packet fromX={layers[1].x + 30} fromY={layers[1].y} toX={layers[2].x - 30} toY={layers[2].y} delay={0.4} duration={0.4} color="#e67e22" />
                    <Packet fromX={layers[2].x - 30} fromY={layers[2].y} toX={layers[0].x + 30} toY={layers[0].y} delay={1} duration={0.5} color="#2ecc71" />
                  </>
                )}
                {multiLayerHitLevel === 3 && (
                  <>
                    <Packet fromX={layers[0].x + 30} fromY={layers[0].y} toX={layers[1].x - 30} toY={layers[1].y} delay={0} duration={0.2} color="#e67e22" />
                    <Packet fromX={layers[1].x + 30} fromY={layers[1].y} toX={layers[2].x - 30} toY={layers[2].y} delay={0.3} duration={0.3} color="#e67e22" />
                    <Packet fromX={layers[2].x + 30} fromY={layers[2].y} toX={layers[3].x - 30} toY={layers[3].y} delay={0.7} duration={0.3} color="#e67e22" />
                    <Packet fromX={layers[3].x - 30} fromY={layers[3].y} toX={layers[0].x + 30} toY={layers[0].y} delay={1.2} duration={0.5} color="#2ecc71" />
                  </>
                )}
              </motion.g>
            )}
          </AnimatePresence>
        </>
      ) : isEviction ? (
        // Eviction view — cache slots
        <>
          <text x={210} y={55} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--primary-color)">Cache (capacity: 4)</text>
          {[0, 1, 2, 3].map((i) => {
            const y = slotStartY + i * (slotH + slotGap);
            const filled = i < Math.min(slotsUsed, 4);
            const isEvicted = slotsUsed >= 5 && i === 0;
            const labels = ["user:1", "user:2", "user:3", "user:4"];
            const newLabel = slotsUsed >= 5 && i === 0 ? "user:5" : labels[i];
            return (
              <g key={i}>
                <motion.rect
                  x={slotX} y={y} width={slotW} height={slotH} rx={4}
                  fill={isEvicted ? "rgba(231,76,60,0.1)" : filled ? "var(--card-bg)" : "transparent"}
                  stroke={isEvicted ? "#e74c3c" : filled ? "var(--accent-color)" : "var(--border-color)"}
                  strokeWidth={filled ? 1.5 : 1}
                  strokeDasharray={filled ? "none" : "3 3"}
                  animate={{ opacity: isEvicted ? [1, 0.3, 1] : 1 }}
                  transition={isEvicted ? { duration: 0.5, repeat: 2 } : {}}
                />
                {filled && (
                  <motion.text
                    x={slotX + slotW / 2} y={y + slotH / 2 + 1}
                    textAnchor="middle" dominantBaseline="central"
                    fontSize={12} fontWeight={500}
                    fill={isEvicted ? "#e74c3c" : "var(--primary-color)"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {newLabel}
                  </motion.text>
                )}
                {/* Access time indicator */}
                {filled && !isEvicted && (
                  <text
                    x={slotX + slotW + 8} y={y + slotH / 2 + 1}
                    dominantBaseline="central" fontSize={9} fill="var(--muted-text)"
                  >
                    {i === 3 ? "recent" : i === 0 ? "oldest" : ""}
                  </text>
                )}
              </g>
            );
          })}
          {/* Eviction label */}
          {slotsUsed >= 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={210} y={260} textAnchor="middle" fontSize={13} fontWeight={600} fill="#e74c3c">
                LRU Evicted: user:1
              </text>
              <text x={210} y={280} textAnchor="middle" fontSize={10} fill="var(--muted-text)">
                Replaced by user:5
              </text>
            </motion.g>
          )}
          {/* New entry arriving */}
          {slotsUsed === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <text x={210} y={260} textAnchor="middle" fontSize={11} fontWeight={500} fill="var(--accent-color)">
                New entry: user:5 arriving...
              </text>
            </motion.g>
          )}
        </>
      ) : isStampede ? (
        // Stampede view
        <>
          <CacheNode x={200} y={140} emoji="🗄️" label="Cache" active miss={stampedePhase >= 1} />
          <CacheNode x={360} y={140} emoji="🗃️" label="Database" active={stampedePhase >= 1} />
          <ConnectionLine x1={230} y1={140} x2={330} y2={140} active={stampedePhase >= 1} />

          {/* Multiple clients */}
          {[0, 1, 2, 3].map((i) => {
            const y = 80 + i * 40;
            return (
              <g key={i}>
                <motion.circle
                  cx={50} cy={y} r={18} fill="var(--card-bg)" stroke="var(--border-color)" strokeWidth={1}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                />
                <motion.text
                  x={50} y={y + 1} textAnchor="middle" dominantBaseline="central" fontSize={14}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                >
                  👤
                </motion.text>
                {/* Lines from clients to cache */}
                <motion.line
                  x1={68} y1={y} x2={172} y2={140}
                  stroke="var(--border-color)" strokeWidth={1} strokeDasharray="4 4"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
                  transition={{ delay: i * 0.15 }}
                />
              </g>
            );
          })}

          {/* EXPIRED label */}
          {stampedePhase >= 1 && (
            <motion.text
              x={200} y={100} textAnchor="middle" fontSize={12} fontWeight={700} fill="#e74c3c"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              EXPIRED
            </motion.text>
          )}

          {/* Flood packets to DB */}
          <AnimatePresence>
            {stampedePhase === 1 && (
              <motion.g key="flood">
                {[0, 1, 2, 3].map((i) => (
                  <Packet key={i} fromX={230} fromY={140} toX={330} toY={140} delay={i * 0.15} color="#e74c3c" r={5} />
                ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* DB overload */}
          {stampedePhase === 1 && (
            <motion.text
              x={360} y={100} textAnchor="middle" fontSize={11} fontWeight={600} fill="#e74c3c"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              Overload! 🔥
            </motion.text>
          )}

          {/* Solution: lock */}
          {stampedePhase === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={200} y={100} textAnchor="middle" fontSize={18}>🔒</text>
              <text x={200} y={195} textAnchor="middle" fontSize={10} fontWeight={500} fill="#2ecc71">
                Mutex — only 1 request refills
              </text>
              <Packet fromX={230} fromY={140} toX={330} toY={140} delay={0.3} color="#2ecc71" label="1 req" />
            </motion.g>
          )}
        </>
      ) : (
        // Standard 3-node view
        <>
          {/* Connection lines */}
          <ConnectionLine
            x1={client.x + 30} y1={client.y} x2={cache.x - 30} y2={cache.y}
            active={cycle >= 0 && mode !== "idle"}
          />
          <ConnectionLine
            x1={cache.x + 30} y1={cache.y} x2={db.x - 30} y2={db.y}
            active={cycle >= 0 && (mode === "cache-miss" || mode === "cache-aside" || mode === "write-through" || mode === "write-behind")}
            dimmed={mode === "cache-hit"}
          />

          {/* Why-cache: no cache, just slow path */}
          {mode === "why-cache" && (
            <>
              <ConnectionLine x1={client.x + 24} y1={client.y} x2={db.x - 24} y2={db.y} active={cycle >= 0} />
              <AnimatePresence mode="wait">
                {cycle >= 0 && (
                  <motion.g key={`slow-${cycle}`}>
                    <Packet fromX={client.x + 30} fromY={client.y} toX={db.x - 30} toY={db.y} delay={0} duration={1} color="#e74c3c" label="~200ms" />
                    <Packet fromX={db.x - 30} fromY={db.y} toX={client.x + 30} toY={client.y} delay={1.2} duration={0.8} color="#e67e22" />
                  </motion.g>
                )}
              </AnimatePresence>
            </>
          )}

          {/* HIT / MISS label above cache */}
          {hitResult === "hit" && (
            <motion.text
              x={cache.x} y={cache.y - 44} textAnchor="middle" fontSize={14} fontWeight={700} fill="#2ecc71"
              initial={{ opacity: 0, y: cache.y - 38 }} animate={{ opacity: 1, y: cache.y - 44 }}
            >
              HIT ✓
            </motion.text>
          )}
          {hitResult === "miss" && (mode === "cache-miss" || mode === "cache-aside") && (
            <motion.text
              x={cache.x} y={cache.y - 44} textAnchor="middle" fontSize={14} fontWeight={700} fill="#e74c3c"
              initial={{ opacity: 0, y: cache.y - 38 }} animate={{ opacity: 1, y: cache.y - 44 }}
            >
              MISS ✗
            </motion.text>
          )}

          {/* Cache-hit packets */}
          <AnimatePresence mode="wait">
            {cycle >= 0 && mode === "cache-hit" && (
              <motion.g key={`hit-${cycle}`}>
                <Packet fromX={client.x + 30} fromY={client.y} toX={cache.x - 30} toY={cache.y} delay={0} color="#2ecc71" />
                <Packet fromX={cache.x - 30} fromY={cache.y} toX={client.x + 30} toY={client.y} delay={0.7} color="#2ecc71" label="< 1ms" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Cache-miss / cache-aside packets */}
          <AnimatePresence mode="wait">
            {cycle >= 0 && (mode === "cache-miss" || mode === "cache-aside") && (
              <motion.g key={`miss-${cycle}`}>
                <Packet fromX={client.x + 30} fromY={client.y} toX={cache.x - 30} toY={cache.y} delay={0} color="#e74c3c" />
                <Packet fromX={cache.x + 30} fromY={cache.y} toX={db.x - 30} toY={db.y} delay={0.7} color="#e67e22" label="query" />
                <Packet fromX={db.x - 30} fromY={db.y} toX={cache.x + 30} toY={cache.y} delay={1.5} color="#3498db" label="store" />
                <Packet fromX={cache.x - 30} fromY={cache.y} toX={client.x + 30} toY={client.y} delay={2.2} color="#2ecc71" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Write-through packets */}
          <AnimatePresence mode="wait">
            {cycle >= 0 && mode === "write-through" && (
              <motion.g key={`wt-${cycle}`}>
                <Packet fromX={client.x + 30} fromY={client.y} toX={cache.x - 30} toY={cache.y} delay={0} color="#9b59b6" label="write" />
                <Packet fromX={cache.x + 30} fromY={cache.y} toX={db.x - 30} toY={db.y} delay={0.7} color="#e67e22" label="sync" />
                <Packet fromX={db.x - 30} fromY={db.y} toX={cache.x + 30} toY={cache.y} delay={1.5} color="#2ecc71" label="ACK" r={4} />
                <Packet fromX={cache.x - 30} fromY={cache.y} toX={client.x + 30} toY={client.y} delay={2.2} color="#2ecc71" label="done" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Write-behind packets */}
          <AnimatePresence mode="wait">
            {cycle >= 0 && mode === "write-behind" && (
              <motion.g key={`wb-${cycle}`}>
                <Packet fromX={client.x + 30} fromY={client.y} toX={cache.x - 30} toY={cache.y} delay={0} color="#9b59b6" label="write" />
                <Packet fromX={cache.x - 30} fromY={cache.y} toX={client.x + 30} toY={client.y} delay={0.6} color="#2ecc71" label="done" />
                <Packet fromX={cache.x + 30} fromY={cache.y} toX={db.x - 30} toY={db.y} delay={1.8} color="#e67e22" label="async" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Write-behind queue indicator */}
          {mode === "write-behind" && cycle >= 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.8 }}>
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={cache.x + 55 + i * 14} cy={cache.y - 42} r={4} fill="var(--accent-color)" opacity={0.5 + i * 0.15} />
              ))}
              <text x={cache.x + 69} y={cache.y - 55} textAnchor="middle" fontSize={9} fill="var(--muted-text)">queue</text>
            </motion.g>
          )}

          {/* Write-through sync annotation */}
          {mode === "write-through" && (
            <motion.text
              x={(cache.x + db.x) / 2} y={cache.y - 48} textAnchor="middle" fontSize={9} fontWeight={500} fill="var(--accent-color)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            >
              Both must complete before response
            </motion.text>
          )}

          {/* Cache-aside annotation */}
          {mode === "cache-aside" && (
            <motion.text
              x={(client.x + cache.x) / 2} y={cache.y + 65} textAnchor="middle" fontSize={9} fontWeight={500} fill="var(--accent-color)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            >
              App manages cache + DB reads
            </motion.text>
          )}

          {/* Invalidation: TTL badge */}
          {mode === "invalidation" && (
            <motion.g>
              <rect x={cache.x - 26} y={cache.y - 62} width={52} height={22} rx={11} fill={ttl === 0 ? "#e74c3c" : "var(--accent-color)"} opacity={0.9} />
              <text x={cache.x} y={cache.y - 48} textAnchor="middle" fontSize={10} fontWeight={700} fill="white">
                {ttl === 0 ? "EXP" : `TTL ${ttl}`}
              </text>
            </motion.g>
          )}
          {mode === "invalidation" && ttl === 0 && (
            <motion.text
              x={cache.x} y={cache.y + 60} textAnchor="middle" fontSize={10} fontWeight={500} fill="#e74c3c"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              Entry expired — next request triggers MISS
            </motion.text>
          )}

          {/* Nodes */}
          {mode !== "why-cache" && (
            <CacheNode
              x={client.x} y={client.y} emoji="👤" label="Client"
              active={cycle >= 0 && mode !== "idle"}
            />
          )}
          {mode === "why-cache" && (
            <>
              <CacheNode x={client.x} y={client.y} emoji="👤" label="Client" active={cycle >= 0} />
              <CacheNode x={db.x} y={db.y} emoji="🗃️" label="Database" active={cycle >= 0} />
              <motion.text
                x={(client.x + db.x) / 2} y={client.y + 60} textAnchor="middle" fontSize={10} fill="var(--muted-text)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
              >
                No cache — every request hits the DB
              </motion.text>
            </>
          )}
          {showCache && (
            <CacheNode
              x={cache.x} y={cache.y} emoji="🗄️" label="Cache"
              active={cycle >= 0 && mode !== "idle"}
              hit={hitResult === "hit"}
              miss={hitResult === "miss" && (mode === "cache-miss" || mode === "cache-aside")}
            />
          )}
          {showDb && mode !== "why-cache" && (
            <CacheNode
              x={db.x} y={db.y} emoji="🗃️" label="Database"
              active={cycle >= 0 && mode !== "cache-hit"}
              dimmed={mode === "cache-hit"}
            />
          )}
        </>
      )}

      {/* Mode label */}
      {mode !== "idle" && (
        <motion.text
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          x={210} y={viewH - 12} textAnchor="middle" fontSize={11} fontWeight={500} fill="var(--muted-text)" fontStyle="italic"
        >
          {mode === "why-cache" && "Without cache — every request pays full DB latency"}
          {mode === "cache-hit" && "Cache hit — sub-millisecond response, DB untouched"}
          {mode === "cache-miss" && "Cache miss — query DB, store result for next time"}
          {mode === "cache-aside" && "Cache-aside — app manages reads from both cache and DB"}
          {mode === "write-through" && "Write-through — sync write to cache + DB (strong consistency)"}
          {mode === "write-behind" && "Write-behind — fast write to cache, async flush to DB"}
          {mode === "invalidation" && "TTL expiry — cached data has a limited lifespan"}
          {mode === "eviction" && "LRU eviction — oldest unused entry gets replaced"}
          {mode === "multi-layer" && (["Browser cache HIT", "CDN edge HIT", "Redis HIT", "Full miss — all layers"][multiLayerHitLevel] ?? "")}
          {mode === "stampede" && ["Clients waiting...", "All miss at once — DB flooded!", "Mutex: only 1 refills cache"][stampedePhase]}
          {mode === "summary" && "Full caching architecture — multiple layers, each with a purpose"}
        </motion.text>
      )}
    </svg>
  );
}
