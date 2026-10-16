// @doc: docs/daten/state/client-storage.md#client-storage
function area() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readRaw(key) {
  const store = area();
  if (!store) return null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

export function writeRaw(key, value) {
  const store = area();
  if (!store) return false;
  try {
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function readJson(key) {
  const raw = readRaw(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeJson(key, value) {
  return writeRaw(key, JSON.stringify(value));
}

export function removeKey(key) {
  const store = area();
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    return;
  }
}
