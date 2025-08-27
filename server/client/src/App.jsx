
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Journal from './pages/Journal';
import Contact from './pages/Contact';
import RecruiterModal from './components/RecruiterModal';
import ProfileLinks from './components/ProfileLinks';
import ThemeToggle from './components/ThemeToggle';


import './App.css';

export default function App() {
  const openRecruiter = () => {
    window.dispatchEvent(new CustomEvent("recruiter:open"));
    history.replaceState(null, "", "#recruiter");
  };

  return (
    <>
    <div>
      <RecruiterModal />
     

      <NavBar/>
  <ThemeToggle />

</div>

        

          


     
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
    
    </>
  );
}
