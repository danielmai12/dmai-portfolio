"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NW = 56;
const NH = 44;

const C = {
  node: { bg: "rgba(42, 90, 138, 0.12)", border: "#2a5a8a" }, // blue
  leader: { bg: "rgba(42, 138, 90, 0.12)", border: "#2a8a5a" }, // green
  down: { bg: "rgba(138, 42, 42, 0.12)", border: "#8a2a2a" }, // red
  client: { bg: "rgba(58, 122, 138, 0.12)", border: "#3a7a8a" }, // teal
  db: { bg: "rgba(106, 58, 138, 0.12)", border: "#6a3a8a" }, // purple
};

function Node({
  x,
  y,
  label,
  sublabel,
  color,
  highlight,
}: {
  x: number;
  y: number;
  label: string;
  sublabel?: string;
  color?: { bg: string; border: string };
  highlight?: string;
}) {
  return (
    <g>
      <rect
        x={x - NW / 2}
        y={y - NH / 2}
        width={NW}
        height={NH}
        rx={8}
        fill={highlight || color?.bg || "var(--card-bg)"}
        stroke={
          highlight
            ? "var(--border-color)"
            : color?.border || "var(--border-color)"
        }
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={sublabel ? y - 2 : y + 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fill="var(--heading-color)"
        fontWeight={600}
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x}
          y={y + 12}
          textAnchor="middle"
          fontSize={8}
          fill="var(--muted-text)"
        >
          {sublabel}
        </text>
      )}
    </g>
  );
}

function Conn({
  x1,
  y1,
  x2,
  y2,
  dashed,
  color,
  opacity,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
  color?: string;
  opacity?: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color || "var(--border-color)"}
      strokeWidth={1.5}
      strokeDasharray={dashed ? "4 3" : undefined}
      opacity={opacity}
    />
  );
}

function useCycle(steps: number, ms: number) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % steps), ms);
    return () => clearInterval(t);
  }, [steps, ms, paused]);
  return { step, setStep, paused, setPaused };
}

function Timeline({
  step,
  total,
  labels,
  paused,
  onToggle,
  onStepClick,
}: {
  step: number;
  total: number;
  labels: string[];
  paused: boolean;
  onToggle: () => void;
  onStepClick: (i: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 4px 0",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onStepClick(i)}
            style={{
              width: i === step ? 18 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              background:
                i === step
                  ? "var(--primary-color)"
                  : "var(--border-color)",
              cursor: "pointer",
              transition: "all 0.2s",
              padding: 0,
            }}
            aria-label={`Step ${i + 1}`}
          />
        ))}
        <span
          style={{
            fontSize: 11,
            color: "var(--muted-text)",
            marginLeft: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {labels[step] || ""}
        </span>
      </div>
      <button
        onClick={onToggle}
        style={{
          background: "none",
          border: "1px solid var(--border-color)",
          borderRadius: 6,
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--muted-text)",
          fontSize: 12,
          flexShrink: 0,
        }}
        aria-label={paused ? "Play" : "Pause"}
      >
        {paused ? "▶" : "⏸"}
      </button>
    </div>
  );
}

function Pkt({
  from,
  to,
  color = "#3498db",
  dur = 0.8,
}: {
  from: [number, number];
  to: [number, number];
  color?: string;
  dur?: number;
}) {
  return (
    <motion.circle
      r={5}
      fill={color}
      initial={{ cx: from[0], cy: from[1], opacity: 0 }}
      animate={{ cx: to[0], cy: to[1], opacity: [0, 1, 1, 0] }}
      transition={{ duration: dur }}
    />
  );
}

function Badge({
  x,
  y,
  text,
  color,
}: {
  x: number;
  y: number;
  text: string;
  color: string;
}) {
  return (
    <motion.text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={11}
      fontWeight={700}
      fill={color}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {text}
    </motion.text>
  );
}

