export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_SOFT = [0.33, 1, 0.68, 1] as const;

export const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

export const staggerChildren = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

export const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_SOFT },
  },
};

export const reducedReveal = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};
