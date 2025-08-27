import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  // lock body scroll when menu open
  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  // close on resize/hash change/escape
  useEffect(() => {
    const close = () => setOpen(false);
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("resize", close);
    window.addEventListener("hashchange", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", close);
      window.removeEventListener("hashchange", close);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // smooth-scroll for same-page anchors (#projects, etc.)
  const onAnchor = (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
      setOpen(false);
    }
  };

  return (
    <header className={`nav ${open ? "open" : ""}`}>
      <div className="nav-inner">
        <a className="brand" href="#home" onClick={onAnchor}>
          <span className="logo-dot" />
          <span>Bigyajeet</span>
        </a>

        <nav className="nav-links" onClick={onAnchor}>
          <a href="#home">Home</a>
          <a href="#projects">Projects</a>
          <a href="#journal">Journal</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">
          <a className="btn btn-plain btn-sm" href="/Bigyajeet_Kumar_PatraResume.pdf" download>Resume</a>
          <a className="btn btn-sm" href="#contact" onClick={onAnchor}>Hire me</a>
          <ThemeToggle />
        </div>

        <button
          className="nav-toggle"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          ☰
        </button>
      </div>

      {/* Mobile sheet */}
      <div className="nav-sheet">
        <a href="#home" onClick={onAnchor}>Home</a>
        <a href="#projects" onClick={onAnchor}>Projects</a>
        <a href="#journal" onClick={onAnchor}>Journal</a>
        <a href="#contact" onClick={onAnchor}>Contact</a>

        <div className="sheet-actions">
          <a className="btn btn-plain" href="/Bigyajeet_Kumar_PatraResume.pdf" download>Resume</a>
          <a className="btn" href="#contact" onClick={onAnchor}>Hire me</a>
          <ThemeToggle />
        </div>
      </div>

      {/* Backdrop to close */}
      <button className="nav-backdrop" aria-hidden="true" onClick={() => setOpen(false)} />
    </header>
  );
}