// Diagram 1: CAP Triangle
export function CapTriangleDiagram() {
  const { step, setStep, paused, setPaused } = useCycle(10, 1400);

  const cx = 220;
  // Triangle section (top half)
  const top = { x: cx, y: 30 };
  const left = { x: 100, y: 170 };
  const right = { x: 340, y: 170 };

  const cpActive = step === 1;
  const apActive = step === 2;
  const caActive = step === 3;

  // Node section (bottom half)
  const ny = 260;
  const n1 = { x: 100, y: ny };
  const n2 = { x: 220, y: ny };
  const n3 = { x: 340, y: ny };
  const partitioned = step >= 6;
  const splitX = 170;

  const stepLabels = [
    "The CAP triangle: pick two guarantees",
    "CP: Consistency + Partition Tolerance",
    "AP: Availability + Partition Tolerance",
    "CA: Only possible without a network (single node)",
    "Three nodes replicating data normally",
    "All nodes in sync",
    "Network splits between A and B",
    "A cannot reach B or C",
    "B and C still communicate",
    "Now the system must choose: consistency or availability?",
  ];

  return (
    <div>
      <svg className="w-full" viewBox="0 0 440 310">
        {/* === Triangle (top) === */}
        <line
          x1={top.x}
          y1={top.y + 22}
          x2={left.x + 20}
          y2={left.y - 22}
          stroke={cpActive ? "#2a8a5a" : "var(--border-color)"}
          strokeWidth={cpActive ? 2.5 : 1.5}
          opacity={cpActive ? 1 : 0.4}
        />
        <line
          x1={top.x}
          y1={top.y + 22}
          x2={right.x - 20}
          y2={right.y - 22}
          stroke={caActive ? "#8a6a2a" : "var(--border-color)"}
          strokeWidth={caActive ? 2.5 : 1.5}
          opacity={caActive ? 1 : 0.4}
        />
        <line
          x1={left.x + 28}
          y1={left.y}
          x2={right.x - 28}
          y2={right.y}
          stroke={apActive ? "#2a5a8a" : "var(--border-color)"}
          strokeWidth={apActive ? 2.5 : 1.5}
          opacity={apActive ? 1 : 0.4}
        />

        <Node
          x={top.x}
          y={top.y}
          label="C"
          sublabel="Consistency"
          color={cpActive || caActive ? C.leader : C.node}
        />
        <Node
          x={left.x}
          y={left.y}
          label="A"
          sublabel="Availability"
          color={apActive || caActive ? C.leader : C.node}
        />
        <Node
          x={right.x}
          y={right.y}
          label="P"
          sublabel="Partition Tol."
          color={cpActive || apActive ? C.leader : C.node}
        />

        {cpActive && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <text x={135} y={90} textAnchor="middle" fontSize={10} fill="#2a8a5a" fontWeight={600}>CP</text>
            <text x={135} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-text)">HBase, ZooKeeper, etcd</text>
          </motion.g>
        )}
        {apActive && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <text x={cx} y={192} textAnchor="middle" fontSize={10} fill="#2a5a8a" fontWeight={600}>AP</text>
            <text x={cx} y={207} textAnchor="middle" fontSize={8} fill="var(--muted-text)">Cassandra, DynamoDB, CouchDB</text>
          </motion.g>
        )}
        {caActive && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <text x={305} y={90} textAnchor="middle" fontSize={10} fill="#8a6a2a" fontWeight={600}>CA</text>
            <text x={305} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-text)">Single-node RDBMS (no network)</text>
          </motion.g>
        )}

        {/* === Divider === */}
        <line
          x1={40}
          y1={218}
          x2={400}
          y2={218}
          stroke="var(--border-color)"
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.3}
        />

        {/* === 3-Node Partition (bottom) === */}
        <Conn
          x1={n1.x + 28}
          y1={n1.y}
          x2={n2.x - 28}
          y2={n2.y}
          dashed={partitioned}
          color={partitioned ? "#8a2a2a" : undefined}
          opacity={partitioned ? 0.4 : 1}
        />
        <Conn x1={n2.x + 28} y1={n2.y} x2={n3.x - 28} y2={n3.y} />

        {partitioned && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <line
              x1={splitX}
              y1={230}
              x2={splitX}
              y2={300}
              stroke="#e74c3c"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            <text
              x={splitX}
              y={228}
              textAnchor="middle"
              fontSize={9}
              fill="#e74c3c"
              fontWeight={600}
            >
              Network Partition
            </text>
          </motion.g>
        )}

        <Node
          x={n1.x}
          y={n1.y}
          label="Node A"
          color={partitioned ? C.down : C.node}
          highlight={partitioned ? "rgba(138, 42, 42, 0.2)" : undefined}
        />
        <Node x={n2.x} y={n2.y} label="Node B" color={C.node} />
        <Node x={n3.x} y={n3.y} label="Node C" color={C.node} />

        {step === 4 && (
          <Pkt from={[n1.x, n1.y]} to={[n2.x, n2.y]} color="#2ecc71" dur={0.6} />
        )}
        {step === 5 && (
          <Pkt from={[n2.x, n2.y]} to={[n3.x, n3.y]} color="#2ecc71" dur={0.6} />
        )}
        {step === 7 && (
          <>
            <Pkt from={[n1.x, n1.y]} to={[splitX - 5, n1.y]} color="#e74c3c" dur={0.5} />
            <Badge x={splitX} y={248} text="✕" color="#e74c3c" />
          </>
        )}
        {step === 8 && (
          <Pkt from={[n2.x, n2.y]} to={[n3.x, n3.y]} color="#2ecc71" dur={0.6} />
        )}
      </svg>
      <Timeline
        step={step}
        total={10}
        labels={stepLabels}
        paused={paused}
        onToggle={() => setPaused((p) => !p)}
        onStepClick={(i) => {
          setStep(i);
          setPaused(true);
        }}
      />
    </div>
  );
}

