import { useEffect, useMemo, useState } from "react";
import "./Project.css";

const GH_USER = "Bigyajeet";

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [order, setOrder] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

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
          .filter(d => !d.fork)
          .map(d => ({
            id: d.id,
            name: d.name,
            desc: d.description || "",
            lang: d.language || "Mixed",
            stars: d.stargazers_count || 0,
            url: d.html_url,
            demo: d.homepage || "",
            topics: d.topics || [],
            updated: d.pushed_at,
          }));

        setRepos(mapped);
        setOrder(mapped.map(x => x.id));
      } catch (e) {
        setErr(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const byId = useMemo(() => {
    const m = new Map();
    for (const r of repos) m.set(r.id, r);
    return m;
  }, [repos]);

  const list = useMemo(
    () => order.map(id => byId.get(id)).filter(Boolean),
    [order, byId]
  );

  const onShuffle = () => setOrder(prev => shuffleArray(prev));

  return (
    <section className="container">
      <div className="row head" style={{ alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Projects</h2>
        <button className="btn" onClick={onShuffle}>Shuffle</button>
        {!!err && <small className="error" style={{ color: "tomato" }}>GitHub: {err}</small>}
      </div>

      {/* skeletons while loading */}
      {loading && (
        <div className="cards-grid" style={{ marginTop: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="pcard skeleton">
              <div className="sk-title" />
              <div className="sk-line" />
              <div className="sk-line short" />
              <div className="sk-meta" />
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <>
          <div className="cards-grid" style={{ marginTop: 12 }}>
            {list.map((r, i) => (
              <Card key={`${r.id}-${i}`} r={r} i={i} />
            ))}
          </div>

          {!list.length && !err && <p className="muted">No repositories yet.</p>}
        </>
      )}
    </section>
  );
}

function Card({ r, i }) {
  const updated = new Date(r.updated);
  return (
    <article className="pcard appear" style={{ "--delay": `${i * 60}ms` }}>
      <header className="pcard-top">
        <b className="pcard-title">{r.name}</b>
        <small className="pcard-stars">★ {r.stars}</small>
      </header>

      <p className="pcard-desc">{r.desc || "No description yet."}</p>

      <div className="pcard-tags">
        {(r.topics?.slice(0, 3) || []).map(t => (
          <span key={t} className="chip">{t}</span>
        ))}
        {!r.topics?.length && <span className="chip">{r.lang}</span>}
      </div>

      <div className="pcard-meta">
        
        <small className="muted">{updated.toLocaleDateString()}</small>
      </div>

      <div className="row" style={{ marginTop: 10 }}>
        <a className="btn btn-plain" href={r.url} target="_blank" rel="noreferrer">View Code</a>
        {r.demo && (
          <a className="btn btn-ghost" href={r.demo} target="_blank" rel="noreferrer">Live</a>
        )}
      </div>
    </article>
  );
}
