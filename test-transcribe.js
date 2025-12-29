import record from "node-record-lpcm16";
import fetch from "node-fetch";
import Meyda from "meyda";

/* ===========================
   AUDIO SETTINGS
=========================== */

const SAMPLE_RATE = 16000;
const BUFFER_SIZE = 512;

/* ===========================
   BASELINE ADAPTATION
=========================== */

let baselineRMS = 0.002;
const SMOOTHING = 0.97;

/* ===========================
   VOICE STATE LOGIC
=========================== */

function detectVoiceState(rms) {
  baselineRMS = baselineRMS * SMOOTHING + rms * (1 - SMOOTHING);
  const intensity = rms / baselineRMS;

  if (intensity > 7) return "panic";
  if (intensity > 4) return "tense";
  if (intensity > 2.5) return "excited";
  if (intensity > 1.5) return "focused";
  return "calm";
}

/* ===========================
   MIC START
=========================== */

console.log("🎤 Listening... speak now");

const mic = record.record({
  sampleRateHertz: SAMPLE_RATE,
  threshold: 0,
  silence: "0.0",
  recordProgram: "sox",
  audioType: "raw",
});

/* ===========================
   AUDIO PROCESSING
=========================== */

mic.stream().on("data", (chunk) => {
  // Convert Int16 PCM → Float32
  const int16 = new Int16Array(chunk.buffer, chunk.byteOffset, chunk.byteLength / 2);
  const float32 = new Float32Array(int16.length);

  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768;
  }

  if (float32.length < BUFFER_SIZE) return;

  const frame = float32.slice(0, BUFFER_SIZE);

  const features = Meyda.extract(
    ["rms", "spectralCentroid"],
    frame,
    {
      sampleRate: SAMPLE_RATE,
      bufferSize: BUFFER_SIZE,
    }
  );

  if (!features || !features.rms) return;

  const { rms, spectralCentroid } = features;
  const state = detectVoiceState(rms);

  console.log("RAW VOICE:", {
    rms: rms.toFixed(5),
    centroid: spectralCentroid.toFixed(2),
  });

  console.log("🎙️ VOICE STATE");
  console.log("state:", state);
  console.log("baseline:", baselineRMS.toFixed(5));
  console.log("intensity:", (rms / baselineRMS).toFixed(2));
  console.log("---------------");

  /* ===========================
     SEND TO BACKEND
  =========================== */

  fetch("http://localhost:8080/voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "voice",
      voice: {
        rms,
        centroid: spectralCentroid,
        state,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
});

