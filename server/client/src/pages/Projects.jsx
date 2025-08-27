// src/pages/Projects.jsx
import { useEffect, useMemo, useState } from "react";
import "./Project.css";

const GH_USER = "Bigyajeet"; // change if needed

// deterministic “variant” picker so each shuffle can change the card look
function pickVariant(id, seed, n) {
  let x = (id + 101 * seed) % 2147483647;
  x = (x * 48271) % 2147483647;
  return x % n; // 0..n-1
}

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [order, setOrder] = useState([]);
  const [seed, setSeed] = useState(0);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(
          `https://api.github.com/users/${GH_USER}/repos?type=owner&sort=updated&per_page=100`,
          { headers: { Accept: "application/vnd.github+json" } }
        );
        if (!r.ok) throw new Error(`GitHub ${r.status}`);
        const data = await r.json();

        const mapped = (Array.isArray(data) ? data : [])
          .filter((d) => !d.fork)
          .map((d) => ({
            id: d.id,
            name: d.name,
            desc: d.description || "",
            lang: d.language || "Mixed",
            stars: d.stargazers_count,
            url: d.html_url,
            demo: d.homepage || "",
            topics: d.topics || [],
            updated: d.pushed_at,
          }));

        setRepos(mapped);
        setOrder(mapped.map((x) => x.id));
      } catch (e) {
        setErr(String(e?.message || e));
      }
    })();
  }, []);

  // quick id→repo map so we can keep a separate “order” array
  const byId = useMemo(() => {
    const m = new Map();
    for (const r of repos) m.set(r.id, r);
    return m;
  }, [repos]);

  const list = useMemo(
    () => order.map((id) => byId.get(id)).filter(Boolean),
    [order, byId]
  );

  const onShuffle = () => {
    setOrder((prev) => shuffleArray(prev));
    setSeed((s) => s + 1); // forces new keys so cards remount with new variants
  };

  return (
    <div className="container">
      <div className="row head" style={{ alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Projects</h2>
        <button className="btn" onClick={onShuffle}>Shuffle</button>
        {!!err && <small className="error" style={{ color: "tomato" }}>GitHub: {err}</small>}
      </div>

      <div className="cards-grid" style={{ marginTop: 12 }}>
        {list.map((r, i) => {
          const v = pickVariant(r.id, seed, 4); // 4 visual templates
          const rot = ((i % 5) - 2) * 1.2;      // tiny playful angle
          const key = `${r.id}-${seed}`;        // new div each shuffle

          if (v === 0) return <CardGradient key={key} r={r} i={i} rot={rot} />;
          if (v === 1) return <CardStripe   key={key} r={r} i={i} rot={rot} />;
          if (v === 2) return <CardRibbon   key={key} r={r} i={i} rot={rot} />;
          return          <CardMinimal  key={key} r={r} i={i} rot={rot} />;
        })}
      </div>

      {!list.length && !err && <p className="muted">No repositories yet.</p>}
    </div>
  );
}

/* ---------- Card Variants ---------- */

function CardGradient({ r, i, rot }) {
  return (
    <div className="vcard vA appear" style={{ "--delay": `${i * 60}ms`, "--rot": `${rot}deg` }}>
      <div className="band" />
      <div className="content">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <b>{r.name}</b><small>★ {r.stars}</small>
        </div>
        <p>{r.desc || "No description yet."}</p>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <small>{r.lang}</small>
          <small>{new Date(r.updated).toLocaleDateString()}</small>
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <a className="btn btn-plain" href={r.url} target="_blank" rel="noreferrer">Code</a>
          {r.demo && <a className="btn btn-ghost" href={r.demo} target="_blank" rel="noreferrer">Live</a>}
        </div>
      </div>
    </div>
  );
}

function CardStripe({ r, i, rot }) {
  return (
    <div className="vcard vB appear" style={{ "--delay": `${i * 60}ms`, "--rot": `${rot}deg` }}>
      <div className="stripe" />
      <b>{r.name}</b>
      <p>{r.desc || "No description yet."}</p>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <small>{r.lang}</small><small>★ {r.stars}</small>
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <a className="btn btn-plain" href={r.url} target="_blank" rel="noreferrer">Code</a>
        {r.demo && <a className="btn btn-ghost" href={r.demo} target="_blank" rel="noreferrer">Live</a>}
      </div>
    </div>
  );
}

function CardRibbon({ r, i, rot }) {
  return (
    <div className="vcard vC appear" style={{ "--delay": `${i * 60}ms`, "--rot": `${rot}deg` }}>
      <span className="ribbon">★ {r.stars}</span>
      <b>{r.name}</b>
      <p style={{ minHeight: 44 }}>{r.desc || "No description yet."}</p>
      <div className="tags">
        {(r.topics?.slice(0, 3) || []).map((t) => <span key={t} className="chip">{t}</span>)}
        {!r.topics?.length && <span className="chip">{r.lang}</span>}
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <a className="btn btn-plain" href={r.url} target="_blank" rel="noreferrer">Code</a>
        {r.demo && <a className="btn btn-ghost" href={r.demo} target="_blank" rel="noreferrer">Live</a>}
      </div>
    </div>
  );
}

function CardMinimal({ r, i, rot }) {
  return (
    <div className="vcard vD appear" style={{ "--delay": `${i * 60}ms`, "--rot": `${rot}deg` }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
        <b className="title">{r.name}</b>
        <small>{new Date(r.updated).toLocaleDateString()}</small>
      </div>
      <p className="muted">{r.desc || "No description yet."}</p>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <small className="pill">{r.lang}</small>
        <small className="pill">★ {r.stars}</small>
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <a className="btn btn-plain" href={r.url} target="_blank" rel="noreferrer">Code</a>
        {r.demo && <a className="btn btn-ghost" href={r.demo} target="_blank" rel="noreferrer">Live</a>}
      </div>
    </div>
  );
}
