"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { SectionBlock } from "@/components/blog/primitives";
import NetworkDiagram from "./NetworkDiagram";

const sections = [
  {
    step: 0,
    title: "You Type a URL",
    content: (
      <>
        <p>
          It all starts with a simple action: you type{" "}
          <code className="article-inline-code">
            https://example.com/api/users
          </code>{" "}
          into your browser and hit enter.
        </p>
        <p>
          In the next ~100-300 milliseconds, your request will traverse multiple
          systems - DNS resolution, TCP handshakes, CDN edges, load balancers,
          and finally reach an application server. Each layer has a purpose.
        </p>
        <p>Let&apos;s follow the packet.</p>
      </>
    ),
  },
  {
    step: 1,
    title: "Step 1 - DNS Resolution",
    content: (
      <>
        <p>
          Your browser doesn&apos;t know what{" "}
          <code className="article-inline-code">example.com</code> is. It
          needs an IP address like{" "}
          <code className="article-inline-code">93.184.216.34</code>.
        </p>
        <p>
          <strong style={{ color: "var(--primary-color)" }}>
            DNS (Domain Name System)
          </strong>{" "}
          is the internet&apos;s phone book. It translates human-readable
          domains into IP addresses through a chain of lookups.
        </p>
        <p>The resolution chain:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li><strong>Browser cache</strong> - checked first, fastest</li>
          <li><strong>OS cache</strong> - system-level DNS cache</li>
          <li><strong>Router cache</strong> - your local network</li>
          <li><strong>ISP&apos;s recursive resolver</strong> - does the heavy lifting</li>
          <li><strong>Root &rarr; TLD &rarr; Authoritative</strong> - the full chain when nothing is cached</li>
        </ol>
      </>
    ),
  },
  {
    step: 2,
    title: "DNS Records & TTL",
    content: (
      <>
        <p>The authoritative nameserver returns a DNS record. Key types:</p>
        <div className="rounded-lg p-4 text-xs space-y-2" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <div className="flex justify-between"><span style={{ color: "var(--primary-color)" }} className="font-medium">A</span><span>Domain &rarr; IPv4 address</span></div>
          <div className="flex justify-between"><span style={{ color: "var(--primary-color)" }} className="font-medium">AAAA</span><span>Domain &rarr; IPv6 address</span></div>
          <div className="flex justify-between"><span style={{ color: "var(--primary-color)" }} className="font-medium">CNAME</span><span>Alias to another domain</span></div>
          <div className="flex justify-between"><span style={{ color: "var(--primary-color)" }} className="font-medium">MX</span><span>Mail server routing</span></div>
          <div className="flex justify-between"><span style={{ color: "var(--primary-color)" }} className="font-medium">NS</span><span>Nameserver delegation</span></div>
        </div>
        <p>
          Every record has a{" "}
          <strong style={{ color: "var(--primary-color)" }}>TTL (Time To Live)</strong>,
          which tells resolvers how long to cache the answer. A TTL of 300 means &ldquo;cache this for 5 minutes.&rdquo;
        </p>
        <p>This is why DNS changes &ldquo;take time to propagate&rdquo; - it&apos;s really just caches expiring worldwide.</p>
      </>
    ),
  },
  {
    step: 3,
    title: "Step 2 - TCP Handshake",
    content: (
      <>
        <p>
          Now that the browser has an IP address, it needs to establish a reliable connection using the{" "}
          <strong style={{ color: "var(--primary-color)" }}>TCP three-way handshake</strong>.
        </p>
        <p>Three packets bounce between client and server before any data is sent:</p>
        <div className="rounded-lg p-4 text-xs space-y-2" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-start gap-2">
            <span style={{ color: "#3498db", fontWeight: 600 }} className="shrink-0">1. SYN</span>
            <span>Client &rarr; Server: &ldquo;I want to connect&rdquo; (sends a sequence number)</span>
          </div>
          <div className="flex items-start gap-2">
            <span style={{ color: "#2ecc71", fontWeight: 600 }} className="shrink-0">2. SYN-ACK</span>
            <span>Server &rarr; Client: &ldquo;Got it, I&apos;m ready too&rdquo; (acknowledges + sends its own sequence number)</span>
          </div>
          <div className="flex items-start gap-2">
            <span style={{ color: "#e67e22", fontWeight: 600 }} className="shrink-0">3. ACK</span>
            <span>Client &rarr; Server: &ldquo;Connection established&rdquo;</span>
          </div>
        </div>
        <p>This adds one round-trip (~20-50ms) before any HTTP data flows. For HTTPS, a{" "}
          <strong style={{ color: "var(--primary-color)" }}>TLS handshake</strong>{" "}
          follows to negotiate encryption keys, adding another 1-2 round trips.</p>
        <p>This is why{" "}<code className="article-inline-code">Connection: keep-alive</code>{" "}exists - reusing TCP connections avoids repeating this overhead.</p>
      </>
    ),
  },
  {
    step: 4,
    title: "Step 3 - CDN Edge",
    content: (
      <>
        <p>
          With the TCP connection established, the request hits a{" "}
          <strong style={{ color: "var(--primary-color)" }}>CDN (Content Delivery Network)</strong>,
          a globally distributed network of servers that cache content close to users.
        </p>
        <p><strong>The problem it solves:</strong> Your server is in Virginia. A user in Tokyo is 11,000 km away. Even at the speed of light in fiber (~200,000 km/s), physics adds ~70ms per round trip.</p>
        <div className="rounded-lg p-4 text-xs font-mono" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p style={{ color: "var(--accent-color)" }}>Cache HIT:</p>
          <p>User &rarr; CDN Edge (Tokyo) &rarr; Response &nbsp;(~5ms)</p>
          <br />
          <p style={{ color: "var(--muted-text)" }}>Cache MISS:</p>
          <p>User &rarr; CDN Edge &rarr; Origin (Virginia) &rarr; Response &nbsp;(~200ms)</p>
        </div>
        <p>CDNs also provide DDoS protection, SSL termination, edge compute, and WAF capabilities - all before traffic ever reaches your origin.</p>
        <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>
          Not every app uses a CDN. Server-side rendered apps (Next.js SSR, Rails), services running in Kubernetes pods, or internal tools may skip this layer entirely. In those cases, the request goes straight from the browser to your origin or load balancer.
        </p>
      </>
    ),
  },
  {
    step: 5,
    title: "Step 4 - API Gateway",
    content: (
      <>
        <p>
          For API requests that aren&apos;t served from cache, traffic reaches the{" "}
          <strong style={{ color: "var(--primary-color)" }}>API Gateway</strong>,
          the front door to your backend services.
        </p>
        <p>Before your application code runs, the gateway handles:</p>
        <ul className="list-none space-y-2">
          <li className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>→</span><span><strong>Authentication</strong> - validate JWTs, API keys, OAuth tokens</span></li>
          <li className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>→</span><span><strong>Rate limiting</strong> - 100 req/min per API key</span></li>
          <li className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>→</span><span><strong>Routing</strong> - direct to the correct service based on path</span></li>
          <li className="flex items-start gap-2"><span style={{ color: "var(--accent-color)" }}>→</span><span><strong>Transformation</strong> - reshape requests/responses</span></li>
        </ul>
        <p>This keeps cross-cutting concerns out of your business logic.</p>
      </>
    ),
  },
  {
    step: 6,
    title: "Step 5 - Load Balancer & Server Processing",
    content: (
      <>
        <p>
          The request is now authenticated and routed. The{" "}
          <strong style={{ color: "var(--primary-color)" }}>Load Balancer</strong>{" "}
          distributes it across healthy application servers.
        </p>
        <div className="rounded-lg p-4 text-xs space-y-2" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <div><strong style={{ color: "var(--primary-color)" }}>Round Robin</strong> - 1, 2, 3, 1, 2, 3...</div>
          <div><strong style={{ color: "var(--primary-color)" }}>Least Connections</strong> - send to the least busy server</div>
          <div><strong style={{ color: "var(--primary-color)" }}>IP Hash</strong> - same client always hits the same server</div>
        </div>
        <p>The selected server processes your{" "}
          <strong style={{ color: "var(--primary-color)" }}>HTTP request</strong>{" "}
          - runs the application logic, queries the database, and builds a response.{" "}
          <em style={{ color: "var(--accent-color)" }}>This is usually the only latency most engineers think about and control!</em>
        </p>
      </>
    ),
  },
  {
    step: 7,
    title: "Step 6 - HTTP Response",
    content: (
      <>
        <p>The server sends an{" "}
          <strong style={{ color: "var(--primary-color)" }}>HTTP response</strong>{" "}
          back through the same chain: origin &rarr; load balancer &rarr; gateway &rarr; CDN edge &rarr; browser.</p>
        <p>
          Along the way, the CDN may cache the response for future requests with proper{" "}
          <code className="article-inline-code">Cache-Control</code> headers.
        </p>
        <div className="rounded-lg p-4 text-xs font-mono space-y-1" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <p><span style={{ color: "var(--muted-text)" }}># Static assets - cache aggressively</span></p>
          <p>Cache-Control: public, max-age=31536000</p>
          <br />
          <p><span style={{ color: "var(--muted-text)" }}># API responses - short cache</span></p>
          <p>Cache-Control: public, max-age=60</p>
          <br />
          <p><span style={{ color: "var(--muted-text)" }}># Private data - never cache</span></p>
          <p>Cache-Control: no-store</p>
        </div>
      </>
    ),
  },
  {
    step: 8,
    title: "Step 7 - TCP Teardown",
    content: (
      <>
        <p>
          After the data transfer is complete, the TCP connection is closed with a{" "}
          <strong style={{ color: "var(--primary-color)" }}>four-way handshake</strong>:
        </p>
        <div className="rounded-lg p-4 text-xs space-y-2" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-start gap-2">
            <span style={{ color: "#e74c3c", fontWeight: 600 }} className="shrink-0">1. FIN</span>
            <span>Client &rarr; Server: &ldquo;I&apos;m done sending data&rdquo;</span>
          </div>
          <div className="flex items-start gap-2">
            <span style={{ color: "#e74c3c", fontWeight: 600 }} className="shrink-0">2. ACK</span>
            <span>Server &rarr; Client: &ldquo;Got it&rdquo;</span>
          </div>
          <div className="flex items-start gap-2">
            <span style={{ color: "#e74c3c", fontWeight: 600 }} className="shrink-0">3. FIN</span>
            <span>Server &rarr; Client: &ldquo;I&apos;m done too&rdquo;</span>
          </div>
          <div className="flex items-start gap-2">
            <span style={{ color: "#e74c3c", fontWeight: 600 }} className="shrink-0">4. ACK</span>
            <span>Client &rarr; Server: &ldquo;Connection closed&rdquo;</span>
          </div>
        </div>
        <p>In practice, modern HTTP uses{" "}
          <strong style={{ color: "var(--primary-color)" }}>persistent connections</strong>{" "}
          - the TCP connection stays open for multiple requests. HTTP/2 goes further with{" "}
          <strong style={{ color: "var(--primary-color)" }}>multiplexing</strong>,
          where many requests share a single connection simultaneously.</p>
        <p className="font-medium" style={{ color: "var(--primary-color)" }}>
          All of this - DNS, TCP, TLS, CDN, gateway, LB, processing, and response - happens in roughly 100-300ms. Understanding each layer tells you where to optimize, where to cache, and where things break.
        </p>
      </>
    ),
  },
];

export default function DnsInteractive() {
  const [activeStep, setActiveStep] = useState(0);
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
      {/* Left: Sticky diagram */}
      <div className="hidden lg:block lg:w-[440px] flex-shrink-0">
        <div className="sticky top-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl p-2"
            style={{ border: "1px solid var(--border-color)", backgroundColor: "var(--card-bg)" }}
          >
            <NetworkDiagram activeStep={activeStep} />
            <div className="flex justify-center gap-1.5 mt-4">
              {sections.map((s) => (
                <div
                  key={s.step}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: activeStep >= s.step ? "var(--accent-color)" : "var(--border-color)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: Scrollable text sections */}
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
