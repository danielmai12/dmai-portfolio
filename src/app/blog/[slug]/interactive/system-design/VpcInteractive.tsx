"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { SectionBlock } from "@/components/blog/primitives";
import VpcDiagram, { type VpcStep } from "./VpcDiagram";

interface Section {
  step: VpcStep;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    step: "intro",
    title: "What Is a VPC?",
    content: (
      <>
        <p>
          A{" "}
          <strong style={{ color: "var(--primary-color)" }}>
            VPC (Virtual Private Cloud)
          </strong>{" "}
          is your own isolated network inside a cloud provider — AWS, GCP, or
          Azure.
        </p>
        <p>
          Think of it like renting a floor in an office building. The building
          (cloud provider) has shared infrastructure — electricity, elevators,
          security guards. But your floor is{" "}
          <strong style={{ color: "var(--accent-color)" }}>
            completely private
          </strong>
          . You decide who gets in, how rooms are connected, and what goes where.
        </p>
        <p>
          Every resource you launch — Compute Engine VMs, Cloud SQL databases, Cloud
          Functions (or AWS EC2, RDS, Lambda) — lives inside a VPC. Understanding VPC networking is
          foundational to cloud architecture.
        </p>
      </>
    ),
  },
  {
    step: "subnets",
    title: "Subnets — Public vs Private",
    content: (
      <>
        <p>
          A VPC is divided into{" "}
          <strong style={{ color: "var(--primary-color)" }}>subnets</strong> —
          logical partitions of your network. Each subnet lives in a specific
          zone (GCP) or Availability Zone (AWS).
        </p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>
          Think of subnets as different rooms on your office floor. The{" "}
          <strong style={{ color: "#2ecc71" }}>lobby</strong> is public — anyone can walk in. The{" "}
          <strong style={{ color: "#3498db" }}>back office</strong> requires a badge — employees only. The{" "}
          <strong style={{ color: "#9b59b6" }}>vault</strong> has no outside access at all — only internal staff with special clearance.
        </p>
        <div
          className="rounded-lg p-4 text-xs space-y-2"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div>
            <strong style={{ color: "#2ecc71" }}>Public Subnet</strong>
            <p className="mt-1">
              Has a route to the internet. Hosts resources that need to be
              reachable from outside — load balancers, bastion hosts, web
              servers.
            </p>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "0.5rem",
            }}
          >
            <strong style={{ color: "#3498db" }}>Private Subnet</strong>
            <p className="mt-1">
              No direct internet access. Hosts your application servers,
              internal services — anything that shouldn&apos;t be publicly
              reachable.
            </p>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "0.5rem",
            }}
          >
            <strong style={{ color: "#9b59b6" }}>Isolated Subnet</strong>
            <p className="mt-1">
              No internet access at all — not even outbound. Databases (Cloud SQL / RDS,
              Memorystore / ElastiCache) live here. Maximum isolation.
            </p>
          </div>
        </div>
        <p>
          This is the core mental model:{" "}
          <strong style={{ color: "var(--primary-color)" }}>
            public-facing resources in public subnets, everything else in
            private or isolated subnets
          </strong>
          .
        </p>
      </>
    ),
  },
  {
    step: "igw-nat",
    title: "Internet Gateway & NAT Gateway",
    content: (
      <>
        <p>
          Two gateways control how your VPC talks to the internet.
        </p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>
          The IGW is like the <strong>front door</strong> of your building — visitors can come in and employees can go out.
          The NAT is like a <strong>mail room</strong> — employees in the back office can send letters out, but no one outside can walk in through the mail room.
        </p>
        <div
          className="rounded-lg p-4 text-xs space-y-3"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div>
            <strong style={{ color: "#2ecc71" }}>
              Internet Gateway (IGW)
            </strong>
            <p className="mt-1">
              Attaches to your VPC and allows{" "}
              <em>bidirectional</em> internet access for public subnets. Inbound
              traffic from users reaches your ALB through the IGW.
            </p>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "0.75rem",
            }}
          >
            <strong style={{ color: "#e67e22" }}>Cloud NAT / NAT Gateway</strong>
            <p className="mt-1">
              Allows private subnet resources to make{" "}
              <em>outbound</em> requests (pull Docker images, call external
              APIs) without being exposed to inbound internet traffic.
              Called Cloud NAT in GCP, NAT Gateway in AWS.
            </p>
          </div>
        </div>
        <p>
          Watch the diagram — the App Server in the private subnet routes
          outbound traffic through{" "}
          <span style={{ color: "#e67e22", fontWeight: 500 }}>NAT</span> →{" "}
          <span style={{ color: "#2ecc71", fontWeight: 500 }}>IGW</span> →
          Internet. But no one on the internet can initiate a connection back to it.
        </p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>
          NAT costs money — Cloud NAT charges per VM + data, AWS NAT Gateway ~$32/mo + data processing. For dev
          environments, some teams use NAT instances or Private Service Connect / VPC endpoints instead.
        </p>
      </>
    ),
  },
  {
    step: "route-tables",
    title: "Route Tables",
    content: (
      <>
        <p>
          Every subnet has a{" "}
          <strong style={{ color: "var(--primary-color)" }}>route table</strong>{" "}
          — a set of rules that decide where traffic goes.
        </p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>
          Like <strong>signs in the hallway</strong> — &ldquo;Floor 2? Take the stairs. Outside? Go through the front door. Restricted area? No exit.&rdquo;
          Route tables are the directions that tell every packet where to go next.
        </p>
        <div
          className="rounded-lg p-4 text-xs font-mono space-y-2"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p style={{ color: "var(--accent-color)" }}>
            # Public subnet route table
          </p>
          <p>10.0.0.0/16 → local</p>
          <p>
            0.0.0.0/0{"  "}→ igw-abc123{" "}
            <span style={{ color: "var(--muted-text)" }}>← internet</span>
          </p>
          <br />
          <p style={{ color: "var(--accent-color)" }}>
            # Private subnet route table
          </p>
          <p>10.0.0.0/16 → local</p>
          <p>
            0.0.0.0/0{"  "}→ nat-xyz789{" "}
            <span style={{ color: "var(--muted-text)" }}>← outbound only</span>
          </p>
        </div>
        <p>
          The{" "}
          <code className="article-inline-code">10.0.0.0/16 → local</code>{" "}
          rule means all traffic within the VPC stays internal. The{" "}
          <code className="article-inline-code">0.0.0.0/0</code> rule is the
          default route — where traffic goes when there&apos;s no more specific
          match.
        </p>
        <p>
          <strong style={{ color: "var(--primary-color)" }}>
            This is what makes a subnet &ldquo;public&rdquo; or
            &ldquo;private&rdquo;
          </strong>{" "}
          — it&apos;s not a property of the subnet itself, it&apos;s the route
          table. Point the default route at an IGW = public. Point it at a NAT =
          private. No default route = isolated.
        </p>
      </>
    ),
  },
  {
    step: "security",
    title: "Firewall Rules",
    content: (
      <>
        <p>
          Firewall rules control traffic at the network level. The implementation differs by provider.
        </p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>
          Think of <strong>security guards</strong> at different checkpoints. One guard sits at each room&apos;s door (instance-level) and remembers who they let in — if you entered, you can leave freely. Another guard sits at the hallway entrance (subnet-level) and checks both directions independently — badge in, badge out, every single time.
        </p>
        <div
          className="rounded-lg p-4 text-xs space-y-3"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div>
            <strong style={{ color: "#e67e22" }}>
              GCP — VPC Firewall Rules
            </strong>
            <p className="mt-1">
              <strong>Stateful</strong> — applied at the VPC level, targeted by network tags or service accounts.
              Each rule specifies direction (ingress/egress), priority, source/destination, protocol, and port. Deny-all-ingress and allow-all-egress are implied defaults.
            </p>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "0.75rem",
            }}
          >
            <strong style={{ color: "#e67e22" }}>
              AWS — Security Groups + NACLs
            </strong>
            <p className="mt-1">
              Two layers: <strong>Security Groups</strong> (stateful, per-instance — if you allow inbound 443, the response is auto-allowed) and{" "}
              <strong>NACLs</strong> (stateless, per-subnet — must explicitly allow both directions). Most teams rely on Security Groups and leave NACLs at defaults.
            </p>
          </div>
        </div>
        <p>
          Watch the diagram — the{" "}
          <span style={{ color: "#e74c3c", fontWeight: 500 }}>red bars</span>{" "}
          are NACLs at the subnet boundary, and the{" "}
          <span style={{ color: "#e67e22", fontWeight: 500 }}>
            orange rings
          </span>{" "}
          are Security Groups around each instance.
        </p>
        <div
          className="rounded-lg p-4 text-xs font-mono space-y-1"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p style={{ color: "var(--accent-color)" }}># Example Security Group rules</p>
          <p>ALB: &nbsp;&nbsp;Allow TCP 443 from 0.0.0.0/0</p>
          <p>App: &nbsp;&nbsp;Allow TCP 8080 from ALB-SG only</p>
          <p>DB: &nbsp;&nbsp;&nbsp;Allow TCP 5432 from App-SG only</p>
        </div>
        <p>
          <strong style={{ color: "var(--primary-color)" }}>
            In practice:
          </strong>{" "}
          most teams rely primarily on Security Groups and leave NACLs at their
          defaults. Use NACLs when you need to explicitly block specific IPs or
          ranges at the subnet level. Firewall rules define source/destination IP, protocol, port, and allow/deny — for both{" "}
          <strong>ingress</strong> (incoming) and <strong>egress</strong> (outgoing) traffic.
        </p>
      </>
    ),
  },
  {
    step: "peering",
    title: "VPC Peering & Transit Gateway",
    content: (
      <>
        <p>
          What if your services span{" "}
          <strong style={{ color: "var(--primary-color)" }}>
            multiple VPCs
          </strong>
          ? Maybe you have separate VPCs for staging/production, or different
          teams own different VPCs.
        </p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>
          VPC Peering is like building a <strong>private skybridge</strong> between two office buildings — direct, fast, but you need one bridge per pair.
          A Transit Gateway is like a <strong>central bus terminal</strong> — every building connects once to the hub, and the hub routes between all of them.
        </p>
        <div
          className="rounded-lg p-4 text-xs space-y-3"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div>
            <strong style={{ color: "var(--primary-color)" }}>
              VPC Peering
            </strong>
            <p className="mt-1">
              A direct 1:1 connection between two VPCs. Traffic stays on the
              cloud provider&apos;s backbone — never touches the public internet.
              Simple but doesn&apos;t scale: N VPCs need N(N-1)/2 peering
              connections.
            </p>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "0.75rem",
            }}
          >
            <strong style={{ color: "var(--primary-color)" }}>
              Transit Gateway / NCC
            </strong>
            <p className="mt-1">
              A central hub that connects multiple VPCs (and on-prem networks)
              through a single attachment point. Much cleaner at scale — add a
              new VPC with one connection instead of peering with every other VPC.
              Called Network Connectivity Center (NCC) in GCP, Transit Gateway in AWS.
            </p>
          </div>
        </div>
        <p>
          <strong style={{ color: "#e74c3c" }}>Key limitation:</strong>{" "}
          VPC Peering is{" "}
          <strong>non-transitive</strong>. If A peers with B, and B peers with C, A{" "}
          <em>cannot</em> reach C through B. Transit Gateway solves this.
        </p>
        <div
          className="rounded-lg p-4 text-xs space-y-3 mt-2"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div>
            <strong style={{ color: "var(--primary-color)" }}>
              Shared VPC
            </strong>
            <p className="mt-1">
              A GCP-native concept where a networking team owns the VPC (host project) centrally, while application teams deploy resources into shared subnets (service projects). AWS achieves similar with RAM (Resource Access Manager). Common in enterprise environments for centralized network control with decentralized deployment.
            </p>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "0.75rem",
            }}
          >
            <strong style={{ color: "var(--primary-color)" }}>
              Hybrid Connectivity
            </strong>
            <p className="mt-1">
              VPCs can connect to on-premises networks via{" "}
              <strong>Cloud VPN / Site-to-Site VPN</strong> (encrypted tunnel over internet) or{" "}
              <strong>Dedicated Interconnect / Direct Connect</strong> (private physical link). This enables hybrid cloud architectures and gradual cloud migration.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    step: "cidr",
    title: "CIDR Blocks & IP Planning",
    content: (
      <>
        <p>
          Every VPC needs a{" "}
          <strong style={{ color: "var(--primary-color)" }}>CIDR block</strong>{" "}
          — the range of IP addresses available inside it.
        </p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>
          Think of it like <strong>postal codes</strong>. Your building gets a zip code range (the VPC CIDR), and each floor gets its own sub-range (subnet CIDRs). Two buildings can&apos;t share the same zip codes — if they do, mail gets lost. Same with IP addresses and peering.
        </p>
        <div
          className="rounded-lg p-4 text-xs font-mono space-y-1"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p>
            <span style={{ color: "var(--accent-color)" }}>10.0.0.0/16</span>
            {"  "}→ 65,536 IPs (VPC)
          </p>
          <p>
            <span style={{ color: "#2ecc71" }}>10.0.1.0/24</span>
            {"  "}→ 256 IPs (public subnet)
          </p>
          <p>
            <span style={{ color: "#3498db" }}>10.0.2.0/24</span>
            {"  "}→ 256 IPs (private subnet)
          </p>
          <p>
            <span style={{ color: "#9b59b6" }}>10.0.3.0/24</span>
            {"  "}→ 256 IPs (isolated subnet)
          </p>
        </div>
        <p>
          The{" "}
          <code className="article-inline-code">/16</code> means the first 16
          bits are the network prefix — the remaining 16 bits are for hosts.
          Smaller number = more IPs.
        </p>
        <p>
          <strong style={{ color: "#e74c3c" }}>
            Critical rule:
          </strong>{" "}
          VPCs that need to peer{" "}
          <strong>cannot have overlapping CIDR blocks</strong>. If VPC A is{" "}
          <code className="article-inline-code">10.0.0.0/16</code> and VPC B
          is also{" "}
          <code className="article-inline-code">10.0.0.0/16</code>, they can
          never be peered. Plan your IP space upfront.
        </p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>
          Cloud providers reserve IPs per subnet — GCP reserves 4 (network, gateway, and 2 for future use), AWS reserves 5 (adds DNS). A /24 gives you ~251–252 usable IPs, not 256.
        </p>
      </>
    ),
  },
  {
    step: "summary",
    title: "Putting It All Together",
    content: (
      <>
        <p>A typical production VPC looks like this:</p>
        <ul className="list-none space-y-2">
          <li className="flex items-start gap-2">
            <span style={{ color: "var(--accent-color)" }}>→</span>
            <span>
              <strong>Public subnet</strong> — ALB receives traffic from the
              Internet Gateway
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "var(--accent-color)" }}>→</span>
            <span>
              <strong>Private subnet</strong> — App servers process requests,
              use NAT for outbound
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "var(--accent-color)" }}>→</span>
            <span>
              <strong>Isolated subnet</strong> — Cloud SQL/Memorystore (or RDS/ElastiCache) with no
              internet access at all
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "var(--accent-color)" }}>→</span>
            <span>
              <strong>Firewall rules</strong> — least-privilege per resource
              (LB allows 443, app allows LB only, DB allows app only)
            </span>
          </li>
        </ul>
        <p>This is the classic{" "}
          <strong style={{ color: "var(--primary-color)" }}>3-tier architecture</strong>:{" "}
          web tier (public) → app tier (private) → data tier (isolated).
        </p>
        <div
          className="rounded-lg p-4 text-xs font-mono mt-2"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p style={{ color: "var(--accent-color)" }}>Request flow:</p>
          <p>
            Internet → IGW → LB (public) → App (private) → DB (isolated)
          </p>
          <br />
          <p style={{ color: "var(--accent-color)" }}>Full production stack:</p>
          <p>VPC + NAT + Firewall rules + Peering + VPN for hybrid</p>
        </div>
        <p
          className="font-medium"
          style={{ color: "var(--primary-color)" }}
        >
          A well-designed VPC is defense in depth — multiple layers of network
          isolation ensuring that even if one layer is compromised, the blast
          radius is contained.
        </p>
      </>
    ),
  },
];

export default function VpcInteractive() {
  const [activeStep, setActiveStep] = useState<VpcStep>("intro");
  const visibleRef = useRef<Set<number>>(new Set());

  const handleVisible = useCallback((index: number, visible: boolean) => {
    if (visible) {
      visibleRef.current.add(index);
    } else {
      visibleRef.current.delete(index);
    }
    if (visibleRef.current.size > 0) {
      const topmost = Math.min.apply(null, Array.from(visibleRef.current));
      setActiveStep(sections[topmost].step);
    }
  }, []);

  return (
    <div className="relative lg:flex lg:gap-10">
      <div className="hidden lg:block lg:w-1/2 flex-shrink-0">
        <div className="sticky top-24 h-[calc(100vh-8rem)] flex items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl p-2 w-full"
            style={{
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--card-bg)",
            }}
          >
            <VpcDiagram step={activeStep} />
          </motion.div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {sections.map((section, i) => (
          <SectionBlock
            key={section.step}
            index={i}
            isFirst={i === 0}
            title={section.title}
            onVisible={handleVisible}
          >
            {section.content}
          </SectionBlock>
        ))}
      </div>
    </div>
  );
}
