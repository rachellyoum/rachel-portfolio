import { useState } from "react";
import { LINKS } from "../data/links";
import { handleStoryNavigation } from "../utils/storyNavigation";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Primary navigation">
        <a className="brand" href="#home" onClick={closeMenu}>
          RY<span>.</span>
        </a>

        <div className="nav-links">
          <a href={LINKS.about} onClick={(event) => handleStoryNavigation(event, "about")}>
            About
          </a>
          <a href={LINKS.projects} onClick={(event) => handleStoryNavigation(event, "projects")}>
            Projects
          </a>
          <a href={LINKS.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>

        <a
          className="nav-contact desktop-contact"
          href={LINKS.contact}
          onClick={(event) => handleStoryNavigation(event, "contact")}
        >
          Contact
        </a>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
        <a
          href={LINKS.about}
          onClick={(event) => {
            handleStoryNavigation(event, "about");
            closeMenu();
          }}
        >
          About
        </a>

        <a
          href={LINKS.projects}
          onClick={(event) => {
            handleStoryNavigation(event, "projects");
            closeMenu();
          }}
        >
          Projects
        </a>

        <a href={LINKS.resume} target="_blank" rel="noreferrer" onClick={closeMenu}>
          Resume
        </a>

        <a
          href={LINKS.contact}
          onClick={(event) => {
            handleStoryNavigation(event, "contact");
            closeMenu();
          }}
        >
          Contact
        </a>
      </div>
    </header>
  );
}

export default Navbar;