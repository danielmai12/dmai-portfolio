import { Article } from "./types";

export const systemDesignArticles: Article[] = [
  {
    slug: "load-balancers-reverse-proxies-api-gateways",
    title: "Load Balancers, Reverse Proxies & API Gateways",
    date: "Mar 19, 2026",
    category: "System Design",
    summary:
      "Three components that sit between clients and servers. What each one does, how they overlap, and when you actually need them.",
    readingTime: "8 min read",
    interactive: true,
    content: `## Load Balancers, Reverse Proxies & API Gateways

If you've ever deployed a web application beyond a single server, you've probably encountered at least one of these. They all sit between the client and your backend, but they solve different problems. Understanding the distinction, and where they overlap, is fundamental to designing reliable systems.

### The Big Picture

\`\`\`
Client → [Load Balancer / Reverse Proxy / API Gateway] → Backend Server(s)
\`\`\`

All three act as intermediaries. The difference is **what they optimize for**.

---

### Load Balancer

A load balancer distributes incoming traffic across multiple servers so no single server gets overwhelmed.

**Why it exists:** One server has limits: CPU, memory, connections. If your app gets more traffic than one machine can handle, you scale horizontally (add more servers). The load balancer decides which server handles each request.

**How it works:**

\`\`\`
Client request
    ↓
Load Balancer
    ↓ (picks one)
┌────────┬────────┬────────┐
│ App #1 │ App #2 │ App #3 │
└────────┴────────┴────────┘
\`\`\`

**Common algorithms:**

- **Round Robin** - requests go to servers in order: 1, 2, 3, 1, 2, 3...
- **Least Connections** - sends to the server with the fewest active connections.
- **IP Hash** - same client IP always goes to the same server (useful for session affinity).
- **Weighted** - servers with more capacity get more traffic.

**L4 vs L7 load balancing:**

| Layer | Operates on | Sees | Example |
|-------|------------|------|---------|
| L4 (Transport) | TCP/UDP packets | IP + port | AWS NLB |
| L7 (Application) | HTTP requests | URL, headers, cookies | AWS ALB, Nginx |

L4 is faster (less inspection), L7 is smarter (can route based on path, headers, etc).

**Real example:** You have 3 instances of your NestJS API behind an AWS ALB. The ALB routes \`/api/users\` to a target group and health-checks each instance every 30 seconds. If one instance goes down, traffic stops going there automatically.

---

### Reverse Proxy

A reverse proxy sits in front of your servers and handles requests on their behalf. The client never talks directly to your backend.

**Why it exists:** It decouples clients from your internal infrastructure. Your servers can change, scale, or move - the client doesn't care.

**What it does:**

- **Hides server identity** - clients see the proxy's IP, not your actual servers.
- **SSL termination** - the proxy handles HTTPS, so your app servers can run plain HTTP internally.
- **Compression** - gzip responses before sending to clients.
- **Caching** - serve static assets or repeated responses without hitting the backend.
- **Security** - block malicious requests, rate limit, filter headers.

\`\`\`
Client → (HTTPS) → Nginx → (HTTP) → App Server
\`\`\`

**How is this different from a load balancer?** A load balancer focuses on distributing traffic. A reverse proxy focuses on mediating the connection. In practice, most reverse proxies (Nginx, HAProxy) can also load balance, and most load balancers (ALB) also act as reverse proxies. The lines are blurred.

**The key distinction:** If you have one backend server, a reverse proxy is still useful. A load balancer only makes sense with multiple servers.

---

### API Gateway

An API gateway is a reverse proxy with application-level intelligence. It understands your API structure and adds cross-cutting concerns.

**Why it exists:** When you have multiple services (or even a single API), there are concerns that don't belong in business logic: authentication, rate limiting, request transformation, analytics. An API gateway handles these in one place.

**What it does beyond a reverse proxy:**

- **Authentication & authorization** - validate JWTs, API keys, OAuth tokens before the request reaches your service.
- **Rate limiting** - 100 requests per minute per API key.
- **Request/response transformation** - rename fields, aggregate responses from multiple services.
- **API versioning** - route \`/v1/users\` and \`/v2/users\` to different services.
- **Analytics & logging** - track usage per endpoint, per consumer.
- **Circuit breaking** - stop sending traffic to a failing downstream service.

\`\`\`
Client → API Gateway → Auth check
                     → Rate limit check
                     → Route to correct service
                     → Transform response
                     → Return to client
\`\`\`

**Examples:** AWS API Gateway, Kong, Apigee, Express Gateway.

**When you need one:** If you're building a public API, have multiple backend services, or need centralized auth and rate limiting - use an API gateway. For a single internal service, a reverse proxy is usually enough.

---

### How They Compare

| Feature | Load Balancer | Reverse Proxy | API Gateway |
|---------|--------------|---------------|-------------|
| Traffic distribution | Yes | Sometimes | Sometimes |
| SSL termination | Yes (L7) | Yes | Yes |
| Caching | Limited | Yes | Sometimes |
| Auth / Rate limiting | No | Basic | Yes |
| Request transformation | No | No | Yes |
| API versioning | No | No | Yes |
| Health checks | Yes | Yes | Yes |

### In Practice

Most production setups use a combination:

\`\`\`
Internet → CDN → API Gateway → Load Balancer → App Servers
\`\`\`

- **CDN** handles static assets and edge caching.
- **API Gateway** handles auth, rate limiting, routing.
- **Load Balancer** distributes traffic across healthy instances.

You don't always need all three. Start simple - a single Nginx reverse proxy can handle SSL, caching, and basic load balancing. Add an API gateway when your API surface grows. Add a dedicated load balancer when you need advanced health checking and auto-scaling integration.

The right answer is always: **use the simplest setup that meets your current requirements**, and evolve from there.`,
  },
  {
    slug: "dns-cdns-internet-traffic-routing",
    title: "DNS, CDNs & How the Internet Routes Traffic",
    date: "Mar 19, 2026",
    category: "System Design",
    summary:
      "What actually happens between typing a URL and seeing a page - DNS resolution, CDN edge caching, and how traffic finds its way across the internet.",
    readingTime: "9 min read",
    interactive: true,
    content: `## DNS, CDNs & How the Internet Routes Traffic

Every developer uses the internet daily, but few can explain what happens in the ~100ms between typing a URL and getting a response. Understanding this flow is fundamental - it affects performance, reliability, and how you architect your systems.

### What Happens When You Type a URL

\`\`\`
You type: https://example.com/api/users

1. DNS Resolution    → "What IP is example.com?"
2. TCP Connection    → Three-way handshake with the server
3. TLS Handshake     → Establish encrypted connection
4. HTTP Request      → GET /api/users
5. Server Processing → Your app handles the request
6. HTTP Response     → JSON/HTML sent back
7. Rendering         → Browser paints the page
\`\`\`

Let's break down the pieces you need to understand as a backend engineer.

---

### DNS - The Internet's Phone Book

DNS (Domain Name System) translates human-readable domain names into IP addresses. Computers don't know what \`example.com\` is - they need \`93.184.216.34\`.

**The resolution chain:**

\`\`\`
Browser cache → OS cache → Router cache → ISP Resolver → Root → TLD → Authoritative
\`\`\`

**Step by step:**

1. **Browser cache** - Did I look this up recently? If yes, use the cached IP.
2. **OS cache** - Check the operating system's DNS cache.
3. **Router cache** - Your home/office router may have it cached.
4. **ISP's recursive resolver** - Your ISP has a DNS server that does the heavy lifting.
5. **Root nameserver** - "I don't know example.com, but .com is handled by these TLD servers."
6. **TLD nameserver** - "I don't know example.com, but its authoritative nameserver is ns1.example.com."
7. **Authoritative nameserver** - "example.com is 93.184.216.34." (the final answer)

**DNS record types you should know:**

| Record | Purpose | Example |
|--------|---------|---------|
| A | Maps domain to IPv4 | example.com → 93.184.216.34 |
| AAAA | Maps domain to IPv6 | example.com → 2606:2800:220:1:... |
| CNAME | Alias to another domain | www.example.com → example.com |
| MX | Mail server routing | example.com → mail.example.com |
| NS | Nameserver delegation | example.com → ns1.cloudflare.com |
| TXT | Arbitrary text (SPF, verification) | "v=spf1 include:..." |

**TTL (Time To Live):** Every DNS record has a TTL - how long resolvers should cache the answer. A TTL of 300 means "cache this for 5 minutes." Lower TTL = faster propagation of changes, but more DNS queries. Higher TTL = better performance, but slower updates.

**Why this matters:** When you deploy to a new server and update DNS, the old IP can still receive traffic until caches expire. This is why DNS changes "take time to propagate" - it's really just caches expiring worldwide.

---

### CDN - Bringing Content Closer to Users

A CDN (Content Delivery Network) is a globally distributed network of servers that cache and serve content from locations physically close to users.

**The problem it solves:** Your server is in us-east-1 (Virginia). A user in Tokyo makes a request. The data travels ~11,000 km each way. Even at the speed of light, physics adds ~70ms of latency per round trip, and real-world routing makes it worse.

**How a CDN works:**

\`\`\`
User in Tokyo → CDN Edge (Tokyo) → Cache HIT → Response (5ms)

User in Tokyo → CDN Edge (Tokyo) → Cache MISS → Origin (Virginia) → Response (200ms)
                                                  ↓
                                   CDN caches it for next time
\`\`\`

**What CDNs cache:**

- **Static assets** - images, CSS, JS, fonts (this is the main use case)
- **HTML pages** - for static or semi-static sites
- **API responses** - with proper cache headers (less common, but powerful)

**Cache headers that control CDN behavior:**

\`\`\`
Cache-Control: public, max-age=31536000    → Cache for 1 year (static assets)
Cache-Control: public, max-age=60          → Cache for 1 minute (dynamic content)
Cache-Control: no-store                     → Never cache (private data)
\`\`\`

**CDN features beyond caching:**

- **DDoS protection** - absorb massive traffic at the edge before it reaches your origin.
- **SSL termination** - handle TLS at the edge, reduce load on your servers.
- **Edge compute** - run code at CDN nodes (Cloudflare Workers, Lambda@Edge).
- **Image optimization** - resize, compress, and convert images on the fly.
- **WAF (Web Application Firewall)** - block SQL injection, XSS at the edge.

**Popular CDNs:** Cloudflare, AWS CloudFront, Fastly, Akamai.

---

### How Traffic Actually Routes Across the Internet

Between the client and your server, traffic passes through multiple networks. Understanding this helps you debug latency and outages.

**IP and routing basics:**

Every device on the internet has an IP address. Routers forward packets hop-by-hop based on routing tables. The path is determined by **BGP (Border Gateway Protocol)** - the protocol that connects different networks (called Autonomous Systems).

\`\`\`
Your laptop → Home router → ISP → Internet Exchange → Cloud provider → Your server
\`\`\`

**Traceroute - see the actual path:**

\`\`\`bash
traceroute example.com

1  192.168.1.1     (your router)        1ms
2  10.0.0.1        (ISP gateway)        5ms
3  72.14.215.85    (ISP backbone)       12ms
4  108.170.250.33  (Google edge)        15ms
5  93.184.216.34   (destination)        18ms
\`\`\`

Each line is a "hop" - a router that forwarded your packet. The latency accumulates.

**Why latency varies:**

- **Physical distance** - speed of light in fiber is ~200,000 km/s, so distance matters.
- **Number of hops** - each router adds processing time.
- **Congestion** - busy links add queuing delay.
- **Peering** - if two networks don't peer directly, traffic may take a longer path through a third network.

---

### Putting It All Together

Here's the full flow for a real-world production setup:

\`\`\`
User types app.example.com
        ↓
DNS resolves to CDN edge IP (Cloudflare)
        ↓
CDN edge (closest PoP to user)
   ├── Static asset? → Serve from cache
   └── API request?  → Forward to origin
        ↓
API Gateway (auth, rate limiting)
        ↓
Load Balancer (distribute to healthy instances)
        ↓
App Server (process request, query DB)
        ↓
Response travels back the same path
\`\`\`

**Performance takeaways:**

- **DNS** - use a fast DNS provider, set reasonable TTLs, pre-connect to critical domains.
- **CDN** - cache everything you can at the edge. Set proper Cache-Control headers.
- **Geography** - deploy in regions close to your users. Multi-region if your users are global.
- **Reduce round trips** - HTTP/2 multiplexing, connection reuse, prefetching.

The internet is a system of systems. The more you understand each layer, the better you can design, debug, and optimize what you build on top of it.`,
  },
  {
    slug: "caching-strategies-patterns-redis",
    title: "Caching - Strategies, Patterns & Common Problems",
    date: "Mar 20, 2026",
    category: "System Design",
    summary:
      "Where to cache, cache architectures (cache-aside, write-through, write-behind, read-through), eviction policies, and common problems like stampedes and hot keys.",
    readingTime: "15 min read",
    interactive: true,
    content: `## Caching - Strategies, Patterns & Common Problems

When most engineers hear caching, they immediately think of Redis or Memcached sitting between the application and the database. But caching shows up in multiple layers of a system. Browsers cache. CDNs cache. Applications cache.

### Where to Cache

**External Caching** - A standalone cache service (Redis, Memcached) your application talks to over the network. Shared by all app servers. This is the default answer in system design interviews.

**CDN** - Geographically distributed servers that cache content close to users. Best for static media at scale.

**Client-Side** - Data stored on the user's device (browser cache, localStorage, mobile storage) to avoid network calls.

**In-Process** - Data cached directly in application memory (HashMap, local cache). Fastest reads but not shared across instances.

### Cache Architectures

**Cache-Aside (Lazy Loading)** - App checks cache, falls back to DB on miss, stores result in cache. Most common pattern.

**Write-Through** - App writes to cache, cache synchronously writes to DB. Strong consistency, slower writes.

**Write-Behind (Write-Back)** - App writes to cache, cache flushes to DB asynchronously. Fast writes, risk of data loss.

**Read-Through** - Cache auto-fetches from DB on miss. Centralizes caching logic. CDNs work this way.

### Eviction Policies

LRU (least recently used, most common), LFU (least frequently used), FIFO (oldest first), TTL (time-based expiry).

### Common Problems

**Cache Stampede** - Popular key expires, many requests simultaneously miss and flood the DB. Solution: request coalescing / singleflight.

**Cache Consistency** - Cache and DB return different values. Solution: invalidate on writes, use short TTLs.

**Hot Keys** - One key gets disproportionate traffic, overloading a single cache node. Solution: replicate hot keys, add local fallback cache.`,
  },
  {
    slug: "vpc-networking-cloud-infrastructure",
    title: "VPC - Your Private Network in the Cloud",
    date: "Mar 19, 2026",
    category: "System Design",
    summary:
      "Subnets, gateways, route tables, security groups, and CIDR blocks - how cloud networking actually works under the hood.",
    readingTime: "8 min read",
    interactive: true,
    content: `## VPC - Your Private Network in the Cloud

A Virtual Private Cloud (VPC) is your isolated network within a cloud provider. Every resource you deploy lives inside one.

### Core Concepts

**Subnets** partition your VPC into public (internet-facing), private (internal), and isolated (no internet) zones.

**Internet Gateway (IGW)** enables bidirectional internet access for public subnets. **NAT Gateway** lets private resources make outbound requests without being exposed.

**Route Tables** determine where traffic flows - they're what actually make a subnet "public" or "private."

**Security Groups** (stateful, per-instance) and **NACLs** (stateless, per-subnet) provide two layers of firewall protection.

**VPC Peering** connects two VPCs directly. **Transit Gateway** acts as a hub for many VPCs at scale.

**CIDR Blocks** define your IP address space. Plan carefully - overlapping CIDRs prevent peering.

### A Typical Production VPC

\`\`\`
Internet → IGW → ALB (public subnet) → App Server (private subnet) → RDS (isolated subnet)
\`\`\`

Defense in depth: multiple layers of network isolation ensuring that even if one layer is compromised, the blast radius is contained.`,
  },
];
