

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";

dotenv.config();

/* middleware  */
const app = express();

app.use(morgan("tiny"));
app.use(express.json());


const allow = new Set(
  (process.env.CLIENT_ORIGIN ||
    "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
);

const corsMw = cors({
  origin(origin, cb) {
    if (!origin || allow.has(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Secret"],
  credentials: true,
  maxAge: 86400
});
app.use(corsMw);
app.options(/.*/, corsMw);           


app.get("/favicon.ico", (_req, res) => res.status(204).end());

/*  MongoDB  */
mongoose.connection.on("connected", () =>
  console.log("✅ Mongo connected:", mongoose.connection.host)
);
mongoose.connection.on("error", (err) =>
  console.error("❌ Mongo error:", err.message)
);
mongoose.connection.on("disconnected", () =>
  console.warn("⚠️ Mongo disconnected")
);

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });

/* Models  */
const { Schema, model, models } = mongoose;

const Project = models.Project || model(
  "Project",
  new Schema({
    title: String,
    summary: String,
    tech: [String],
    github: String,
    demo: String,
    cover: String,
    impact: String,
    createdAt: { type: Date, default: Date.now }
  })
);

const Blog = models.Blog || model(
  "Blog",
  new Schema({
    title: String,
    content: String,
    tags: [String],
    createdAt: { type: Date, default: Date.now }
  })
);

const Message = models.Message || model(
  "Message",
  new Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
  })
);

const Stat = models.Stat || model(
  "Stat",
  new Schema({
    key: { type: String, unique: true },
    value: { type: Number, default: 0 }
  })
);

const Event = models.Event || model(
  "Event",
  new Schema({
    action: String,
    label: String,
    ts: { type: Date, default: Date.now }
  })
);


function adminOnly(req, res, next) {
  if (req.headers["x-admin-secret"] === process.env.ADMIN_SECRET) return next();
  return res.status(401).json({ error: "unauthorized" });
}


function makeTransporter() {
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = port === 465;            
  const relax = String(process.env.INSECURE_TLS).toLowerCase() === "true";

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure,                                
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: {
      servername: "smtp.gmail.com",
      rejectUnauthorized: !relax        
    },
    logger: true,
    debug: true
  });
}

const contactLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });
const isEmail = (v = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/*  Routes  */
// Health
app.get("/", (_req, res) => res.json({ ok: true, service: "portfolio-api" }));


app.get("/api/ping", async (_req, res) => {
  try {
    const doc = await Stat.findOneAndUpdate(
      { key: "visits" }, { $inc: { value: 1 } }, { upsert: true, new: true }
    );
    res.json({ ok: true, visits: doc.value });
  } catch {
    res.status(500).json({ error: "stat_error" });
  }
});


app.get("/api/_debug/smtp", async (_req, res) => {
  try {
    await makeTransporter().verify();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});

// One-click test email
app.get("/api/_debug/smtp/send", async (_req, res) => {
  try {
    const info = await makeTransporter().sendMail({
      from: `"Portfolio" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: "SMTP test from API",
      text: "If you see this, sending works."
    });
    res.json({ ok: true, messageId: info.messageId });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});


app.get("/api/projects", async (_req, res) => {
  const items = await Project.find().sort({ createdAt: -1 });
  res.json(items);
});

app.get("/api/blogs", async (_req, res) => {
  const items = await Blog.find().sort({ createdAt: -1 });
  res.json(items);
});


app.post("/api/blogs", adminOnly, async (req, res) => {
  const { title = "", content = "", tags = [] } = req.body || {};
  if (!title.trim() || !content.trim())
    return res.status(400).json({ error: "title_content_required" });
  const doc = await Blog.create({ title, content, tags });
  res.json({ ok: true, id: doc._id });
});



app.post("/api/messages", contactLimiter, async (req, res) => {
  try {
    const { name = "", email = "", message = "", hp = "" } = req.body || {};
    console.log("CONTACT_REQ", { name, email, len: (message || "").length, hp: !!hp });

    if (hp) return res.json({ ok: true, skipped: true }); // honeypot
    if (!name.trim() || !message.trim())
      return res.status(400).json({ error: "name_message_required" });

    const saved = await Message.create({ name, email, message });

    let emailed = false, messageId = null;
    if (process.env.SEND_EMAILS !== "false") {
      try {
        const t = makeTransporter();

        const info1 = await t.sendMail({
          from: `"Portfolio" <${process.env.SMTP_USER}>`,
          to: process.env.OWNER_EMAIL,
          replyTo: email || undefined,
          subject: `New portfolio message from ${name}`,
          text: `${message}\n\nFrom: ${name} <${email || "no-email"}>`
        });
        console.log("MAIL_SENT owner", info1.messageId);
        messageId = info1.messageId;

        if (email && isEmail(email)) {
          const info2 = await t.sendMail({
            from: `"${process.env.SMTP_USER}" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Thanks for reaching out",
            text: `Hi ${name},\n\nThanks for your message. I’ll get back to you soon.\n\n— Bigyajeet`
          });
          console.log("MAIL_SENT autoreply", info2.messageId);
        }
        emailed = true;
      } catch (e) {
        console.error("MAIL_FAIL", e);
      }
    }

    return res.json({ ok: true, id: saved._id, emailed, messageId });
  } catch (e) {
    console.error("CONTACT_ERROR", e);
    return res.status(500).json({ error: String(e.message || e) });
  }
});


app.post("/api/track", async (req, res) => {
  const { action = "unknown", label = "" } = req.body || {};
  await Event.create({ action, label });
  res.json({ ok: true });
});



app.post("/api/admin/seed", adminOnly, async (_req, res) => {
  await Promise.all([Project.deleteMany({}), Blog.deleteMany({})]);
  await Project.create([
    {
      title: "Spark SQL Workshop",
      summary: "3-hour live session on joins & KPIs using Spark SQL.",
      tech: ["Spark", "PySpark", "SQL", "React"],
      github: "https://github.com/yourname/spark-sql-workshop",
      cover: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      impact: "Helped 60+ students; 90% positive feedback."
    }
  ]);
  await Blog.create([
    { title: "What I learned building my first MERN app", content: "Ship v1, then iterate.", tags: ["mern"] }
  ]);
  res.json({ ok: true });
});


const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`🚀 Server on http://localhost:${port}`));
