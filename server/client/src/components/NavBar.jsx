// src/components/NavBar.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LogoBK from "../LogoBK";           
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
        <a className="navbar-brand" href="/" aria-label="Bigyajeet • Home">
          <LogoBK size={28} />
          <span className="sr-only">Bigyajeet</span>
        </a>

        <div className="navbar-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/journal">Journal</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        <div className="navbar-spacer" />

        {/* Always visible toggle (mobile + desktop) */}
        <div className="navbar-theme">
          <ThemeToggle />
        </div>

        {/* Hidden on mobile, visible on desktop */}
        <div className="navbar-actionsDesktop">
          <button type="button" className="chip" onClick={handleResume}>Resume</button>
          <button type="button" className="btn btn-sm" onClick={handleHire}>Hire me</button>
        </div>

        {/* Hamburger (mobile only) */}
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

      {/* Backdrop (mobile sheet) */}
      <div
        className="navbar-backdrop"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      {/* Mobile sheet menu */}
      <div id="navSheet" className="navbar-sheet" role="dialog" aria-modal="true">
        <NavLink to="/" end ref={firstLinkRef}>Home</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/journal">Journal</NavLink>
        <NavLink to="/contact">Contact</NavLink>

        <div className="navbar-sheetActions">
          <button type="button" className="chip" onClick={handleResume}>Resume</button>
          <button type="button" className="btn" onClick={handleHire}>Hire me</button>
        </div>
      </div>
    </nav>
  );
}
