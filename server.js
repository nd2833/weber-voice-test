import express from "express";
import cors from "cors";

/* ================================
   APP SETUP
================================ */
const app = express();
const PORT = 8080;

app.use(cors({ origin: "*" }));
app.use(express.json());

/* ================================
   VOICE STATE MEMORY
================================ */
let lastVoiceState = null;

/* ================================
   RECEIVE VOICE STATE
   (from test-transcribe.js)
================================ */
app.post("/voice", (req, res) => {
  lastVoiceState = req.body;

  console.log("🧠 VOICE STATE RECEIVED");
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});

/* ================================
   EXPOSE VOICE STATE
   (for Base / frontend)
================================ */
app.get("/voice", (req, res) => {
  res.json(lastVoiceState);
});

/* ================================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("Weber AI backend running");
});

/* ================================
   START SERVER
================================ */
app.listen(PORT, () => {
  console.log(`🚀 Weber AI backend running at http://localhost:${PORT}`);
});

