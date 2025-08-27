// src/components/NavBar.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./NavBar.css";

export default function NavBar({ onHire, onResume }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const firstLinkRef = useRef(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    if (open) setTimeout(() => firstLinkRef.current?.focus(), 0);
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleResume = () => { setOpen(false); onResume?.(); };
  const handleHire = () => { setOpen(false); onHire?.(); };

  return (
    <nav className="navbar" data-open={open ? "true" : "false"}>
      <div className="navbar-inner">
        <NavLink to="/" end className="navbar-brand">
          <span className="navbar-logoDot" />
          <span>Bigyajeet</span>
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/journal">Journal</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        <div className="navbar-actionsDesktop">
          <ThemeToggle />
          <button type="button" className="chip" onClick={handleResume}>Resume</button>
          <button type="button" className="btn btn-sm" onClick={handleHire}>Hire me</button>
        </div>

        <button
          type="button"
          className="navbar-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-controls="navSheet"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <div
        className="navbar-backdrop"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <div id="navSheet" className="navbar-sheet" role="dialog" aria-modal="true">
        <NavLink to="/" end ref={firstLinkRef}>Home</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/journal">Journal</NavLink>
        <NavLink to="/contact">Contact</NavLink>

        <div className="navbar-sheetActions">
          <ThemeToggle />
          <button type="button" className="chip" onClick={handleResume}>Resume</button>
          <button type="button" className="btn" onClick={handleHire}>Hire me</button>
        </div>
      </div>
    </nav>
  );
}
