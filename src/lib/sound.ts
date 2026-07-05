/**
 * Procedural audio engine — no assets required.
 *
 * Everything is synthesized live with the Web Audio API: a slow, evolving
 * ambient drone plus short interaction cues (hover / click / transition /
 * reveal). This means the "sound-ready" wiring across the site produces real,
 * tasteful audio the moment the user enables it — and ships zero audio files.
 *
 * Notes:
 * - The AudioContext is created lazily inside a user gesture (the toggle click),
 *   satisfying browser autoplay policies.
 * - Muted by default; the preference is persisted to localStorage.
 * - Fails silent if Web Audio is unavailable.
 */

export type SoundCue = "hover" | "click" | "transition" | "reveal" | "ambient";

const STORAGE_KEY = "oob-sound-enabled";
const MASTER_LEVEL = 0.5;

class SoundManagerImpl {
  private enabled = false;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNodes: AudioScheduledSourceNode[] = [];
  private lastCueAt: Record<string, number> = {};
  private listeners = new Set<(enabled: boolean) => void>();

  init() {
    if (typeof window === "undefined") return;
    try {
      this.enabled = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      this.enabled = false;
    }
    // Do NOT create the AudioContext here — wait for a user gesture.
  }

  isEnabled() {
    return this.enabled;
  }

  subscribe(fn: (enabled: boolean) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.enabled));
  }

  private ensureContext(): boolean {
    if (typeof window === "undefined") return false;
    if (this.ctx) return true;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return false;
    try {
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
      return true;
    } catch {
      return false;
    }
  }

  setEnabled(next: boolean) {
    this.enabled = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }

    if (next) {
      if (this.ensureContext() && this.ctx && this.master) {
        void this.ctx.resume();
        const now = this.ctx.currentTime;
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.setValueAtTime(this.master.gain.value, now);
        this.master.gain.linearRampToValueAtTime(MASTER_LEVEL, now + 1.2);
        this.startAmbient();
      }
    } else if (this.ctx && this.master) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(this.master.gain.value, now);
      this.master.gain.linearRampToValueAtTime(0, now + 0.6);
      window.setTimeout(() => this.stopAmbient(), 700);
    }

    this.emit();
  }

  toggle() {
    this.setEnabled(!this.enabled);
  }

  /** Fire a one-shot interaction cue. */
  play(cue: SoundCue) {
    if (!this.enabled) return;
    if (cue === "ambient") return;
    if (!this.ensureContext() || !this.ctx || !this.master) return;

    // debounce identical cues (hover spam)
    const now = this.ctx.currentTime;
    const key = cue;
    if (now - (this.lastCueAt[key] ?? -1) < 0.04) return;
    this.lastCueAt[key] = now;

    switch (cue) {
      case "hover":
        this.blip(1180, 0.028, 0.11, "triangle");
        break;
      case "click":
        this.blip(320, 0.06, 0.18, "sine", 140);
        break;
      case "reveal":
        this.blip(640, 0.03, 0.3, "sine", 760);
        break;
      case "transition":
        this.sweep();
        break;
    }
  }

  /** Short enveloped tone, optionally gliding to `toFreq`. */
  private blip(
    freq: number,
    peak: number,
    dur: number,
    type: OscillatorType,
    toFreq?: number,
  ) {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (toFreq) osc.frequency.exponentialRampToValueAtTime(toFreq, now + dur);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain).connect(this.master!);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  /** Filtered noise sweep for scene transitions. */
  private sweep() {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const dur = 0.5;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(4000, now + dur);
    filter.Q.value = 6;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    src.connect(filter).connect(gain).connect(this.master!);
    src.start(now);
    src.stop(now + dur);
  }

  /** Layered evolving drone. */
  private startAmbient() {
    if (!this.ctx || !this.master || this.ambientNodes.length) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = 0.5;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 700;
    lowpass.Q.value = 0.6;
    this.ambientGain.connect(lowpass).connect(this.master);

    // detuned drone voices (A1, E2, A2)
    const voices: Array<{ freq: number; type: OscillatorType; level: number; detune: number }> = [
      { freq: 55, type: "sine", level: 0.5, detune: -6 },
      { freq: 82.41, type: "triangle", level: 0.28, detune: 4 },
      { freq: 110, type: "sine", level: 0.16, detune: 8 },
    ];
    for (const v of voices) {
      const osc = ctx.createOscillator();
      osc.type = v.type;
      osc.frequency.value = v.freq;
      osc.detune.value = v.detune;
      const g = ctx.createGain();
      g.gain.value = v.level;
      osc.connect(g).connect(this.ambientGain);
      osc.start(now);
      this.ambientNodes.push(osc);
    }

    // slow LFO drifting the filter cutoff for movement
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(lowpass.frequency);
    lfo.start(now);
    this.ambientNodes.push(lfo);

    // second, slower LFO on overall ambient level (breathing)
    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 0.08;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 0.18;
    lfo2.connect(lfo2Gain).connect(this.ambientGain.gain);
    lfo2.start(now);
    this.ambientNodes.push(lfo2);
  }

  private stopAmbient() {
    for (const n of this.ambientNodes) {
      try {
        n.stop();
      } catch {
        /* already stopped */
      }
    }
    this.ambientNodes = [];
    this.ambientGain?.disconnect();
    this.ambientGain = null;
  }
}

export const SoundManager = new SoundManagerImpl();
