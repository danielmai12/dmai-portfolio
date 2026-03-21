"use client";

import {
  ExternalCacheDiagram,
  CdnCacheDiagram,
  ClientCacheDiagram,
  InProcessCacheDiagram,
  CacheAsideDiagram,
  WriteThroughDiagram,
  WriteBehindDiagram,
  ReadThroughDiagram,
  StampedeDiagram,
} from "./CachingDiagrams";

function DiagramBlock({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 mb-6"
      style={{
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      {children}
    </div>
  );
}

export default function CachingInteractive() {
  return (
    <div className="space-y-16">
      {/* Section 1: Intro */}
      <section>
        <div className="space-y-4 text-base leading-relaxed">
          <p style={{ color: "var(--muted-text)", fontStyle: "italic" }}>
            &ldquo;There are only two hard things in Computer Science: cache
            invalidation and naming things.&rdquo; - Phil Karlton
          </p>
          <p>
            At its core, caching means{" "}
            <span style={{ color: "#2a8a5a" }}>
              keeping a copy of data somewhere faster to reach
            </span>{" "}
            so you skip the expensive fetch next time. The concept is
            straightforward, but doing it well in a distributed system is
            surprisingly tricky.
          </p>
          <p>
            When most people think &ldquo;cache,&rdquo; they think{" "}
            <span style={{ color: "#2a8a5a" }}>Redis</span>. Redis is a solid
            choice, but caching exists at nearly every layer.{" "}
            <span style={{ color: "#3a7a8a" }}>Browsers cache</span>.{" "}
            <span style={{ color: "#3a7a8a" }}>CDNs cache</span>. Your{" "}
            <span style={{ color: "#2a5a8a" }}>application process</span>{" "}
            can hold data in memory. Even{" "}
            <span style={{ color: "#6a3a8a" }}>databases</span> run their own
            internal cache layers under the hood.
          </p>
          <p>
            This article walks through{" "}
            <strong style={{ color: "var(--primary-color)" }}>where</strong>{" "}
            caching happens,{" "}
            <strong style={{ color: "var(--primary-color)" }}>how</strong>{" "}
            different cache patterns work, and the{" "}
            <strong style={{ color: "var(--primary-color)" }}>problems</strong>{" "}
            that come with it.
          </p>
        </div>
      </section>

      <h2
        className="text-2xl font-bold mb-2"
        style={{ color: "var(--heading-color)" }}
      >
        Where to Cache
      </h2>
      {/* Section 2: External Caching */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          External Caching
        </h3>
        <DiagramBlock>
          <ExternalCacheDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            An external cache is a dedicated service like{" "}
            <strong style={{ color: "var(--primary-color)" }}>Redis</strong> or{" "}
            <strong style={{ color: "var(--primary-color)" }}>Memcached</strong>{" "}
            that sits between your application and the database. Your app
            servers connect to it over the network and use it to hold
            frequently requested data so the database doesn&apos;t get
            hammered on every read.
          </p>
          <p>
            The big advantage is that{" "}
            <span style={{ color: "#2a5a8a" }}>
              all of your app servers share a single cache
            </span>
            . Built-in eviction policies like{" "}
            <span style={{ color: "#2a8a5a" }}>LRU</span> and time-based
            expiry via{" "}
            <span style={{ color: "#2a8a5a" }}>TTL</span> keep memory usage
            in check automatically.
          </p>
          <p>
            If you&apos;re dealing with high traffic, an external cache is
            usually the first lever to pull. Get that working, then consider
            adding CDN or client-side caching on top.
          </p>
        </div>
      </section>

      {/* Section 3: CDN */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          CDN (Content Delivery Network)
        </h3>
        <DiagramBlock>
          <CdnCacheDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            A CDN places copies of your content on servers spread across the
            globe. When a user makes a request, it gets served from whichever
            edge node is physically closest rather than traveling all the way
            back to your origin.
          </p>
          <p>
            Providers like Cloudflare, Fastly, and Akamai have grown well
            beyond static file hosting. They can cache API responses, render
            HTML at the edge, and even enforce security rules before traffic
            reaches your infrastructure. That said, the highest-impact use
            case is still serving images, videos, and other static media.
          </p>
          <div
            className="rounded-lg p-4 text-xs"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p className="mb-2">
              <strong style={{ color: "var(--primary-color)" }}>
                How it works:
              </strong>
            </p>
            <div className="space-y-1">
              {[
                "A user requests an image from your app.",
                "The request goes to the nearest CDN edge server.",
                "If the image is cached there, it is returned immediately.",
                "If not, the CDN fetches it from your origin server, stores it, and returns it.",
                "Future users in that region get the image instantly from the CDN.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: "var(--accent-color)", flexShrink: 0 }}>
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
          <p>
            To put it in numbers: a request from India to a Virginia-based
            origin adds roughly{" "}
            <span style={{ color: "#6a3a8a" }}>250–300ms of round-trip latency</span>.
            Serve that same asset from a nearby CDN node and you&apos;re
            looking at{" "}
            <span style={{ color: "#2a8a5a" }}>20–40ms</span>.
          </p>
          <p>
            CDNs can do a lot more these days, but for most teams the
            biggest latency savings still come from offloading static media
            delivery.
          </p>
        </div>
      </section>

      {/* Section 4: Client-Side Caching */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Client-Side Caching
        </h3>
        <DiagramBlock>
          <ClientCacheDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Client-side caching keeps data on the requester&apos;s own device
            so it never has to cross the network again. In practice that could
            be a browser&apos;s HTTP cache, localStorage, or a mobile
            app&apos;s on-device storage.
          </p>
          <p>
            It also applies at the library level. A Redis client, for instance,
            caches{" "}
            <span style={{ color: "#3a7a8a" }}>cluster metadata</span> locally
            so it knows which shard owns which slot. That lets it route
            commands to the correct node without an extra round trip every
            time.
          </p>
          <p>
            The tradeoff is control. You can&apos;t easily invalidate what&apos;s
            sitting on someone&apos;s phone or browser. Strava, for example,
            stores your run history locally so the app works offline and syncs
            when connectivity returns. Your browser reusing an image it already
            downloaded is the same idea.
          </p>
        </div>
      </section>

      {/* Section 5: In-Process Caching */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          In-Process Caching
        </h3>
        <DiagramBlock>
          <InProcessCacheDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Your servers already have memory sitting there. Instead of reaching
            out to Redis or the database every time, you can stash
            frequently needed data right inside the application process
            itself.
          </p>
          <p>
            If the same handful of values keep getting requested, a HashMap or
            a local LRU cache inside the process eliminates the lookup
            entirely.{" "}
            <span style={{ color: "#2a8a5a" }}>
              Reading from process memory is faster than even Redis
            </span>{" "}
            because there&apos;s zero network overhead.
          </p>
          <p>
            This works well for small, frequently accessed values that rarely
            change:
          </p>
          <ul
            className="list-disc list-inside space-y-1 pl-2"
            style={{ color: "var(--muted-text)" }}
          >
            {[
              "Configuration values",
              "Feature flags",
              "Small reference datasets",
              "Hot keys",
              "Rate limiting counters",
              "Precomputed values",
            ].map((item) => (
              <li key={item}>
                <span style={{ color: "inherit" }}>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            The obvious downside is isolation. Every app instance maintains its
            own copy, so{" "}
            <span style={{ color: "#2a5a8a" }}>
              nothing is shared across servers
            </span>
            . If one instance invalidates a key, the rest still serve the old
            value until their own copy expires.
          </p>
          <p>
            Best suited for small, slow-changing values you read constantly.
            It won&apos;t replace Redis, but it makes a great first line of
            defense before you even hit the network.
          </p>
        </div>
      </section>

      {/* Section 6: Cache Architectures Intro */}
      <section>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--heading-color)" }}
        >
          Cache Architectures
        </h2>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Where you put the cache is only half the story. The other half is
            how reads and writes flow through it. Each pattern makes a
            different tradeoff between speed, consistency, and complexity.
          </p>
        </div>
      </section>

      {/* Section 7: Cache-Aside */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Cache-Aside (Lazy Loading)
        </h3>
        <DiagramBlock>
          <CacheAsideDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            By far the most widely used pattern. If you look at how most
            production services talk to Redis, this is what they&apos;re doing.
          </p>
          <div
            className="rounded-lg p-4 text-xs"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p className="mb-2">
              <strong style={{ color: "var(--primary-color)" }}>
                How it works:
              </strong>
            </p>
            <div className="space-y-1">
              {[
                "Application checks the cache.",
                "If the data is there, return it.",
                "If not, fetch from the database, store it in the cache, and return it.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: "var(--accent-color)", flexShrink: 0 }}>
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
          <p>
            Because data only enters the cache after it&apos;s actually
            requested, you avoid filling memory with things nobody needs. The
            tradeoff: every first request for a key pays an extra round trip.
          </p>
          <p style={{ color: "var(--primary-color)" }} className="font-medium">
            If you only remember one caching pattern, make it cache-aside.
          </p>
        </div>
      </section>

      {/* Section 8: Write-Through */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Write-Through Caching
        </h3>
        <DiagramBlock>
          <WriteThroughDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            In this pattern the app sends every write to the cache, and the
            cache{" "}
            <span style={{ color: "#2a8a5a" }}>synchronously</span> persists it
            to the database before acknowledging.{" "}
            <span style={{ color: "#6a3a8a" }}>
              Nothing returns to the caller until both stores are updated
            </span>
            .
          </p>
          <p>
            This isn&apos;t something Redis does out of the box. You typically
            need a caching library or a thin wrapper in your application code
            that coordinates the dual write.
          </p>
          <p>
            Writes are slower since the caller blocks on two operations. You
            also risk filling the cache with entries that nobody ever reads
            again.
          </p>
          <p>
            There&apos;s also the{" "}
            <span style={{ color: "#6a3a8a" }}>dual-write problem</span>: if
            the cache write succeeds but the database write fails (or the other
            way around), you end up with inconsistent state.
          </p>
          <p>
            Reach for this when your reads absolutely need the latest value
            and you can afford the extra write latency.
          </p>
        </div>
      </section>

      {/* Section 9: Write-Behind */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Write-Behind (Write-Back) Caching
        </h3>
        <DiagramBlock>
          <WriteBehindDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Write-behind flips the durability guarantee. The app writes to the
            cache and returns immediately. The cache then flushes changes to
            the database{" "}
            <span style={{ color: "#2a8a5a" }}>asynchronously</span> in the
            background, often in batches.
          </p>
          <p>
            You get blazing-fast writes, but with a real risk:{" "}
            <span style={{ color: "#6a3a8a" }}>
              if the cache goes down before flushing, those writes are gone
            </span>
            . Only use this where losing a small window of data is
            tolerable.
          </p>
          <p>
            Analytics pipelines, event counters, and metrics collectors are
            classic fits. High write volume, eventual consistency is fine.
          </p>
        </div>
      </section>

      {/* Section 10: Read-Through */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Read-Through Caching
        </h3>
        <DiagramBlock>
          <ReadThroughDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Read-through puts{" "}
            <span style={{ color: "#2a8a5a" }}>
              the cache in charge of fetching
            </span>
            . Your application only ever talks to the cache. On a miss, the
            cache itself queries the database, stores the result, and hands
            it back.
          </p>
          <p>
            Think of it as the mirror image of write-through. One manages
            reads, the other manages writes, and many systems pair them
            together so the application never touches the database directly
            for either path.
          </p>
          <p>
            It keeps caching logic out of your app code, but you need a
            library or service that knows how to talk to the database.{" "}
            <span style={{ color: "#3a7a8a" }}>
              CDNs work exactly this way
            </span>{" "}
            - on a miss they pull from origin, store it, and serve it. For
            app-level caching with Redis, though, cache-aside is far more
            common in practice.
          </p>
        </div>
      </section>

      {/* Section 11: Cache Eviction Policies */}
      <section>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--heading-color)" }}
        >
          Cache Eviction Policies
        </h2>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Memory is finite. When the cache fills up, something has to go.
            Eviction policies are the rules that decide what gets dropped.
          </p>

          <div className="space-y-6 mt-2">
            <div>
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: "var(--primary-color)" }}
              >
                LRU (Least Recently Used)
              </h3>
              <p>
                Drops whichever entry hasn&apos;t been touched the longest. Under
                the hood it typically uses a{" "}
                <span style={{ color: "#2a5a8a" }}>
                  doubly-linked list plus a hash map
                </span>{" "}
                so removals and promotions happen in{" "}
                <span style={{ color: "#2a8a5a" }}>O(1)</span>. It&apos;s the
                default in Redis and most caching libraries because recent
                access is a surprisingly good predictor of future access.
              </p>
            </div>

            <div>
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: "var(--primary-color)" }}
              >
                LFU (Least Frequently Used)
              </h3>
              <p>
                Tracks how often each key is accessed and removes the one with
                the lowest count. Exact frequency tracking can be expensive, so
                many systems use an approximate version. LFU shines when
                popularity is stable over time, like a trending video that
                stays hot for hours.
              </p>
            </div>

            <div>
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: "var(--primary-color)" }}
              >
                FIFO (First In First Out)
              </h3>
              <p>
                A simple queue: the oldest entry gets evicted first, regardless
                of how often it&apos;s still being read. Easy to implement,
                but it can throw out hot data for no good reason. You rarely
                see FIFO in production caches for that reason.
              </p>
            </div>

            <div>
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: "var(--primary-color)" }}
              >
                TTL (Time To Live)
              </h3>
              <p>
                Strictly speaking, TTL isn&apos;t an eviction policy. It&apos;s a
                per-key{" "}
                <span style={{ color: "#2a8a5a" }}>expiration timer</span> that
                automatically removes stale entries. Most setups layer TTL on
                top of LRU or LFU to get both freshness and memory control.
                Essential for anything that must eventually refresh, like{" "}
                <span style={{ color: "#3a7a8a" }}>
                  API responses or session tokens
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 12: Common Caching Problems */}
      <section>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--heading-color)" }}
        >
          Common Caching Problems
        </h2>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Speed comes with strings attached. Each of these failure modes has
            taken down production systems, and knowing them helps you design
            around them before they bite.
          </p>
        </div>
      </section>

      {/* Section 13: Cache Stampede */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Cache Stampede (Thundering Herd)
        </h3>
        <DiagramBlock>
          <StampedeDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Picture a popular key expiring while hundreds of requests are
            in flight.{" "}
            <span style={{ color: "#6a3a8a" }}>
              Every single one misses the cache and hits the database
              simultaneously
            </span>
            . What should be one query becomes hundreds, and the sudden spike
            can bring the database to its knees.
          </p>
          <p>
            Say your homepage feed is cached with a 60-second TTL. At the
            moment it expires, every concurrent request falls through to the
            database at once. Under heavy traffic that burst alone can trigger
            cascading failures downstream.
          </p>
          <div
            className="rounded-lg p-4 text-xs"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p className="mb-2">
              <strong style={{ color: "var(--primary-color)" }}>
                How to handle it:
              </strong>
            </p>
            <div className="space-y-2">
              {[
                {
                  label: "Request coalescing (single flight)",
                  desc: "Allow only one request to rebuild the cache while others wait for the result.",
                },
                {
                  label: "Cache warming",
                  desc: "Refresh popular keys proactively before they expire. This only helps when using TTL-based expiration.",
                },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-2">
                  <span style={{ color: "var(--accent-color)", flexShrink: 0 }}>
                    →
                  </span>
                  <span>
                    <strong style={{ color: "var(--primary-color)" }}>
                      {label}:
                    </strong>{" "}
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 14: Cache Consistency */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Cache Consistency
        </h3>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            This is what happens when{" "}
            <span style={{ color: "#2a8a5a" }}>the cache</span> and{" "}
            <span style={{ color: "#6a3a8a" }}>the database</span> disagree.
            Since most apps write to the database first and the cache second,
            there&apos;s always a brief window where the cache still holds{" "}
            <span style={{ color: "#6a3a8a" }}>stale data</span>.
          </p>
          <p>
            A user changes their profile picture. The database gets the new
            image, but the cache is still serving the old one. Everyone else
            sees the outdated photo until the cached entry expires or gets
            explicitly invalidated.
          </p>
          <div
            className="rounded-lg p-4 text-xs"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p className="mb-2">
              <strong style={{ color: "var(--primary-color)" }}>
                How to handle it:
              </strong>
            </p>
            <div className="space-y-2">
              {[
                {
                  label: "Cache invalidation on writes",
                  desc: "Delete the cache entry after updating the database so it gets repopulated with fresh data.",
                },
                {
                  label: "Short TTLs for stale tolerance",
                  desc: "Let slightly stale data live temporarily if eventual consistency is acceptable.",
                },
                {
                  label: "Accept eventual consistency",
                  desc: "For feeds, metrics, and analytics, a short delay is usually fine.",
                },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-2">
                  <span style={{ color: "var(--accent-color)", flexShrink: 0 }}>
                    →
                  </span>
                  <span>
                    <strong style={{ color: "var(--primary-color)" }}>
                      {label}:
                    </strong>{" "}
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 15: Hot Keys */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Hot Keys
        </h3>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Sometimes one key gets{" "}
            <span style={{ color: "#2a8a5a" }}>
              orders of magnitude more traffic than everything else
            </span>
            . Your overall hit rate looks fine, but that single key is
            hammering one Redis shard so hard it becomes the bottleneck for
            the whole system.
          </p>
          <p>
            Think of a social platform where a celebrity goes viral. The cache
            key for their profile might see millions of reads per second, all
            routed to the same shard. Everything else in the cluster is
            healthy, but that one node is on fire.
          </p>
          <div
            className="rounded-lg p-4 text-xs"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p className="mb-2">
              <strong style={{ color: "var(--primary-color)" }}>
                How to handle it:
              </strong>
            </p>
            <div className="space-y-2">
              {[
                {
                  label: "Replicate hot keys",
                  desc: "Store the same value on multiple cache nodes and load balance reads across them.",
                },
                {
                  label: "Add a local fallback cache",
                  desc: "Keep extremely hot values in-process to avoid pounding Redis.",
                },
                {
                  label: "Apply rate limiting",
                  desc: "Slow down abusive traffic patterns on specific keys.",
                },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-2">
                  <span style={{ color: "var(--accent-color)", flexShrink: 0 }}>
                    →
                  </span>
                  <span>
                    <strong style={{ color: "var(--primary-color)" }}>
                      {label}:
                    </strong>{" "}
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* References */}
      <section>
        <div
          className="h-px w-full mb-8"
          style={{ backgroundColor: "var(--border-color)", opacity: 0.6 }}
        />
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          References
        </h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span style={{ color: "var(--accent-color)", flexShrink: 0 }}>→</span>
            <a
              href="https://www.hellointerview.com/learn/system-design/core-concepts/caching"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200"
              style={{ color: "var(--primary-color)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Hello Interview — Caching Core Concepts
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
