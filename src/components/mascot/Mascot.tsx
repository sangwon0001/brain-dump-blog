"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MascotCharacter from "./MascotCharacter";

const STORAGE_KEY = "mascot-visible";

export default function Mascot() {
  const [isVisible, setIsVisible] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsVisible(stored === "true");
    }
    setIsHydrated(true);

    // Listen for toggle event from Header
    const handleToggle = () => {
      setIsVisible((prev) => {
        const newValue = !prev;
        localStorage.setItem(STORAGE_KEY, String(newValue));
        return newValue;
      });
    };

    window.addEventListener("toggle-mascot", handleToggle);
    return () => window.removeEventListener("toggle-mascot", handleToggle);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          className="print:hidden"
        >
          <MascotCharacter />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
