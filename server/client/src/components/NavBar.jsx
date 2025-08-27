import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function NavBar({ onHire, onResume }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  // Close sheet on route change
  useEffect(() => { setOpen(false); }, [loc.pathname]);

  // Close sheet if viewport grows beyond breakpoint
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 860) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav className="navbar" data-open={open ? "true" : "false"}>
      <div className="navbar-inner">
        <a className="navbar-brand" href="/">
          <span className="navbar-logoDot" />
          <span>Bigyajeet</span>
        </a>

        {/* Desktop links */}
        <div className="navbar-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/journal">Journal</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        {/* Desktop actions */}
        <div className="navbar-actionsDesktop">
          <ThemeToggle />
          <button className="chip" onClick={onResume}>Resume</button>
          <button className="btn btn-sm" onClick={onHire}>Hire me</button>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          aria-label="Open menu"
          className="navbar-toggle"
          onClick={() => setOpen(v => !v)}
        >
          <span aria-hidden>≡</span>
        </button>
      </div>

      {/* Mobile sheet */}
      <div className="navbar-sheet">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/journal">Journal</NavLink>
        <NavLink to="/contact">Contact</NavLink>

        <div className="navbar-sheetActions">
          <ThemeToggle />
          <button className="chip" onClick={() => { setOpen(false); onResume?.(); }}>
            Resume
          </button>
          <button className="btn" onClick={() => { setOpen(false); onHire?.(); }}>
            Hire me
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <button
        className="navbar-backdrop"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
    </nav>
  );
}
