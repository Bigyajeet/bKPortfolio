import { useMemo, useState, useEffect } from "react";
import { api } from "../Api";

import './Contact.css'

const MAX_MSG = 1000;
const MIN_MSG = 10;
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", hp: "" });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ kind: "", note: "" });

  const errors = useMemo(() => {
    const e = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const msg = form.message.trim();

    if (!name) e.name = "Name is required";
    else if (name.length < 2) e.name = "Use at least 2 characters";

    if (email && !isEmail(email)) e.email = "Enter a valid email (or leave blank)";

    if (!msg) e.message = "Message is required";
    else if (msg.length < MIN_MSG) e.message = `Write at least ${MIN_MSG} characters`;
    else if (msg.length > MAX_MSG) e.message = `Keep it under ${MAX_MSG} characters`;

    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0 && status.kind !== "sending";
  const msgLen = form.message.length;
  const counterWarn = msgLen > MAX_MSG || msgLen >= MAX_MSG - 50;

  useEffect(() => {
    if (status.kind === "ok") {
      const id = setTimeout(() => setStatus({ kind: "", note: "" }), 3500);
      return () => clearTimeout(id);
    }
  }, [status.kind]);

  const blur = (k) => setTouched((t) => ({ ...t, [k]: true }));

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!canSubmit) return;

    setStatus({ kind: "sending", note: "" });
    try {
      const r = await api("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const text = await r.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { /* keep empty */ }

      if (!r.ok) throw new Error(data.error || `${r.status} ${r.statusText}`);

      setStatus({ kind: "ok", note: "Thanks! I’ll reply soon." });
      setForm({ name: "", email: "", message: "", hp: "" });
      setTouched({});
    } catch (err) {
      console.error("CONTACT_SUBMIT", err);
      setStatus({ kind: "error", note: String(err.message || err) });
    }
  };

  return (
    <div className="container">
      <h2>Contact</h2>

 
      {status.kind === "ok" && <div className="banner ok"> {status.note}</div>}
      {status.kind === "error" && <div className="banner error"> {status.note}</div>}

      <form className="contact-pro" onSubmit={submit} noValidate>
        <div className={`row-2`}>
          
          <div className={`field ${touched.name && errors.name ? "has-error" : ""}`}>
            <label htmlFor="name">Your name *</label>
            <div className="input-wrap">
              <span className="icon" aria-hidden>👤</span>
              <input
                id="name"
                placeholder="Bigyajeet"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onBlur={() => blur("name")}
                aria-invalid={!!(touched.name && errors.name)}
              />
            </div>
            {touched.name && errors.name && <small className="error">{errors.name}</small>}
          </div>

          
          <div className={`field ${touched.email && errors.email ? "has-error" : ""}`}>
            <label htmlFor="email">Email (optional)</label>
            <div className="input-wrap">
              <span className="icon" aria-hidden></span>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={() => blur("email")}
                aria-invalid={!!(touched.email && errors.email)}
              />
            </div>
            {touched.email && errors.email && <small className="error">{errors.email}</small>}
          </div>
        </div>

   
        <div className={`field ${touched.message && errors.message ? "has-error" : ""}`}>
          <label htmlFor="message">Your message *</label>
          <div className="input-wrap textarea">
            <span className="icon" aria-hidden></span>
            <textarea
              id="message"
              rows={6}
              placeholder="How can I help?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              onBlur={() => blur("message")}
              maxLength={MAX_MSG + 50}
              aria-invalid={!!(touched.message && errors.message)}
            />
          </div>
          <div className="field-foot">
            {touched.message && errors.message && <small className="error">{errors.message}</small>}
            <small className={`counter ${counterWarn ? "warn" : ""}`}>{msgLen}/{MAX_MSG}</small>
          </div>
        </div>

       
        <input
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
          value={form.hp}
          onChange={(e) => setForm({ ...form, hp: e.target.value })}
        />

        <button className="btn btn-lg" type="submit" disabled={!canSubmit}>
          {status.kind === "sending" ? "Sending…" : "Send"}
        </button>
      </form>

      <div style={{ marginTop: 20 }}>
        <p>Prefer checking my problem-solving?</p>
        
      </div>
    </div>
  );
}
