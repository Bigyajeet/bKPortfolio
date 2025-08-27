import { useEffect, useState } from "react";
import "./NavBar.css";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when menu is open (mobile)
  useEffect(() => {
    if (open) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Change this if you're using a router; call setOpen(false) on route change.

  return (
    <nav className={`nb-nav ${open ? "is-open" : ""}`}>
      <div className="nb-inner">
        <a className="nb-brand" href="/">
          <span className="nb-dot" aria-hidden="true" />
          Bigyajeet
        </a>

        {/* Desktop links */}
        <div className="nb-links" role="navigation" aria-label="Primary">
          <a href="/" className="active">Home</a>
          <a href="/projects">Projects</a>
          <a href="/journal">Journal</a>
          <a href="/contact">Contact</a>
        </div>

        {/* Desktop actions */}
        <div className="nb-actions">
          <label className="switch" title="Toggle theme">
            <input
              type="checkbox"
              onChange={(e) =>
                document.documentElement.setAttribute(
                  "data-theme",
                  e.target.checked ? "dark" : "light"
                )
              }
            />
            <span className="slider">
              <span className="icon">☀️</span>
              <span className="icon">🌙</span>
            </span>
          </label>

          <a className="btn btn-plain" href="/Bigyajeet_Kumar_PatraResume.pdf" download>
            Resume
          </a>
          <a className="btn" href="mailto:bigyajeetkumarpatra@gmail.com">Hire me</a>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="nb-toggle"
          aria-expanded={open}
          aria-controls="nb-sheet"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </button>
      </div>

      {/* Backdrop & Sheet for mobile */}
      <button className="nb-backdrop" aria-hidden={!open} onClick={() => setOpen(false)} />
      <div id="nb-sheet" className="nb-sheet">
        <a href="/" onClick={() => setOpen(false)}>Home</a>
        <a href="/projects" onClick={() => setOpen(false)}>Projects</a>
        <a href="/journal" onClick={() => setOpen(false)}>Journal</a>
        <a href="/contact" onClick={() => setOpen(false)}>Contact</a>

        <div className="nb-sheet-actions">
          <a className="btn btn-plain" href="/Bigyajeet_Kumar_PatraResume.pdf" download>
            Resume
          </a>
          <a className="btn" href="mailto:bigyajeetkumarpatra@gmail.com">Hire me</a>
        </div>
      </div>
    </nav>
  );
}
