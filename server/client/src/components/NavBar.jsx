import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle"; 
import './NavBar.css'

export default function NavBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    window.addEventListener("hashchange", close);
    return () => {
      window.removeEventListener("resize", close);
      window.removeEventListener("hashchange", close);
    };
  }, []);

  return (
    <header className={`nav ${open ? "open" : ""}`}>
      <div className="nav-inner">
        <div className="brand">
          <span className="logo-dot" />
          <span>Bigyajeet</span>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          ☰
        </button>

        <nav className="nav-links" onClick={() => setOpen(false)}>
          <NavLink to="/" end className={({isActive}) => isActive ? "active" : undefined}>Home</NavLink>
          <NavLink to="/projects" className={({isActive}) => isActive ? "active" : undefined}>Projects</NavLink>
          <NavLink to="/journal"  className={({isActive}) => isActive ? "active" : undefined}>Journal</NavLink>
          <NavLink to="/contact"  className={({isActive}) => isActive ? "active" : undefined}>Contact</NavLink>
        </nav>

        <div className="nav-actions">
          <a className="btn btn-plain btn-sm" href="/Bigyajeet_Kumar_PatraResume.pdf" download>Resume</a>
          <a className="btn btn-sm" href="/contact">Hire me</a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