// Diagram 3: CP vs AP behavior during a partition
export function CpVsApDiagram() {
  const { step, setStep, paused, setPaused } = useCycle(6, 1400);

  const stepLabels = [
    "During a network partition...",
    "CP: client requests data",
    "CP: node rejects - can't confirm consistency",
    "AP: client requests data",
    "AP: node responds with local copy",
    "Same partition, different tradeoff",
  ];

  return (
    <div>
      <svg className="w-full" viewBox="0 0 440 170">
        {/* Divider */}
        <line
          x1={220}
          y1={10}
          x2={220}
          y2={160}
          stroke="var(--border-color)"
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.3}
        />
        <text
          x={110}
          y={18}
          textAnchor="middle"
          fontSize={11}
          fill="#2a8a5a"
          fontWeight={700}
        >
          CP System
        </text>
        <text
          x={330}
          y={18}
          textAnchor="middle"
          fontSize={11}
          fill="#2a5a8a"
          fontWeight={700}
        >
          AP System
        </text>

        {/* CP side */}
        <Node x={60} y={60} label="Client" color={C.client} />
        <Node x={160} y={60} label="Node" color={C.node} />
        <Conn x1={88} y1={60} x2={132} y2={60} />

        {/* AP side */}
        <Node x={280} y={60} label="Client" color={C.client} />
        <Node x={380} y={60} label="Node" color={C.node} />
        <Conn x1={308} y1={60} x2={352} y2={60} />

        {/* Partition indicator */}
        <text x={110} y={105} textAnchor="middle" fontSize={8} fill="#e74c3c">
          (partitioned from leader)
        </text>
        <text x={330} y={105} textAnchor="middle" fontSize={8} fill="#e74c3c">
          (partitioned from peers)
        </text>

        {/* CP: client sends request → gets error */}
        {step === 1 && (
          <Pkt from={[60, 60]} to={[160, 60]} color="#3498db" dur={0.6} />
        )}
        {step === 2 && (
          <>
            <Badge x={160} y={38} text="503 ERROR" color="#e74c3c" />
            <Pkt from={[160, 60]} to={[60, 60]} color="#e74c3c" dur={0.6} />
          </>
        )}

        {/* AP: client sends request → gets stale data */}
        {step === 3 && (
          <Pkt from={[280, 60]} to={[380, 60]} color="#3498db" dur={0.6} />
        )}
        {step === 4 && (
          <>
            <Badge x={380} y={38} text="200 OK (stale)" color="#e67e22" />
            <Pkt from={[380, 60]} to={[280, 60]} color="#2ecc71" dur={0.6} />
          </>
        )}

        {/* Outcome labels */}
        {(step === 2 || step === 5) && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <rect x={20} y={120} width={180} height={36} rx={6}
              fill={C.down.bg} stroke={C.down.border} strokeWidth={1} />
            <text x={110} y={142} textAnchor="middle" fontSize={9} fill="var(--muted-text)">
              Refuses stale reads
            </text>
          </motion.g>
        )}
        {(step === 4 || step === 5) && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <rect x={240} y={120} width={180} height={36} rx={6}
              fill={C.leader.bg} stroke={C.leader.border} strokeWidth={1} />
            <text x={330} y={142} textAnchor="middle" fontSize={9} fill="var(--muted-text)">
              Serves data, may be stale
            </text>
          </motion.g>
        )}
      </svg>
      <Timeline
        step={step}
        total={6}
        labels={stepLabels}
        paused={paused}
        onToggle={() => setPaused((p) => !p)}
        onStepClick={(i) => {
          setStep(i);
          setPaused(true);
        }}
      />
    </div>
  );
}

