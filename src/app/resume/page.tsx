"use client";

import { FaHtml5, FaCss3, FaJs, FaReact, FaNodeJs } from "react-icons/fa";

import {
  SiTailwindcss,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
} from "react-icons/si";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

const about = {
  title: "About Me",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  info: [
    {
      fieldName: "Name",
      fieldValue: "Daniel mai",
    },
    {
      fieldName: "Phone",
      fieldValue: "(+1) 204-869-1269",
    },
    {
      fieldName: "Experience",
      fieldValue: "3+ years",
    },
    {
      fieldName: "Nationality",
      fieldValue: "Viet Nam & Canada",
    },
    {
      fieldName: "Email",
      fieldValue: "danielmai12.cs@gmail.com | dmai@gryd.com",
    },
    {
      fieldName: "Freelance",
      fieldValue: "Available",
    },
    {
      fieldName: "Languages",
      fieldValue: "English, Vietnamese",
    },
  ],
};

const experiences = {
  title: "My experience",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  items: [
    {
      company: "Gryd Media Ltd",
      position: "Software Engineer",
      duration: "07/2024 - Present",
    },
    {
      company: "Wawanesa Insurance",
      position: "Software Developer Contract",
      duration: "02/2024 - 07/2024",
    },
    {
      company: "QDoc",
      position: "Software Developer Intern",
      duration: "05/2023 - 02/2024",
    },
    {
      company: "Wawanesa Insurance",
      position: "Software Developer Intern",
      duration: "05/2022 - 05/2023",
    },
    {
      company: "University of Manitoba",
      position: "Undergraduate Research Assistant",
      duration: "05/2021 - 12/2021",
    },
    {
      company: "University of Manitoba",
      position: "Teaching Assistant",
      duration: "08/2021 - 05/2024",
    },
  ],
};

const educations = {
  title: "My educations",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  items: [
    {
      school: "University of Manitoba",
      location: "Winnipeg, Canada",
      degree: "Bachelor of Computer Science",
      duration: "08/2019 - 04/2024",
    },
    {
      school: "Le Quy Don High School for the Gifted",
      location: "VungTau, Vietnam",
      degree: "High School Diploma - Math major",
      duration: "08/2016 - 05/2019",
    },
  ],
};

const skills = {
  title: "My skills",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
  skillLists: [
    { icon: <FaHtml5 />, title: "HTML" },
    { icon: <FaCss3 />, title: "CSS" },
    { icon: <FaJs />, title: "JavaScript" },
    { icon: <SiTypescript />, title: "TypeScript" },
    { icon: <FaReact />, title: "ReactJS" },
    { icon: <SiTailwindcss />, title: "Tailwind CSS" },
    { icon: <FaNodeJs />, title: "NodeJS" },
    { icon: <SiMongodb />, title: "MongoDB" },
    { icon: <SiPostgresql />, title: "PostgreSQL" },
  ],
};

const Resume = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.4, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[80vh] flex items-center justify-center py-12 xl:py-0"
    >
      <div className="container mx-auto">
        <Tabs
          defaultValue="experience"
          className="flex flex-col xl:flex-row gap-[60px]"
        >
          <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="about">About Me</TabsTrigger>
          </TabsList>

          <div className="min-h-[70vh] w-full">
            <TabsContent value="experience" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold" style={{ color: "var(--primary-color)" }}>
                  {experiences.title}
                </h3>
                <p className="max-w-[600px] mx-auto xl:mx-0" style={{ color: "var(--text-color)" }}>
                  {experiences.description}
                </p>
                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    {experiences.items.map((item, index) => (
                      <li
                        key={index}
                        className="h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1 border"
                        style={{
                          backgroundColor: "var(--card-bg)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <span style={{ color: "var(--accent-color)" }}>
                          {item.duration}
                        </span>
                        <h3
                          className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left font-medium"
                          style={{ color: "var(--primary-color)" }}
                        >
                          {item.position}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span
                            className="w-[6px] h-[6px] rounded-full"
                            style={{ backgroundColor: "var(--accent-color)" }}
                          />
                          <p style={{ color: "var(--text-color)" }}>
                            {item.company}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="education" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold" style={{ color: "var(--primary-color)" }}>
                  {educations.title}
                </h3>
                <p className="max-w-[600px] mx-auto xl:mx-0" style={{ color: "var(--text-color)" }}>
                  {educations.description}
                </p>
                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    {educations.items.map((item, index) => (
                      <li
                        key={index}
                        className="h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1 border"
                        style={{
                          backgroundColor: "var(--card-bg)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <span style={{ color: "var(--accent-color)" }}>
                          {item.duration}
                        </span>
                        <h3
                          className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left font-medium"
                          style={{ color: "var(--primary-color)" }}
                        >
                          {item.degree}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span
                            className="w-[6px] h-[6px] rounded-full"
                            style={{ backgroundColor: "var(--accent-color)" }}
                          />
                          <p style={{ color: "var(--text-color)" }}>
                            {item.school}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="w-full h-full">
              <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[30px] text-center xl:text-left">
                  <h3 className="text-4xl font-bold" style={{ color: "var(--primary-color)" }}>
                    {skills.title}
                  </h3>
                  <p className="max-w-[600px] mx-auto xl:mx-0" style={{ color: "var(--text-color)" }}>
                    {skills.description}
                  </p>
                </div>
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:gap-[30px] gap-4">
                  {skills.skillLists.map((skill, index) => (
                    <li key={index}>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger
                            className="w-full h-[150px] rounded-xl flex items-center justify-center group border"
                            style={{
                              backgroundColor: "var(--card-bg)",
                              borderColor: "var(--border-color)",
                            }}
                          >
                            <div
                              className="text-6xl transition-all duration-300"
                              style={{ color: "var(--text-color)" }}
                            >
                              {skill.icon}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="capitalize">{skill.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent
              value="about"
              className="w-full text-center xl:text-left"
            >
              <div className="flex flex-col gap-[30px]">
                <h3 className="text-4xl font-bold" style={{ color: "var(--primary-color)" }}>
                  {about.title}
                </h3>
                <p className="max-w-[600px] mx-auto xl:mx-0" style={{ color: "var(--text-color)" }}>
                  {about.description}
                </p>
                <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0">
                  {about.info.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-center xl:justify-start gap-4"
                    >
                      <span style={{ color: "var(--accent-color)" }}>
                        {item.fieldName}:
                      </span>
                      <p style={{ color: "var(--text-color)" }}>
                        {item.fieldValue}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Resume;
