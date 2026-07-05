/**
 * Sound-ready architecture.
 *
 * The site ships with NO audio assets, but every interaction is already wired
 * to a central `SoundManager`. Drop mp3/ogg files into `public/sounds/` and map
 * them in `SOUND_MANIFEST` below — hovers, clicks, scene transitions and ambient
 * loops will start playing with zero component changes.
 *
 * Design notes:
 * - Lazy: an <audio> element is only created the first time a cue is played.
 * - Safe: missing files fail silently (no console spam, no thrown errors).
 * - Respectful: muted by default until the user opts in (browsers block
 *   autoplay anyway) and honors a persisted preference.
 */

export type SoundCue =
  | "hover"
  | "click"
  | "transition"
  | "reveal"
  | "ambient";

/** Map cues to files you drop into /public/sounds later. */
export const SOUND_MANIFEST: Record<SoundCue, { src: string; loop?: boolean; volume?: number }> = {
  hover: { src: "/sounds/hover.mp3", volume: 0.25 },
  click: { src: "/sounds/click.mp3", volume: 0.4 },
  transition: { src: "/sounds/transition.mp3", volume: 0.35 },
  reveal: { src: "/sounds/reveal.mp3", volume: 0.3 },
  ambient: { src: "/sounds/ambient.mp3", loop: true, volume: 0.18 },
};

const STORAGE_KEY = "oob-sound-enabled";

class SoundManagerImpl {
  private enabled = false;
  private pools = new Map<SoundCue, HTMLAudioElement[]>();
  private ambient: HTMLAudioElement | null = null;
  private listeners = new Set<(enabled: boolean) => void>();
  private available = new Map<SoundCue, boolean>();

  init() {
    if (typeof window === "undefined") return;
    try {
      this.enabled = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      this.enabled = false;
    }
    if (this.enabled) this.startAmbient();
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

  setEnabled(next: boolean) {
    this.enabled = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (next) this.startAmbient();
    else this.stopAmbient();
    this.emit();
  }

  toggle() {
    this.setEnabled(!this.enabled);
  }

  /** Fire a one-shot cue. No-op when disabled or asset missing. */
  play(cue: SoundCue) {
    if (!this.enabled || typeof window === "undefined") return;
    if (cue === "ambient") return this.startAmbient();
    if (this.available.get(cue) === false) return;

    const { src, volume = 0.3 } = SOUND_MANIFEST[cue];
    let pool = this.pools.get(cue);
    if (!pool) {
      pool = [];
      this.pools.set(cue, pool);
    }
    // reuse a finished element to avoid GC churn
    let el = pool.find((a) => a.paused || a.ended);
    if (!el) {
      el = new Audio(src);
      el.volume = volume;
      el.addEventListener("error", () => this.available.set(cue, false), {
        once: true,
      });
      if (pool.length < 6) pool.push(el);
    }
    el.currentTime = 0;
    el.play().catch(() => {
      /* autoplay / missing file — ignore */
    });
  }

  private startAmbient() {
    if (typeof window === "undefined" || !this.enabled) return;
    if (this.available.get("ambient") === false) return;
    if (!this.ambient) {
      const { src, volume = 0.18 } = SOUND_MANIFEST.ambient;
      this.ambient = new Audio(src);
      this.ambient.loop = true;
      this.ambient.volume = volume;
      this.ambient.addEventListener(
        "error",
        () => this.available.set("ambient", false),
        { once: true },
      );
    }
    this.ambient.play().catch(() => {
      /* ignore */
    });
  }

  private stopAmbient() {
    this.ambient?.pause();
  }
}

export const SoundManager = new SoundManagerImpl();
