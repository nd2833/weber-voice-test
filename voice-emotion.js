// voice-emotion.js

export function analyzeVoiceState({ rms, spectralCentroid }) {

  // --- NORMALIZATION ---
  // Raw RMS is tiny (0.001–0.02). Convert to perceptual loudness.
  const loudness = Math.min(Math.log10(rms * 1000 + 1), 1);

  // Spectral centroid normalized (human speech ~1k–4k)
  const brightness = Math.min(spectralCentroid / 3000, 1);

  let state = "neutral";
  let confidence = 0.6;

  if (loudness < 0.25 && brightness < 0.3) {
    state = "calm";
    confidence = 0.8;
  }
  else if (loudness > 0.6 && brightness < 0.5) {
    state = "excited";
    confidence = 0.85;
  }
  else if (loudness > 0.5 && brightness > 0.6) {
    state = "stressed";
    confidence = 0.9;
  }
  else if (loudness < 0.3 && brightness > 0.5) {
    state = "suppressed";
    confidence = 0.75;
  }

  return {
    voice_arousal: Number(loudness.toFixed(3)),
    voice_stress: Number(brightness.toFixed(3)),
    voice_state: state,
    confidence
  };
}

