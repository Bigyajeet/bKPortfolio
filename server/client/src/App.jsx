import NavBar from "./components/NavBar";
import "./components/NavBar.css";

import { Routes, Route, NavLink, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Journal from "./pages/Journal";
import Contact from "./pages/Contact";

import RecruiterModal from "./components/RecruiterModal";
import ProfileLinks from "./components/ProfileLinks";


export default function App() {
  const openRecruiter = () => {
    window.dispatchEvent(new CustomEvent("recruiter:open"));
    history.replaceState(null, "", "#recruiter");
  };

  const openResume = () => {
    // If you want the same behavior as before (download)
    window.location.href = "/Bigyajeet_Kumar_PatraResume.pdf";
  };

  return (
    <div>
      <RecruiterModal />
      <NavBar onHire={openRecruiter} onResume={openResume} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <footer className="footer">
        <h4>Profiles</h4>
        <ProfileLinks />
        <small>© 2025 BK. Built with MERN.</small>
      </footer>
    </div>
  );
}
