// Home.jsx
import { useEffect, useState } from "react";
import { api } from "../Api";
import { Link, useNavigate } from "react-router-dom";  
import "./Home.css";

export default function Home() {
  const [visits, setVisits] = useState(null);
  const navigate = useNavigate();                    

  useEffect(() => {
    api("/api/ping").then(r => r.json()).then(d => setVisits(d.visits));
  }, []);

  const openRecruiter = () => {
    window.dispatchEvent(new CustomEvent("recruiter:open"));
    api("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "recruiter_mode_opened" })
    });
    history.replaceState(null, "", "#recruiter");
  };

  const emailMe = () => {
    const to = "bigyajeetkumarpatra@gmail.com";
    const subject = "Interview inquiry";
    const body = "Hi Bigyajeet,\n\nWe'd like to connect about an opportunity.";
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setTimeout(() => {
      if (document.visibilityState === "visible") {
        const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmail, "_blank", "noopener");
      }
    }, 700);
  };

 
  const goProjects = () => navigate("/projects");  

  return (
    <div className="container hero">
      <section className="hero-left">
        <span className="pill">Open to SDE Intern / Full-Time</span>

        <h1 className="h1">Hi, I’m <span className="gradient">Bigyajeet Kumar Patra</span></h1>
        <p className="subtitle">
          I build fast, reliable <b>MERN</b> products, skilled in <b>AI/ML</b> for smart features,
          and use <b>CP</b>-honed problem-solving with exploring ai tools.
        </p>

        <div className="metrics">
          <div className="metric"><div className="num">50+</div><div className="label">Projects</div></div>
          <div className="metric"><div className="num">90+</div><div className="label">DSA problems</div></div>
          <div className="metric"><div className="num">{visits ?? "…"}</div><div className="label">Site visits</div></div>
        </div>

        <div className="row ctas">
    
          <button className="btn" type="button" onClick={openRecruiter}>Recruiter Mode</button>

  
          <a className="btn btn-plain" href="/Bigyajeet_Kumar_PatraResume.pdf" download>
            Download Resume
          </a>

    
          <button className="btn btn-plain" type="button" onClick={emailMe}>Email me</button>


          <Link className="btn btn-ghost" to="/projects">View Projects</Link>

          
        </div>
      </section>

      <aside className="hero-right">
        <div className="avatar-ring">
          <img src="bk.png" alt="Bigyajeet Kumar Patra" className="avatar" />
        </div>
      </aside>
    </div>
  );
}
