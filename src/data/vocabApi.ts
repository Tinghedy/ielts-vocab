import type { Filter, VocabIndex, Word } from '../types';

const base = import.meta.env.BASE_URL + 'vocab/';

// 單檔版（scripts/build-single.mjs）會把資料直接嵌進 HTML，就不必 fetch
declare global {
  interface Window {
    __VOCAB__?: { index: VocabIndex; cats: Record<string, Word[]> };
  }
}
const embedded = typeof window !== 'undefined' ? window.__VOCAB__ : undefined;

let indexPromise: Promise<VocabIndex> | null = embedded ? Promise.resolve(embedded.index) : null;
const catCache = new Map<number, Promise<Word[]>>(
  embedded ? Object.entries(embedded.cats).map(([id, words]) => [Number(id), Promise.resolve(words)]) : [],
);

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`載入失敗：${url}（${res.status}）`);
  return res.json() as Promise<T>;
}

export function loadIndex(): Promise<VocabIndex> {
  indexPromise ??= getJson<VocabIndex>(base + 'index.json').catch((e) => {
    indexPromise = null;
    throw e;
  });
  return indexPromise;
}

export function loadCategory(id: number): Promise<Word[]> {
  let p = catCache.get(id);
  if (!p) {
    p = loadIndex()
      .then((idx) => getJson<Word[]>(`${base}cat-${String(id).padStart(2, '0')}.json?v=${idx.version}`))
      .catch((e) => {
        catCache.delete(id);
        throw e;
      });
    catCache.set(id, p);
  }
  return p;
}

export async function loadCategories(ids: number[]): Promise<Word[]> {
  const lists = await Promise.all(ids.map(loadCategory));
  return lists.flat();
}

export function allCategoryIds(index: VocabIndex): number[] {
  return index.categories.map((c) => c.id);
}

export function matchesFilter(w: Word, f: Filter): boolean {
  return (
    (f.categories.length === 0 || f.categories.includes(w.category)) &&
    (f.freqs.length === 0 || f.freqs.includes(w.freq)) &&
    (f.levels.length === 0 || f.levels.includes(w.level)) &&
    (!f.coreOnly || w.ecdictIelts)
  );
}

/** 用 index.json 的計數算出符合條件的字數，不必載入主題檔 */
export function countMatching(index: VocabIndex, f: Filter, categoryIds?: number[]): number {
  const cats = categoryIds ?? (f.categories.length ? f.categories : allCategoryIds(index));
  let n = 0;
  for (const c of cats) {
    for (const [key, v] of Object.entries(index.counts[c] ?? {})) {
      const [freq, level, core] = key.split('|');
      if (f.freqs.length && !f.freqs.includes(freq as Filter['freqs'][number])) continue;
      if (f.levels.length && !f.levels.includes(level as Filter['levels'][number])) continue;
      if (f.coreOnly && core !== 'core') continue;
      n += v;
    }
  }
  return n;
}

export function countByFreq(index: VocabIndex, categoryId: number): Record<string, number> {
  const out: Record<string, number> = { high: 0, mid: 0, low: 0 };
  for (const [key, v] of Object.entries(index.counts[categoryId] ?? {})) {
    out[key.split('|')[0]] += v;
  }
  return out;
}
