/**
 * useSound — Centralized audio feedback hook.
 * All volumes are balanced so every sound feels like the same family.
 * Uses the Web Audio API via HTMLAudioElement for minimal overhead.
 *
 * Sounds are loaded lazily on first play and cached for the session.
 * A user gesture is required before audio can play (browser policy).
 * We queue the first play internally — if it's blocked, we fail silently.
 */

const cache = {};

const SOUNDS = {
  // Short, clean click for opening panels/modals (apertura liviana)
  click:        { src: '/sounds/click_001.ogg',        volume: 0.35 },
  // "Drop" metaphor: item landing in the cart
  addToCart:    { src: '/sounds/drop_001.ogg',          volume: 0.45 },
  // Positive confirmation: order placed
  confirm:      { src: '/sounds/confirmation_001.ogg',  volume: 0.40 },
  // Named "switch" — matches the delivery mode toggle exactly
  toggle:       { src: '/sounds/switch_001.ogg',        volume: 0.30 },
  // Soft close for dismissing panels/modals
  close:        { src: '/sounds/close_001.ogg',         volume: 0.30 },
  // Soft selection tick for picking address/branch from list
  select:       { src: '/sounds/select_001.ogg',        volume: 0.35 },
};

function getAudio(key) {
  if (!cache[key]) {
    const { src, volume } = SOUNDS[key];
    const audio = new Audio(src);
    audio.volume = volume;
    audio.preload = 'auto';
    cache[key] = audio;
  }
  return cache[key];
}

export function playSound(key) {
  try {
    const audio = getAudio(key);
    // Rewind so rapid repeated plays work
    audio.currentTime = 0;
    const p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        // Autoplay blocked before a user gesture — fail silently
      });
    }
  } catch (e) {
    // Fail silently on any audio error (e.g. unsupported format)
  }
}
