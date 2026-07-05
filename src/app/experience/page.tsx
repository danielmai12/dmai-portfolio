"use client";

import { motion } from "framer-motion";

// Wrap text in **...** to bold inline — used for metrics, impact numbers, and key tech names

type SkillGroup = {
  area: string;
  items: string[];
};

type Experience = {
  company: string;
  url?: string;
  roles: { title: string; period: string }[];
  location?: string;
  narrative: string;
  skills?: SkillGroup[];
  bullets?: string[];
};

const experiences: Experience[] = [
  {
    company: "PolicyMe",
    url: "https://www.policyme.com/",
    roles: [{ title: "Software Engineer", period: "July 2026 - Present" }],
    location: "Toronto, Canada",
    narrative:
      "Joining PolicyMe to work across their AI-powered insurance platform — full-stack on **Python**, **React/Redux**, **PostgreSQL**, and **AWS**, with a focus on integrating AI/ML (document processing, data extraction, recommendation engines) into production alongside their senior AI engineers. Carrying the same **plan → execute → validate** discipline into a stack built around **LangChain/LangGraph** and **n8n** — scoping features and data pipelines up front, shipping incrementally, and building in the observability to prove correctness in production rather than assume it.",
    bullets: [
      "Full-stack feature development across **Python**, **React/Redux**, **PostgreSQL**, and **AWS** for an AI-powered web application.",
      "Integrating AI models and third-party APIs for document processing, data extraction, and recommendation engines, working closely with senior engineers to get them production-ready.",
      "Building scalable, secure, and observable cloud architecture and data pipelines feeding AI model training and inference.",
      "Contributing to architecture planning, code review, and release planning, with end-to-end feature ownership once ramped up.",
      "Participating in company-wide engineering initiatives — quarterly planning, hackathons, engineering guilds, and AI tooling experiments.",
    ],
  },
  {
    company: "GrydPark",
    url: "https://parkwithgryd.com/",
    roles: [{ title: "Software Engineer", period: "July 2024 - July 2026" }],
    location: "Winnipeg, Canada",
    narrative:
      "Joined as one of the first in-house engineers to rebuild GrydPark's parking platform from the ground up. What's been roughly **2 years** has felt closer to **4** — end-to-end reach across **7 repositories** and **2,000+ commits**, as the **#1 contributor** to the core API and the mobile app and primary owner of the cloud infrastructure, plus top-tier contributions to the web portal, guest checkout, and enforcement app. Drove every non-trivial change through a **plan → execute → validate** loop rather than shipping on instinct — scope the design, ship it in small gated increments, then prove it with automated checks before it ever touches production.",
    skills: [
      {
        area: "Engineering Practice — Plan → Execute → Validate",
        items: [
          "**Plan:** Scoped a written design before touching code on every major surface change — e.g. the Booking Flow V2 spot-hold model and the Terraform module boundaries for GCP infra — to catch race conditions and blast radius up front.",
          "**Execute:** Shipped in small, reviewable increments — migrations, feature-gated rollouts, workspace-scoped Terraform applies — across all **7 repositories**, from database schema to mobile screens.",
          "**Validate:** Closed the loop with automated proof instead of assumptions — **Stryker** mutation testing on payment-critical paths, CI gated so Terraform only applies on a real `plan` diff, and a QuickBooks reconciliation pass that re-checks posted journals against Stripe's source of truth.",
        ],
      },
      {
        area: "Backend Platform — Payments & Accounting",
        items: [
          "Own the money-movement core: built the **QuickBooks Online** double-entry integration, with a reconcile pass that re-reads posted journals against the matching **Stripe** payment intent to catch fee/amount drift before it corrupts the ledger.",
          "Created and own the **Stripe** webhook service — the busiest file in the payment module — handling payment intents, refunds, processing fees, payouts, and **Voucherify** vouchers.",
          "Led the **Booking Flow V2** rearchitecture: a two-phase hold → confirm model backed by a **pg_cron** job that self-cleans stale holds, eliminating double-booking races.",
          "Sole architect of **SecurePark**, GrydPark's physical-access product — an OAuth integration with **ButterflyMX** that turns a reservation into automatic gate/door access.",
          "Built the mobile **BFF** layer and the pay-station/kiosk booking channel, giving app and terminal traffic purpose-built, accounting-safe endpoints instead of reused dashboard APIs.",
        ],
      },
      {
        area: "Mobile App — React Native",
        items: [
          "Sole architect of the app's typed **Axios** HTTP client — a single interceptor layer that dedupes concurrent 401/403 failures so one expired token can't trigger duplicate logout/navigation resets.",
          "Led the mobile **Booking Flow V2** — hold → confirm with in-flight edit and extend, built on a suite of **TanStack Query** hooks against the v2 reservation API.",
          "Sole architect of the booking-lifecycle notification system — starts-soon / ends-soon / ended local notifications that deep-link straight into Extend, Open Gate, or View Receipt.",
          "Led passwordless auth (phone **OTP** + **Apple**/**Google** sign-in) and in-app **Secure Park** gate/PIN access.",
          "Migrated state management toward **Zustand** + **TanStack Query** off legacy Redux, and cut re-renders on the app's hottest screen.",
        ],
      },
      {
        area: "Cloud Infrastructure — Terraform / GCP",
        items: [
          "Primary author of GrydPark's GCP infrastructure-as-code — modular **Terraform** (GKE, Cloud SQL, static-site, VPC peering, IAM) across dev/stage/prod workspaces with a gated CI pipeline that only applies on a real plan diff.",
          "Led the **GKE Autopilot** cluster module — Dataplane V2 (Cilium/eBPF), Kubernetes Gateway API, Workload Identity, Managed Prometheus, and autoscaling (VPA/HPA).",
          "Led a static-site migration moving the portal and enforcement app off always-on **GKE** pods onto **GCS + Cloud CDN** with managed TLS — cutting both hosting cost and cluster load.",
          "Hardened **Cloud SQL** (PostgreSQL): private VPC peering, pgAudit, point-in-time recovery, and Secret-Manager-sourced credentials.",
          "Cut Cloud Monitoring/Logging spend by removing redundant metrics once Managed Prometheus covered the same signals.",
        ],
      },
      {
        area: "Web Portal & Guest Checkout",
        items: [
          "Built end-to-end operator booking-lifecycle tooling — modify/override/refund/cancel in one panel — plus the SecurePark access-point control UI for BMX gate hardware.",
          "Founded the standalone **Express Checkout** SPA — scaffolded the entire app (~100 files) from scratch as a lean, dependency-free guest-checkout flow with its own CI/CD.",
          "Added 15-second live-occupancy polling to the enforcement app, giving officers near-real-time booking state instead of stale snapshots.",
        ],
      },
      {
        area: "Performance & Reliability",
        items: [
          "Reduced query latency **~3x** through indexing, pagination, and query optimization — stabilizing production under load.",
          "Diagnosed **N+1** query problems and replaced expensive joins with **CTEs** to pull only the needed boundary rows instead of scanning full tables.",
          "Found that **nestjs-paginate**'s offset pagination was silently running a full unfiltered count on every request — migrated to **cursor-based pagination** to remove the bottleneck.",
          "Ran timezone-safe money handling (**Luxon**) across bookings, receipts, and monthly queries so date-sensitive charges compute correctly across jurisdictions.",
        ],
      },
    ],
  },
  {
    company: "Wawanesa Insurance",
    url: "https://www.wawanesa.com/",
    roles: [
      { title: "Application Developer I", period: "Feb 2024 - June 2024" },
      {
        title: "Application Developer I — Co-op",
        period: "May 2022 - May 2023",
      },
    ],
    location: "Winnipeg, Canada",
    narrative:
      "Returned to Wawanesa after my co-op to take on a full-time role on the same **Guidewire Cloud PolicyCenter** team. Across both stints, I shipped insurance product features, mentored developers, and drove performance improvements.",
    bullets: [
      "Built and maintained **PolicyCenter** features using **Gosu**, **Java**, and **PostgreSQL** — with **JUnit**-based unit tests and **Jenkins** delivery automation.",
      "Shipped policy renewal and endorsement features for personal property and seasonal insurance products, with focus on rate capping business logic.",
      "Reworked **Seasonal** risk features end-to-end for broker usage and updated **Homeowner** risk types across jurisdictions.",
      "Diagnosed and corrected performance anti-patterns across the quoting pipeline, reducing quoting time by **~80%**.",
      "Onboarded and mentored new developers on application setup, coding standards, and **Git** workflows.",
      "Improved developer tooling and release flow across teams.",
    ],
  },
  {
    company: "QDoc",
    url: "https://qdoc.ca/",
    roles: [
      {
        title: "Software Developer — Full-Time Contract",
        period: "Sept 2023 - Feb 2024",
      },
      { title: "Software Developer — Intern", period: "May 2023 - Sept 2023" },
    ],
    location: "Winnipeg, Canada",
    narrative:
      "Started as an intern building core telehealth features, then was brought back on contract to own infrastructure and ship a billing platform. Went from building UI to designing VPC architecture in under a year.",
    bullets: [
      "Built a telehealth platform serving **~3,000 consultations/month**, replacing paper-based workflows with **React** and an AWS-serverless backend (**Lambda**, **DynamoDB**, **GraphQL**).",
      "Designed an admin metrics and reporting system aggregating data across **1M+** annual patient encounters and billing records.",
      "Implemented event-driven automation using **AWS Lambda** and **Twilio SMS** to improve appointment attendance.",
      "Built a physician-to-physician referral and appointment booking service, contributing to **5%** growth in active users.",
      "Owned infrastructure for the billing app using **AWS CDK** — implemented **Cognito**-based auth and RBAC, boosting team delivery capacity by **~15%** per sprint.",
      "Designed and provisioned the full **VPC** architecture — private **RDS** instance with a secure **EC2** bastion host as the sole ingress point.",
    ],
  },
  {
    company: "University of Manitoba",
    url: "https://umanitoba.ca/",
    roles: [{ title: "Research Assistant", period: "May 2021 - Sept 2021" }],
    location: "Winnipeg, Canada",
    narrative:
      "My first technical role — applied machine learning to real-world logistics and healthcare problems, and competed in my first data science challenge.",
    bullets: [
      "Won **1st place** in the **Nexus Data Science Challenge**.",
      "Built freight balancing models using **LSTM** and greedy algorithms.",
      "Developed deep learning models for COVID-19 hospitalization prediction using **autoencoder** and **few-shot learning** techniques.",
      "Analyzed large-scale COVID-19 datasets with **Python**, **TensorFlow**, **Pandas**, and **NumPy**.",
    ],
  },
];

