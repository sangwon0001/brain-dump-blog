"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  floatingVariants,
  tentacleVariants,
  clickReactions,
  getRandomReaction,
  positionSpring,
} from "./mascotAnimations";

const MASCOT_SIZE = 120;
const PADDING = 50;
const MOVE_INTERVAL_MIN = 8000;
const MOVE_INTERVAL_MAX = 12000;

export default function MascotCharacter() {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [reaction, setReaction] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 30, y: 100 });
  const mascotRef = useRef<HTMLDivElement>(null);

  // Global mouse tracking for eyes + shy avoidance
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;

      const rect = mascotRef.current.getBoundingClientRect();
      const mascotCenterX = rect.left + MASCOT_SIZE / 2;
      const mascotCenterY = rect.top + MASCOT_SIZE / 2;

      const dx = e.clientX - mascotCenterX;
      const dy = e.clientY - mascotCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxOffset = 4;
      const factor = Math.min(distance / 200, 1);

      if (distance > 0) {
        setEyeOffset({
          x: (dx / distance) * maxOffset * factor,
          y: (dy / distance) * maxOffset * factor,
        });
      }

      // Shy avoidance - move away slowly when mouse gets close
      const avoidanceThreshold = 100;
      if (distance < avoidanceThreshold && distance > 0) {
        // Much slower, gentle avoidance (3-8px)
        const avoidStrength = ((avoidanceThreshold - distance) / avoidanceThreshold) * 5 + 3;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newX = position.x - (dx / distance) * avoidStrength;
        let newY = position.y - (dy / distance) * avoidStrength;

        // Keep within bounds
        newX = Math.max(PADDING, Math.min(viewportWidth - MASCOT_SIZE - PADDING, newX));
        newY = Math.max(PADDING, Math.min(viewportHeight - MASCOT_SIZE - PADDING, newY));

        setPosition({ x: newX, y: newY });
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [position]);

  // Random movement
  useEffect(() => {
    const getRandomPosition = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const maxX = viewportWidth - MASCOT_SIZE - PADDING;
      const maxY = viewportHeight - MASCOT_SIZE - PADDING;

      return {
        x: Math.random() * (maxX - PADDING) + PADDING,
        y: Math.random() * (maxY - PADDING) + PADDING,
      };
    };

    const moveToRandomPosition = () => {
      const newPos = getRandomPosition();
      setPosition(newPos);
    };

    // Initial random position
    moveToRandomPosition();

    // Set up interval for random movement
    const scheduleNextMove = () => {
      const delay =
        Math.random() * (MOVE_INTERVAL_MAX - MOVE_INTERVAL_MIN) +
        MOVE_INTERVAL_MIN;
      return setTimeout(() => {
        moveToRandomPosition();
        timeoutId = scheduleNextMove();
      }, delay);
    };

    let timeoutId = scheduleNextMove();

    return () => clearTimeout(timeoutId);
  }, []);

  // Click reaction
  const handleClick = useCallback(() => {
    const newReaction = getRandomReaction();
    setReaction(newReaction);
    setTimeout(() => setReaction(null), 500);
  }, []);

  const currentReaction = reaction ? clickReactions[reaction] : null;

  return (
    <motion.div
      ref={mascotRef}
      className="fixed z-[998] cursor-pointer select-none"
      style={{
        width: MASCOT_SIZE,
        height: MASCOT_SIZE,
      }}
      initial={{ opacity: 0.6 }}
      animate={{
        left: position.x,
        top: position.y,
        opacity: 0.6,
      }}
      transition={positionSpring}
      onClick={handleClick}
      whileHover={{ scale: 1.05, opacity: 0.85 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Main floating animation wrapper */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Click reaction wrapper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={reaction || "idle"}
            initial={currentReaction?.initial}
            animate={currentReaction?.animate || {}}
            style={{ width: "100%", height: "100%" }}
          >
            {/* Brain mascot SVG */}
            <svg
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", height: "100%" }}
              aria-label="블로그 마스코트"
            >
              {/* Neuron tentacles */}
              <motion.path
                custom={0}
                variants={tentacleVariants}
                animate="animate"
                d="M15 55 Q5 65 8 72"
                stroke="var(--mascot-fold)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                style={{ transformOrigin: "15px 55px" }}
              />
              <motion.path
                custom={1}
                variants={tentacleVariants}
                animate="animate"
                d="M25 60 Q20 72 25 78"
                stroke="var(--mascot-fold)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                style={{ transformOrigin: "25px 60px" }}
              />
              <motion.path
                custom={2}
                variants={tentacleVariants}
                animate="animate"
                d="M55 60 Q60 72 55 78"
                stroke="var(--mascot-fold)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                style={{ transformOrigin: "55px 60px" }}
              />
              <motion.path
                custom={3}
                variants={tentacleVariants}
                animate="animate"
                d="M65 55 Q75 65 72 72"
                stroke="var(--mascot-fold)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                style={{ transformOrigin: "65px 55px" }}
              />

              {/* Brain body - main shape */}
              <ellipse
                cx="40"
                cy="35"
                rx="28"
                ry="25"
                fill="var(--mascot-body)"
              />

              {/* Brain folds/wrinkles */}
              <path
                d="M20 25 Q30 20 40 25 Q50 20 60 25"
                stroke="var(--mascot-fold)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M18 35 Q28 30 40 35 Q52 30 62 35"
                stroke="var(--mascot-fold)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M22 45 Q32 40 40 45 Q48 40 58 45"
                stroke="var(--mascot-fold)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />

              {/* Left eye white */}
              <ellipse cx="30" cy="32" rx="8" ry="9" fill="white" />
              {/* Left pupil */}
              <circle
                cx={30 + eyeOffset.x}
                cy={32 + eyeOffset.y}
                r="4"
                fill="var(--mascot-pupil)"
              />
              {/* Left eye shine */}
              <circle
                cx={28 + eyeOffset.x * 0.5}
                cy={30 + eyeOffset.y * 0.5}
                r="1.5"
                fill="white"
              />

              {/* Right eye white */}
              <ellipse cx="50" cy="32" rx="8" ry="9" fill="white" />
              {/* Right pupil */}
              <circle
                cx={50 + eyeOffset.x}
                cy={32 + eyeOffset.y}
                r="4"
                fill="var(--mascot-pupil)"
              />
              {/* Right eye shine */}
              <circle
                cx={48 + eyeOffset.x * 0.5}
                cy={30 + eyeOffset.y * 0.5}
                r="1.5"
                fill="white"
              />

              {/* Blush */}
              <ellipse
                cx="20"
                cy="40"
                rx="5"
                ry="3"
                fill="var(--mascot-blush)"
                opacity="0.5"
              />
              <ellipse
                cx="60"
                cy="40"
                rx="5"
                ry="3"
                fill="var(--mascot-blush)"
                opacity="0.5"
              />

              {/* Smile */}
              <path
                d="M35 48 Q40 53 45 48"
                stroke="var(--mascot-pupil)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
