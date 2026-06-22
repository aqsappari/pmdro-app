const STATE_KEY = "pmdro_state";
const CURRENT_VERSION = 1;

export type PmdroState = {
  version: number;
  theme?: string;
  themePreview?: string;
  durations?: Record<string, number>;
  tasks?: {
    id: number;
    text: string;
    completed: boolean;
  }[];
};

function ensureStorageAvailable(): boolean {
  try {
    const testKey = "__pmdro_test";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function isStorageAvailable(): boolean {
  return ensureStorageAvailable();
}

export function loadState(): PmdroState | null {
  if (!ensureStorageAvailable()) throw new Error("storage-unavailable");

  const raw = localStorage.getItem(STATE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PmdroState;
    if (!parsed.version) parsed.version = CURRENT_VERSION;
    return parsed;
  } catch {
    throw new Error("malformed-state");
  }
}

export function saveState(partial: Partial<PmdroState>): PmdroState {
  if (!ensureStorageAvailable()) throw new Error("storage-unavailable");

  let current: PmdroState | null = null;
  try {
    current = loadState();
  } catch {
    // ignore load errors and overwrite
  }

  const next: PmdroState = {
    version: CURRENT_VERSION,
    ...(current || {}),
    ...(partial || {}),
  };

  localStorage.setItem(STATE_KEY, JSON.stringify(next));
  return next;
}

export function clearState(): void {
  if (!ensureStorageAvailable()) throw new Error("storage-unavailable");
  localStorage.removeItem(STATE_KEY);
}
