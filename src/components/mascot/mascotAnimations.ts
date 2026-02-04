import type { Variants, TargetAndTransition } from "framer-motion";

// Floating animation - gentle bobbing
export const floatingVariants: Variants = {
  animate: {
    y: [0, -8, 0, -4, 0],
    rotate: [-1, 1, -1, 0.5, -1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Neuron tentacles wiggling
export const tentacleVariants: Variants = {
  animate: (i: number) => ({
    rotate: [0, 8, -8, 4, 0],
    transition: {
      duration: 2 + i * 0.3,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.2,
    },
  }),
};

// Click reaction type
interface ClickReaction {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
}

// Click reactions
export const clickReactions: Record<string, ClickReaction> = {
  jump: {
    initial: { y: 0, scale: 1 },
    animate: {
      y: [-30, 0],
      scale: [1.1, 1],
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },
  spin: {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 360],
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  },
  wobble: {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  },
  bounce: {
    initial: { scale: 1 },
    animate: {
      scale: [1, 0.8, 1.2, 0.9, 1],
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  },
};

// Get random click reaction
export function getRandomReaction(): keyof typeof clickReactions {
  const reactions = Object.keys(clickReactions) as (keyof typeof clickReactions)[];
  return reactions[Math.floor(Math.random() * reactions.length)];
}

// Calculate eye offset based on mouse position
export function calculateEyeOffset(
  mascotX: number,
  mascotY: number,
  mouseX: number,
  mouseY: number,
  maxOffset: number = 4
): { x: number; y: number } {
  const dx = mouseX - mascotX;
  const dy = mouseY - mascotY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Max effect at 200px distance
  const factor = Math.min(distance / 200, 1);

  if (distance === 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: (dx / distance) * maxOffset * factor,
    y: (dy / distance) * maxOffset * factor,
  };
}

// Generate random position within screen bounds
export function getRandomPosition(
  screenWidth: number,
  screenHeight: number,
  padding: number = 100,
  mascotSize: number = 80
): { x: number; y: number } {
  const minX = padding;
  const maxX = screenWidth - padding - mascotSize;
  const minY = padding;
  const maxY = screenHeight - padding - mascotSize;

  return {
    x: Math.random() * (maxX - minX) + minX,
    y: Math.random() * (maxY - minY) + minY,
  };
}

// Spring transition for position changes
export const positionSpring = {
  type: "spring" as const,
  stiffness: 50,
  damping: 20,
};

// Drag animation settings
export const dragTransition = {
  power: 0.2,
  timeConstant: 200,
};
