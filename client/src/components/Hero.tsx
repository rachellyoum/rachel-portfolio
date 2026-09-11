import { useEffect, useRef, useState, type MouseEvent } from "react";
import { LINKS } from "../data/links";
import { chapterVisibility, clamp01 } from "../story/timeline";
import { handleStoryNavigation } from "../utils/storyNavigation";
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
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 650 : false
  );
  const [activeChapter, setActiveChapter] = useState<
    "chapter1" | "chapter2" | "chapter3" | "chapter4" | "chapter5" | "chapter6"
  >("chapter1");
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

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth <= 650);

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const chapterNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-mobile-chapter]")
    );

    if (chapterNodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;

        const nextChapter = visibleEntry.target.getAttribute(
          "data-mobile-chapter"
        ) as keyof typeof chapterMap;

        if (nextChapter) {
          setActiveChapter(nextChapter);
        }
      },
      {
        threshold: [0.3, 0.45, 0.7],
        rootMargin: "-18% 0px -15% 0px",
      }
    );

    chapterNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [isMobile]);

  const chapterMap = {
    chapter1: 0.05,
    chapter2: 0.22,
    chapter3: 0.39,
    chapter4: 0.57,
    chapter5: 0.77,
    chapter6: 0.94,
  } as const;

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

  const mobileSceneProgress = chapterMap[activeChapter];

  const mobileChapters = [
    {
      id: "chapter1",
      slug: "about",
      eyebrow: "CHAPTER 01",
      heading: (
        <>
          Hi, I'm Rachel.
          <span> I build thoughtful software.</span>
        </>
      ),
      description:
        "I'm a Computing Science student interested in backend systems, full-stack development, and game development. I enjoy turning ideas into useful, polished experiences.",
      actions: [
        {
          label: "View my work",
          href: LINKS.projects,
          primary: true,
          onClick: (event: MouseEvent<HTMLAnchorElement>) => handleStoryNavigation(event, "projects"),
        },
        { label: "GitHub", href: LINKS.github, target: "_blank", primary: false },
      ],
      tags: ["Backend", "Full Stack", "Game Dev"],
    },
    {
      id: "chapter2",
      slug: "chapter-2",
      eyebrow: "CHAPTER 02",
      heading: "Learning to build at SFU.",
      description:
        "I'm studying Computing Science at Simon Fraser University, building foundations in software development, algorithms, systems, databases, and collaborative problem solving.",
      tags: ["Computing Science", "Software Development", "Problem Solving"],
      hint: "Keep scrolling — projects ahead",
    },
    {
      id: "chapter3",
      slug: "projects",
      eyebrow: "CHAPTER 03",
      heading: "MapSi",
      tagline: "Building software for the way people travel.",
      description:
        "An AI-powered travel planner that turns trip preferences into personalized itineraries, routes, points of interest, transportation recommendations, and collaborative travel plans.",
      role: "Role: Backend Co-owner",
      tags: ["FastAPI", "PostgreSQL", "Firebase", "Redis", "Google Cloud"],
      highlight:
        "Built backend services for AI itinerary generation, POI discovery, routing, transportation decisions, and trip sharing.",
      actions: [
        { label: "View Project", href: LINKS.mapsi, target: "_blank", primary: true },
      ],
      hint: "Keep scrolling — more projects ahead",
    },
    {
      id: "chapter4",
      slug: "chapter-4",
      eyebrow: "CHAPTER 04",
      heading: "Prioritize",
      tagline: "Turning busy schedules into something manageable.",
      description:
        "A productivity platform that helps organize tasks, schedules, and calendar events through a backend-driven workflow.",
      role: "Role: Backend Developer",
      tags: ["FastAPI", "PostgreSQL", "SQLAlchemy", "JWT", "Docker"],
      highlight:
        "Built user authentication and backend services for calendar output, event logging, and scheduling workflows.",
      actions: [
        { label: "View Project", href: LINKS.prioritize, target: "_blank", primary: true },
      ],
      hint: "Keep scrolling — something different ahead",
    },
    {
      id: "chapter5",
      slug: "skills",
      eyebrow: "CHAPTER 05",
      heading: "Dog + Human",
      badge: "IN DEVELOPMENT",
      tagline: "Currently building my first Unity game.",
      description:
        "A cooperative puzzle-platformer where a human and dog split up, use different abilities to solve obstacles, and reunite to complete each level.",
      role: "Role: Developer",
      tags: ["Unity", "C#", "Game Design", "2D", "Gameplay Programming"],
      highlight:
        "Currently building the split-and-reunite control system and puzzle mechanics that let each character solve different parts of the same level.",
      actions: [{ label: "View Progress", href: LINKS.github, target: "_blank", primary: true }],
      hint: "Keep scrolling — what's next?",
    },
    {
      id: "chapter6",
      slug: "contact",
      eyebrow: "CHAPTER 06",
      heading: "What's next?",
      tagline: "The next chapter is still being written.",
      description:
        "I'm looking for software development opportunities where I can keep learning, contribute to real products, and grow as an engineer.",
      role: "Backend · Full Stack · Game Development",
      actions: [
        { label: "View Resume", href: LINKS.resume, target: "_blank", primary: true },
        {
          label: "Contact Me",
          href: LINKS.contact,
          primary: false,
          onClick: (event: MouseEvent<HTMLAnchorElement>) => handleStoryNavigation(event, "contact"),
        },
      ],
      links: [
        { label: "LinkedIn", href: LINKS.linkedin, target: "_blank" },
        { label: "GitHub", href: LINKS.github, target: "_blank" },
      ],
    },
  ] as const;

  if (isMobile) {
    return (
      <>
        <section className="mobile-story" aria-label="Portfolio story">
          <div className="mobile-scene-shell">
            <div className="mobile-scene-window">
              <PortfolioScene progress={mobileSceneProgress} reducedMotion={reducedMotion} />
            </div>
          </div>

          {mobileChapters.map((chapter) => (
            <section
              key={chapter.id}
              id={chapter.slug}
              data-mobile-chapter={chapter.id}
              className={`mobile-chapter ${activeChapter === chapter.id ? "is-active" : ""}`}
            >
              <div className="mobile-chapter-inner">
                <p className="eyebrow">{chapter.eyebrow}</p>

                {chapter.id === "chapter1" ? (
                  <h1 className="mobile-heading">{chapter.heading}</h1>
                ) : chapter.id === "chapter2" ? (
                  <h1 className="mobile-heading mobile-heading-tight">{chapter.heading}</h1>
                ) : chapter.id === "chapter5" ? (
                  <div className="project-header-row mobile-project-header">
                    <h1 className="project-name mobile-project-name">{chapter.heading}</h1>
                    <span className="project-status">{chapter.badge}</span>
                  </div>
                ) : chapter.id === "chapter6" ? (
                  <h1 className="project-name final-headline mobile-final-headline">{chapter.heading}</h1>
                ) : (
                  <h1 className="project-name mobile-project-name">{chapter.heading}</h1>
                )}

                {"tagline" in chapter && chapter.tagline ? (
                  <p className="project-chapter-tagline mobile-tagline">{chapter.tagline}</p>
                ) : null}

                {"description" in chapter && chapter.description ? (
                  <p className="hero-description mobile-description">{chapter.description}</p>
                ) : null}

                {"role" in chapter && chapter.role ? (
                  <p className="project-role mobile-role">{chapter.role}</p>
                ) : null}

                {"tags" in chapter && chapter.tags?.length ? (
                  <div className="hero-tags project-tags mobile-tags">
                    {chapter.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                ) : null}

                {"highlight" in chapter && chapter.highlight ? (
                  <p className="project-highlight mobile-highlight">{chapter.highlight}</p>
                ) : null}

                {"actions" in chapter && chapter.actions?.length ? (
                  <div className="hero-actions project-actions mobile-actions">
                    {chapter.actions.map((action) => (
                      <a
                        key={action.label}
                        className={
                          action.primary
                            ? "button button-primary mobile-button"
                            : "button button-secondary mobile-button"
                        }
                        href={action.href}
                        target={"target" in action ? action.target : undefined}
                        rel={
                          "target" in action && action.target === "_blank"
                            ? "noreferrer"
                            : undefined
                        }
                        onClick={
                          "onClick" in action && action.onClick
                            ? action.onClick
                            : undefined
                        }
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                ) : null}

                {"links" in chapter && chapter.links?.length ? (
                  <div className="final-links mobile-links">
                    {chapter.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.target}
                        rel={link.target === "_blank" ? "noreferrer" : undefined}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}

                {"hint" in chapter && chapter.hint ? (
                  <div className="scroll-hint mobile-scroll-hint">
                    <span className="scroll-line"></span>
                    <span>{chapter.hint}</span>
                  </div>
                ) : null}
              </div>
            </section>
          ))}
        </section>

        <footer className="story-footer mobile-footer">
          <div className="container mobile-footer-inner">
            <p>Rachel Youm</p>
            <p>Software Developer</p>
            <p>Computing Science</p>
            <div className="story-footer-nav mobile-footer-nav">
              <a href={LINKS.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href="#home">Back to top</a>
            </div>
          </div>
        </footer>
      </>
    );
  }

  return (
    <>
      <section className="hero-story" id="home" ref={sectionRef}>
        <div className="hero hero-sticky">
          <div className="container hero-grid">
            <div className="hero-content story-copy">
              <div
                id="about"
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
                  Hi, I'm Rachel.
                  <span> I build thoughtful software.</span>
                </h1>

                <p className="hero-description">
                  I'm a Computing Science student interested in backend
                  systems, full-stack development, and game development. I
                  enjoy turning ideas into useful, polished experiences.
                </p>

                <div className="hero-actions">
                  <a
                    className="button button-primary"
                    href={LINKS.projects}
                    onClick={(event) => handleStoryNavigation(event, "projects")}
                  >
                    View my work
                  </a>

                  <a
                    className="button button-secondary"
                    href={LINKS.github}
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
                  I'm studying Computing Science at Simon Fraser University,
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
                id="projects"
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
                  <a
                    className="button button-primary"
                    href={LINKS.mapsi}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View MapSi project"
                  >
                    View Project
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
                  <a
                    className="button button-primary"
                    href={LINKS.prioritize}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View Prioritize project"
                  >
                    View Project
                  </a>
                </div>

                <div className="scroll-hint">
                  <span className="scroll-line"></span>
                  <span>Keep scrolling — something different ahead</span>
                </div>
              </div>

              <div
                id="skills"
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
                  <a
                    className="button button-primary"
                    href={LINKS.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View Dog + Human progress"
                  >
                    View Progress
                  </a>
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

                <h1 className="project-name final-headline">What's next?</h1>

                <p className="project-chapter-tagline final-tagline">
                  The next chapter is still being written.
                </p>

                <p className="hero-description project-description final-description">
                  I'm looking for software development opportunities where I can
                  keep learning, contribute to real products, and grow as an engineer.
                </p>

                <p className="project-role final-role">Backend · Full Stack · Game Development</p>

                <div className="hero-actions project-actions final-actions">
                  <a
                    className="button button-primary"
                    href={LINKS.resume}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View resume"
                  >
                    View Resume
                  </a>

                  <a
                    className="button button-secondary"
                    href={LINKS.contact}
                    aria-label="Contact Rachel"
                    onClick={(event) => handleStoryNavigation(event, "contact")}
                  >
                    Contact Me
                  </a>
                </div>

                <div className="final-links">
                  <a href="https://www.linkedin.com/in/rachel-youm/" target="_blank" rel="noreferrer" aria-label="View LinkedIn profile">
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
            <a href={LINKS.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="#home">Back to top</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Hero;
