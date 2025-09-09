import { useEffect, useMemo, useState } from "react";
import { api } from "../Api";
import "./Journal.css";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function readMins(text) {
  const w = (text || "").trim().split(/\s+/).length;
  return Math.max(1, Math.round(w / 180));
}

export default function Journal() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    (async () => {
      const r = await api("/api/blogs");
      const data = await r.json();
      setPosts(data);
    })();
  }, []);

  const tags = useMemo(() => {
    const t = new Set();
    posts.forEach((p) => (p.tags || []).forEach((x) => t.add(x)));
    return ["All", ...Array.from(t)];
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const hitTag = !tag || tag === "All" || (p.tags || []).includes(tag);
      const hitQ =
        !q ||
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.content.toLowerCase().includes(q.toLowerCase());
      return hitTag && hitQ;
    });
  }, [posts, q, tag]);

  return (
    <div className="container">
      <h2>Journal</h2>

      <div className="journal-toolbar">
        <input
          placeholder="Search notes…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={tag || "All"} onChange={(e) => setTag(e.target.value)}>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="journal-grid">
        {filtered.map((p) => (
          <article key={p._id} className="j-card">
            <header className="j-head">
              <h3>{p.title}</h3>
              <div className="meta">
                <span>{formatDate(p.createdAt)}</span>
                <span>• {readMins(p.content)} min read</span>
                {(p.tags || []).slice(0, 3).map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </header>
            <p className="j-body">
              {p.content.length > 280
                ? p.content.slice(0, 280) + "…"
                : p.content}
            </p>
          </article>
        ))}

        {filtered.length === 0 && (
          <p className="muted">
            No entries yet. Use the seed or create one (below).
          </p>
        )}
      </div>

      <details style={{ marginTop: 20 }}>
        <summary>Add entry (local admin)</summary>
        <AdminQuickAdd onAdded={(post) => setPosts([post, ...posts])} />
      </details>
    </div>
  );
}
function AdminQuickAdd({ onAdded }) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("journal,progress");
  const [content, setContent] = useState("");
  const [secret, setSecret] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("saving…");
    try {
      const r = await api("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Secret": secret,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      const raw = await r.text();
      const d = raw ? JSON.parse(raw) : {};
      if (!r.ok || !d.ok) throw new Error(d.error || `${r.status}`);

      onAdded({
        _id: d.id,
        title,
        content,
        tags: tags.split(",").map((s) => s.trim()),
        createdAt: new Date().toISOString(),
      });
      setTitle("");
      setContent("");
      setTags("journal,progress");
      setMsg("saved ✓");
    } catch (e2) {
      setMsg("error: " + e2.message);
    }
  };

  return (
    <form className="j-admin" onSubmit={submit}>
      <input
        placeholder="Admin secret"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        required
      />
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <textarea
        rows={6}
        placeholder="Write your note…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button className="btn" type="submit">
        Publish
      </button>
      {!!msg && <small className="muted">{msg}</small>}
    </form>
  );
}
