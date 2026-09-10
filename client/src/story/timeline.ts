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
    holdEnd: 0.15,
  },
  transition12: {
    start: 0.15,
    end: 0.24,
  },
  chapter2: {
    holdStart: 0.24,
    holdEnd: 0.39,
  },
  transition23: {
    start: 0.39,
    end: 0.49,
  },
  chapter3: {
    holdStart: 0.49,
    holdEnd: 0.67,
  },
  transition34: {
    start: 0.67,
    end: 0.78,
  },
  chapter4: {
    holdStart: 0.78,
    holdEnd: 1,
  },
} as const;

export const chapterVisibility = (
  progress: number,
  chapter: "chapter1" | "chapter2" | "chapter3" | "chapter4"
) => {
  const transition12 = STORY.transition12;
  const transition23 = STORY.transition23;
  const transition34 = STORY.transition34;

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

  if (chapter === "chapter3") {
    if (progress < transition23.start) return 0;

    if (progress <= transition23.end) {
      const fadeStart = transition23.end - (transition23.end - transition23.start) * 0.45;
      return smoothstep(fadeStart, transition23.end, progress);
    }

    if (progress <= STORY.chapter3.holdEnd) return 1;

    if (progress < transition34.start) return 1;

    if (progress <= transition34.end) {
      const fadeStart = transition34.start;
      const fadeEnd = transition34.start + (transition34.end - transition34.start) * 0.55;
      return 1 - smoothstep(fadeStart, fadeEnd, progress);
    }

    return 0;
  }

  if (chapter === "chapter4") {
    if (progress < transition34.start) return 0;

    if (progress <= transition34.end) {
      const fadeStart = transition34.start;
      const fadeEnd = transition34.start + (transition34.end - transition34.start) * 0.58;
      return smoothstep(fadeStart, fadeEnd, progress);
    }

    return 1;
  }

  return 0;
};

export const getLocalTransitionProgress = (
  progress: number,
  transitionStart: number,
  transitionEnd: number
) => rangeProgress(progress, transitionStart, transitionEnd);
