"use client";

import { motion } from "framer-motion";

interface MascotToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

export default function MascotToggle({ isVisible, onToggle }: MascotToggleProps) {
  return (
    <motion.button
      className="fixed bottom-4 right-4 z-[997] w-10 h-10 rounded-full
                 bg-[var(--bg-secondary)] border border-[var(--border-primary)]
                 shadow-md flex items-center justify-center
                 hover:border-[var(--border-accent)] transition-colors
                 print:hidden"
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isVisible ? "마스코트 숨기기" : "마스코트 보이기"}
      title={isVisible ? "마스코트 숨기기" : "마스코트 보이기"}
    >
      {/* Mini brain icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        style={{ opacity: isVisible ? 1 : 0.4 }}
      >
        <ellipse
          cx="12"
          cy="11"
          rx="8"
          ry="7"
          fill="var(--mascot-body)"
        />
        <path
          d="M6 8 Q9 6 12 8 Q15 6 18 8"
          stroke="var(--mascot-fold)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M5 11 Q9 9 12 11 Q15 9 19 11"
          stroke="var(--mascot-fold)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M6 14 Q9 12 12 14 Q15 12 18 14"
          stroke="var(--mascot-fold)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        {/* Eyes */}
        <circle cx="9" cy="10" r="1.5" fill="white" />
        <circle cx="9" cy="10" r="0.8" fill="var(--mascot-pupil)" />
        <circle cx="15" cy="10" r="1.5" fill="white" />
        <circle cx="15" cy="10" r="0.8" fill="var(--mascot-pupil)" />
        {/* Tentacles */}
        <path
          d="M5 15 Q3 18 4 20"
          stroke="var(--mascot-fold)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M19 15 Q21 18 20 20"
          stroke="var(--mascot-fold)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        {/* Strike-through when hidden */}
        {!isVisible && (
          <line
            x1="4"
            y1="20"
            x2="20"
            y2="4"
            stroke="var(--text-secondary)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
    </motion.button>
  );
}
