import { writable } from 'svelte/store';

export const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "herbarium",
  "density": 2,
  "showCorners": true,
  "leftPct": 33,
  "monoFont": "jetbrains",
  "serifFont": "cormorant"
}/*EDITMODE-END*/;

const { subscribe, update } = writable({ ...TWEAK_DEFAULTS });

export function setTweak(keyOrEdits, val) {
  const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
    ? keyOrEdits : { [keyOrEdits]: val };
  update(prev => ({ ...prev, ...edits }));
  window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
}

export const tweaks = { subscribe };
