import express from "express";
import cors from "cors";

const app = express();

/**
 * 🚨 THIS LINE IS CRITICAL
 * Railway injects PORT dynamically
 */
const PORT = process.env.PORT;

app.use(cors({ origin: "*" }));
app.use(express.json());

let lastVoiceState = null;

app.post("/voice", (req, res) => {
  lastVoiceState = req.body;

  console.log("🧠 VOICE STATE RECEIVED");
  console.log(JSON.stringify(req.body, null, 2));

  res.status(200).json({ ok: true });
});

app.get("/voice", (req, res) => {
  res.json(lastVoiceState ?? { status: "no data yet" });
});

app.get("/", (req, res) => {
  res.send("✅ Weber AI backend running");
});

/**
 * 🚨 DO NOT hardcode PORT
 * 🚨 DO NOT use localhost
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on PORT ${PORT}`);
});
