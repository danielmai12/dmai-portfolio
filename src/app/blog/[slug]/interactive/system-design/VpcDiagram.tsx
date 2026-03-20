"use client";

import { motion } from "framer-motion";
import { Node, ConnectionLine, PacketDot } from "@/components/blog/primitives";

export type VpcStep =
  | "intro"
  | "subnets"
  | "igw-nat"
  | "route-tables"
  | "security"
  | "peering"
  | "cidr"
  | "summary";

interface VpcDiagramProps {
  step: VpcStep;
}

// ── Layout ──────────────────────────────────────────
// Internet sits above; VPC starts well below with room for IGW on the border.
// Each subnet is big enough that every node (r=32 glow + label at y+42)
// fits comfortably inside.

const vpcBox = { x: 30, y: 110, w: 390, h: 420 };

const publicSubnet  = { x: 42,  y: 155, w: 180, h: 195 };
const privateSubnet = { x: 232, y: 155, w: 180, h: 195 };
const isolatedSubnet = { x: 232, y: 362, w: 180, h: 155 };

// Nodes
const internet  = { x: 220, y: 40 };
const igw       = { x: 130, y: 130 };   // on VPC top edge
const nat       = { x: 222, y: 310 };   // between subnets, on the border
const alb       = { x: 130, y: 210 };   // mid public subnet
const webServer = { x: 130, y: 290 };   // lower public subnet
const appServer = { x: 320, y: 250 };   // center of private subnet
const db        = { x: 320, y: 435 };   // center of isolated subnet

// Peering (below VPC A when shrunk — VPC A bottom = 110+250 = 360)
const vpc2Box    = { x: 42, y: 390, w: 170, h: 120 };
const transitGw  = { x: 310, y: 450 };

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

// ── Sub-components ──────────────────────────────────

function SubnetBox({
  x, y, w, h, label, color, active, type,
}: {
  x: number; y: number; w: number; h: number;
  label: string; color: string; active: boolean;
  type: "public" | "private" | "isolated";
}) {
  return (
    <motion.g
      initial={{ opacity: 0.15 }}
      animate={{ opacity: active ? 1 : 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <rect
        x={x} y={y} width={w} height={h} rx={8}
        fill={color} fillOpacity={0.08}
        stroke={color} strokeWidth={active ? 1.5 : 0.5}
        strokeDasharray={type === "public" ? "none" : "6 3"}
      />
      <text x={x + 6} y={y + 14} fontSize={8} fontWeight={600} fill={color}>
        {label}
      </text>
    </motion.g>
  );
}

function NaclBar({ x, y, w, active }: { x: number; y: number; w: number; active: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      <rect x={x} y={y - 2} width={w} height={4} rx={2} fill="#e74c3c" fillOpacity={0.6} />
      <text x={x + w / 2} y={y - 6} textAnchor="middle" fontSize={6} fontWeight={600} fill="#e74c3c">
        NACL
      </text>
    </motion.g>
  );
}

function SecurityGroupRing({ cx, cy, active }: { cx: number; cy: number; active: boolean }) {
  return (
    <motion.circle
      cx={cx} cy={cy} r={30} fill="none"
      stroke="#e67e22" strokeWidth={1.5} strokeDasharray="4 3"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 0.8 : 0 }}
      transition={{ duration: 0.4 }}
    />
  );
}

