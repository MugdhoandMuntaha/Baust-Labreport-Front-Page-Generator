import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Background Glows */}
      <div className="bg-glow glow-1" />
      <div className="bg-glow glow-2" />
      <div className="bg-glow glow-3" />

      <div className="home-container">
        <header className="home-hero">
          <div className="hero-badge">🎓 BAUST Students</div>
          <h1 className="hero-title">
            The Ultimate <br />
            <span className="text-gradient">Lab Report</span> Generator
          </h1>
          <p className="hero-subtitle">
            Create professional, perfectly formatted front pages for your BAUST lab reports in seconds. No more copy-pasting or formatting struggles.
          </p>
          
          <div className="hero-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/generator" className="btn-primary-large">
              <span className="btn-icon">⚡</span>
              Generate Report Now
            </Link>
            <Link href="/index-generator" className="btn-primary-large" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <span className="btn-icon">📑</span>
              Generate Index Page
            </Link>
          </div>
        </header>

        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Save Time</h3>
            <p>Generate your front page in less than a minute. Just fill in your details and you&apos;re good to go.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Perfect Format</h3>
            <p>Strictly follows the official BAUST lab report guidelines for all departments.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📥</div>
            <h3>Multiple Formats</h3>
            <p>Download your report front page as a PDF, DOCX, or PNG image with a single click.</p>
          </div>
        </section>

        <footer className="home-footer">
          <p>BAUST Lab Report Generator &copy; 2026 &mdash; Made with ❤️</p>
        </footer>
      </div>
    </>
  );
}
