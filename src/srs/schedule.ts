import type { Rating } from '../types';

export interface CardState {
  c: number; // category
  k: 0 | 1; // 1 = 答過「記得」，算會了，不再複習
  d: number; // 下次複習日（epoch day）；k = 1 時不用
  l: number; // 上次作答日
  n: number; // 作答總次數
  x: number; // 答「不認識」的次數
}

/** 不認識、模糊各隔幾天再複習 */
export const REVIEW_AFTER: Record<Exclude<Rating, 'good'>, number> = { again: 1, hard: 2 };

export function grade(prev: CardState | undefined, rating: Rating, day: number, category: number): CardState {
  const known = rating === 'good';
  return {
    c: category,
    k: known ? 1 : 0,
    d: known ? 0 : day + REVIEW_AFTER[rating],
    l: day,
    n: (prev?.n ?? 0) + 1,
    x: (prev?.x ?? 0) + (rating === 'again' ? 1 : 0),
  };
}

export const isDue = (s: CardState, day: number) => s.k === 0 && s.d <= day;
export const isKnown = (s: CardState) => s.k === 1;

/** 舊版（Leitner 盒子 b）的紀錄轉成新格式：盒 2 以上代表上次答記得 */
export function migrate(s: CardState & { b?: number }): CardState {
  if (s.k === 0 || s.k === 1) return s;
  const { b = 1, ...rest } = s;
  return b >= 2 ? { ...rest, k: 1, d: 0 } : { ...rest, k: 0 };
}
