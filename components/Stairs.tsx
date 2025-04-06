import { animate, motion } from "framer-motion";
import React from "react";
const stairAnimation = {
  initial: {
    top: "0%",
  },
  animate: {
    top: "100%",
  },
  exit: {
    top: ["100%", "0%"],
  },
};

// calculate the reverse index for staggered delay.
const reverseIndex = (index: number) => {
  const totalSteps = 6; // total number of steps
  return totalSteps - index - 0.1; // staggered delay in seconds
};

const Stairs = () => {
  return (
    <>
      {/* render 6 motion divs, each representing a step of the stairs
        Each div will have the same animation defined by the stairsAnimation object.
        The delay for each div is calculated sinamically based on the reversed index of the div.
        creating a staggered effect with decreasing delay for each subsequent step.
      */}
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          variants={stairAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.4,
            delay: reverseIndex(index) * 0.1,
            ease: "easeInOut",
          }}
          className="h-full w-full bg-white relative"
        />
      ))}
    </>
  );
};

export default Stairs;
