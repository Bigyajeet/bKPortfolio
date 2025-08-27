import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function useTheme() {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "dark"
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return { theme, setTheme };
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const loc = useLocation();

  // close sheet on route change
  useEffect(() => setOpen(false), [loc]);

  return (
    <nav className={`nav ${open ? "open" : ""}`} data-nav>
      <div className="nav-inner">
        <a className="brand" href="/">
          <span className="logo-dot" aria-hidden />
          Bigyajeet
        </a>

        {/* Desktop links */}
        <div className="nav-links" role="navigation" aria-label="Primary">
          <NavLink to="/" end className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
          <NavLink to="/projects" className={({isActive}) => isActive ? "active" : ""}>Projects</NavLink>
          <NavLink to="/journal"  className={({isActive}) => isActive ? "active" : ""}>Journal</NavLink>
          <NavLink to="/contact"  className={({isActive}) => isActive ? "active" : ""}>Contact</NavLink>
        </div>

        {/* Desktop actions */}
        <div className="nav-actions">
          <label className="switch" aria-label="Theme">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
            />
            <span className="slider">
              <span className="icon">🌙</span>
              <span className="icon">☀️</span>
            </span>
          </label>
          <a className="btn btn-plain" href="/Bigyajeet_Kumar_PatraResume.pdf" download>
            Resume
          </a>
          <a className="btn" href="/#contact">Hire me</a>
        </div>

        {/* Hamburger (mobile only via CSS) */}
        <button
          className="nav-toggle"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      {/* Backdrop for sheet */}
      <button
        className="nav-backdrop"
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      {/* Mobile sheet menu */}
      <div className="nav-sheet" role="dialog" aria-modal="true" aria-label="Menu">
        <nav aria-label="Mobile">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/journal">Journal</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="sheet-actions">
          <label className="switch" aria-label="Theme">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
            />
            <span className="slider">
              <span className="icon">🌙</span>
              <span className="icon">☀️</span>
            </span>
          </label>
          <a className="btn btn-plain" href="/Bigyajeet_Kumar_PatraResume.pdf" download>
            Resume
          </a>
          <a className="btn" href="/#contact" onClick={() => setOpen(false)}>Hire me</a>
        </div>
      </div>
    </nav>
  );
}
