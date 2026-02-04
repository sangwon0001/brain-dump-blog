import { Variants, Transition } from 'framer-motion';

// Spring configurations
export const springs = {
  gentle: { type: 'spring', stiffness: 300, damping: 30 } as Transition,
  bouncy: { type: 'spring', stiffness: 400, damping: 25 } as Transition,
  snappy: { type: 'spring', stiffness: 500, damping: 30 } as Transition,
} as const;

// Icon rotation (ThemeToggle)
export const iconRotate: Variants = {
  initial: { rotate: -90, scale: 0, opacity: 0 },
  animate: {
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  exit: {
    rotate: 90,
    scale: 0,
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// Fade + slide up (BackToTop, general entrance)
export const fadeSlideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2 },
  },
};

// Scale in (Modal)
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95, y: -10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.15 },
  },
};

// Backdrop fade
export const backdropFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Slide from right (Drawer)
export const slideFromRight: Variants = {
  initial: { x: '100%' },
  animate: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    x: '100%',
    transition: { type: 'spring', stiffness: 400, damping: 35 },
  },
};

// Card entrance with stagger support
export const cardEntrance: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      delay: i * 0.05,
    },
  }),
};

// Stagger container for lists
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Stagger item
export const staggerItem: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, x: 10, transition: { duration: 0.1 } },
};
