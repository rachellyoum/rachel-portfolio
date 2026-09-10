function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-content">
          <p className="eyebrow">SFU COMPUTING SCIENCE</p>

          <h1>
            Hi, I&apos;m Rachel.
            <span> I build thoughtful software.</span>
          </h1>

          <p className="hero-description">
            I&apos;m a Computing Science student interested in backend systems,
            full-stack development, and game development. I enjoy turning ideas
            into useful, polished experiences.
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

        <div className="hero-visual" aria-hidden="true">
          <div className="visual-window">
            <div className="window-top">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="window-content">
              <p className="visual-label">currently building</p>

              <div className="mini-project">
                <div className="mini-icon">🌱</div>
                <div>
                  <strong>Portfolio</strong>
                  <p>React · TypeScript</p>
                </div>
              </div>

              <div className="mini-project">
                <div className="mini-icon">🐕</div>
                <div>
                  <strong>Dog + Human</strong>
                  <p>Unity · C#</p>
                </div>
              </div>

              <div className="code-line">
                <span>const</span> nextProject = <strong>&quot;something useful&quot;</strong>;
              </div>
            </div>
          </div>

          <div className="decorative-leaf leaf-one">✦</div>
          <div className="decorative-leaf leaf-two">✦</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;