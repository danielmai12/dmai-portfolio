"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const photos = ["/assets/photo-1.png", "/assets/photo.png"];

const Photo = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[222px] h-[222px] xl:w-[506px] xl:h-[506px] relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 0.5, duration: 0.4, ease: "easeIn" },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={photos[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-[220px] h-[220px] xl:w-[498px] xl:h-[498px] absolute top-0 left-0"
          >
            <Image
              src={photos[index]}
              priority
              quality={100}
              fill
              alt="Daniel Mai"
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>

        <motion.svg
          className="w-[222px] xl:w-[506px] h-[222px] xl:h-[506px]"
          fill="transparent"
          viewBox="0 0 506 506"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="253"
            cy="253"
            r="250"
            stroke="var(--accent-color)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: "24 10 0 0" }}
            animate={{
              strokeDasharray: ["15 120 25 25", "16 25 92 72", "4 250 22 22"],
              rotate: [120, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
            }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
};

export default Photo;
