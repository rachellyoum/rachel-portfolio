export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const smoothstep = (start: number, end: number, value: number) => {
  if (end === start) return 0;

  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export const rangeProgress = (value: number, start: number, end: number) => {
  if (end === start) return 0;

  return clamp01((value - start) / (end - start));
};

export const STORY = {
  chapter1: {
    holdStart: 0,
    holdEnd: 0.2,
  },
  transition12: {
    start: 0.2,
    end: 0.32,
  },
  chapter2: {
    holdStart: 0.32,
    holdEnd: 0.52,
  },
  transition23: {
    start: 0.52,
    end: 0.66,
  },
  chapter3: {
    holdStart: 0.66,
    holdEnd: 1,
  },
} as const;

export const chapterVisibility = (
  progress: number,
  chapter: "chapter1" | "chapter2" | "chapter3"
) => {
  const transition12 = STORY.transition12;
  const transition23 = STORY.transition23;

  if (chapter === "chapter1") {
    if (progress < transition12.start) return 1;
    if (progress <= transition12.end) {
      const fadeStart = transition12.start;
      const fadeEnd = transition12.start + (transition12.end - transition12.start) * 0.45;
      return 1 - smoothstep(fadeStart, fadeEnd, progress);
    }
    return 0;
  }

  if (chapter === "chapter2") {
    if (progress < transition12.end) {
      const fadeStart = transition12.end - (transition12.end - transition12.start) * 0.45;
      return smoothstep(fadeStart, transition12.end, progress);
    }

    if (progress <= STORY.chapter2.holdEnd) return 1;

    if (progress < transition23.start) return 1;

    if (progress <= transition23.end) {
      const fadeStart = transition23.start;
      const fadeEnd = transition23.start + (transition23.end - transition23.start) * 0.45;
      return 1 - smoothstep(fadeStart, fadeEnd, progress);
    }

    return 0;
  }

  if (progress < transition23.start) return 0;

  if (progress <= transition23.end) {
    const fadeStart = transition23.end - (transition23.end - transition23.start) * 0.45;
    return smoothstep(fadeStart, transition23.end, progress);
  }

  return 1;
};

export const getLocalTransitionProgress = (
  progress: number,
  transitionStart: number,
  transitionEnd: number
) => rangeProgress(progress, transitionStart, transitionEnd);
