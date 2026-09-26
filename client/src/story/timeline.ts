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
    holdEnd: 0.08,
  },
  transition12: {
    start: 0.08,
    end: 0.13,
  },
  chapter2: {
    holdStart: 0.13,
    holdEnd: 0.22,
  },
  transition23: {
    start: 0.22,
    end: 0.27,
  },
  chapter3: {
    holdStart: 0.27,
    holdEnd: 0.37,
  },
  transition34: {
    start: 0.37,
    end: 0.42,
  },
  chapter4: {
    holdStart: 0.42,
    holdEnd: 0.52,
  },
  transition45: {
    start: 0.52,
    end: 0.58,
  },
  chapter5: {
    holdStart: 0.58,
    holdEnd: 0.69,
  },
  transition56: {
    start: 0.69,
    end: 0.75,
  },
  chapter6: {
    holdStart: 0.75,
    holdEnd: 0.87,
  },
  transition67: {
    start: 0.87,
    end: 0.93,
  },
  chapter7: {
    holdStart: 0.93,
    holdEnd: 1,
  },
} as const;

export const chapterVisibility = (
  progress: number,
  chapter:
    | "chapter1"
    | "chapter2"
    | "chapter3"
    | "chapter4"
    | "chapter5"
    | "chapter6"
    | "chapter7"
) => {
  const transition12 = STORY.transition12;
  const transition23 = STORY.transition23;
  const transition34 = STORY.transition34;
  const transition45 = STORY.transition45;
  const transition56 = STORY.transition56;
  const transition67 = STORY.transition67;

  if (chapter === "chapter1") {
    if (progress < transition12.start) return 1;
    if (progress <= transition12.end) {
      const fadeStart = transition12.start;
      const fadeEnd =
        transition12.start + (transition12.end - transition12.start) * 0.45;
      return 1 - smoothstep(fadeStart, fadeEnd, progress);
    }

    return 0;
  }

  if (chapter === "chapter2") {
    if (progress < transition12.end) {
      const fadeStart =
        transition12.end - (transition12.end - transition12.start) * 0.45;
      return smoothstep(fadeStart, transition12.end, progress);
    }

    if (progress <= STORY.chapter2.holdEnd) return 1;

    if (progress < transition23.start) return 1;

    if (progress <= transition23.end) {
      const fadeStart = transition23.start;
      const fadeEnd =
        transition23.start + (transition23.end - transition23.start) * 0.45;
      return 1 - smoothstep(fadeStart, fadeEnd, progress);
    }

    return 0;
  }

  if (chapter === "chapter3") {
    if (progress < transition23.start) return 0;

    if (progress <= transition23.end) {
      const fadeStart =
        transition23.end - (transition23.end - transition23.start) * 0.45;
      return smoothstep(fadeStart, transition23.end, progress);
    }

    if (progress <= STORY.chapter3.holdEnd) return 1;

    if (progress < transition34.start) return 1;

    if (progress <= transition34.end) {
      const fadeStart = transition34.start;
      const fadeEnd =
        transition34.start + (transition34.end - transition34.start) * 0.55;
      return 1 - smoothstep(fadeStart, fadeEnd, progress);
    }

    return 0;
  }

  if (chapter === "chapter4") {
    if (progress < transition34.start) return 0;

    if (progress <= transition34.end) {
      const fadeStart =
        transition34.start - (transition34.end - transition34.start) * 0.42;
      return smoothstep(fadeStart, transition34.end, progress);
    }

    if (progress <= STORY.chapter4.holdEnd) return 1;

    if (progress < transition45.start) return 1;

    if (progress <= transition45.end) {
      const fadeStart = transition45.start;
      const fadeEnd =
        transition45.start + (transition45.end - transition45.start) * 0.5;
      return 1 - smoothstep(fadeStart, fadeEnd, progress);
    }

    return 0;
  }

  if (chapter === "chapter5") {
    if (progress < transition45.start) return 0;

    if (progress <= transition45.end) {
      const fadeStart =
        transition45.end - (transition45.end - transition45.start) * 0.5;
      return smoothstep(fadeStart, transition45.end, progress);
    }

    if (progress <= STORY.chapter5.holdEnd) return 1;

    if (progress < transition56.start) return 1;

    if (progress <= transition56.end) {
      const fadeStart = transition56.start;
      const fadeEnd =
        transition56.start + (transition56.end - transition56.start) * 0.55;
      return 1 - smoothstep(fadeStart, fadeEnd, progress);
    }

    return 0;
  }

  if (chapter === "chapter6") {
    if (progress < transition56.start) return 0;

    if (progress <= transition56.end) {
      const fadeStart =
        transition56.end - (transition56.end - transition56.start) * 0.5;
      return smoothstep(fadeStart, transition56.end, progress);
    }

    if (progress <= STORY.chapter6.holdEnd) return 1;

    if (progress < transition67.start) return 1;

    if (progress <= transition67.end) {
      const fadeStart = transition67.start;
      const fadeEnd =
        transition67.start + (transition67.end - transition67.start) * 0.55;
      return 1 - smoothstep(fadeStart, fadeEnd, progress);
    }

    return 0;
  }

  if (chapter === "chapter7") {
    if (progress < transition67.start) return 0;

    if (progress <= transition67.end) {
      const fadeStart =
        transition67.end - (transition67.end - transition67.start) * 0.5;
      return smoothstep(fadeStart, transition67.end, progress);
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
