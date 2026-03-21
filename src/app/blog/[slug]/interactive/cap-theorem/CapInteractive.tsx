"use client";

import {
  CapTriangleDiagram,
  CpVsApDiagram,
  RaftElectionDiagram,
  RaftReplicationDiagram,
  PacelcDiagram,
} from "./CapDiagrams";

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

export default function CapInteractive() {
  return (
    <div className="space-y-16">
      {/* Intro */}
      <section>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            In any distributed system,{" "}
            <span style={{ color: "#6a3a8a" }}>
              partition tolerance is a must
            </span>
            . Network failures will happen, and your system needs to handle
            them. This means that in practice, CAP theorem really boils down to
            a single choice:{" "}
            <span style={{ color: "#2a8a5a" }}>
              do you prioritize consistency or availability when a network
              partition occurs?
            </span>
          </p>
          <p>
            Once you understand that tradeoff, the next question is: how do
            nodes actually agree on anything? That&apos;s where{" "}
            <span style={{ color: "#2a8a5a" }}>consensus algorithms</span> come
            in. Raft is the most approachable one, and it&apos;s the engine
            behind systems like etcd, Consul, and CockroachDB.
          </p>
        </div>
      </section>

      {/* CAP Theorem */}
      <h2
        className="text-2xl font-bold mb-2"
        style={{ color: "var(--heading-color)" }}
      >
        The CAP Theorem
      </h2>

      {/* What is CAP */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Three Guarantees, Pick Two
        </h3>
        <DiagramBlock>
          <CapTriangleDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Eric Brewer proposed in 2000 that a distributed data store can only
            provide two of three guarantees at the same time:
          </p>
          <div className="space-y-3 mt-2">
            {[
              {
                letter: "C",
                name: "Consistency",
                color: "#2a8a5a",
                desc: "Every read returns the most recent write, or an error. All nodes see the same data at the same time.",
              },
              {
                letter: "A",
                name: "Availability",
                color: "#2a5a8a",
                desc: "Every request gets a non-error response, even if some nodes are down. The system always answers.",
              },
              {
                letter: "P",
                name: "Partition Tolerance",
                color: "#6a3a8a",
                desc: "The system keeps operating even when network messages between nodes are lost or delayed.",
              },
            ].map(({ letter, name, color, desc }) => (
              <div key={letter} className="flex items-start gap-3">
                <span
                  style={{
                    color,
                    fontWeight: 700,
                    fontSize: 18,
                    flexShrink: 0,
                    width: 20,
                  }}
                >
                  {letter}
                </span>
                <span>
                  <strong style={{ color }}>{name}</strong> - {desc}
                </span>
              </div>
            ))}
          </div>
          <p>
            The &ldquo;pick two&rdquo; framing is a bit misleading.{" "}
            <span style={{ color: "#6a3a8a" }}>
              In any distributed system, network partitions will happen
            </span>
            . Switches fail. Cables get cut. Cloud availability zones lose
            connectivity. You don&apos;t get to opt out of P.
          </p>
          <p>
            So the real choice is:{" "}
            <span style={{ color: "#2a8a5a" }}>
              when a partition occurs, do you sacrifice consistency or
              availability?
            </span>
          </p>
          <div
            className="rounded-lg p-4 text-sm"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="space-y-2">
              {[
                {
                  label: "CP systems",
                  desc: "Reject requests they can't confirm are consistent. You might get an error, but you'll never get stale data.",
                  color: "#2a8a5a",
                  examples: "HBase, ZooKeeper, etcd, MongoDB (strong reads)",
                },
                {
                  label: "AP systems",
                  desc: "Always respond, even if the data might be outdated. You get an answer, but it might not be the latest one.",
                  color: "#2a5a8a",
                  examples: "Cassandra, DynamoDB, CouchDB, DNS",
                },
              ].map(({ label, desc, color, examples }) => (
                <div key={label} className="flex items-start gap-2">
                  <span
                    style={{ color: "var(--accent-color)", flexShrink: 0 }}
                  >
                    →
                  </span>
                  <span>
                    <strong style={{ color }}>{label}:</strong> {desc}
                    <br />
                    <span
                      style={{ color: "var(--muted-text)", fontSize: "12px" }}
                    >
                      Examples: {examples}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CP vs AP in action */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          CP vs AP in Action
        </h3>
        <DiagramBlock>
          <CpVsApDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            During a partition, a{" "}
            <span style={{ color: "#2a8a5a" }}>CP system</span> would rather
            return an error than risk serving outdated data. A banking system
            does this: if the node handling your request can&apos;t verify your
            balance with the primary, it refuses the transaction.
          </p>
          <p>
            An <span style={{ color: "#2a5a8a" }}>AP system</span> takes the
            opposite approach. A social media feed keeps loading even if some
            backend nodes are unreachable. You might see a post from 30 seconds
            ago instead of the absolute latest, but the app stays responsive.
          </p>
          <p>
            Neither is universally better.{" "}
            <span style={{ color: "#2a8a5a" }}>
              The right choice depends on what your users can tolerate
            </span>
            : stale data or downtime.
          </p>
        </div>
      </section>

      {/* PACELC */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Beyond CAP: PACELC
        </h3>
        <DiagramBlock>
          <PacelcDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            CAP only describes behavior during a partition. But partitions are
            rare. Most of the time your system is running fine.{" "}
            <span style={{ color: "#6a3a8a" }}>
              PACELC extends CAP to cover normal operation too
            </span>
            .
          </p>
          <p>
            The idea: if there&apos;s a{" "}
            <strong style={{ color: "#e74c3c" }}>Partition</strong>, choose
            between <strong style={{ color: "#2a5a8a" }}>Availability</strong>{" "}
            and <strong style={{ color: "#2a8a5a" }}>Consistency</strong>.{" "}
            <strong style={{ color: "#2ecc71" }}>Else</strong> (normal
            operation), choose between{" "}
            <strong style={{ color: "#6a3a8a" }}>Latency</strong> and{" "}
            <strong style={{ color: "#2a8a5a" }}>Consistency</strong>.
          </p>
          <div
            className="rounded-lg p-4 text-sm"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="space-y-2">
              {[
                {
                  label: "DynamoDB (PA/EL)",
                  desc: "During partition: favor availability. Normal: favor low latency. Eventual consistency by default.",
                },
                {
                  label: "MongoDB (PC/EC)",
                  desc: "During partition: favor consistency. Normal: also favor consistency. Reads go to the primary by default.",
                },
                {
                  label: "Cassandra (PA/EL)",
                  desc: "During partition: stay available. Normal: prioritize fast reads. Tunable consistency per query.",
                },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-2">
                  <span
                    style={{ color: "var(--accent-color)", flexShrink: 0 }}
                  >
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
          <p>
            PACELC is more useful in practice because it captures the tradeoff
            you make every day, not just during rare failure scenarios.
          </p>
        </div>
      </section>

      {/* Real-world examples */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Real-World Tradeoffs
        </h3>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            The consistency vs availability decision isn&apos;t abstract. It
            shows up in real product decisions every day.
          </p>
          <div className="space-y-4 mt-2">
            {[
              {
                name: "Parking System",
                choice: "Consistency",
                color: "#2a8a5a",
                why: "If two drivers see the same spot as available and both try to park, you have a conflict. The system needs to reject one of them. Showing an error is better than double-booking a spot.",
              },
              {
                name: "Banking / Payments",
                choice: "Consistency",
                color: "#2a8a5a",
                why: "You can't show a balance of $500 when the real balance is $0. An ATM that's temporarily unavailable is better than one that dispenses money it shouldn't.",
              },
              {
                name: "Social Media Feed",
                choice: "Availability",
                color: "#2a5a8a",
                why: "If your Instagram feed is 30 seconds behind, you won't notice. But if the app refuses to load because one server is unreachable, you'll switch to another app.",
              },
              {
                name: "E-commerce Product Page",
                choice: "Availability",
                color: "#2a5a8a",
                why: "Showing a product page with a slightly outdated price is better than showing an error. The inventory check at checkout is where you enforce consistency.",
              },
              {
                name: "Collaborative Document Editing",
                choice: "Availability",
                color: "#2a5a8a",
                why: "Google Docs lets everyone keep typing even during network hiccups. Edits merge later. Blocking all users until every keystroke is confirmed would make the product unusable.",
              },
            ].map(({ name, choice, color, why }) => (
              <div
                key={name}
                className="rounded-lg p-4"
                style={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <strong style={{ color: "var(--heading-color)" }}>
                    {name}
                  </strong>
                  <span
                    style={{
                      fontSize: 11,
                      color,
                      fontWeight: 600,
                      padding: "1px 8px",
                      borderRadius: 4,
                      border: `1px solid ${color}`,
                      opacity: 0.9,
                    }}
                  >
                    {choice}
                  </span>
                </div>
                <p
                  className="text-sm"
                  style={{ color: "var(--muted-text)", margin: 0 }}
                >
                  {why}
                </p>
              </div>
            ))}
          </div>
          <p>
            The pattern:{" "}
            <span style={{ color: "#2a8a5a" }}>
              choose consistency when wrong data causes real-world harm
            </span>
            .{" "}
            <span style={{ color: "#2a5a8a" }}>
              Choose availability when a slightly stale experience is better
              than no experience at all
            </span>
            .
          </p>
        </div>
      </section>

      {/* Distributed Consensus */}
      <h2
        className="text-2xl font-bold mb-2"
        style={{ color: "var(--heading-color)" }}
      >
        Distributed Consensus
      </h2>

      {/* Why consensus matters */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          The Problem
        </h3>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            If you have three database replicas and a client writes a value, how
            do all three nodes agree on what that value is? What if one node is
            slow? What if the leader crashes mid-write?
          </p>
          <p>
            <span style={{ color: "#2a8a5a" }}>
              Consensus is the process of getting multiple nodes to agree on a
              single value
            </span>
            , even when some nodes fail or messages get lost. Without it,
            replicas drift apart and your system returns contradictory answers.
          </p>
          <p>
            This is the foundation of every CP system. Leader election, log
            replication, distributed locks, configuration management - they all
            depend on consensus under the hood.
          </p>
        </div>
      </section>

      {/* Raft: Leader Election */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Raft: Leader Election
        </h3>
        <DiagramBlock>
          <RaftElectionDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Raft was designed in 2014 specifically to be understandable. It
            breaks consensus into three sub-problems:{" "}
            <span style={{ color: "#2a8a5a" }}>leader election</span>,{" "}
            <span style={{ color: "#2a5a8a" }}>log replication</span>, and{" "}
            <span style={{ color: "#6a3a8a" }}>safety</span>.
          </p>
          <p>
            Every Raft cluster has exactly one leader at any time. All writes go
            through the leader. If the leader goes down, the remaining nodes
            detect the failure (via heartbeat timeouts) and elect a new one.
          </p>
          <div
            className="rounded-lg p-4 text-sm"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p className="mb-2">
              <strong style={{ color: "var(--primary-color)" }}>
                Election process:
              </strong>
            </p>
            <div className="space-y-1">
              {[
                "A follower notices it hasn't heard from the leader (heartbeat timeout).",
                "It becomes a candidate and increments its term number.",
                "It votes for itself and sends vote requests to all other nodes.",
                "If it gets votes from a majority, it becomes the new leader.",
                "The new leader starts sending heartbeats to maintain authority.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    style={{ color: "var(--accent-color)", flexShrink: 0 }}
                  >
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
          <p>
            The{" "}
            <span style={{ color: "#2a8a5a" }}>term number</span> is
            critical. It acts as a logical clock. If a node receives a message
            with a higher term, it knows its information is outdated and steps
            down. This prevents stale leaders from causing split-brain
            scenarios.
          </p>
        </div>
      </section>

      {/* Raft: Log Replication */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Raft: Log Replication
        </h3>
        <DiagramBlock>
          <RaftReplicationDiagram />
        </DiagramBlock>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            Once a leader is elected, it&apos;s responsible for accepting
            writes and replicating them to followers. Every write becomes an
            entry in an ordered log.
          </p>
          <p>
            The leader appends the entry to its own log, sends it to all
            followers, and waits for a{" "}
            <span style={{ color: "#2a8a5a" }}>majority to acknowledge</span>.
            Once a majority confirms, the entry is{" "}
            <span style={{ color: "#2a8a5a" }}>committed</span> and the leader
            responds to the client. Even if a minority of nodes are down or
            slow, the system keeps making progress.
          </p>
          <p>
            This is what makes Raft a CP protocol.{" "}
            <span style={{ color: "#6a3a8a" }}>
              A write is only considered successful when a majority of nodes
              have it
            </span>
            . If the leader crashes after committing, the new leader is
            guaranteed to have all committed entries because it needed a
            majority vote - and at least one of those voters has the latest
            data.
          </p>
        </div>
      </section>

      {/* Paxos and others */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Other Consensus Algorithms
        </h3>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            <strong style={{ color: "var(--primary-color)" }}>Paxos</strong>{" "}
            came first (1989, published 1998). It solves the same fundamental
            problem as Raft but is notoriously hard to understand and even
            harder to implement correctly. Most engineers who work with Paxos
            rely on battle-tested libraries rather than writing it from scratch.
          </p>
          <p>
            <strong style={{ color: "var(--primary-color)" }}>
              Multi-Paxos and Viewstamped Replication
            </strong>{" "}
            extend basic Paxos for continuous operation (not just single-value
            consensus). Raft is essentially a more structured and teachable
            version of Multi-Paxos.
          </p>
          <p>
            <strong style={{ color: "var(--primary-color)" }}>PBFT</strong>{" "}
            (Practical Byzantine Fault Tolerance) handles a different threat
            model: nodes that actively lie or behave maliciously. This is
            relevant for blockchain systems but overkill for trusted
            datacenter environments.
          </p>
        </div>
      </section>

      {/* Where you see this */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--heading-color)" }}
        >
          Where This Shows Up
        </h3>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            You don&apos;t usually implement consensus yourself, but
            understanding it helps you reason about the systems you depend on:
          </p>
          <div className="space-y-2">
            {[
              {
                label: "etcd / Consul",
                desc: "Use Raft for distributed key-value storage. Kubernetes stores all cluster state in etcd.",
              },
              {
                label: "ZooKeeper",
                desc: "Uses ZAB (similar to Raft). Coordinates distributed systems - leader election, config management, distributed locks.",
              },
              {
                label: "CockroachDB / TiKV",
                desc: "Use Raft per data range to replicate and agree on writes across nodes.",
              },
              {
                label: "Kafka (KRaft)",
                desc: "Replaced ZooKeeper with a built-in Raft-based controller for metadata consensus.",
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
          <p>
            The pattern is the same everywhere:{" "}
            <span style={{ color: "#2a8a5a" }}>
              a small cluster of nodes (usually 3 or 5) runs consensus to agree
              on state, and the rest of the system trusts that source of truth
            </span>
            . Understanding Raft gives you a mental model for how all of these
            work.
          </p>
        </div>
      </section>
    </div>
  );
}
