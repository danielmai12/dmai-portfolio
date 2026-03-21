"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { SectionBlock } from "@/components/blog/primitives";
import ScalingDiagram, { type ScalingMode } from "./ScalingDiagram";

interface Section {
  mode: ScalingMode;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    mode: "idle",
    title: "Scaling & Availability",
    content: (
      <>
        <p>A load balancer routes traffic. But who decides how many servers there are? And what happens when an entire data center goes down?</p>
        <p>This is the domain of{" "}<strong style={{ color: "var(--primary-color)" }}>auto scaling</strong> and{" "}<strong style={{ color: "var(--primary-color)" }}>high availability</strong>: two concepts that work hand-in-hand with load balancing to keep your system running no matter what fails.</p>
        <p>Picture a restaurant: the load balancer is the host seating guests at tables. Auto scaling is the manager who calls in extra staff when it gets busy. High availability is having a second kitchen so service continues even if one catches fire.</p>
      </>
    ),
  },
  {
    mode: "why-scale",
    title: "Why Scale?",
    content: (
      <>
        <p>A single server has hard limits: CPU cores, memory, network bandwidth, disk I/O. When traffic exceeds what one machine can handle, you have two options:</p>
        <div className="rounded-lg p-4 text-xs space-y-2" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <div>
            <strong style={{ color: "var(--primary-color)" }}>Vertical Scaling (Scale Up)</strong>
            <p className="mt-1">Bigger machine: more CPU, more RAM. Simple but has a ceiling. You can&apos;t buy an infinitely large server, and you have a single point of failure.</p>
          </div>
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem" }}>
            <strong style={{ color: "var(--primary-color)" }}>Horizontal Scaling (Scale Out)</strong>
            <p className="mt-1">More machines. Distribute the load. No ceiling: just add more. This is what the cloud is built for.</p>
          </div>
        </div>
        <p>The diagram shows a single server at 95% CPU. One slow query, one traffic spike, and it&apos;s down. This is why every production system scales horizontally.</p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>A grocery store is a good analogy here: vertical scaling is making one checkout lane faster. Horizontal scaling is opening more lanes.</p>
      </>
    ),
  },
  {
    mode: "scale-out-in",
    title: "Scale Out & Scale In",
    content: (
      <>
        <p><strong style={{ color: "var(--accent-color)" }}>Scale out</strong> adds instances when demand increases.{" "}<strong style={{ color: "var(--accent-color)" }}>Scale in</strong> removes them when demand drops, so you&apos;re not paying for idle servers at 3 AM.</p>
        <p>As traffic ramps up in the diagram, a 5th VM spins up and immediately joins the load balancer&apos;s rotation.</p>
        <div className="rounded-lg p-4 text-xs space-y-1" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "var(--primary-color)" }}>Scale out when:</strong></p>
          <p>• Average CPU across instances &gt; 70%</p>
          <p>• Request rate exceeds X req/sec per instance</p>
          <p>• Queue depth grows beyond threshold</p>
          <p className="mt-2"><strong style={{ color: "var(--primary-color)" }}>Scale in when:</strong></p>
          <p>• CPU drops below 30% for sustained period</p>
          <p>• Request rate is well within capacity</p>
        </div>
        <p><strong style={{ color: "var(--primary-color)" }}>Cooldown period:</strong> After a scaling action, the system waits (typically 60-300s) before scaling again. This prevents thrashing: rapidly adding and removing instances as metrics oscillate around the threshold.</p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>A thermostat works the same way. It doesn&apos;t turn the AC on and off every second; it waits to see if the temperature stabilizes.</p>
      </>
    ),
  },
  {
    mode: "auto-scaling",
    title: "Auto Scaling in Practice",
    content: (
      <>
        <p>Manual scaling means someone watches dashboards and clicks buttons at 2 AM.{" "}<strong style={{ color: "var(--accent-color)" }}>Auto scaling</strong> replaces that human with a policy engine that reacts in seconds.</p>
        <div className="rounded-lg p-4 text-xs space-y-2" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "var(--primary-color)" }}>Scaling policies:</strong></p>
          <div className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>→</span><span><strong>Target tracking</strong>: &ldquo;Keep average CPU at 60%&rdquo; (simplest, most common)</span></div>
          <div className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>→</span><span><strong>Step scaling</strong>: &ldquo;If CPU &gt; 70% add 2, if &gt; 90% add 5&rdquo;</span></div>
          <div className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>→</span><span><strong>Scheduled</strong>: &ldquo;Scale to 10 instances every weekday at 9 AM&rdquo;</span></div>
          <div className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>→</span><span><strong>Predictive</strong>: ML-based, learns your traffic patterns</span></div>
        </div>
        <p>In{" "}<strong style={{ color: "var(--primary-color)" }}>GCP</strong>, the auto scaler is built into{" "}<strong>Managed Instance Groups (MIG)</strong>. You set a target CPU utilization or custom Cloud Monitoring metric, and it handles the rest. In{" "}<strong>AWS</strong>, it&apos;s an{" "}<strong>Auto Scaling Group (ASG)</strong> with target tracking or step scaling policies attached.</p>
        <p>The auto scaler and load balancer work as a pair: the LB routes traffic to healthy instances, the auto scaler ensures there are enough of them.</p>
      </>
    ),
  },
  {
    mode: "health-checks",
    title: "Health Checks: The Glue",
    content: (
      <>
        <p>Health checks are the feedback loop that makes everything work. Without them, the LB doesn&apos;t know which servers are alive, and the auto scaler doesn&apos;t know when to replace failed instances.</p>
        <div className="rounded-lg p-4 text-xs space-y-2" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "var(--primary-color)" }}>How they work:</strong></p>
          <p>The load balancer sends{" "}<code className="article-inline-code">GET /health</code> to each instance every 10-30 seconds.</p>
          <p className="mt-2"><strong style={{ color: "#2ecc71" }}>Healthy</strong>: returns 200. Stays in rotation.</p>
          <p><strong style={{ color: "#e74c3c" }}>Unhealthy</strong>: returns 5xx or times out for N consecutive checks. Removed from rotation.</p>
          <p className="mt-2"><strong style={{ color: "var(--primary-color)" }}>What a good health check tests:</strong></p>
          <p>• App process is running</p>
          <p>• Database connection is alive</p>
          <p>• Critical dependencies are reachable</p>
        </div>
        <p>In{" "}<strong style={{ color: "var(--primary-color)" }}>GCP</strong>, health checks are a first-class resource. You create them independently and attach to both the load balancer and the MIG. The MIG uses them for{" "}<strong>auto-healing</strong>: if an instance fails health checks, it&apos;s automatically recreated from the instance template.</p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>It&apos;s similar to hospital vitals monitoring: if the heartbeat flatlines, the system responds automatically.</p>
      </>
    ),
  },
  {
    mode: "ha-zones",
    title: "High Availability: The Nines",
    content: (
      <>
        <p><strong style={{ color: "var(--accent-color)" }}>High availability (HA)</strong> is the ability of a system to remain operational despite failures. It&apos;s measured in &ldquo;nines&rdquo; of uptime:</p>
        <div className="rounded-lg p-4 text-xs space-y-1 font-mono" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <div className="flex justify-between"><span>99.9% &nbsp;(three nines)</span><span style={{ color: "var(--muted-text)" }}>~8.7 hrs downtime/year</span></div>
          <div className="flex justify-between"><span>99.95%</span><span style={{ color: "var(--muted-text)" }}>~4.4 hrs downtime/year</span></div>
          <div className="flex justify-between"><span style={{ color: "var(--accent-color)" }}>99.99% (four nines)</span><span style={{ color: "var(--accent-color)" }}>~52 min downtime/year</span></div>
          <div className="flex justify-between"><span>99.999% (five nines)</span><span style={{ color: "var(--muted-text)" }}>~5.3 min downtime/year</span></div>
        </div>
        <p>The key insight: you can&apos;t achieve HA with a single location. Hardware fails. Power goes out. Networks partition. The only way to survive is{" "}<strong style={{ color: "var(--primary-color)" }}>redundancy across failure domains</strong>.</p>
        <p>In the diagram, VMs are spread across Zone A and Zone B. Each zone is a separate physical data center with independent power, cooling, and networking. If one zone fails, the other keeps serving.</p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>Having two offices in different buildings works the same way: if one loses power, the other keeps running.</p>
      </>
    ),
  },
  {
    mode: "ha-failover",
    title: "Zone Failover in Action",
    content: (
      <>
        <p>When Zone A goes down, the load balancer detects failed health checks and shifts all traffic to Zone B. No human intervention. No downtime.</p>
        <div className="rounded-lg p-4 text-xs space-y-2" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "var(--primary-color)" }}>The failover sequence:</strong></p>
          <div className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>1.</span><span>Zone A instances fail health checks (3 consecutive failures)</span></div>
          <div className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>2.</span><span>LB removes Zone A instances from rotation (~30s)</span></div>
          <div className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>3.</span><span>All traffic routes to Zone B</span></div>
          <div className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>4.</span><span>Auto scaler detects reduced capacity → spins up more Zone B instances</span></div>
        </div>
        <p>This is the trifecta at work:{" "}<strong style={{ color: "var(--primary-color)" }}>health checks</strong> detect the failure,{" "}<strong style={{ color: "var(--primary-color)" }}>load balancing</strong> reroutes traffic, and{" "}<strong style={{ color: "var(--primary-color)" }}>auto scaling</strong> restores capacity.</p>
        <p>In{" "}<strong style={{ color: "var(--primary-color)" }}>GCP</strong>, a regional MIG automatically spreads instances across zones. The HTTPS Load Balancer is{" "}<strong>global</strong>, so it can route around zone, region, or even continent-level failures. In{" "}<strong>AWS</strong>, you configure a multi-AZ Auto Scaling Group with an ALB.</p>
      </>
    ),
  },
  {
    mode: "lb-types",
    title: "GCP Load Balancer Types",
    content: (
      <>
        <p>GCP has a family of load balancers, each optimized for different traffic patterns:</p>
        <div className="rounded-lg p-4 text-xs space-y-2" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <div>
            <strong style={{ color: "#3498db" }}>External HTTPS LB (L7)</strong>
            <p className="mt-1">Global. Routes by URL path, host, headers. Terminates SSL. Integrates with Cloud CDN and Cloud Armor (WAF). This is the default for web apps.</p>
          </div>
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem" }}>
            <strong style={{ color: "#e67e22" }}>TCP/SSL Proxy LB (L4)</strong>
            <p className="mt-1">Global. For non-HTTP traffic: databases, game servers, custom protocols. Terminates SSL without inspecting HTTP.</p>
          </div>
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem" }}>
            <strong style={{ color: "#2ecc71" }}>Internal HTTPS LB</strong>
            <p className="mt-1">Regional. For service-to-service traffic within your VPC. Not exposed to the internet. L7 routing for internal microservices.</p>
          </div>
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem" }}>
            <strong style={{ color: "#9b59b6" }}>Network LB (passthrough)</strong>
            <p className="mt-1">Regional. L4 passthrough - doesn&apos;t terminate connections. Lowest latency. Used for UDP, non-HTTP TCP, or when you need to preserve the client IP.</p>
          </div>
        </div>
        <p>The{" "}<strong style={{ color: "var(--primary-color)" }}>AWS equivalents</strong>: ALB (L7), NLB (L4 passthrough), GWLB (inline appliances). AWS doesn&apos;t have a global LB; you use CloudFront + ALB per region instead.</p>
      </>
    ),
  },
  {
    mode: "mig",
    title: "Managed Instance Groups (MIG)",
    content: (
      <>
        <p>A{" "}<strong style={{ color: "var(--accent-color)" }}>Managed Instance Group</strong> is GCP&apos;s way of combining everything we&apos;ve discussed into one managed resource.</p>
        <div className="rounded-lg p-4 text-xs space-y-1" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "var(--primary-color)" }}>What a MIG provides:</strong></p>
          <p>• <strong>Instance template</strong>: machine type, disk, startup script, container image</p>
          <p>• <strong>Auto scaling</strong>: target CPU, custom metrics, schedules</p>
          <p>• <strong>Auto healing</strong>: recreates instances that fail health checks</p>
          <p>• <strong>Rolling updates</strong>: deploy new versions with zero downtime</p>
          <p>• <strong>Multi-zone distribution</strong>: spreads instances across zones automatically</p>
        </div>
        <p>A regional MIG in{" "}<code className="article-inline-code">us-central1</code>{" "}might run instances across{" "}<code className="article-inline-code">us-central1-a</code>,{" "}<code className="article-inline-code">-b</code>, and{" "}<code className="article-inline-code">-c</code>. If zone A has a hardware failure, the MIG redistributes to the remaining zones.</p>
        <p>The{" "}<strong>AWS equivalent</strong> is an{" "}<strong>Auto Scaling Group (ASG)</strong> with a launch template, multi-AZ placement, and instance refresh for rolling deployments.</p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>A MIG is essentially a factory floor manager: it follows a blueprint (template), keeps the right number of workers on shift (auto scaling), replaces anyone who calls in sick (auto healing), and spreads them across buildings (multi-zone).</p>
      </>
    ),
  },
  {
    mode: "summary",
    title: "The Full Architecture",
    content: (
      <>
        <p>Here&apos;s how it all fits together in a production GCP deployment:</p>
        <div className="rounded-lg p-4 text-xs font-mono space-y-1" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p>Client</p>
          <p>&nbsp; → Cloud DNS</p>
          <p>&nbsp; → External HTTPS LB (global)</p>
          <p>&nbsp;&nbsp;&nbsp; → Cloud CDN (edge cache)</p>
          <p>&nbsp;&nbsp;&nbsp; → Cloud Armor (WAF/DDoS)</p>
          <p>&nbsp; → Regional MIG (multi-zone)</p>
          <p>&nbsp;&nbsp;&nbsp; → VM instances (auto-scaled)</p>
          <p>&nbsp;&nbsp;&nbsp; → Health checks (auto-healing)</p>
          <p>&nbsp; → Cloud SQL / Memorystore</p>
        </div>
        <div className="rounded-lg p-4 text-xs space-y-2 mt-3" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "var(--primary-color)" }}>How they work together:</strong></p>
          <div className="flex justify-between"><span><strong>Load Balancer</strong></span><span>Routes traffic to healthy instances</span></div>
          <div className="flex justify-between"><span><strong>Auto Scaling</strong></span><span>Adjusts instance count to match demand</span></div>
          <div className="flex justify-between"><span><strong>Health Checks</strong></span><span>Detects failures, triggers healing</span></div>
          <div className="flex justify-between"><span><strong>Multi-Zone</strong></span><span>Survives data center failures</span></div>
        </div>
        <p className="font-medium" style={{ color: "var(--primary-color)" }}>Load balancing, auto scaling, and high availability aren&apos;t separate concerns. They&apos;re a single system. The LB needs the auto scaler to ensure capacity. The auto scaler needs health checks to know what&apos;s broken. And multi-zone deployment makes all of it resilient.</p>
      </>
    ),
  },
];

export default function ScalingInteractive() {
  const [activeMode, setActiveMode] = useState<ScalingMode>("idle");
  const visibleRef = useRef<Set<number>>(new Set());

  const handleVisible = useCallback((index: number, visible: boolean) => {
    if (visible) {
      visibleRef.current.add(index);
    } else {
      visibleRef.current.delete(index);
    }
    if (visibleRef.current.size > 0) {
      const topmost = Math.min.apply(null, Array.from(visibleRef.current));
      setActiveMode(sections[topmost].mode);
    }
  }, []);

  return (
    <div className="relative lg:flex lg:gap-10">
      <div className="hidden lg:block lg:w-[440px] flex-shrink-0">
        <div className="sticky top-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl p-2"
            style={{ border: "1px solid var(--border-color)", backgroundColor: "var(--card-bg)" }}
          >
            <ScalingDiagram mode={activeMode} />
          </motion.div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {sections.map((section, i) => (
          <SectionBlock
            key={i}
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
