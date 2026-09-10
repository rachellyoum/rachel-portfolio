import { useEffect, useRef, useState } from "react";
import PortfolioScene from "./PortfolioScene";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothstep = (start: number, end: number, value: number) => {
  if (end === start) return 0;

  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

const rangeProgress = (value: number, start: number, end: number) => {
  if (end === start) return 0;

  return clamp01((value - start) / (end - start));
};

const STORY_RANGES = {
  chapter1: [0, 0.3] as const,
  workspaceExit: [0.3, 0.48] as const,
  campusIntro: [0.42, 0.6] as const,
  chapter2: [0.6, 1] as const,
};

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const updateScrollProgress = () => {
      const section = sectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = section.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) {
        setScrollProgress(0);
        return;
      }

      const distanceScrolled = Math.min(Math.max(-rect.top, 0), scrollableDistance);
      const progress = distanceScrolled / scrollableDistance;

      setScrollProgress(progress);
    };

    updateScrollProgress();

    window.addEventListener("scroll", updateScrollProgress, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  const progress = reducedMotion ? clamp01(scrollProgress * 0.8) : scrollProgress;
  const chapter1Progress = rangeProgress(
    progress,
    STORY_RANGES.chapter1[0],
    STORY_RANGES.chapter1[1]
  );
  const chapter2Progress = rangeProgress(
    progress,
    STORY_RANGES.campusIntro[0],
    STORY_RANGES.campusIntro[1]
  );
  const chapter1Visible = 1 - smoothstep(
    STORY_RANGES.workspaceExit[0],
    STORY_RANGES.workspaceExit[1],
    progress
  );
  const chapter2Visible = smoothstep(
    STORY_RANGES.campusIntro[0],
    STORY_RANGES.campusIntro[1],
    progress
  );

  const chapter1Shift = (1 - chapter1Progress) * 18;
  const chapter2Shift = (1 - chapter2Progress) * 18;

  return (
    <section className="hero-story" id="home" ref={sectionRef}>
      <div className="hero hero-sticky">
        <div className="container hero-grid">
          <div className="hero-content story-copy">
            <div
              className="chapter-copy chapter-one"
              style={{
                opacity: chapter1Visible,
                transform: `translate3d(0, ${chapter1Shift}px, 0)`,
                transition: "opacity 260ms ease, transform 260ms ease",
              }}
            >
              <p className="eyebrow">CHAPTER 01</p>

              <h1>
                Hi, I&apos;m Rachel.
                <span> I build thoughtful software.</span>
              </h1>

              <p className="hero-description">
                I&apos;m a Computing Science student interested in backend
                systems, full-stack development, and game development. I
                enjoy turning ideas into useful, polished experiences.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#projects">
                  View my work
                </a>

                <a
                  className="button button-secondary"
                  href="https://github.com/rachellyoum"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </div>

              <div className="hero-tags">
                <span>Backend</span>
                <span>Full Stack</span>
                <span>Game Dev</span>
              </div>
            </div>

            <div
              className="chapter-copy chapter-two"
              style={{
                opacity: chapter2Visible,
                transform: `translate3d(${chapter2Shift}px, ${(1 - chapter2Visible) * 12}px, 0)`,
                transition: "opacity 300ms ease, transform 300ms ease",
                pointerEvents: chapter2Visible > 0.35 ? "auto" : "none",
              }}
            >
              <p className="eyebrow">CHAPTER 02</p>

              <h1>Learning to build at SFU.</h1>

              <p className="hero-description">
                I&apos;m studying Computing Science at Simon Fraser University,
                building foundations in software development, algorithms,
                systems, databases, and collaborative problem solving.
              </p>

              <div className="hero-actions">
                <div className="hero-tags">
                  <span>Computing Science</span>
                  <span>Software Development</span>
                  <span>Problem Solving</span>
                </div>
              </div>

              <div className="scroll-hint">
                <span className="scroll-line"></span>
                <span>Keep scrolling — projects ahead</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <PortfolioScene progress={progress} reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
