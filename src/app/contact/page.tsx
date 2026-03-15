"use client";

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const info = [
  {
    icon: <FaPhoneAlt />,
    title: "Phone",
    description: "(+1) 204-869-1269",
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    description: "danielmai12.cs@gmail.com",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Address",
    description: "Winnipeg, Manitoba, Canada",
  },
];

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus("sending");
    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setStatus("success");
      formRef.current.reset();
      setSubject("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.4, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[calc(100vh-4rem)] flex items-center py-16"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          <div className="xl:w-[54%] order-2 xl:order-none">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 p-10 rounded-xl border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <h3
                className="text-4xl font-semibold"
                style={{ color: "var(--accent-color)" }}
              >
                Let&apos;s connect
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-color)" }}>
                Have a project in mind, a role you think I&apos;d be a good fit
                for, or just want to say hi? Fill out the form and I&apos;ll get
                back to you as soon as I can.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input type="text" name="firstname" placeholder="Firstname" required />
                <Input type="text" name="lastname" placeholder="Lastname" required />
                <Input type="email" name="email" placeholder="Email" required />
                <Input type="tel" name="phone" placeholder="Phone number" />
              </div>

              {/* Hidden input so subject value is included in the form data */}
              <input type="hidden" name="subject" value={subject} />

              <Select onValueChange={setSubject}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select a service</SelectLabel>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                    <SelectItem value="ai-development">AI / LLM Integration</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Textarea
                className="h-[200px]"
                name="message"
                placeholder="Type your message here..."
                required
              />

              <div className="flex items-center gap-4">
                <Button className="max-w-40" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Send message"}
                </Button>
                {status === "success" && (
                  <p className="text-sm" style={{ color: "var(--accent-color)" }}>
                    Message sent successfully!
                  </p>
                )}
                {status === "error" && (
                  <p className="text-sm text-red-500">
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map((item, index) => (
                <li key={index} className="flex items-center gap-6">
                  <div
                    className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] rounded-md flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--border-color)",
                      color: "var(--accent-color)",
                    }}
                  >
                    <div className="text-[28px]">{item.icon}</div>
                  </div>
                  <div className="flex-1">
                    <p style={{ color: "var(--secondary-color)" }}>{item.title}</p>
                    <h3
                      className="text-xl font-medium"
                      style={{ color: "var(--primary-color)" }}
                    >
                      {item.description}
                    </h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