export default function VpcDiagram({ step }: VpcDiagramProps) {
  const showSubnets = step !== "intro";
  const showIgwNat =
    step === "igw-nat" || step === "route-tables" ||
    step === "security" || step === "summary";
  const showSecurity = step === "security";
  const showPeering = step === "peering";
  const showCidr = step === "cidr";
  const showRoutes = step === "route-tables";
  const showSummary = step === "summary";
  const showIsolated = step !== "intro" && step !== "peering";

  return (
    <svg viewBox="0 0 450 550" className="w-full h-auto">
      {/* ── VPC box ── */}
      <motion.rect
        x={vpcBox.x} y={vpcBox.y} width={vpcBox.w} rx={12}
        fill="none" stroke="var(--accent-color)"
        strokeWidth={step === "intro" ? 2 : 1.5}
        initial={{ opacity: 0.3, height: vpcBox.h }}
        animate={{
          opacity: step !== "peering" ? 1 : 0.6,
          height: showPeering ? 250 : vpcBox.h,
        }}
        transition={{ duration: 0.5 }}
      />
      <motion.text
        x={vpcBox.x + vpcBox.w - 8} y={vpcBox.y + 16}
        textAnchor="end" fontSize={10} fontWeight={600} fill="var(--accent-color)"
        animate={{ opacity: 1 }}
      >
        {showPeering ? "VPC A" : "VPC"}
      </motion.text>

      {/* CIDR label */}
      {(showCidr || showSummary) && (
        <motion.text
          {...fadeIn}
          x={vpcBox.x + 10} y={vpcBox.y + 16}
          fontSize={7} fontWeight={500} fill="var(--primary-color)" fontFamily="monospace"
        >
          10.0.0.0/16
        </motion.text>
      )}

      {/* ── Subnets ── */}
      <SubnetBox
        x={publicSubnet.x} y={publicSubnet.y} w={publicSubnet.w} h={publicSubnet.h}
        label="Public Subnet" color="#2ecc71" active={showSubnets && !showPeering} type="public"
      />
      <SubnetBox
        x={privateSubnet.x} y={privateSubnet.y} w={privateSubnet.w} h={privateSubnet.h}
        label="Private Subnet" color="#3498db" active={showSubnets && !showPeering} type="private"
      />
      {showIsolated && (
        <SubnetBox
          x={isolatedSubnet.x} y={isolatedSubnet.y} w={isolatedSubnet.w} h={isolatedSubnet.h}
          label="Isolated Subnet" color="#9b59b6" active={showSubnets} type="isolated"
        />
      )}

      {/* CIDR per-subnet labels */}
      {(showCidr || showSummary) && (
        <motion.g {...fadeIn}>
          <text x={publicSubnet.x + publicSubnet.w - 4} y={publicSubnet.y + 14} textAnchor="end" fontSize={6} fill="#2ecc71" fontFamily="monospace">10.0.1.0/24</text>
          <text x={privateSubnet.x + privateSubnet.w - 4} y={privateSubnet.y + 14} textAnchor="end" fontSize={6} fill="#3498db" fontFamily="monospace">10.0.2.0/24</text>
          <text x={isolatedSubnet.x + isolatedSubnet.w - 4} y={isolatedSubnet.y + 14} textAnchor="end" fontSize={6} fill="#9b59b6" fontFamily="monospace">10.0.3.0/24</text>
        </motion.g>
      )}

      {/* ── Internet node (above VPC) ── */}
      <Node x={internet.x} y={internet.y} label="Internet" icon="🌐" active={showIgwNat || showSummary} />

      {/* Connection: Internet → IGW */}
      <ConnectionLine
        x1={internet.x} y1={internet.y + 26} x2={igw.x} y2={igw.y + 8}
        active={showIgwNat || showSummary} delay={0.1}
      />

      {/* ── IGW (sits on VPC top border) ── */}
      {(showIgwNat || showSummary) && (
        <motion.g {...fadeIn}>
          <rect
            x={igw.x - 22} y={igw.y - 9} width={44} height={18} rx={4}
            fill="var(--card-bg)" stroke="#2ecc71" strokeWidth={1.5}
          />
          <text x={igw.x} y={igw.y + 4} textAnchor="middle" fontSize={8} fontWeight={600} fill="#2ecc71">
            IGW
          </text>
        </motion.g>
      )}

      {/* Connection: IGW → ALB */}
      <ConnectionLine
        x1={igw.x} y1={igw.y + 10} x2={alb.x} y2={alb.y - 26}
        active={showIgwNat || showSummary} delay={0.15}
      />

      {/* ── Nodes inside subnets ── */}
      <Node x={alb.x} y={alb.y} label="ALB" icon="⚖️"
        active={showSubnets && !showPeering} delay={0.1}
      />
      <Node x={webServer.x} y={webServer.y} label="Web Server" icon="🖥️"
        active={showSubnets && !showPeering} delay={0.15}
      />
      <Node x={appServer.x} y={appServer.y} label="App Server" icon="⚙️"
        active={showSubnets && !showPeering} delay={0.2}
      />
      {showIsolated && (
        <Node x={db.x} y={db.y} label="RDS" icon="🗄️"
          active={showSubnets} delay={0.25}
        />
      )}

      {/* ── NAT Gateway (bottom of public subnet) ── */}
      {(showIgwNat || showSummary) && (
        <motion.g {...fadeIn}>
          <rect
            x={nat.x - 22} y={nat.y - 9} width={44} height={18} rx={4}
            fill="var(--card-bg)" stroke="#e67e22" strokeWidth={1.5}
          />
          <text x={nat.x} y={nat.y + 4} textAnchor="middle" fontSize={8} fontWeight={600} fill="#e67e22">
            NAT
          </text>
        </motion.g>
      )}

      {/* Connection: App → NAT */}
      {(showIgwNat || showSummary) && (
        <ConnectionLine
          x1={appServer.x - 26} y1={appServer.y + 15}
          x2={nat.x + 22} y2={nat.y}
          active={true} delay={0.2} color="#e67e22"
        />
      )}

      {/* Connection: NAT → IGW (outbound) */}
      {(showIgwNat || showSummary) && (
        <ConnectionLine
          x1={nat.x} y1={nat.y - 9}
          x2={igw.x} y2={igw.y + 10}
          active={true} delay={0.25} color="#e67e22"
        />
      )}

      {/* Connection: ALB → Web */}
      <ConnectionLine
        x1={alb.x} y1={alb.y + 26} x2={webServer.x} y2={webServer.y - 26}
        active={showSubnets && !showPeering} delay={0.1}
      />

      {/* Connection: Web → App */}
      <ConnectionLine
        x1={webServer.x + 26} y1={webServer.y}
        x2={appServer.x - 26} y2={appServer.y}
        active={showSubnets && !showPeering} delay={0.2}
      />

      {/* Connection: App → DB */}
      {showIsolated && (
        <ConnectionLine
          x1={appServer.x} y1={appServer.y + 26}
          x2={db.x} y2={db.y - 26}
          active={showSubnets} delay={0.3}
        />
      )}

      {/* ── Route table labels ── */}
      {showRoutes && (
        <motion.g {...fadeIn}>
          <rect x={publicSubnet.x} y={publicSubnet.y + publicSubnet.h + 6} width={publicSubnet.w} height={28} rx={4}
            fill="var(--card-bg)" stroke="var(--accent-color)" strokeWidth={1}
          />
          <text x={publicSubnet.x + 8} y={publicSubnet.y + publicSubnet.h + 20} fontSize={6} fontWeight={600} fill="var(--primary-color)">Route Table (Public)</text>
          <text x={publicSubnet.x + 8} y={publicSubnet.y + publicSubnet.h + 30} fontSize={5.5} fill="var(--muted-text)" fontFamily="monospace">0.0.0.0/0 → igw-xxx</text>

          <rect x={privateSubnet.x} y={privateSubnet.y + privateSubnet.h + 6} width={privateSubnet.w} height={28} rx={4}
            fill="var(--card-bg)" stroke="var(--accent-color)" strokeWidth={1}
          />
          <text x={privateSubnet.x + 8} y={privateSubnet.y + privateSubnet.h + 20} fontSize={6} fontWeight={600} fill="var(--primary-color)">Route Table (Private)</text>
          <text x={privateSubnet.x + 8} y={privateSubnet.y + privateSubnet.h + 30} fontSize={5.5} fill="var(--muted-text)" fontFamily="monospace">0.0.0.0/0 → nat-xxx</text>
        </motion.g>
      )}

      {/* ── Security: NACLs and Security Groups ── */}
      {showSecurity && (
        <>
          <NaclBar x={publicSubnet.x} y={publicSubnet.y + publicSubnet.h} w={publicSubnet.w} active={true} />
          <NaclBar x={privateSubnet.x} y={privateSubnet.y + privateSubnet.h} w={privateSubnet.w} active={true} />
          <SecurityGroupRing cx={webServer.x} cy={webServer.y} active={true} />
          <SecurityGroupRing cx={appServer.x} cy={appServer.y} active={true} />
          <SecurityGroupRing cx={db.x} cy={db.y} active={true} />

          {/* Legend */}
          <motion.g {...fadeIn}>
            <line x1={80} y1={543} x2={100} y2={543} stroke="#e74c3c" strokeWidth={1.5} />
            <text x={104} y={545} fontSize={7} fill="var(--muted-text)">NACL (subnet)</text>
            <circle cx={185} cy={543} r={5} fill="none" stroke="#e67e22" strokeWidth={1.5} strokeDasharray="3 2" />
            <text x={194} y={545} fontSize={7} fill="var(--muted-text)">Security Group (instance)</text>
          </motion.g>
        </>
      )}

      {/* ── Peering view ── */}
      {showPeering && (() => {
        const vpcABottom = vpcBox.y + 250; // animated height during peering
        return (
          <motion.g {...fadeIn}>
            {/* VPC B */}
            <rect
              x={vpc2Box.x} y={vpc2Box.y} width={vpc2Box.w} height={vpc2Box.h} rx={12}
              fill="none" stroke="#e67e22" strokeWidth={1.5}
            />
            <text x={vpc2Box.x + vpc2Box.w - 8} y={vpc2Box.y + 16}
              textAnchor="end" fontSize={9} fontWeight={600} fill="#e67e22">
              VPC B
            </text>
            <Node x={vpc2Box.x + 85} y={vpc2Box.y + 60} label="Service B" icon="⚙️" active={true} color="#e67e22" />

            {/* Transit Gateway — centered between VPC A and VPC B */}
            <rect x={transitGw.x - 35} y={transitGw.y - 12} width={70} height={24} rx={6}
              fill="var(--card-bg)" stroke="var(--accent-color)" strokeWidth={2}
            />
            <text x={transitGw.x} y={transitGw.y + 4} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--accent-color)">
              Transit GW
            </text>

            {/* VPC A → Transit GW (orthogonal: down then right) */}
            <ConnectionLine
              x1={transitGw.x} y1={vpcABottom}
              x2={transitGw.x} y2={transitGw.y - 12}
              active={true} delay={0.1}
            />
            {/* VPC B → Transit GW (horizontal) */}
            <ConnectionLine
              x1={vpc2Box.x + vpc2Box.w} y1={transitGw.y}
              x2={transitGw.x - 35} y2={transitGw.y}
              active={true} delay={0.2} color="#e67e22"
            />
            {/* Packet VPC A → Transit GW (straight down) */}
            <PacketDot
              x1={transitGw.x} y1={vpcABottom}
              x2={transitGw.x} y2={transitGw.y - 12}
              active={true} delay={0.2}
            />
            {/* Packet Transit GW → VPC B (straight left) */}
            <PacketDot
              x1={transitGw.x - 35} y1={transitGw.y}
              x2={vpc2Box.x + vpc2Box.w} y2={transitGw.y}
              active={true} delay={1.2} color="#e67e22"
            />
          </motion.g>
        );
      })()}

      {/* ── Summary packets ── */}
      {showSummary && (
        <>
          <PacketDot
            x1={internet.x} y1={internet.y + 26}
            x2={alb.x} y2={alb.y - 12}
            active={true} delay={0}
          />
          <PacketDot
            x1={alb.x} y1={alb.y + 26}
            x2={appServer.x} y2={appServer.y - 10}
            active={true} delay={0.8}
          />
          <PacketDot
            x1={appServer.x} y1={appServer.y + 26}
            x2={db.x} y2={db.y - 26}
            active={true} delay={1.6} color="#9b59b6"
          />
        </>
      )}

      {/* ── Mode label ── */}
      {step !== "intro" && !showPeering && !showSecurity && !showRoutes && (
        <motion.text
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          x={225} y={545} textAnchor="middle" fontSize={9} fontWeight={500}
          fill="var(--muted-text)" fontStyle="italic"
        >
          {step === "subnets" && "Public, Private & Isolated subnets"}
          {step === "igw-nat" && "IGW for inbound — NAT for outbound"}
          {step === "cidr" && "CIDR blocks define your IP space"}
          {step === "summary" && "Internet → ALB → App → DB"}
        </motion.text>
      )}
    </svg>
  );
}
