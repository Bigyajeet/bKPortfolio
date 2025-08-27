// server/server.js
// Portfolio API — Express + Mongoose + Nodemailer
// ESM file (package.json should have: "type": "module")

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";

dotenv.config();

/* ------------------------------ App setup ------------------------------ */

const app = express();
app.set("trust proxy", 1); // important on Render / proxies

app.use(express.json());
app.use(morgan("tiny"));

// tiny helper so proxies/CDNs can cache CORS decisions properly
app.use((req, res, next) => {
  res.setHeader("Vary", "Origin");
  next();
});

// silence favicon noise
app.get("/favicon.ico", (_req, res) => res.status(204).end());

/* ---------------------------- Mongo connection ---------------------------- */

mongoose.connection.on("connected", () => {
  console.log("✅ Mongo connected:", mongoose.connection.host);
});
mongoose.connection.on("error", (err) => {
  console.error("❌ Mongo error:", err.message);
});
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongo disconnected");
});

if (!process.env.MONGO_URI) {
  console.warn("⚠️ MONGO_URI not set");
}
mongoose.connect(process.env.MONGO_URI || "", {
  serverSelectionTimeoutMS: 10000,
});

/* -------------------------------- Models -------------------------------- */

const { Schema, model, models } = mongoose;

const Project =
  models.Project ||
  model(
    "Project",
    new Schema({
      title: String,
      summary: String,
      tech: [String],
      github: String,
      demo: String,
      cover: String,
      impact: String,
      createdAt: { type: Date, default: Date.now },
    })
  );

const Blog =
  models.Blog ||
  model(
    "Blog",
    new Schema({
      title: String,
      content: String,
      tags: [String],
      createdAt: { type: Date, default: Date.now },
    })
  );

const Message =
  models.Message ||
  model(
    "Message",
    new Schema({
      name: String,
      email: String,
      message: String,
      createdAt: { type: Date, default: Date.now },
    })
  );

const Stat =
  models.Stat ||
  model(
    "Stat",
    new Schema({
      key: { type: String, unique: true },
      value: { type: Number, default: 0 },
    })
  );

const Event =
  models.Event ||
  model(
    "Event",
    new Schema({
      action: String,
      label: String,
      ts: { type: Date, default: Date.now },
    })
  );

/* ------------------------------ Admin helper ----------------------------- */

function adminOnly(req, res, next) {
  if (req.headers["x-admin-secret"] === process.env.ADMIN_SECRET) return next();
  return res.status(401).json({ error: "unauthorized" });
}

/* --------------------------------- CORS ---------------------------------- */
/**
 * Allow-list with simple wildcard support (e.g. https://b-k-portfolio-*.vercel.app)
 * Set env: CLIENT_ORIGIN=origin1,origin2,origin-with-*.example.com,http://localhost:5173
 */

const rawOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const originPatterns = rawOrigins.map((entry) => {
  if (!entry.includes("*")) return { exact: entry };
  const re = new RegExp(
    "^" +
      entry
        .split("*")
        .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join(".*") +
      "$"
  );
  return { re };
});

function isAllowed(origin) {
  if (!origin) return true; // same-origin/curl/postman
  if (originPatterns.some((p) => p.exact === origin)) return true;
  if (originPatterns.some((p) => p.re?.test(origin))) return true;
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

const corsOptions = {
  origin(origin, cb) {
    if (isAllowed(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Secret"],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight cleanly

/* ----------------------------- Mail Transport ---------------------------- */

function makeTransporter() {
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = port === 465; // 465 = SSL/TLS, 587 = STARTTLS

  const allowInsecure = String(process.env.ALLOW_INSECURE_TLS || "").toLowerCase() === "true";

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, // Gmail App Password for Gmail accounts
    },
    tls: {
      servername: process.env.SMTP_HOST || "smtp.gmail.com",
      // For some corporate dev networks you might need this during local testing.
      // Never set to true in production unless you understand the risk.
      rejectUnauthorized: !allowInsecure,
    },
    logger: true,
    debug: true,
  });
}

/* --------------------------------- Health -------------------------------- */

app.get("/", (_req, res) => res.json({ ok: true, service: "portfolio-api" }));

app.get("/api/_debug/smtp", async (_req, res) => {
  try {
    await makeTransporter().verify();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});

/* ------------------------------- Public API ------------------------------ */

app.get("/api/ping", async (_req, res) => {
  try {
    const doc = await Stat.findOneAndUpdate(
      { key: "visits" },
      { $inc: { value: 1 } },
      { upsert: true, new: true }
    );
    res.json({ ok: true, visits: doc.value });
  } catch {
    res.status(500).json({ ok: false, error: "stat_error" });
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

/* --------------------------- Contact (save + mail) ----------------------- */

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});

app.post("/api/messages", contactLimiter, async (req, res) => {
  try {
    const { name = "", email = "", message = "", hp = "" } = req.body || {};
    if (hp) return res.json({ ok: true }); // honeypot

    if (!name.trim() || !message.trim()) {
      return res.status(400).json({ ok: false, error: "name_message_required" });
    }

    // 1) Save
    const saved = await Message.create({ name, email, message });

    // 2) Email notification (skip if SEND_EMAILS=false)
    if (String(process.env.SEND_EMAILS || "true").toLowerCase() !== "false") {
      const t = makeTransporter();

      await t.sendMail({
        from: `"Portfolio" <${process.env.SMTP_USER}>`,
        to: process.env.OWNER_EMAIL,
        replyTo: email || undefined,
        subject: `New portfolio message from ${name}`,
        text: `${message}\n\nFrom: ${name} <${email || "no-email"}>`,
        html: `<p>${String(message).replace(/\n/g, "<br/>")}</p>
               <p>From: <b>${name}</b> ${email ? "&lt;" + email + "&gt;" : ""}</p>`,
      });

      if (email) {
        await t.sendMail({
          from: `"${process.env.SMTP_USER}" <${process.env.SMTP_USER}>`,
          to: email,
          subject: "Thanks for reaching out",
          text: `Hi ${name},\n\nThanks for your message. I’ll get back to you soon.\n\n— Bigyajeet`,
        });
      }
    }

    res.json({ ok: true, id: saved._id });
  } catch (e) {
    console.error("CONTACT_ERROR:", e);
    res.status(500).json({ ok: false, error: "contact_failed" });
  }
});

/* ------------------------------ Simple analytics ------------------------- */

app.post("/api/track", async (req, res) => {
  const { action = "unknown", label = "" } = req.body || {};
  await Event.create({ action, label });
  res.json({ ok: true });
});

/* -------------------------------- Admin seed ----------------------------- */

app.post("/api/admin/seed", adminOnly, async (_req, res) => {
  await Promise.all([Project.deleteMany({}), Blog.deleteMany({})]);

  await Project.create([
    {
      title: "Spark SQL Workshop",
      summary: "3-hour live session on joins & KPIs using Spark SQL.",
      tech: ["Spark", "PySpark", "SQL", "React"],
      github: "https://github.com/yourname/spark-sql-workshop",
      cover: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      impact: "Helped 60+ students; 90% positive feedback.",
    },
  ]);

  await Blog.create([
    {
      title: "What I learned building my first MERN app",
      content: "Ship v1, then iterate.",
      tags: ["mern"],
    },
  ]);

  res.json({ ok: true });
});

/* ------------------------------- Start server ---------------------------- */

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(` Server on http://localhost:${port}`)
);
