import type { MouseEvent } from "react";
import { STORY } from "../story/timeline";

export type StorySection = "about" | "projects" | "contact";
export type StoryChapter =
  | "chapter1"
  | "chapter2"
  | "chapter3"
  | "chapter4"
  | "chapter5"
  | "chapter6";

const STORY_SECTION_MAP: Record<StorySection, { chapter: StoryChapter; hash: string }> = {
  about: { chapter: "chapter1", hash: "#about" },
  projects: { chapter: "chapter3", hash: "#projects" },
  contact: { chapter: "chapter6", hash: "#contact" },
};

export const MOBILE_BREAKPOINT = 650;

export const isMobileViewport = () =>
  typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT;

export const getStoryChapterProgress = (chapter: StoryChapter) => {
  const chapterData = STORY[chapter] as Record<string, number>;

  if (!chapterData || !("holdStart" in chapterData) || !("holdEnd" in chapterData)) {
    return 0;
  }

  const { holdStart, holdEnd } = chapterData;
  return (holdStart + holdEnd) / 2;
};

const setLocationHash = (hash: string) => {
  if (typeof window === "undefined") return;

  const nextUrl = new URL(window.location.href);
  nextUrl.hash = hash;
  window.history.pushState({}, "", nextUrl);
};

export const scrollToStoryProgress = (progress: number, hash?: string) => {
  if (typeof window === "undefined") return;

  const storySection = document.querySelector<HTMLElement>(".hero-story");

  if (!storySection) {
    if (hash) setLocationHash(hash);
    return;
  }

  const scrollableDistance = storySection.offsetHeight - window.innerHeight;
  const top = scrollableDistance > 0 ? progress * scrollableDistance : 0;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });

  if (hash) setLocationHash(hash);
};

export const scrollToStoryChapter = (chapter: StoryChapter, hash?: string) => {
  const targetProgress = getStoryChapterProgress(chapter);
  scrollToStoryProgress(targetProgress, hash);
};

export const scrollToStorySection = (section: StorySection) => {
  const target = STORY_SECTION_MAP[section];

  if (isMobileViewport()) {
    const mobileTarget = document.getElementById(target.hash.slice(1));

    if (mobileTarget) {
      mobileTarget.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setLocationHash(target.hash);
      return;
    }
  }

  scrollToStoryChapter(target.chapter, target.hash);
};

export const handleStoryNavigation = (
  event: MouseEvent<HTMLAnchorElement>,
  section: StorySection
) => {
  if (event.defaultPrevented) return;

  event.preventDefault();
  scrollToStorySection(section);
};
