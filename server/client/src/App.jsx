
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Journal from './pages/Journal';
import Contact from './pages/Contact';
import RecruiterModal from './components/RecruiterModal';
import ProfileLinks from './components/ProfileLinks';
import ThemeToggle from './components/Themetoggle';

import './App.css';

export default function App() {
  const openRecruiter = () => {
    window.dispatchEvent(new CustomEvent("recruiter:open"));
    history.replaceState(null, "", "#recruiter");
  };

  return (
    <div>
      <RecruiterModal />

      <nav className="nav">
        <div className="nav-inner">
          <a className="brand" href="/">
            <span className="logo-dot" />
            <span>Bigyajeet</span>
          </a>

          <div className="nav-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/journal">Journal</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <div className="nav-actions">
  <ThemeToggle />

</div>

          </div>

          <div className="nav-actions">
            <a className="chip" href="/resume.pdf" download>Resume</a>
            <button className="btn btn-sm" onClick={openRecruiter}>Hire me</button>
          </div>
        </div>
      </nav>

     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <footer className="footer">
        <h4> Profiles</h4>
        <ProfileLinks />
        <small>© 2025 BK. Built with MERN.</small>
      </footer>
    </div>
  );
}
