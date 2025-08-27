// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Journal from "./pages/Journal";
import Contact from "./pages/Contact";

import RecruiterModal from "./components/RecruiterModal";
import ProfileLinks from "./components/ProfileLinks";
import ThemeToggle from "./components/ThemeToggle";

import "./App.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const openRecruiter = () => {
    window.dispatchEvent(new CustomEvent("recruiter:open"));
    history.replaceState(null, "", "#recruiter");
  };

  // Close the sheet when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (menuOpen) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      <RecruiterModal />

      {/* NAVBAR */}
      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <div className="nav-inner">
          <a className="brand" href="/">
            <span className="logo-dot" />
            <span>Bigyajeet</span>
          </a>

          {/* Desktop links */}
          <div className="nav-links" role="navigation" aria-label="Primary">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/journal">Journal</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>

          {/* Desktop actions (right side) */}
          <div className="nav-actions">
            <ThemeToggle />
            <a className="chip" href="/Bigyajeet_Kumar_PatraResume.pdf" download>
              Resume
            </a>
            <button className="btn btn-sm" onClick={openRecruiter}>
              Hire me
            </button>
          </div>

          {/* Hamburger (shown on small screens via CSS) */}
          <button
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="nav-sheet"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile backdrop + sheet */}
        <button
          className="nav-backdrop"
          aria-hidden={!menuOpen}
          onClick={() => setMenuOpen(false)}
        />
        <div id="nav-sheet" className="nav-sheet">
          <ThemeToggle />
          <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/projects" onClick={() => setMenuOpen(false)}>Projects</a>
          <a href="/journal" onClick={() => setMenuOpen(false)}>Journal</a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>

          <div className="sheet-actions">
            <a
              className="btn btn-plain"
              href="/Bigyajeet_Kumar_PatraResume.pdf"
              download
              onClick={() => setMenuOpen(false)}
            >
              Resume
            </a>
            <button className="btn" onClick={() => { setMenuOpen(false); openRecruiter(); }}>
              Hire me
            </button>
          </div>
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* FOOTER */}
      <footer className="footer">
        <h4>Profiles</h4>
        <ProfileLinks />
        <small>© 2025 BK. Built with MERN.</small>
      </footer>
    </div>
  );
}
