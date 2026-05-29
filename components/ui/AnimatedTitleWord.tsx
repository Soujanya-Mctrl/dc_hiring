"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Innovators", "Developers", "Designers", "Creators", "Builders"];

export function AnimatedTitleWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className="text-accent inline-grid overflow-hidden align-bottom"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="col-start-1 row-start-1"
        >
          <span className="opacity-100 col-start-1 row-start-1 pointer-events-none" aria-hidden="true">
        {words[index]}
      </span>
        </motion.span>
      </AnimatePresence>

    </span>
  );
}