// Diagram 4: Raft Leader Election
export function RaftElectionDiagram() {
  const { step } = useCycle(8, 1100);

  const nodes = [
    { x: 80, y: 90, label: "A" },
    { x: 180, y: 90, label: "B" },
    { x: 280, y: 90, label: "C" },
    { x: 380, y: 90, label: "D" },
    { x: 230, y: 40, label: "E" },
  ];

  const leaderDead = step >= 1;
  const candidateB = step >= 2 && step <= 5;
  const bIsLeader = step >= 6;

  return (
    <svg className="w-full" viewBox="0 0 440 170">
      {/* Connections between nodes */}
      {nodes.map((n, i) =>
        nodes.slice(i + 1).map((m, j) => (
          <Conn
            key={`${i}-${j}`}
            x1={n.x}
            y1={n.y}
            x2={m.x}
            y2={m.y}
            dashed
            opacity={0.15}
          />
        )),
      )}

      {/* Nodes */}
      {nodes.map((n, i) => {
        let color = C.node;
        let hl: string | undefined;
        if (i === 0 && !leaderDead) {
          color = C.leader; // A is leader
        }
        if (i === 0 && leaderDead) {
          color = C.down;
          hl = "rgba(138, 42, 42, 0.2)";
        }
        if (i === 1 && candidateB) {
          color = { bg: "rgba(138, 138, 42, 0.12)", border: "#8a8a2a" }; // yellow candidate
        }
        if (i === 1 && bIsLeader) {
          color = C.leader; // B becomes leader
        }
        return (
          <Node
            key={i}
            x={n.x}
            y={n.y}
            label={n.label}
            color={color}
            highlight={hl}
          />
        );
      })}

      {/* Leader badge */}
      {!leaderDead && (
        <Badge x={80} y={58} text="Leader" color="#2ecc71" />
      )}
      {leaderDead && step <= 5 && (
        <Badge x={80} y={58} text="Down" color="#e74c3c" />
      )}
      {bIsLeader && <Badge x={180} y={58} text="Leader" color="#2ecc71" />}

      {/* Candidate badge */}
      {candidateB && step < 6 && (
        <Badge x={180} y={58} text="Candidate" color="#e6c53a" />
      )}

      {/* Vote request packets */}
      {step === 3 &&
        [2, 3, 4].map((i) => (
          <Pkt
            key={`vote-${i}`}
            from={[180, 90]}
            to={[nodes[i].x, nodes[i].y]}
            color="#e6c53a"
            dur={0.6}
          />
        ))}

      {/* Vote responses */}
      {step === 4 &&
        [2, 3, 4].map((i) => (
          <Pkt
            key={`ack-${i}`}
            from={[nodes[i].x, nodes[i].y]}
            to={[180, 90]}
            color="#2ecc71"
            dur={0.6}
          />
        ))}

      {step === 5 && <Badge x={230} y={140} text="Majority reached" color="#2ecc71" />}

      {/* New leader replicating */}
      {step === 7 &&
        [2, 3, 4].map((i) => (
          <Pkt
            key={`rep-${i}`}
            from={[180, 90]}
            to={[nodes[i].x, nodes[i].y]}
            color="#2ecc71"
            dur={0.7}
          />
        ))}

      <text
        x={220}
        y={162}
        textAnchor="middle"
        fontSize={10}
        fill="var(--muted-text)"
      >
        {
          [
            "A is the current leader",
            "Leader A goes down",
            "B starts election (increments term)",
            "B requests votes from C, D, E",
            "Nodes vote for B",
            "B wins majority (3/4 votes)",
            "B becomes the new leader",
            "B begins replicating to followers",
          ][step]
        }
      </text>
    </svg>
  );
}