function renderBullet(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong
        key={i}
        style={{ fontWeight: 600, color: "var(--primary-color)" }}
      >
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mb-3 list-none p-0">
      {items.map((b, j) => (
        <li
          key={j}
          className="relative text-sm mb-1 pl-4 leading-relaxed font-light"
          style={{ color: "var(--text-color)" }}
        >
          <span
            className="absolute left-0 rounded-full inline-block"
            style={{
              top: "0.65em",
              width: "3px",
              height: "3px",
              backgroundColor: "var(--muted-text)",
              opacity: 0.4,
            }}
          />
          {renderBullet(b)}
        </li>
      ))}
    </ul>
  );
}

const WorkPage = () => {
  return (
    <section className="py-16 min-h-screen">
      <div className="container mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-14"
        >
          <h2
            className="text-2xl font-medium flex-shrink-0"
            style={{ color: "var(--primary-color)", letterSpacing: "-0.02em" }}
          >
            Experience
          </h2>
          <div
            className="flex-1 h-px opacity-60"
            style={{ backgroundColor: "var(--border-color)" }}
          />
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-[850px]" style={{ paddingLeft: "3rem" }}>
          {/* Vertical gradient line */}
          <div
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: "15px",
              background: `linear-gradient(to bottom, transparent 0%, var(--border-color) 8%, var(--border-color) 92%, transparent 100%)`,
              opacity: 0.5,
            }}
          />

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              className="relative mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* Dot */}
              <div
                className="absolute rounded-full"
                style={{
                  left: "-22px",
                  top: "0.45rem",
                  width: "7px",
                  height: "7px",
                  backgroundColor: "var(--primary-color)",
                  opacity: 0.7,
                }}
              />

              {/* Company name */}
              <h3
                className="text-lg font-medium mb-1"
                style={{ letterSpacing: "-0.01em" }}
              >
                {exp.url ? (
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: "var(--primary-color)" }}
                  >
                    {exp.company}
                  </a>
                ) : (
                  <span style={{ color: "var(--primary-color)" }}>
                    {exp.company}
                  </span>
                )}
              </h3>

              {/* Roles with dates */}
              <div className="mb-3">
                {exp.roles.map((role, j) => (
                  <div
                    key={j}
                    className="flex flex-wrap items-center gap-x-3"
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-color)" }}
                    >
                      {role.title}
                    </span>
                    <span
                      className="text-xs"
                      style={{
                        color: "var(--muted-text)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {role.period}
                    </span>
                  </div>
                ))}
                {exp.location && (
                  <span
                    className="text-xs"
                    style={{ color: "var(--muted-text)" }}
                  >
                    {exp.location}
                  </span>
                )}
              </div>

              {/* Narrative */}
              <p
                className="text-sm font-light mb-4 leading-relaxed"
                style={{ color: "var(--text-color)" }}
              >
                {renderBullet(exp.narrative)}
              </p>

              {/* Skill groups (GrydPark style) */}
              {exp.skills && (
                <div className="flex flex-col gap-4">
                  {exp.skills.map((group, j) => (
                    <div key={j}>
                      <h4
                        className="text-xs font-semibold uppercase tracking-wider mb-2"
                        style={{ color: "var(--muted-text)" }}
                      >
                        {group.area}
                      </h4>
                      <BulletList items={group.items} />
                    </div>
                  ))}
                </div>
              )}

              {/* Flat bullets (other experiences) */}
              {exp.bullets && <BulletList items={exp.bullets} />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkPage;
