import { useRef, useState } from "react";
import { loadBooleanPreference, saveBooleanPreference } from "../utils/preferences";

const STORAGE_KEY = "sea-battle-sound-enabled-v1";

export default function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(() =>
    loadBooleanPreference(STORAGE_KEY, true)
  );
  const contextRef = useRef(null);

  function ensureContext() {
    if (typeof window === "undefined") {
      return null;
    }

    if (!contextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return null;
      }

      contextRef.current = new AudioContextClass();
    }

    if (contextRef.current.state === "suspended") {
      contextRef.current.resume();
    }

    return contextRef.current;
  }

  function playTone(context, { frequency, duration, gain, type = "sine", delay = 0 }) {
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    const startAt = context.currentTime + delay;
    const stopAt = startAt + duration;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startAt);

    volume.gain.setValueAtTime(0.0001, startAt);
    volume.gain.exponentialRampToValueAtTime(gain, startAt + 0.01);
    volume.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    oscillator.connect(volume);
    volume.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(stopAt);
  }

  function play(effect) {
    if (!soundEnabled) {
      return;
    }

    const context = ensureContext();
    if (!context) {
      return;
    }

    const sequences = {
      place: [{ frequency: 540, duration: 0.08, gain: 0.03, type: "triangle" }],
      recall: [
        { frequency: 620, duration: 0.06, gain: 0.022, type: "triangle" },
        { frequency: 430, duration: 0.08, gain: 0.02, type: "triangle", delay: 0.06 },
      ],
      randomize: [
        { frequency: 430, duration: 0.08, gain: 0.025, type: "triangle" },
        { frequency: 620, duration: 0.08, gain: 0.025, type: "triangle", delay: 0.05 },
        { frequency: 780, duration: 0.08, gain: 0.022, type: "triangle", delay: 0.1 },
      ],
      start: [
        { frequency: 420, duration: 0.08, gain: 0.03, type: "triangle" },
        { frequency: 620, duration: 0.09, gain: 0.03, type: "triangle", delay: 0.07 },
        { frequency: 840, duration: 0.1, gain: 0.028, type: "triangle", delay: 0.14 },
      ],
      miss: [{ frequency: 260, duration: 0.12, gain: 0.02, type: "sine" }],
      hit: [
        { frequency: 680, duration: 0.08, gain: 0.03, type: "square" },
        { frequency: 920, duration: 0.07, gain: 0.022, type: "triangle", delay: 0.03 },
      ],
      sunk: [
        { frequency: 420, duration: 0.08, gain: 0.025, type: "square" },
        { frequency: 620, duration: 0.08, gain: 0.025, type: "square", delay: 0.05 },
        { frequency: 920, duration: 0.12, gain: 0.022, type: "triangle", delay: 0.1 },
      ],
      win: [
        { frequency: 520, duration: 0.1, gain: 0.024, type: "triangle" },
        { frequency: 780, duration: 0.12, gain: 0.024, type: "triangle", delay: 0.08 },
        { frequency: 1040, duration: 0.14, gain: 0.022, type: "triangle", delay: 0.16 },
      ],
      lose: [
        { frequency: 620, duration: 0.1, gain: 0.02, type: "sawtooth" },
        { frequency: 420, duration: 0.12, gain: 0.02, type: "sawtooth", delay: 0.08 },
        { frequency: 280, duration: 0.15, gain: 0.018, type: "sawtooth", delay: 0.18 },
      ],
    };

    (sequences[effect] ?? []).forEach((tone) => playTone(context, tone));
  }

  function toggleSound() {
    setSoundEnabled((current) => {
      const nextValue = !current;
      saveBooleanPreference(STORAGE_KEY, nextValue);
      return nextValue;
    });
  }

  return {
    soundEnabled,
    toggleSound,
    play,
  };
}
