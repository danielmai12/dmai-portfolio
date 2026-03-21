"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NW = 56;
const NH = 44;

// Consistent color palette for node types
const C = {
  app:   { bg: "#162438", border: "#2a5a8a" },  // blue
  cache: { bg: "#1a3528", border: "#2a8a5a" },  // green
  db:    { bg: "#281a35", border: "#6a3a8a" },  // purple
  user:  { bg: "#1a2830", border: "#3a7a8a" },  // teal
};

function Node({ x, y, emoji, label, highlight, color }: {
  x: number; y: number; emoji: string; label: string;
  highlight?: string; color?: { bg: string; border: string };
}) {
  return (
    <g>
      <rect x={x - NW / 2} y={y - NH / 2} width={NW} height={NH} rx={8}
        fill={highlight || color?.bg || "var(--card-bg)"}
        stroke={highlight ? "var(--border-color)" : color?.border || "var(--border-color)"} strokeWidth={1.5} />
      <text x={x} y={y + 2} textAnchor="middle" dominantBaseline="central" fontSize={20}>{emoji}</text>
      <text x={x} y={y + NH / 2 + 14} textAnchor="middle" fontSize={10} fill="var(--muted-text)">{label}</text>
    </g>
  );
}

function Conn({ x1, y1, x2, y2, dashed }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border-color)" strokeWidth={1.5} strokeDasharray={dashed ? "4 3" : undefined} />;
}

function useCycle(steps: number, ms: number) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps), ms);
    return () => clearInterval(t);
  }, [steps, ms]);
  return step;
}

function Pkt({ from, to, color = "#3498db", dur = 0.8 }: { from: [number, number]; to: [number, number]; color?: string; dur?: number }) {
  return (
    <motion.circle r={5} fill={color}
      initial={{ cx: from[0], cy: from[1], opacity: 0 }}
      animate={{ cx: to[0], cy: to[1], opacity: [0, 1, 1, 0] }}
      transition={{ duration: dur }}
    />
  );
}

function Badge({ x, y, text, color }: { x: number; y: number; text: string; color: string }) {
  return (
    <motion.text x={x} y={y} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {text}
    </motion.text>
  );
}

export function ExternalCacheDiagram() {
  const step = useCycle(3, 1200);
  return (
    <svg className="w-full" viewBox="0 0 440 150">
      <Conn x1={98} y1={65} x2={192} y2={65} />
      <Conn x1={248} y1={65} x2={342} y2={65} />
      <Node x={70} y={65} emoji="🖥️" label="App" color={C.app} />
      <Node x={220} y={65} emoji="⚡" label="Redis" color={C.cache} />
      <Node x={370} y={65} emoji="🗄️" label="Database" color={C.db} />
      {step === 0 && <Pkt key="step0" from={[70, 65]} to={[220, 65]} color="#3498db" />}
      {step === 1 && (
        <>
          <Badge x={220} y={30} text="HIT" color="#2ecc71" />
          <Pkt key="step1" from={[220, 65]} to={[70, 65]} color="#2ecc71" />
        </>
      )}
    </svg>
  );
}

