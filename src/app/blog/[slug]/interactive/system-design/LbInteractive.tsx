"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { SectionBlock } from "@/components/blog/primitives";
import LbDiagram, { type LbMode } from "./LbDiagram";

interface Section {
  mode: LbMode;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    mode: "idle",
    title: "The Three Gatekeepers",
    content: (
      <>
        <p>Between your users and your backend, three critical components control how traffic flows:{" "}<strong style={{ color: "var(--primary-color)" }}>Reverse Proxies</strong>,{" "}<strong style={{ color: "var(--primary-color)" }}>API Gateways</strong>, and{" "}<strong style={{ color: "var(--primary-color)" }}>Load Balancers</strong>.</p>
        <p>They sound similar, and they do overlap, but each solves a distinct problem. Knowing when to use which is fundamental to designing resilient systems.</p>
        <p>Let&apos;s explore each one, starting from the simplest concept and building up.</p>
      </>
    ),
  },
  {
    mode: "reverse-proxy",
    title: "Reverse Proxy",
    content: (
      <>
        <p>A{" "}<strong style={{ color: "var(--accent-color)" }}>reverse proxy</strong>{" "}sits in front of your backend and acts on behalf of the server. Clients never talk directly to your origin.</p>
        <p>In the diagram, the client sends HTTPS, but the proxy forwards plain HTTP internally. That&apos;s{" "}<strong style={{ color: "var(--primary-color)" }}>SSL termination</strong> - the proxy handles encryption so your app doesn&apos;t have to.</p>
        <div className="rounded-lg p-4 text-xs space-y-1" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "var(--primary-color)" }}>What it does:</strong></p>
          <p>• <strong>SSL termination</strong> - decrypt HTTPS at the edge</p>
          <p>• <strong>Caching</strong> - serve repeated responses without hitting origin</p>
          <p>• <strong>Compression</strong> - gzip/brotli responses</p>
          <p>• <strong>Hide origin</strong> - clients never see your real server IPs</p>
        </div>
        <p><strong style={{ color: "var(--primary-color)" }}>Examples:</strong> Nginx, Caddy, HAProxy, Cloudflare. Even a CDN is essentially a globally distributed reverse proxy.</p>
      </>
    ),
  },
  {
    mode: "api-gateway",
    title: "API Gateway",
    content: (
      <>
        <p>An{" "}<strong style={{ color: "var(--accent-color)" }}>API Gateway</strong>{" "}is a specialized reverse proxy built for APIs. It adds application-aware features on top of basic proxying.</p>
        <p>Notice how requests to{" "}<span style={{ color: "#3498db", fontWeight: 500 }}>/users</span>,{" "}<span style={{ color: "#e67e22", fontWeight: 500 }}>/orders</span>, and{" "}<span style={{ color: "#2ecc71", fontWeight: 500 }}>/pay</span>{" "}each route to different backend services.</p>
        <div className="rounded-lg p-4 text-xs space-y-1" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "var(--primary-color)" }}>What it adds over a reverse proxy:</strong></p>
          <p>• <strong>Authentication</strong> - validate JWTs, API keys, OAuth</p>
          <p>• <strong>Rate limiting</strong> - 100 req/min per key</p>
          <p>• <strong>Request transformation</strong> - reshape payloads between client and service</p>
          <p>• <strong>Service routing</strong> - route by path, header, or method to different backends</p>
        </div>
        <p><strong style={{ color: "var(--primary-color)" }}>Examples:</strong> Kong, AWS API Gateway, Apigee. This is the front door to your microservices - it keeps cross-cutting concerns out of business logic.</p>
      </>
    ),
  },
  {
    mode: "round-robin",
    title: "Load Balancer: Round Robin",
    content: (
      <>
        <p>Now the{" "}<strong style={{ color: "var(--primary-color)" }}>Load Balancer</strong>. While a reverse proxy can sit in front of one server, a load balancer distributes traffic across{" "}<em>multiple</em> servers. It&apos;s how you scale horizontally.</p>
        <p>The simplest strategy is{" "}<strong style={{ color: "var(--accent-color)" }}>Round Robin</strong>: requests cycle through servers in order - 1 → 2 → 3 → 1 → 2 → 3.</p>
        <div className="rounded-lg p-4 text-xs space-y-1" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "var(--primary-color)" }}>Best for:</strong> Stateless services with similar server specs</p>
          <p><strong style={{ color: "var(--primary-color)" }}>Weakness:</strong> Ignores server load. A slow request on App #1 doesn&apos;t stop new traffic from arriving.</p>
        </div>
        <p><strong style={{ color: "var(--primary-color)" }}>Weighted Round Robin</strong> is a variant where beefier servers get a larger share. A server with weight 3 gets three requests for every one sent to a weight-1 server.</p>
      </>
    ),
  },
  {
    mode: "least-connections",
    title: "Least Connections",
    content: (
      <>
        <p>Smarter than round robin. The load balancer tracks{" "}<strong style={{ color: "var(--accent-color)" }}>active connections per server</strong>{" "}and routes new requests to the one with the fewest.</p>
        <p>The badges show this clearly - App #2 has only 3 active connections vs 12 and 7, so every new request goes there.</p>
        <div className="rounded-lg p-4 text-xs space-y-1" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "var(--primary-color)" }}>Best for:</strong> Long-lived connections (WebSocket, database pools, streaming)</p>
          <p><strong style={{ color: "var(--primary-color)" }}>Why it wins:</strong> Adapts to real load, not just request count</p>
        </div>
        <p>This is what most production setups use when connections have varying durations. AWS ALB uses a variant of this by default.</p>
      </>
    ),
  },
  {
    mode: "health-check",
    title: "Health Checks & Failover",
    content: (
      <>
        <p>The load balancer periodically pings each server with a{" "}<strong style={{ color: "var(--primary-color)" }}>health check</strong> - typically{" "}<code className="article-inline-code">GET /health</code> every 10-30 seconds.</p>
        <p>In the diagram, App #2 fails its health check, turns red, and gets pulled from rotation. Traffic automatically reroutes to the remaining healthy servers.</p>
        <div className="rounded-lg p-4 text-xs space-y-1" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "#2ecc71" }}>Green dot</strong> = healthy, passing health checks</p>
          <p><strong style={{ color: "#e74c3c" }}>Red dot</strong> = unhealthy, removed from pool</p>
        </div>
        <p>This is how systems stay available during deployments, crashes, or scaling events, with no manual intervention needed.</p>
      </>
    ),
  },
  {
    mode: "sticky-session",
    title: "Sticky Sessions",
    content: (
      <>
        <p>Sometimes you need the{" "}<strong style={{ color: "var(--primary-color)" }}>same user to hit the same server</strong>, usually because session state is stored in server memory.</p>
        <p>Here,{" "}<span style={{ color: "#3498db", fontWeight: 500 }}>User A</span> (blue) always goes to App #1, and{" "}<span style={{ color: "#2ecc71", fontWeight: 500 }}>User B</span> (green) always goes to App #2. The LB uses a cookie or IP hash to maintain that affinity.</p>
        <div className="rounded-lg p-4 text-xs space-y-1" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "var(--primary-color)" }}>Trade-off:</strong> If that server dies, the session is lost. That&apos;s why stateless architectures (JWTs, Redis sessions) are preferred.</p>
        </div>
        <p>Use sticky sessions as a temporary solution or when migrating from a stateful app. The goal should always be stateless servers behind the LB.</p>
      </>
    ),
  },
  {
    mode: "l4-vs-l7",
    title: "Layer 4 vs Layer 7",
    content: (
      <>
        <p>This is the most important distinction in load balancing.</p>
        <div className="rounded-lg p-4 text-xs space-y-3" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <div>
            <strong style={{ color: "var(--primary-color)" }}>L4 (Transport Layer)</strong>
            <p className="mt-1">Routes based on IP + port. Sees TCP/UDP packets, not HTTP. Fast but blind to content. Example: AWS NLB.</p>
          </div>
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem" }}>
            <strong style={{ color: "var(--primary-color)" }}>L7 (Application Layer)</strong>
            <p className="mt-1">Routes based on URL path, headers, cookies. Can split traffic by content. Example: AWS ALB, Nginx.</p>
          </div>
        </div>
        <p>In the diagram, the L7 LB reads the request path and routes{" "}<span style={{ color: "#9b59b6", fontWeight: 500 }}>/images</span> to App #1,{" "}<span style={{ color: "#e67e22", fontWeight: 500 }}>/api</span> to App #2, and{" "}<span style={{ color: "#1abc9c", fontWeight: 500 }}>/static</span> to App #3. Each path lands on its own dedicated service.</p>
        <p>L7 is what you want for microservices, API gateways, and anything where routing depends on the content of the request.</p>
      </>
    ),
  },
  {
    mode: "idle",
    title: "Putting It All Together",
    content: (
      <>
        <p>These three components often overlap, and in production you typically layer them:</p>
        <ul className="list-none space-y-2">
          <li className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>→</span><span><strong>Reverse Proxy</strong> (Nginx/Cloudflare) handles SSL, caching, compression at the edge</span></li>
          <li className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>→</span><span><strong>API Gateway</strong> (Kong/AWS) handles auth, rate limiting, and routes to services</span></li>
          <li className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>→</span><span><strong>Load Balancer</strong> (ALB/NLB) distributes traffic within each service cluster</span></li>
          <li className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>→</span><span><strong>Health checks</strong> automatically pull unhealthy instances from rotation</span></li>
        </ul>
        <div className="rounded-lg p-4 text-xs space-y-1" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><strong style={{ color: "var(--primary-color)" }}>A common stack:</strong></p>
          <p className="font-mono mt-1">Client → Cloudflare (RP) → Kong (API GW) → ALB (LB) → App Servers</p>
        </div>
        <p className="font-medium" style={{ color: "var(--primary-color)" }}>Knowing the distinction between these layers, and when each one is needed, is the foundation of designing resilient, scalable backend infrastructure.</p>
      </>
    ),
  },
];

export default function LbInteractive() {
  const [activeMode, setActiveMode] = useState<LbMode>("idle");
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
      <div className="hidden lg:block lg:w-[460px] flex-shrink-0">
        <div className="sticky top-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl p-2"
            style={{ border: "1px solid var(--border-color)", backgroundColor: "var(--card-bg)" }}
          >
            <LbDiagram mode={activeMode} />
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
