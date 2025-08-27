// src/components/NavBar.jsx
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function NavBar({ onHire, onResume }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  return (
    <nav className="navbar" data-open={open ? "true" : "false"}>
      <div className="navbar-inner">
        <a className="navbar-brand" href="/">
          <span className="navbar-logoDot" />
          <span>Bigyajeet</span>
        </a>

        <div className="navbar-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/journal">Journal</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        <div className="navbar-actionsDesktop">
          <ThemeToggle />
          <button className="chip" onClick={onResume}>Resume</button>
          <button className="btn btn-sm" onClick={onHire}>Hire me</button>
        </div>

        <button
          className="navbar-toggle"
          aria-label="Open menu"
          aria-controls="navSheet"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span aria-hidden>≡</span>
        </button>
      </div>

      <div id="navSheet" className="navbar-sheet" role="dialog" aria-modal="true">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/journal">Journal</NavLink>
        <NavLink to="/contact">Contact</NavLink>

        <div className="navbar-sheetActions">
          <ThemeToggle />
          <button className="chip" onClick={() => { setOpen(false); onResume?.(); }}>Resume</button>
          <button className="btn" onClick={() => { setOpen(false); onHire?.(); }}>Hire me</button>
        </div>
      </div>

      <button
        className="navbar-backdrop"
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />
    </nav>
  );
}