// Diagram 5: Raft Log Replication
export function RaftReplicationDiagram() {
  const { step } = useCycle(6, 1200);

  const leader = { x: 120, y: 50 };
  const followers = [
    { x: 300, y: 30, label: "Follower 1" },
    { x: 300, y: 80, label: "Follower 2" },
    { x: 300, y: 130, label: "Follower 3" },
  ];
  const client = { x: 30, y: 50 };

  return (
    <svg className="w-full" viewBox="0 0 440 170">
      {/* Connections */}
      <Conn x1={client.x + 28} y1={client.y} x2={leader.x - 28} y2={leader.y} />
      {followers.map((f, i) => (
        <Conn
          key={i}
          x1={leader.x + 28}
          y1={leader.y}
          x2={f.x - 28}
          y2={f.y}
        />
      ))}

      {/* Client */}
      <Node x={client.x} y={client.y} label="Client" color={C.client} />

      {/* Leader */}
      <Node x={leader.x} y={leader.y} label="Leader" color={C.leader} />
      <Badge x={120} y={18} text="Term 3" color="#2a8a5a" />

      {/* Followers */}
      {followers.map((f, i) => (
        <Node key={i} x={f.x} y={f.y} label={f.label} color={C.node} />
      ))}

      {/* 1. Client writes to leader */}
      {step === 0 && (
        <Pkt from={[client.x, client.y]} to={[leader.x, leader.y]} color="#e67e22" dur={0.6} />
      )}

      {/* 2. Leader appends to local log */}
      {step === 1 && (
        <Badge x={120} y={90} text="Append to log" color="#e67e22" />
      )}

      {/* 3. Leader replicates to followers */}
      {step === 2 &&
        followers.map((f, i) => (
          <Pkt
            key={`rep-${i}`}
            from={[leader.x, leader.y]}
            to={[f.x, f.y]}
            color="#3498db"
            dur={0.7}
          />
        ))}

      {/* 4. Followers acknowledge */}
      {step === 3 &&
        followers.map((f, i) => (
          <Pkt
            key={`ack-${i}`}
            from={[f.x, f.y]}
            to={[leader.x, leader.y]}
            color="#2ecc71"
            dur={0.6}
          />
        ))}

      {/* 5. Majority ack → commit */}
      {step === 4 && (
        <Badge x={220} y={155} text="Majority ACK → entry committed" color="#2ecc71" />
      )}

      {/* 6. Leader responds to client */}
      {step === 5 && (
        <Pkt
          from={[leader.x, leader.y]}
          to={[client.x, client.y]}
          color="#2ecc71"
          dur={0.6}
        />
      )}

      <text
        x={220}
        y={165}
        textAnchor="middle"
        fontSize={10}
        fill="var(--muted-text)"
      >
        {
          [
            "1. Client sends write to leader",
            "2. Leader appends to its log",
            "3. Leader replicates entry to followers",
            "4. Followers acknowledge",
            "5. Majority confirmed → committed",
            "6. Leader responds to client",
          ][step]
        }
      </text>
    </svg>
  );
}

