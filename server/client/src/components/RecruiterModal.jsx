import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ProfileLinks from "./ProfileLinks";
import './RecruiterModal'
export default function RecruiterModal() {
  const [show, setShow] = useState(false);
  
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



  useEffect(() => {
    const open = () => setShow(true);
    window.addEventListener("recruiter:open", open);
    if (location.hash === "#recruiter") setShow(true);
    return () => window.removeEventListener("recruiter:open", open);
  }, []);

 
  useEffect(() => {
    if (!show) return;
    document.body.classList.add("no-scroll");
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKey);
    };
  }, [show]);

  const close = () => { setShow(false); history.replaceState(null, "", " "); };
  if (!show) return null;

  const mail = `mailto:bigyajeetkumarpatra@gmail.com?subject=Interview%20inquiry`;

  const modal = (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={close}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Quick Overview</h3>
        <p><b>Skills:</b> MERN, AI tools, ML,JAVA(DSA),Python & libraries ,joi tool</p>
        <ul>
          <li>Built various project</li>
          <li>Reduced report prep time by ~60%</li>
          <li>built AIML project</li>
          <li>Case studies that show clear impact</li>
        </ul>
        <div className="row">
          <a className="btn" href="/resume.pdf" download>View Resume (PDF)</a>
          <a className="btn" href="/projects">Top Project</a>
        <button className="btn" onClick={emailMe}>Email Me</button>
        <a className="btn" href="https://calendly.com/your-link">Book a Slot</a>
        </div>
        <h4 style={{ marginTop: 16 }}>Problem-solving Profiles</h4>
        <ProfileLinks />
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn" onClick={close}>Close</button>
        </div>
      </div>
    </div>
  );

  // render above everything
  return createPortal(modal, document.body);
}
