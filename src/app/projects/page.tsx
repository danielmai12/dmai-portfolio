"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const topics = ["All", "ML & AI", "Web", "DevOps"] as const;
type Topic = (typeof topics)[number];

const projects = [
  {
    name: "CGC Grain Outcome Predictions",
    period: "May 2023 - Aug 2023",
    description:
      "ML models predicting Ergot severity using weather data pipelines and dockerized PostgreSQL storage.",
    tech: ["Python", "Docker", "PostgreSQL", "TensorFlow"],
    topic: "ML & AI" as Topic,
    github: "https://github.com/ChromaticPanic/CGC_Grain_Outcome_Predictions",
  },
  {
    name: "UManitoba Navigator",
    period: "Feb 2024",
    description:
      "Hackathon project: campus navigation app with Python FastAPI backend and React frontend.",
    tech: ["Python", "FastAPI", "React", "HTML/CSS"],
    topic: "Web" as Topic,
    github: "https://github.com/danielmai12/VN_Dragons-Repository",
  },
  {
    name: "Easy Scheduler",
    period: "2024",
    description:
      "Personal project for scheduling messages and reminders, built with React and AWS serverless backend using Lambda, EventBridge, and DynamoDB via AWS Amplify Gen 2.",
    tech: ["React", "AWS Lambda", "DynamoDB", "EventBridge", "Amplify"],
    topic: "Web" as Topic,
    github: "https://github.com/danielmai12/EasyScheduler",
  },
  {
    name: "Portfolio Website",
    period: "Mar 2026",
    description:
      "Personal portfolio site built with Next.js, TypeScript, and Tailwind CSS, featuring smooth animations with Framer Motion and a clean, responsive design.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    topic: "Web" as Topic,
    github: "https://github.com/danielmai12/dmai-portfolio",
  },
];

const ProjectsPage = () => {
  const [activeTopic, setActiveTopic] = useState<Topic>("All");

  const filtered =
    activeTopic === "All"
      ? projects
      : projects.filter((p) => p.topic === activeTopic);

  return (
    <section className="py-16 h-screen flex flex-col">
      <div className="container mx-auto flex flex-col flex-1 min-h-0">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <h2
            className="text-2xl font-medium flex-shrink-0"
            style={{ color: "var(--primary-color)", letterSpacing: "-0.02em" }}
          >
            Projects
          </h2>
          <div
            className="flex-1 h-px opacity-60"
            style={{ backgroundColor: "var(--border-color)" }}
          />
        </motion.div>

        {/* Topic filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-2 mb-10 flex-wrap"
        >
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200"
              style={{
                border: "1px solid var(--border-color)",
                backgroundColor:
                  activeTopic === topic
                    ? "var(--primary-color)"
                    : "transparent",
                color:
                  activeTopic === topic
                    ? "var(--bg-color, #fff)"
                    : "var(--muted-text)",
              }}
            >
              {topic}
            </button>
          ))}
        </motion.div>

        {/* Cards grid */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((project, i) => (
            <motion.a
              key={i}
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }}
              className="group block rounded-lg p-5 cursor-pointer"
              style={{
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--card-bg, transparent)",
                transition: "border-color 0.2s, background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--primary-color)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border-color)";
              }}
            >
              {/* Title */}
              <h3
                className="text-sm font-medium mb-1 leading-snug"
                style={{
                  color: "var(--heading-color)",
                  letterSpacing: "-0.01em",
                }}
              >
                {project.name}
              </h3>

              {/* Period */}
              <p
                className="text-xs mb-3"
                style={{ color: "var(--muted-text)", letterSpacing: "0.02em" }}
              >
                {project.period}
              </p>

              {/* Description */}
              <p
                className="text-xs leading-relaxed font-light mb-4"
                style={{ color: "var(--text-color)" }}
              >
                {project.description}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-x-1.5 gap-y-1">
                {project.tech.map((t, j) => (
                  <span key={j} className="flex items-center gap-x-1.5">
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--muted-text)" }}
                    >
                      {t}
                    </span>
                    {j < project.tech.length - 1 && (
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
            </motion.a>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
