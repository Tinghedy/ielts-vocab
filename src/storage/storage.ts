// localStorage 包裝：所有 key 加版本前綴，讀寫失敗（無痕模式、容量滿）時不讓畫面壞掉
const PREFIX = 'ielts.v1.';

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** 簡單的訂閱式 store，讓多個元件共用同一份資料 */
export function createStore<T>(key: string, initial: T) {
  let value = readJson<T>(key, initial);
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next: T) {
      value = next;
      writeJson(key, value);
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}