// Diagram 6: PACELC
export function PacelcDiagram() {
  const { step } = useCycle(3, 2500);

  return (
    <svg className="w-full" viewBox="0 0 440 160">
      {/* Two boxes: Partition and Else */}
      <rect
        x={20}
        y={20}
        width={190}
        height={100}
        rx={10}
        fill={step === 1 ? "rgba(231, 76, 60, 0.08)" : "var(--card-bg)"}
        stroke={step === 1 ? "#e74c3c" : "var(--border-color)"}
        strokeWidth={step === 1 ? 2 : 1.5}
      />
      <text
        x={115}
        y={16}
        textAnchor="middle"
        fontSize={10}
        fill="#e74c3c"
        fontWeight={600}
      >
        If Partition (P)
      </text>
      <text
        x={115}
        y={55}
        textAnchor="middle"
        fontSize={12}
        fill="var(--heading-color)"
        fontWeight={600}
      >
        Choose:
      </text>
      <text
        x={75}
        y={80}
        textAnchor="middle"
        fontSize={14}
        fill="#2a8a5a"
        fontWeight={700}
      >
        C
      </text>
      <text
        x={115}
        y={80}
        textAnchor="middle"
        fontSize={12}
        fill="var(--muted-text)"
      >
        or
      </text>
      <text
        x={155}
        y={80}
        textAnchor="middle"
        fontSize={14}
        fill="#2a5a8a"
        fontWeight={700}
      >
        A
      </text>
      <text
        x={75}
        y={96}
        textAnchor="middle"
        fontSize={8}
        fill="var(--muted-text)"
      >
        Consistency
      </text>
      <text
        x={155}
        y={96}
        textAnchor="middle"
        fontSize={8}
        fill="var(--muted-text)"
      >
        Availability
      </text>

      <rect
        x={230}
        y={20}
        width={190}
        height={100}
        rx={10}
        fill={step === 2 ? "rgba(46, 204, 113, 0.08)" : "var(--card-bg)"}
        stroke={step === 2 ? "#2ecc71" : "var(--border-color)"}
        strokeWidth={step === 2 ? 2 : 1.5}
      />
      <text
        x={325}
        y={16}
        textAnchor="middle"
        fontSize={10}
        fill="#2ecc71"
        fontWeight={600}
      >
        Else (E) - Normal Operation
      </text>
      <text
        x={325}
        y={55}
        textAnchor="middle"
        fontSize={12}
        fill="var(--heading-color)"
        fontWeight={600}
      >
        Choose:
      </text>
      <text
        x={285}
        y={80}
        textAnchor="middle"
        fontSize={14}
        fill="#6a3a8a"
        fontWeight={700}
      >
        L
      </text>
      <text
        x={325}
        y={80}
        textAnchor="middle"
        fontSize={12}
        fill="var(--muted-text)"
      >
        or
      </text>
      <text
        x={365}
        y={80}
        textAnchor="middle"
        fontSize={14}
        fill="#2a8a5a"
        fontWeight={700}
      >
        C
      </text>
      <text
        x={285}
        y={96}
        textAnchor="middle"
        fontSize={8}
        fill="var(--muted-text)"
      >
        Latency
      </text>
      <text
        x={365}
        y={96}
        textAnchor="middle"
        fontSize={8}
        fill="var(--muted-text)"
      >
        Consistency
      </text>

      <text
        x={220}
        y={148}
        textAnchor="middle"
        fontSize={10}
        fill="var(--muted-text)"
      >
        {
          [
            'PACELC: "if Partition → A or C, Else → L or C"',
            "During a partition: trade consistency for availability, or vice versa",
            "Normal operation: trade latency for consistency, or vice versa",
          ][step]
        }
      </text>
    </svg>
  );
}
