const PREFIX = 'cinecerca:';

export function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage lleno o deshabilitado: ignorar sin romper la UI
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {}
}