export function CdnCacheDiagram() {
  const step = useCycle(7, 1100);

  const origin = { x: 115, y: 105 };
  const edges = [
    { x: 252, y: 60, label: "London" },
    { x: 412, y: 80, label: "Tokyo" },
    { x: 152, y: 195, label: "São Paulo" },
    { x: 432, y: 190, label: "Sydney" },
  ];
  const user = { x: 372, y: 128 };
  const tokyo = edges[1];

  return (
    <svg className="w-full" viewBox="0 0 500 265">
      {/* Continent shapes */}
      <g opacity={0.07} fill="var(--muted-text)">
        <path d="M 55,62 C 72,42 138,38 168,54 C 184,64 186,94 176,116 C 166,136 128,148 98,142 C 72,136 52,118 48,98 C 44,78 48,68 55,62 Z" />
        <path d="M 128,158 C 144,148 168,150 174,166 C 182,186 178,218 164,234 C 150,244 134,238 126,222 C 116,202 114,176 128,158 Z" />
        <path d="M 238,46 C 254,36 284,40 292,54 C 300,70 296,90 288,102 C 280,116 274,128 270,148 C 264,168 268,192 262,212 C 256,226 244,220 240,204 C 232,180 234,154 236,134 C 238,114 230,94 234,74 C 236,56 237,50 238,46 Z" />
        <path d="M 312,52 C 338,36 388,30 432,46 C 458,56 470,76 466,104 C 460,124 444,140 418,146 C 392,150 362,142 342,130 C 318,118 302,96 306,76 C 308,64 310,56 312,52 Z" />
        <path d="M 406,170 C 420,160 450,163 460,176 C 468,188 464,206 450,213 C 436,218 414,216 406,203 C 398,190 396,178 406,170 Z" />
      </g>

      {/* Network lines from origin to edges */}
      {edges.map((e, i) => (
        <line key={i} x1={origin.x} y1={origin.y} x2={e.x} y2={e.y}
          stroke="var(--border-color)" strokeWidth={1} strokeDasharray="3 4" opacity={0.35} />
      ))}

      {/* Line from user to Tokyo edge */}
      <line x1={user.x} y1={user.y} x2={tokyo.x} y2={tokyo.y}
        stroke="var(--border-color)" strokeWidth={1} strokeDasharray="3 4" opacity={0.35} />

      {/* Origin server */}
      <circle cx={origin.x} cy={origin.y} r={14} fill={C.db.bg} stroke="#e67e22" strokeWidth={1.5} />
      <text x={origin.x} y={origin.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={13}>🏢</text>
      <text x={origin.x} y={origin.y + 24} textAnchor="middle" fontSize={8} fill="#e67e22" fontWeight={600}>Origin</text>

      {/* Edge servers */}
      {edges.map((e, i) => (
        <g key={i}>
          <circle cx={e.x} cy={e.y} r={11} fill={C.cache.bg}
            stroke={step >= 3 && step <= 6 && e === tokyo ? "#e74c3c" : C.cache.border} strokeWidth={1.5} />
          <text x={e.x} y={e.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={11}>🌐</text>
          <text x={e.x} y={e.y + 20} textAnchor="middle" fontSize={8} fill="var(--muted-text)">{e.label}</text>
        </g>
      ))}

      {/* User */}
      <circle cx={user.x} cy={user.y} r={10} fill={C.user.bg} stroke={C.user.border} strokeWidth={1.5} />
      <text x={user.x} y={user.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={11}>👤</text>
      <text x={user.x} y={user.y + 19} textAnchor="middle" fontSize={8} fill="var(--muted-text)">User</text>

      {/* HIT: user → tokyo edge → user */}
      {step === 0 && <Pkt key="h0" from={[user.x, user.y]} to={[tokyo.x, tokyo.y]} color="#3498db" dur={0.6} />}
      {step === 1 && (
        <>
          <Badge x={tokyo.x} y={tokyo.y - 20} text="HIT" color="#2ecc71" />
          <Pkt key="h1" from={[tokyo.x, tokyo.y]} to={[user.x, user.y]} color="#2ecc71" dur={0.5} />
        </>
      )}

      {/* MISS: user → tokyo → origin → tokyo → user */}
      {step === 3 && <Pkt key="m0" from={[user.x, user.y]} to={[tokyo.x, tokyo.y]} color="#3498db" dur={0.6} />}
      {step === 4 && (
        <>
          <Badge x={tokyo.x} y={tokyo.y - 20} text="MISS" color="#e74c3c" />
          <Pkt key="m1" from={[tokyo.x, tokyo.y]} to={[origin.x, origin.y]} color="#e67e22" dur={0.9} />
        </>
      )}
      {step === 5 && <Pkt key="m2" from={[origin.x, origin.y]} to={[tokyo.x, tokyo.y]} color="#2ecc71" dur={0.8} />}
      {step === 6 && <Pkt key="m3" from={[tokyo.x, tokyo.y]} to={[user.x, user.y]} color="#2ecc71" dur={0.5} />}

      {/* Step label */}
      <text x={250} y={255} textAnchor="middle" fontSize={10} fill="var(--muted-text)">
        {[
          "Request → nearest edge",
          "Edge cache HIT (fast)",
          "",
          "Request → nearest edge",
          "MISS → fetch from origin",
          "Origin responds",
          "Edge serves user",
        ][step]}
      </text>
    </svg>
  );
}

export function ClientCacheDiagram() {
  const step = useCycle(4, 1200);
  return (
    <svg className="w-full" viewBox="0 0 440 150">
      <Conn x1={148} y1={65} x2={292} y2={65} />
      <Node x={120} y={65} emoji="📱" label="Device" color={C.user} highlight={step === 0 ? "#1a3a2a" : undefined} />
      <Node x={320} y={65} emoji="🖥️" label="Server" color={C.app} />
      {step === 0 && (
        <g>
          <rect x={60} y={20} width={76} height={18} rx={4} fill="#2ecc71" opacity={0.2} stroke="#2ecc71" strokeWidth={1} />
          <text x={98} y={32} textAnchor="middle" fontSize={9} fill="#2ecc71">Local Cache</text>
        </g>
      )}
      {step === 1 && <Badge x={120} y={25} text="CACHED" color="#2ecc71" />}
      {step === 3 && <Pkt key="step3" from={[120, 65]} to={[320, 65]} color="#3498db" />}
    </svg>
  );
}

export function InProcessCacheDiagram() {
  const step = useCycle(5, 1200);
  return (
    <svg className="w-full" viewBox="0 0 440 170">
      {/* Server process boundary */}
      <rect x={30} y={16} width={250} height={110} rx={12}
        fill="var(--card-bg)" stroke="var(--border-color)" strokeWidth={1.5} strokeDasharray="6 3" />
      <text x={155} y={12} textAnchor="middle" fontSize={9} fill="var(--muted-text)" fontWeight={600}>
        Server Process (Node.js / JVM)
      </text>

      {/* App logic box inside process */}
      <rect x={50} y={40} width={60} height={42} rx={8}
        fill={C.app.bg} stroke={C.app.border} strokeWidth={1.5} />
      <text x={80} y={58} textAnchor="middle" dominantBaseline="central" fontSize={16}>⚙️</text>
      <text x={80} y={76} textAnchor="middle" fontSize={8} fill="var(--muted-text)">App Logic</text>

      {/* Local cache box inside process */}
      <rect x={160} y={40} width={100} height={42} rx={8}
        fill={step <= 1 ? "#1a3a2a" : C.cache.bg}
        stroke={step <= 1 ? "#2ecc71" : C.cache.border} strokeWidth={1.5} />
      <text x={210} y={53} textAnchor="middle" fontSize={9} fill={step <= 1 ? "#2ecc71" : "var(--muted-text)"} fontWeight={600}>
        Local Cache
      </text>
      <text x={210} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-text)">
        Map / HashMap
      </text>

      {/* Internal connection */}
      <line x1={110} y1={61} x2={160} y2={61} stroke="var(--border-color)" strokeWidth={1.5} />

      {/* External DB (outside process) */}
      <rect x={350} y={40} width={56} height={42} rx={8}
        fill={C.db.bg} stroke={C.db.border} strokeWidth={1.5} />
      <text x={378} y={58} textAnchor="middle" dominantBaseline="central" fontSize={16}>🗄️</text>
      <text x={378} y={96} textAnchor="middle" fontSize={9} fill="var(--muted-text)">Database</text>

      {/* Network boundary indicator */}
      <line x1={305} y1={22} x2={305} y2={120} stroke="var(--border-color)" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
      <text x={305} y={135} textAnchor="middle" fontSize={7} fill="var(--muted-text)">network</text>

      {/* External connection (dashed, grayed) */}
      <line x1={280} y1={61} x2={350} y2={61}
        stroke="var(--border-color)" strokeWidth={1} strokeDasharray="4 3" opacity={step >= 3 ? 0.8 : 0.3} />

      {/* Animation: local cache read (fast, stays inside process) */}
      {step === 0 && (
        <motion.circle r={4} fill="#2ecc71" key="local"
          initial={{ cx: 110, cy: 61, opacity: 0 }}
          animate={{ cx: 160, cy: 61, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.5 }}
        />
      )}
      {step === 1 && <Badge x={210} y={32} text="HIT  ~0ms" color="#2ecc71" />}

      {/* Animation: without cache, must cross network to DB (slow) */}
      {step === 3 && <Pkt key="db-req" from={[210, 61]} to={[378, 61]} color="#e67e22" dur={0.8} />}
      {step === 4 && (
        <>
          <Pkt key="db-res" from={[378, 61]} to={[80, 61]} color="#e67e22" dur={0.9} />
          <Badge x={378} y={32} text="~5-50ms" color="#e67e22" />
        </>
      )}

      {/* Step label */}
      <text x={220} y={160} textAnchor="middle" fontSize={10} fill="var(--muted-text)">
        {[
          "Read from local memory",
          "Instant - no network call",
          "",
          "Without cache → network round trip",
          "Much slower",
        ][step]}
      </text>
    </svg>
  );
}

export function CacheAsideDiagram() {
  const step = useCycle(6, 1000);
  const labels = [
    "1. Check cache",
    "2. Cache miss",
    "3. Query database",
    "4. Return data",
    "5. Store in cache",
    "",
  ];
  return (
    <svg className="w-full" viewBox="0 0 440 150">
      <Conn x1={98} y1={65} x2={192} y2={65} />
      <Conn x1={248} y1={65} x2={342} y2={65} />
      <Node x={70} y={65} emoji="🖥️" label="App" color={C.app} />
      <Node x={220} y={65} emoji="⚡" label="Cache" color={C.cache} />
      <Node x={370} y={65} emoji="🗄️" label="DB" color={C.db} />
      {step === 0 && <Pkt key="step0" from={[70, 65]} to={[220, 65]} color="#3498db" />}
      {step === 1 && <Badge x={220} y={30} text="MISS" color="#e74c3c" />}
      {step === 2 && <Pkt key="step2" from={[70, 65]} to={[370, 65]} color="#3498db" />}
      {step === 3 && <Pkt key="step3" from={[370, 65]} to={[70, 65]} color="#2ecc71" />}
      {step === 4 && <Pkt key="step4" from={[70, 65]} to={[220, 65]} color="#e67e22" />}
      <text x={220} y={140} textAnchor="middle" fontSize={11} fill="var(--muted-text)">{labels[step]}</text>
    </svg>
  );
}

export function WriteThroughDiagram() {
  const step = useCycle(5, 1000);
  const labels = [
    "1. Write to cache",
    "2. Write to DB (sync)",
    "3. DB acknowledges",
    "4. Confirm to app",
    "",
  ];
  return (
    <svg className="w-full" viewBox="0 0 440 150">
      <Conn x1={98} y1={65} x2={192} y2={65} />
      <Conn x1={248} y1={65} x2={342} y2={65} />
      <Node x={70} y={65} emoji="🖥️" label="App" color={C.app} />
      <Node x={220} y={65} emoji="⚡" label="Cache" color={C.cache} />
      <Node x={370} y={65} emoji="🗄️" label="DB" color={C.db} />
      {step === 0 && <Pkt key="step0" from={[70, 65]} to={[220, 65]} color="#e67e22" />}
      {step === 1 && <Pkt key="step1" from={[220, 65]} to={[370, 65]} color="#e67e22" />}
      {step === 2 && <Pkt key="step2" from={[370, 65]} to={[220, 65]} color="#2ecc71" />}
      {step === 3 && <Pkt key="step3" from={[220, 65]} to={[70, 65]} color="#2ecc71" />}
      <text x={220} y={140} textAnchor="middle" fontSize={11} fill="var(--muted-text)">{labels[step]}</text>
    </svg>
  );
}

export function WriteBehindDiagram() {
  const step = useCycle(4, 1200);
  const labels = [
    "1. Write to cache",
    "2. Instant ACK",
    "",
    "3. Async flush to DB",
  ];
  return (
    <svg className="w-full" viewBox="0 0 440 150">
      <Conn x1={98} y1={65} x2={192} y2={65} />
      <Conn x1={248} y1={65} x2={342} y2={65} dashed />
      <Node x={70} y={65} emoji="🖥️" label="App" color={C.app} />
      <Node x={220} y={65} emoji="⚡" label="Cache" color={C.cache} />
      <Node x={370} y={65} emoji="🗄️" label="DB" color={C.db} />
      {step === 0 && <Pkt key="step0" from={[70, 65]} to={[220, 65]} color="#e67e22" />}
      {step === 1 && <Pkt key="step1" from={[220, 65]} to={[70, 65]} color="#2ecc71" />}
      {step === 3 && <Pkt key="step3" from={[220, 65]} to={[370, 65]} color="#e67e22" dur={1.0} />}
      <text x={220} y={140} textAnchor="middle" fontSize={11} fill="var(--muted-text)">{labels[step]}</text>
    </svg>
  );
}

export function ReadThroughDiagram() {
  const step = useCycle(5, 1000);
  const labels = [
    "1. Read from cache",
    "2. Cache fetches from DB",
    "3. DB returns data",
    "4. Cache returns to app",
    "",
  ];
  return (
    <svg className="w-full" viewBox="0 0 440 150">
      <Conn x1={98} y1={65} x2={192} y2={65} />
      <Conn x1={248} y1={65} x2={342} y2={65} />
      <Node x={70} y={65} emoji="🖥️" label="App" color={C.app} />
      <Node x={220} y={65} emoji="⚡" label="Cache" color={C.cache} />
      <Node x={370} y={65} emoji="🗄️" label="DB" color={C.db} />
      {step === 0 && <Pkt key="step0" from={[70, 65]} to={[220, 65]} color="#3498db" />}
      {step === 1 && (
        <>
          <Badge x={220} y={30} text="MISS" color="#e74c3c" />
          <Pkt key="step1" from={[220, 65]} to={[370, 65]} color="#3498db" />
        </>
      )}
      {step === 2 && <Pkt key="step2" from={[370, 65]} to={[220, 65]} color="#2ecc71" />}
      {step === 3 && <Pkt key="step3" from={[220, 65]} to={[70, 65]} color="#2ecc71" />}
      <text x={220} y={140} textAnchor="middle" fontSize={11} fill="var(--muted-text)">{labels[step]}</text>
    </svg>
  );
}

export function StampedeDiagram() {
  const step = useCycle(6, 1000);
  const labels = ["", "Clients hit expired cache", "DB overloaded!", "", "Mutex: one rebuilds", "Others wait"];
  const clients = [40, 90, 140];

  return (
    <svg className="w-full" viewBox="0 0 440 180">
      {clients.map(cy => (
        <line key={cy} x1={66} y1={cy} x2={174} y2={90} stroke="var(--border-color)" strokeWidth={1.5} />
      ))}
      <Conn x1={226} y1={90} x2={342} y2={90} />
      {clients.map(cy => (
        <g key={cy}>
          <circle cx={50} cy={cy} r={16} fill={C.user.bg} stroke={C.user.border} strokeWidth={1.5} />
          <text x={50} y={cy + 1} textAnchor="middle" dominantBaseline="central" fontSize={14}>👤</text>
        </g>
      ))}
      <Node x={200} y={90} emoji="⚡" label="Cache" color={C.cache}
        highlight={step === 0 ? "#3a1a1a" : step === 4 ? "#1a2a3a" : undefined} />
      <Node x={370} y={90} emoji="🗄️" label="DB" color={C.db} />

      {step === 0 && <Badge x={200} y={55} text="EXPIRED" color="#e74c3c" />}
      {step === 1 && clients.map((cy, i) => (
        <Pkt key={`step1-${i}`} from={[50, cy]} to={[200, 90]} color="#3498db" />
      ))}
      {step === 2 && clients.map((cy, i) => (
        <Pkt key={`step2-${i}`} from={[200, 90]} to={[370, 90]} color="#e74c3c" />
      ))}
      {step === 4 && (
        <>
          <Badge x={200} y={55} text="🔒" color="#3498db" />
          <Pkt key="step4-client" from={[50, 40]} to={[200, 90]} color="#3498db" />
          <Pkt key="step4-db" from={[200, 90]} to={[370, 90]} color="#3498db" />
        </>
      )}
      {step === 5 && clients.map((cy, i) => (
        <Pkt key={`step5-${i}`} from={[200, 90]} to={[50, cy]} color="#2ecc71" />
      ))}

      <text x={220} y={168} textAnchor="middle" fontSize={11} fill="var(--muted-text)">{labels[step]}</text>
    </svg>
  );
}
