function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Primary navigation">
        <a className="brand" href="#home">
          RY<span>.</span>
        </a>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
        </div>

        <a className="nav-contact" href="#contact">
          Contact
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
