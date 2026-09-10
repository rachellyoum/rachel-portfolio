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
  const chapter4Opacity = chapterVisibility(progress, "chapter4");
  const chapter5Opacity = chapterVisibility(progress, "chapter5");
  const chapter6Opacity = chapterVisibility(progress, "chapter6");

  const chapter1Shift = (1 - chapter1Opacity) * -18;
  const chapter2Shift = (1 - chapter2Opacity) * 20;
  const chapter3Shift = (1 - chapter3Opacity) * 20;
  const chapter4Shift = (1 - chapter4Opacity) * 20;
  const chapter5Shift = (1 - chapter5Opacity) * 20;
  const chapter6Shift = (1 - chapter6Opacity) * 20;

  return (
    <>
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
                  href="https://github.com/rachellyoum/mapsi-public"
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

            <div
              className="chapter-copy chapter-four project-chapter"
              style={{
                opacity: chapter4Opacity,
                transform: `translate3d(0, ${chapter4Shift}px, 0)`,
                transition: "opacity 300ms ease, transform 300ms ease",
                pointerEvents: chapter4Opacity > 0.2 ? "auto" : "none",
              }}
            >
              <p className="eyebrow">CHAPTER 04</p>

              <h1 className="project-name">Prioritize</h1>

              <p className="project-chapter-tagline">
                Turning busy schedules into something manageable.
              </p>

              <p className="hero-description project-description">
                A productivity platform that helps organize tasks, schedules, and
                calendar events through a backend-driven workflow.
              </p>

              <p className="project-role">Role: Backend Developer</p>

              <div className="hero-tags project-tags">
                <span>FastAPI</span>
                <span>PostgreSQL</span>
                <span>SQLAlchemy</span>
                <span>JWT</span>
                <span>Docker</span>
              </div>

              <p className="project-highlight">
                Built user authentication and backend services for calendar output,
                event logging, and scheduling workflows.
              </p>

              <div className="hero-actions project-actions">
                <a className="button button-primary" href="#" aria-label="View Prioritize project">
                  View Project
                </a>

                <a
                  className="button button-secondary"
                  href="https://github.com/rachellyoum/prioritize-public"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="View Prioritize GitHub"
                >
                  GitHub
                </a>
              </div>

              <div className="scroll-hint">
                <span className="scroll-line"></span>
                <span>Keep scrolling — something different ahead</span>
              </div>
            </div>

            <div
              className="chapter-copy chapter-five project-chapter"
              style={{
                opacity: chapter5Opacity,
                transform: `translate3d(0, ${chapter5Shift}px, 0)`,
                transition: "opacity 300ms ease, transform 300ms ease",
                pointerEvents: chapter5Opacity > 0.2 ? "auto" : "none",
              }}
            >
              <p className="eyebrow">CHAPTER 05</p>

              <div className="project-header-row">
                <h1 className="project-name">Dog + Human</h1>
                <span className="project-status">IN DEVELOPMENT</span>
              </div>

              <p className="project-chapter-tagline">
                Currently building my first Unity game.
              </p>

              <p className="hero-description project-description">
                A cooperative puzzle-platformer where a human and dog split up,
                use different abilities to solve obstacles, and reunite to complete
                each level.
              </p>

              <p className="project-role">Role: Developer</p>

              <div className="hero-tags project-tags">
                <span>Unity</span>
                <span>C#</span>
                <span>Game Design</span>
                <span>2D</span>
                <span>Gameplay Programming</span>
              </div>

              <p className="project-highlight">
                Currently building the split-and-reunite control system and puzzle
                mechanics that let each character solve different parts of the same
                level.
              </p>

              <div className="hero-actions project-actions">
                {/* TODO: add a real progress/demo page when the Dog + Human project is ready. */}
                <a className="button button-primary" href="#" aria-label="View Dog + Human progress">
                  View Progress
                </a>

                {/* No active Dog + Human repository URL is available yet. */}
              </div>

              <div className="scroll-hint">
                <span className="scroll-line"></span>
                <span>Keep scrolling — what&apos;s next?</span>
              </div>
            </div>

            <div
              id="contact"
              className="chapter-copy chapter-six project-chapter final-chapter"
              style={{
                opacity: chapter6Opacity,
                transform: `translate3d(0, ${chapter6Shift}px, 0)`,
                transition: "opacity 300ms ease, transform 300ms ease",
                pointerEvents: chapter6Opacity > 0.2 ? "auto" : "none",
              }}
            >
              <p className="eyebrow">CHAPTER 06</p>

              <h1 className="project-name final-headline">What&apos;s next?</h1>

              <p className="project-chapter-tagline final-tagline">
                The next chapter is still being written.
              </p>

              <p className="hero-description project-description final-description">
                I&apos;m looking for software development opportunities where I can
                keep learning, contribute to real products, and grow as an engineer.
              </p>

              <p className="project-role final-role">Backend · Full Stack · Game Development</p>

              <div className="hero-actions project-actions final-actions">
                <a className="button button-primary" href="#" aria-label="View resume">
                  View Resume
                </a>

                <a className="button button-secondary" href="#contact" aria-label="Contact Rachel">
                  Contact Me
                </a>
              </div>

              <div className="final-links">
                <a href="#" aria-label="View LinkedIn profile">
                  LinkedIn
                </a>
                <a href="https://github.com/rachellyoum" target="_blank" rel="noreferrer" aria-label="View GitHub profile">
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <PortfolioScene progress={progress} reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>
      </section>

      <footer className="story-footer">
        <div className="container">
          <p>Rachel Youm</p>
          <p>Software Developer / Computing Science</p>
          <div className="story-footer-nav">
            <a href="https://github.com/rachellyoum" target="_blank" rel="noreferrer">
              GitHub
            </a>
            {/* TODO: add LinkedIn URL when available. */}
            <a href="#">LinkedIn</a>
            <a href="#home">Back to top</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Hero;
