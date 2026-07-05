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
    company: "GrydPark",
    url: "https://parkwithgryd.com/",
    roles: [{ title: "Software Engineer", period: "July 2024 - Present" }],
    location: "Winnipeg, Canada",
    narrative:
      "Joined as one of the first engineers in-house to rebuild GrydPark's parking platform from the ground up. What's been roughly **2 years** has felt closer to **4** — consistently putting in long days to own the full stack end-to-end across **7 repositories** and **1000+ commits**. Led a migration from a fragmented microservices setup to a containerized monolith, scaling traffic **~4x** and cutting deployment time by **50%**. Sole owner of the API, web portal, mobile app, guest checkout, enforcement app, and cloud infrastructure.",
    skills: [
      {
        area: "Platform & Architecture",
        items: [
          "Built the core **NestJS** API — a full-featured parking management platform with **TypeScript** and **PostgreSQL**, supporting hourly and monthly bookings with overlap prevention.",
          "Developed the web portal in **React** with **Shadcn/Radix** components — booking calendar with multi-day support, zone-based spot grouping, and property management with **Google Maps** integration.",
          "Extracted a standalone guest checkout SPA with a complete flow: duration picker → user details → payment → confirmation, plus booking extension for returning guests.",
        ],
      },
      {
        area: "Mobile App — React Native",
        items: [
          "Owner of the **React Native** mobile app shipped to both **iOS** and **Android** — managed the full release lifecycle",
          "Rebuilt the entire authentication system from scratch — mobile sign-in, OTP verification, third-party auth (**Apple/Google**), profile creation, and edge case handling.",
          "Owned the full booking and checkout flow — review screen, hourly rate integration, extend/modify booking, dynamic reservation details, in-checkout editing, and **$0 booking** support.",
          "Implemented **Secure Park / Gated Access** end-to-end in mobile — access points list, gated modal flow, and gain access screen.",
          "Performance-optimized the Explore screen by reducing unnecessary re-renders and refactored core screens (**SpotDetails**, **Receipts**, **Confirmation**, **Vehicle**) for better architecture.",
          "Shipped cross-platform bug fixes — resolved **Android**-specific crashes, CSS issues, and **iOS** sign-in problems.",
        ],
      },
      {
        area: "Payments & Billing",
        items: [
          "Owned end-to-end payment infrastructure processing **$200K+/month** — **Stripe** integration with transaction tracking, refunds, receipt generation, and **Stripe Terminal** for in-person card payments.",
          "Built **QuickBooks Online** accounting integration for automated journal entries, bill management, and reconciliation.",
          "Handled GST/tax calculations per state with currency and timezone-aware payment recording.",
        ],
      },
      {
        area: "Auth & Security",
        items: [
          "Implemented **Firebase Auth** with multi-provider support (Google, Apple) and phone-based OTP guest checkout via **Twilio**.",
          "Built role-based access control spanning Gryd Admin, Company Admin, Property Manager, and Lot Attendant roles.",
          "Added **QR code generation** for bookings with anti-scam unique identifiers.",
        ],
      },
      {
        area: "IoT — Secure Park",
        items: [
          "Designed and built **Secure Park**, an access control system integrating **ButterflyMX** APIs for secure parking via mobile app and keypad entry.",
          "Built access point management — operators can open gates remotely and resend PINs to parkers.",
          "Implemented pincode generation and key code auth for automated entry.",
        ],
      },
      {
        area: "Infrastructure & DevOps",
        items: [
          "Architected **Terraform** IaC with **8 reusable modules** across dev/staging/prod environments.",
          "Provisioned **GKE Autopilot** clusters with advanced networking, managed Prometheus, and workload identity.",
          "Set up **Cloud SQL PostgreSQL** with automated backups, point-in-time recovery, and SSL enforcement.",
          "Built **Cloud CDN + GCS** infrastructure for static site hosting and **Artifact Registry** for Docker image management.",
          "Created **Cloud Build** CI/CD pipelines with intelligent plan detection and conditional applies.",
          "Migrated Kubernetes config from manual manifests to **Kustomize** overlays with environment-specific patches.",
        ],
      },
      {
        area: "Performance & Observability",
        items: [
          "Reduced query latency **~3x** through indexing, pagination, and query optimization — stabilizing production under load.",
          "Diagnosed and fixed **N+1 query** problems and replaced expensive joins between large tables with **CTEs** to extract only the needed boundary rows, avoiding full cross-table scans.",
          "Discovered the **nestjs-paginate** offset-based pagination was silently running a full unfiltered count query on every request — migrated to **cursor-based pagination** to eliminate the bottleneck.",
          "Added live booking **data polling** (15-second auto-refresh) in the enforcement app for real-time parker visibility.",
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
