"use client";

import { motion } from "framer-motion";

const projects = [
  {
    name: "CGC Grain Outcome Predictions",
    period: "May 2023 – Aug 2023",
    description:
      "Collaborated in a team of 6 to build ML models predicting the incidence and severity of Ergot. Created a Python pipeline to scrape weather data from ground station and satellite sources, stored in dockerized PostgreSQL containers. Held biweekly meetings with stakeholders from the Government and University of Manitoba.",
    tech: ["Python", "Docker", "PostgreSQL", "TensorFlow"],
    github: "https://github.com/dmai/CGC_Grain_Outcome_Predictions",
  },
];

const ProjectsPage = () => {
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
            Projects
          </h2>
          <div
            className="flex-1 h-px opacity-60"
            style={{ backgroundColor: "var(--border-color)" }}
          />
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[900px]">
          {projects.map((project, i) => (
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
    </section>
  );
};

export default ProjectsPage;
