import express from "express";
import cors from "cors";

const app = express();

/* 🚨 IMPORTANT: Railway uses process.env.PORT */
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

/* ================================
   MEMORY
================================ */
let lastVoiceState = null;

/* ================================
   RECEIVE VOICE STATE
================================ */
app.post("/voice", (req, res) => {
  lastVoiceState = req.body;

  console.log("🧠 VOICE STATE RECEIVED:");
  console.log(JSON.stringify(req.body, null, 2));

  res.status(200).json({ ok: true });
});

/* ================================
   EXPOSE VOICE STATE
================================ */
app.get("/voice", (req, res) => {
  res.json(lastVoiceState || { status: "no data yet" });
});

/* ================================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("✅ Weber AI backend running");
});

/* ================================
   START SERVER
================================ */
app.listen(PORT, () => {
  console.log(`🚀 Server listening on PORT ${PORT}`);
});
