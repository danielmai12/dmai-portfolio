"use client";

import { motion } from "framer-motion";

// Wrap text in **...** to bold inline — used for metrics, impact numbers, and key tech names
const experiences = [
  {
    company: "GrydPark",
    url: "https://parkwithgryd.com/",
    role: "Software Engineer",
    periods: ["July 2024 - Present"],
    location: "Winnipeg, Canada",
    intro: null,
    bullets: [
      "Led a full rebuild of the core B2B/B2C platform — scaled traffic **~4x** and reduced deployment time by **50%** migrating from a fragmented microservices setup to a containerized monolith using **NestJS**, **React Native**, **PostgreSQL**, and **GCP**.",
      "Owned end-to-end system design for booking, payments, and accounting — event-driven services processing **Stripe** webhooks integrated with **QuickBooks** for automated billing, handling **$200K+** in monthly volume.",
      "Built secure auth in **NestJS** with custom permission policies and **Firebase Auth** for phone-based guest checkout.",
      "Designed and built **Secure Park**, an IoT access control system integrating **ButterflyMX** APIs for secure parking via mobile app and keypad entry.",
      "Established cloud infrastructure using **Terraform**, **Docker**, and **Kubernetes** with CI/CD pipelines on **GCP**.",
      "Reduced query latency through indexing and optimization, improving application performance by **~3×** and stabilizing production under load.",
    ],
    tech: [
      "NestJS",
      "React",
      "React Native",
      "PostgreSQL",
      "GCP",
      "Stripe",
      "QuickBooks",
      "Firebase",
      "Terraform",
      "Docker",
      "Kubernetes",
    ],
  },
  {
    company: "Wawanesa Insurance",
    url: "https://www.wawanesa.com/",
    role: "Application Developer I",
    periods: ["Feb 2024 - June 2024"],
    location: "Winnipeg, Canada",
    intro: null,
    bullets: [
      "Built and maintained **Guidewire Cloud PolicyCenter** features using **Gosu**, **Java**, and **PostgreSQL** — with unit tests (**JUnit**) and delivery automation (**Jenkins**).",
      "Shipped policy renewal and endorsement features for personal property and seasonal insurance products, with focus on rate capping business logic.",
      "Diagnosed and corrected performance anti-patterns across the quoting pipeline, reducing quoting time by **~80%**.",
      "Improved developer tooling and release flow across teams.",
    ],
    tech: ["Gosu", "Java", "PostgreSQL", "Jenkins", "Guidewire Cloud", "JUnit"],
  },
  {
    company: "QDoc",
    url: "https://qdoc.ca/",
    role: "Software Developer (Full-Time Contract)",
    periods: ["Sept 2023 - Feb 2024"],
    location: "Winnipeg, Canada",
    intro:
      "Built and shipped features for a telehealth and healthcare billing platform.",
    bullets: [
      "Owned infrastructure for a billing application using **AWS CDK** with **React** and **Mantine UI** — implemented **Cognito**-based auth and RBAC, boosting team delivery capacity by **~15%** per sprint.",
      "Designed and provisioned the full **VPC** architecture — deployed a private **RDS** instance and established a secure **EC2** bastion host as the sole ingress point for database access.",
    ],
    tech: ["AWS CDK", "Lambda", "Cognito", "React", "Mantine", "PostgreSQL"],
  },
  {
    company: "QDoc",
    url: "https://qdoc.ca/",
    role: "Software Developer (Intern)",
    periods: ["May 2023 - Sept 2023"],
    location: "Winnipeg, Canada",
    intro:
      "Built and shipped features for a telehealth and healthcare billing platform.",
    bullets: [
      "Built a telehealth platform serving **~3,000 consultations/month**, replacing paper-based workflows with a **React**/AWS-serverless backend (**Lambda**, **DynamoDB**, **GraphQL**).",
      "Designed an admin metrics and reporting system aggregating data across **1M+** annual patient encounters and billing records.",
      "Implemented event-driven automation using **AWS Lambda** and **Twilio SMS** to improve appointment attendance.",
      "Built a physician-to-physician referral and appointment booking service — streamlined the consultation workflow end-to-end, contributing to a **5%** growth in active users.",
    ],
    tech: [
      "Lambda",
      "DynamoDB",
      "GraphQL",
      "Cognito",
      "React",
      "Material UI",
      "Twilio",
    ],
  },
  {
    company: "Wawanesa Insurance Company",
    url: "https://www.wawanesa.com/",
    role: "Application Developer I - Coop",
    periods: ["May 2022 - May 2023"],
    intro: "Worked on Guidewire Insurance cloud project",
    bullets: [
      "Developed **Guidewire Cloud PolicyCenter** features using **Gosu** and **Java** for application logic, **PostgreSQL** for database, and **GUnit** (**JUnit**-based) for unit testing and automation.",
      "Updated features across backend, frontend, and ratebook for **Homeowner** risk types across jurisdictions, and reworked **Seasonal** risk features end-to-end for broker usage.",
      "Made numerous enhancements and bug fixes to meet product requirements.",
      "Onboarded and mentored new developers on application setup, coding standards, and **Git** workflows.",
    ],
    tech: ["Gosu", "Java", "PostgreSQL", "Jenkins", "Guidewire Cloud", "JUnit"],
  },
  {
    company: "University of Manitoba",
    url: "https://umanitoba.ca/",
    role: "Research Assistant",
    periods: ["May 2021 - Sept 2021"],
    location: "Winnipeg, Canada",
    intro: "Worked on machine learning and data analytics.",
    bullets: [
      "Won **1st place** in the **Nexus Data Science Challenge**.",
      "Built freight balancing models using **LSTM** and greedy algorithms.",
      "Developed deep learning models for COVID-19 hospitalization prediction using **autoencoder** and **few-shot learning** techniques.",
      "Analyzed large-scale COVID-19 datasets with **Python**, **TensorFlow**, **Pandas**, and **NumPy**.",
    ],
    tech: ["Python", "TensorFlow", "Pandas", "NumPy", "Matplotlib"],
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
              className="relative mb-10"
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

              {/* Role @ Company */}
              <h3
                className="text-base font-medium mb-1"
                style={{ letterSpacing: "-0.01em" }}
              >
                <span style={{ color: "var(--text-color)" }}>{exp.role}</span>
                <span style={{ color: "var(--muted-text)" }}> @ </span>
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

              {/* Dates + location */}
              <div className="flex flex-wrap items-center gap-x-3 mb-3">
                {exp.periods.map((p, j) => (
                  <span
                    key={j}
                    className="text-xs"
                    style={{
                      color: "var(--muted-text)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {p}
                  </span>
                ))}
                {exp.location && (
                  <span
                    className="text-xs"
                    style={{ color: "var(--muted-text)" }}
                  >
                    · {exp.location}
                  </span>
                )}
              </div>

              {/* Intro */}
              {exp.intro && (
                <p
                  className="text-sm font-light mb-2"
                  style={{ color: "var(--text-color)" }}
                >
                  {exp.intro}
                </p>
              )}

              {/* Bullets */}
              <ul className="mb-3 list-none p-0">
                {exp.bullets.map((b, j) => (
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

              {/* Tech */}
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                {exp.tech.map((t, j) => (
                  <span key={j} className="flex items-center gap-x-1.5">
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--muted-text)" }}
                    >
                      {t}
                    </span>
                    {j < exp.tech.length - 1 && (
                      <span
                        className="text-xs"
                        style={{ color: "var(--muted-text)", opacity: 0.4 }}
                      >
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkPage;
