import { useEffect, useRef, useState } from "react";
import { chapterVisibility, clamp01 } from "../story/timeline";
import PortfolioScene from "./PortfolioScene";

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
  const chapter1Opacity = chapterVisibility(progress, "chapter1");
  const chapter2Opacity = chapterVisibility(progress, "chapter2");
  const chapter3Opacity = chapterVisibility(progress, "chapter3");

  const chapter1Shift = (1 - chapter1Opacity) * -18;
  const chapter2Shift = (1 - chapter2Opacity) * 20;
  const chapter3Shift = (1 - chapter3Opacity) * 20;

  return (
    <section className="hero-story" id="home" ref={sectionRef}>
      <div className="hero hero-sticky">
        <div className="container hero-grid">
          <div className="hero-content story-copy">
            <div
              className="chapter-copy chapter-one"
              style={{
                opacity: chapter1Opacity,
                transform: `translate3d(0, ${chapter1Shift}px, 0)`,
                transition: "opacity 260ms ease, transform 260ms ease",
                pointerEvents: chapter1Opacity > 0.2 ? "auto" : "none",
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
                opacity: chapter2Opacity,
                transform: `translate3d(0, ${chapter2Shift}px, 0)`,
                transition: "opacity 300ms ease, transform 300ms ease",
                pointerEvents: chapter2Opacity > 0.2 ? "auto" : "none",
              }}
            >
              <p className="eyebrow">CHAPTER 02</p>

              <h1 className="story-chapter-heading">Learning to build at SFU.</h1>

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

            <div
              className="chapter-copy chapter-three project-chapter"
              style={{
                opacity: chapter3Opacity,
                transform: `translate3d(0, ${chapter3Shift}px, 0)`,
                transition: "opacity 300ms ease, transform 300ms ease",
                pointerEvents: chapter3Opacity > 0.2 ? "auto" : "none",
              }}
            >
              <p className="eyebrow">CHAPTER 03</p>

              <h1 className="project-name">MapSi</h1>

              <p className="project-chapter-tagline">
                Building software for the way people travel.
              </p>

              <p className="hero-description project-description">
                An AI-powered travel planner that turns trip preferences into
                personalized itineraries, routes, points of interest,
                transportation recommendations, and collaborative travel plans.
              </p>

              <p className="project-role">Role: Backend Co-owner</p>

              <div className="hero-tags project-tags">
                <span>FastAPI</span>
                <span>PostgreSQL</span>
                <span>Firebase</span>
                <span>Redis</span>
                <span>Google Cloud</span>
              </div>

              <p className="project-highlight">
                Built backend services for AI itinerary generation, POI discovery,
                routing, transportation decisions, and trip sharing.
              </p>

              <div className="hero-actions project-actions">
                <a className="button button-primary" href="#" aria-label="View MapSi project">
                  View Project
                </a>

                <a
                  className="button button-secondary"
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="View MapSi GitHub"
                >
                  GitHub
                </a>
              </div>

              <div className="scroll-hint">
                <span className="scroll-line"></span>
                <span>Keep scrolling — more projects ahead</span>
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
